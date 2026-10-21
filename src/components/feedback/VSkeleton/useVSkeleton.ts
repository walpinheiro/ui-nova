import { computed } from 'vue'
import type { VSkeletonProps } from './VSkeleton.types'
import { mountVSkeleton } from './mountVSkeleton'

const CHART_BAR_HEIGHTS = ['40%', '55%', '70%', '85%', '100%']

export function useVSkeleton(props: VSkeletonProps) {
  const config = computed(() => mountVSkeleton(props))

  const lineIndices = computed(() =>
    Array.from({ length: config.value.lines }, (_, index) => index + 1),
  )

  const chartBarHeights = computed(() => CHART_BAR_HEIGHTS)

  const rootAttrs = computed(() => ({
    class: [
      'v-skeleton',
      `v-skeleton--${config.value.size}`,
      `v-skeleton--${config.value.variant}`,
      { 'is-animated': config.value.shimmering },
    ],
    role: 'status' as const,
    'aria-busy': config.value.busy || undefined,
    'aria-disabled': config.value.disabled || undefined,
    'aria-label': props.ariaLabel,
    'data-test-id': 'v-skeleton',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.state,
  }))

  return { config, lineIndices, chartBarHeights, rootAttrs }
}
