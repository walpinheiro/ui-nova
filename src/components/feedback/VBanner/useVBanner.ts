import { computed, nextTick, ref, watch } from 'vue'
import type { VBannerProps } from './VBanner.types'
import { mountVBanner } from './mountVBanner'

type VBannerEmit = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
}

export function useVBanner(props: VBannerProps, emit: VBannerEmit) {
  const config = computed(() => mountVBanner(props))
  const dismissed = ref(props.modelValue === false)

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== undefined) dismissed.value = value === false
    },
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-banner',
      `v-banner--${config.value.variant}`,
      `v-banner--${config.value.size}`,
      { 'v-banner--disabled': config.value.disabled, 'v-banner--loading': config.value.loading },
    ],
    role: config.value.role,
    'aria-live': config.value.role === 'alert' ? ('assertive' as const) : ('polite' as const),
    'aria-atomic': true,
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel,
    tabindex: '-1',
    'data-test-id': 'v-banner',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dismissed.value
      ? 'dismissed'
      : config.value.loading
        ? 'loading'
        : config.value.disabled
          ? 'disabled'
          : 'default',
  }))

  const dismiss = (event?: Event) => {
    if (!config.value.closable || config.value.disabled || config.value.loading || dismissed.value) return

    const origin = event?.currentTarget instanceof HTMLElement
      ? event.currentTarget.closest<HTMLElement>('[data-test-id="v-banner"]')
      : null
    const focusableAfterOrigin = origin && typeof document !== 'undefined'
      ? Array.from(document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'))
          .find((element) => {
            if (element === origin || origin.contains(element) || element.hasAttribute('disabled')) return false
            return Boolean(origin.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
          })
      : undefined

    dismissed.value = true
    emit('update:modelValue', false)
    emit('close')

    if (focusableAfterOrigin) {
      void nextTick(() => focusableAfterOrigin.focus())
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && config.value.closeOnEscape) dismiss(event)
  }

  return { config, dismissed, rootAttrs, dismiss, handleKeydown }
}
