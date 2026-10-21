import { computed } from 'vue'
import type { VStatCardProps } from './VStatCard.types'
import { mountVStatCard } from './mountVStatCard'

export function useVStatCard(props: VStatCardProps) {
  const config = computed(() => mountVStatCard(props))

  const rootAttrs = computed(() => ({
    class: [
      'v-stat-card',
      `v-stat-card--${config.value.size}`,
      `v-stat-card--${config.value.variant}`,
      { 'v-stat-card--loading': props.loading },
    ],
    'aria-busy': props.loading ? ('true' as const) : undefined,
    'data-test-id': props.dataTestId ?? 'v-stat-card',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
  }))

  return { config, rootAttrs }
}
