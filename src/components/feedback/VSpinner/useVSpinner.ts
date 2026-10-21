import { computed } from 'vue'
import type { VSpinnerProps } from './VSpinner.types'
import { mountVSpinner } from './mountVSpinner'

export function useVSpinner(props: VSpinnerProps) {
  const config = computed(() => mountVSpinner(props))

  const rootAttrs = computed(() => ({
    class: [
      'v-spinner',
      `v-spinner--${config.value.variant}`,
      `v-spinner--${config.value.size}`,
      `v-spinner--color-${config.value.color}`,
      { 'v-spinner--spinning': config.value.spinning },
    ],
    role: 'status' as const,
    'aria-live': 'polite' as const,
    'aria-busy': config.value.loading || undefined,
    'aria-disabled': config.value.disabled || undefined,
    'aria-label': props.ariaLabel || config.value.label,
    'data-test-id': 'v-spinner',
    'data-variant': config.value.variant,
    'data-color': config.value.color,
    'data-size': config.value.size,
    'data-state': config.value.state,
  }))

  return { config, rootAttrs }
}
