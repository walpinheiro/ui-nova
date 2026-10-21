import { computed } from 'vue'
import type { VFunnelChartProps } from './VFunnelChart.types'
import { mountVFunnelChart } from './mountVFunnelChart'

export function useVFunnelChart(props: VFunnelChartProps) {
  const config = computed(() => mountVFunnelChart(props))

  const rootAttrs = computed(() => ({
    class: ['v-funnel-chart', `v-funnel-chart--${config.value.tone}`],
    role: 'list' as const,
    'aria-label': props.ariaLabel,
    'data-test-id': props.dataTestId ?? 'v-funnel-chart',
    style: {
      '--v-funnel-height': `${config.value.height}px`,
      '--v-funnel-columns': String(Math.max(1, config.value.columns.length)),
    },
  }))

  return { config, rootAttrs }
}
