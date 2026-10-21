import { computed, ref, watch } from 'vue'
import type { VAlertEmit, VAlertProps } from './VAlert.types'
import { mountVAlert } from './mountVAlert'

export function useVAlert(props: VAlertProps, emit: VAlertEmit) {
  const config = computed(() => mountVAlert(props))
  const visible = ref(props.modelValue !== false)

  watch(
    () => props.modelValue,
    (value) => {
      if (typeof value === 'boolean') visible.value = value
    },
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-alert',
      `v-alert--${config.value.size}`,
      `v-alert--${config.value.variant}`,
      `v-alert--${config.value.layout}`,
      { 'v-alert--disabled': config.value.disabled, 'v-alert--loading': config.value.loading },
    ],
    'aria-atomic': true,
    'aria-busy': config.value.loading ? true : undefined,
    'aria-disabled': config.value.disabled ? true : undefined,
    'aria-label': props.ariaLabel || undefined,
    'data-size': config.value.size,
    'data-state': config.value.loading ? 'loading' : config.value.disabled ? 'disabled' : 'default',
    'data-test-id': 'v-alert',
    'data-variant': config.value.variant,
    'data-layout': config.value.layout,
  }))

  const canDismiss = computed(() => config.value.dismissible && !config.value.interactiveDisabled)
  const dismissLabel = computed(() => props.dismissLabel || 'Dismiss alert')

  function dismiss() {
    if (!canDismiss.value) return
    visible.value = false
    emit('update:modelValue', false)
    emit('dismiss')
  }

  return { canDismiss, config, dismiss, dismissLabel, rootAttrs, visible }
}
