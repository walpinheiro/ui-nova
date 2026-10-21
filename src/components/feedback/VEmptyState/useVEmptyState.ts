import { computed } from 'vue'
import type { VEmptyStateEmit, VEmptyStateProps } from './VEmptyState.types'
import { mountVEmptyState, resolveEmptyStateActionIcon } from './mountVEmptyState'

export function useVEmptyState(props: VEmptyStateProps, emit: VEmptyStateEmit) {
  const config = computed(() => mountVEmptyState(props))
  const actionIcon = computed(() => resolveEmptyStateActionIcon(config.value.action?.icon))

  const rootAttrs = computed(() => ({
    class: [
      'v-empty-state',
      `v-empty-state--${config.value.size}`,
      `v-empty-state--${config.value.variant}`,
      {
        'v-empty-state--compact': config.value.compact,
        'v-empty-state--no-illustration': !config.value.showIllustration,
        'v-empty-state--disabled': config.value.disabled,
        'v-empty-state--loading': config.value.loading,
      },
    ],
    role: 'region' as const,
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel,
    'data-test-id': 'v-empty-state',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : config.value.compact
          ? 'compact'
          : !config.value.showIllustration
            ? 'no-illustration'
            : 'default',
  }))

  const onActionClick = () => {
    if (config.value.disabled) return
    emit('action')
  }

  return { config, actionIcon, rootAttrs, onActionClick }
}
