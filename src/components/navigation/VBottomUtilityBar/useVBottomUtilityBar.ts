import { computed, useSlots } from 'vue'
import type { VBottomUtilityBarProps } from './VBottomUtilityBar.types'
import { mountVBottomUtilityBar } from './mountVBottomUtilityBar'

export function useVBottomUtilityBar(props: VBottomUtilityBarProps) {
  const slots = useSlots()
  const config = computed(() => mountVBottomUtilityBar(props))

  const hasStatus = computed(() => Boolean(slots.status))
  const hasActions = computed(() => Boolean(slots.actions))

  const rootAttrs = computed(() => ({
    class: [
      'v-bottom-utility-bar',
      `v-bottom-utility-bar--${config.value.size}`,
      `v-bottom-utility-bar--${config.value.variant}`,
      {
        'v-bottom-utility-bar--fixed': config.value.fixed,
        'v-bottom-utility-bar--safe-area': config.value.safeArea,
        'v-bottom-utility-bar--bordered': config.value.bordered,
        'v-bottom-utility-bar--disabled': config.value.disabled,
        'v-bottom-utility-bar--loading': config.value.loading,
        'v-bottom-utility-bar--with-status': hasStatus.value,
        'v-bottom-utility-bar--with-actions': hasActions.value,
      },
    ],
    role: 'contentinfo',
    'aria-label': props.ariaLabel ?? 'Utility bar',
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'data-test-id': 'v-bottom-utility-bar',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : 'default',
  }))

  return { config, hasStatus, hasActions, rootAttrs }
}
