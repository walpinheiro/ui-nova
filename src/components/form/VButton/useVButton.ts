import { computed } from 'vue'
import type { VButtonProps } from './VButton.types'
import { mountVButton } from './mountVButton'

export function useVButton(props: VButtonProps) {
  const config = computed(() => mountVButton(props))
  const rootAttrs = computed(() => ({
    class: [
      'v-button',
      `v-button--${config.value.size}`,
      `v-button--${config.value.variant}`,
      { 'v-button--pill': config.value.shape === 'pill' },
      {
        'v-button--loading': config.value.loading && config.value.variant !== 'loading',
        'v-button--motion-spring': props.motion === 'expressive',
      },
    ],
    type: config.value.type,
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel,
    'data-test-id': 'v-button',
    'data-variant': config.value.variant,
    'data-shape': config.value.shape,
    'data-size': config.value.size,
    'data-state': config.value.loading ? 'loading' : config.value.disabled ? 'disabled' : 'default',
  }))
  return { config, rootAttrs }
}
