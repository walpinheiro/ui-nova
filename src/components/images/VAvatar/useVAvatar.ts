import { computed, ref, watch } from 'vue'
import type { VAvatarProps } from './VAvatar.types'
import { mountVAvatar } from './mountVAvatar'

type VAvatarEmit = {
  (event: 'click', payload: MouseEvent): void
  (event: 'select', payload: MouseEvent): void
  (event: 'update:selected', payload: boolean): void
}

export function useVAvatar(props: VAvatarProps, emit: VAvatarEmit) {
  const config = computed(() => mountVAvatar(props))
  const selected = ref(props.selected ?? false)
  const imageFailed = ref(false)

  watch(
    () => props.selected,
    (value) => {
      if (value !== undefined) selected.value = value
    },
  )

  watch(
    () => props.src,
    () => {
      imageFailed.value = false
    },
  )

  const showFallback = computed(
    () => props.loading || imageFailed.value || (!props.src && !props.initials),
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-avatar',
      `v-avatar--${config.value.size}`,
      `v-avatar--${config.value.shape}`,
      {
        'v-avatar--interactive': config.value.interactive,
        'v-avatar--loading': props.loading,
        'v-avatar--fallback': showFallback.value && !props.loading,
      },
    ],
    'data-test-id': config.value.testId,
    'data-size': config.value.size,
    'data-shape': config.value.shape,
    'data-state': props.loading
      ? 'loading'
      : selected.value
        ? 'selected'
        : showFallback.value
          ? 'fallback'
          : 'default',
    role: props.decorative ? 'presentation' : config.value.interactive ? 'button' : 'img',
    'aria-hidden': props.decorative ? 'true' : undefined,
    'aria-label': props.decorative ? undefined : config.value.ariaLabel,
    'aria-pressed': config.value.interactive ? String(selected.value) : undefined,
    'aria-busy': props.loading ? 'true' : undefined,
    tabindex: config.value.interactive ? 0 : undefined,
  }))

  function onImageError() {
    imageFailed.value = true
  }

  function handleClick(event: MouseEvent) {
    if (!config.value.interactive || config.value.disabled) return
    event.preventDefault()
    event.stopPropagation()
    const nextSelected = props.selected !== undefined ? !props.selected : !selected.value
    selected.value = nextSelected
    emit('update:selected', nextSelected)
    emit('select', event)
    emit('click', event)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!config.value.interactive || config.value.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick(event as unknown as MouseEvent)
    }
  }

  return {
    config,
    selected,
    imageFailed,
    showFallback,
    rootAttrs,
    onImageError,
    handleClick,
    handleKeydown,
  }
}
