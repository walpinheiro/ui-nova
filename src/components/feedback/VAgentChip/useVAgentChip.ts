import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { isMotionDisabled } from '../../../composables/useReducedMotion'
import { useReducedMotion } from '../../../composables/useReducedMotion'
import type { VAgentChipEmit, VAgentChipProps } from './VAgentChip.types'
import { mountVAgentChip } from './mountVAgentChip'

export function useVAgentChip(props: VAgentChipProps, emit: VAgentChipEmit) {
  const config = computed(() => mountVAgentChip(props))
  const reduced = useReducedMotion()
  const elapsedMs = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  const motionDisabled = computed(() => isMotionDisabled(config.value.motion, reduced.value))
  const isExpressive = computed(() => config.value.motion === 'expressive' && !motionDisabled.value)
  const isPending = computed(() => config.value.status === 'pending')
  const isSuccess = computed(() => config.value.status === 'success')
  const isError = computed(() => config.value.status === 'error')

  const displayMs = computed(() => {
    if (isPending.value) return elapsedMs.value
    return config.value.durationMs > 0 ? config.value.durationMs : elapsedMs.value
  })

  const formattedDuration = computed(() => `${Math.max(0, Math.round(displayMs.value))}ms`)

  const clearTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }

  const startTimer = () => {
    clearTimer()
    elapsedMs.value = 0
    if (!isPending.value) return
    const started = performance.now()
    timer = setInterval(() => {
      elapsedMs.value = performance.now() - started
    }, 50)
  }

  watch(
    () => config.value.status,
    (status) => {
      if (status === 'pending') startTimer()
      else clearTimer()
    },
    { immediate: true },
  )

  onBeforeUnmount(clearTimer)

  const rootAttrs = computed(() => ({
    class: [
      'v-agent-chip',
      `v-agent-chip--${config.value.status}`,
      {
        'v-agent-chip--expressive': isExpressive.value,
        'v-agent-chip--pending': isPending.value,
        'v-agent-chip--success': isSuccess.value,
        'v-agent-chip--error': isError.value,
      },
    ],
    role: 'status' as const,
    'aria-live': isPending.value ? ('polite' as const) : undefined,
    'aria-busy': isPending.value || undefined,
    'aria-label': props.ariaLabel ?? `${config.value.label}, ${config.value.status}`,
    'data-test-id': 'v-agent-chip',
    'data-status': config.value.status,
    'data-state': config.value.status,
  }))

  const retryAttrs = computed(() => ({
    type: 'button' as const,
    class: 'v-agent-chip__retry',
    'aria-label': config.value.retryLabel,
    'data-test-id': 'v-agent-chip-retry',
  }))

  const onRetry = () => {
    emit('retry')
  }

  return {
    config,
    rootAttrs,
    retryAttrs,
    formattedDuration,
    isPending,
    isSuccess,
    isError,
    isExpressive,
    onRetry,
  }
}
