import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { VToastEmits, VToastProps, VToastQueueItem, VToastQueueOptions } from './VToast.types'
import { mountVToast } from './mountVToast'

type VToastEmitFn = <K extends keyof VToastEmits>(event: K, ...args: VToastEmits[K]) => void

let toastCounter = 0

export function useVToast(props: VToastProps, emit: VToastEmitFn) {
  const config = computed(() => mountVToast(props))
  const visible = ref(props.modelValue !== false)
  const paused = ref(false)
  const dismissing = ref(false)
  const progress = ref(100)
  let dismissTimer: ReturnType<typeof setTimeout> | null = null
  let progressFrame: ReturnType<typeof requestAnimationFrame> | null = null
  let startedAt = 0
  let elapsedBeforePause = 0

  watch(
    () => props.modelValue,
    (value) => {
      if (typeof value === 'boolean') visible.value = value
    },
  )

  const clearDismissTimer = () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer)
      dismissTimer = null
    }
  }

  const clearProgressFrame = () => {
    if (progressFrame) {
      cancelAnimationFrame(progressFrame)
      progressFrame = null
    }
  }

  const finishDismiss = () => {
    clearDismissTimer()
    clearProgressFrame()
    visible.value = false
    emit('update:modelValue', false)
    emit('close')
  }

  const startDismissTimer = () => {
    if (config.value.disabled || !config.value.duration || config.value.duration <= 0) return
    clearDismissTimer()
    startedAt = performance.now()
    elapsedBeforePause = 0
    progress.value = 100

    const tick = () => {
      if (paused.value) {
        progressFrame = requestAnimationFrame(tick)
        return
      }
      const elapsed = elapsedBeforePause + (performance.now() - startedAt)
      const remaining = Math.max(0, config.value.duration - elapsed)
      progress.value = (remaining / config.value.duration) * 100
      if (remaining <= 0) {
        dismiss()
        return
      }
      progressFrame = requestAnimationFrame(tick)
    }

    dismissTimer = setTimeout(() => dismiss(), config.value.duration)
    progressFrame = requestAnimationFrame(tick)
  }

  const pauseTimer = () => {
    if (paused.value || config.value.disabled) return
    paused.value = true
    clearDismissTimer()
    elapsedBeforePause += performance.now() - startedAt
  }

  const resumeTimer = () => {
    if (!paused.value || config.value.disabled) return
    paused.value = false
    startedAt = performance.now()
    const remaining = Math.max(0, config.value.duration - elapsedBeforePause)
    if (remaining <= 0) {
      dismiss()
      return
    }
    dismissTimer = setTimeout(() => dismiss(), remaining)
  }

  const dismiss = () => {
    if (config.value.disabled || dismissing.value || !visible.value) return
    dismissing.value = true
    clearDismissTimer()
    clearProgressFrame()
    setTimeout(finishDismiss, 120)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') dismiss()
  }

  const rootAttrs = computed(() => ({
    class: [
      'v-toast',
      `v-toast--${config.value.size}`,
      `v-toast--${config.value.variant}`,
      {
        'v-toast--paused': paused.value,
        'v-toast--dismissing': dismissing.value,
        'v-toast--disabled': config.value.disabled,
        'v-toast--expressive': props.motion === 'expressive',
      },
    ],
    role: 'status',
    'aria-live': 'polite',
    'aria-atomic': true,
    'aria-busy': config.value.loading ? true : undefined,
    'aria-disabled': config.value.disabled ? true : undefined,
    'aria-label': props.ariaLabel || props.message || undefined,
    'data-test-id': 'v-toast',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-state': dismissing.value
      ? 'dismissed'
      : paused.value
        ? 'paused'
        : config.value.loading
          ? 'loading'
          : config.value.disabled
            ? 'disabled'
            : 'default',
  }))

  const containerAttrs = computed(() => ({
    class: 'v-toast__container',
    'data-test-id': 'toast-container',
    'data-variant': config.value.variant,
  }))

  const dismissLabel = computed(() => props.dismissLabel ?? 'Dismiss notification')

  watch(
    visible,
    (isVisible) => {
      if (isVisible) {
        dismissing.value = false
        startDismissTimer()
      } else {
        clearDismissTimer()
        clearProgressFrame()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    clearDismissTimer()
    clearProgressFrame()
  })

  return {
    config,
    visible,
    paused,
    dismissing,
    progress,
    rootAttrs,
    containerAttrs,
    dismissLabel,
    dismiss,
    pauseTimer,
    resumeTimer,
    onKeydown,
  }
}

export function useVToastQueue() {
  const items = ref<VToastQueueItem[]>([])

  const push = (options: VToastQueueOptions) => {
    const id = `toast-${++toastCounter}`
    items.value = [
      ...items.value,
      {
        id,
        message: options.message,
        variant: options.variant ?? 'info',
        size: options.size ?? 'md',
        duration: options.duration ?? 5000,
        closable: options.closable ?? true,
        showProgress: options.showProgress ?? true,
      },
    ]
    return id
  }

  const remove = (id: string) => {
    items.value = items.value.filter((item) => item.id !== id)
  }

  const clear = () => {
    items.value = []
  }

  return { items, push, remove, clear }
}
