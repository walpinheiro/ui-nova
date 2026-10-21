import type { VFunnelChartProps, VFunnelChartTone } from './VFunnelChart.types'

const TONES: VFunnelChartTone[] = ['primary', 'inverse']

export function conversionRate(from: number, to: number): number | null {
  if (!from || from <= 0) return null
  return Math.round((to / from) * 100)
}

export function mountVFunnelChart(props: VFunnelChartProps) {
  const stages = props.stages ?? []
  const tone = TONES.includes(props.tone as VFunnelChartTone) ? (props.tone as VFunnelChartTone) : 'primary'
  const base = stages.reduce((acc, stage) => Math.max(acc, stage.value), 0) || 1
  const height = props.height && props.height > 0 ? props.height : 120

  const columns = stages.map((stage, index) => {
    const next = stages[index + 1]
    return {
      ...stage,
      key: `${index}-${stage.label}`,
      text: stage.display ?? String(stage.value),
      percent: Math.max(4, Math.min(100, (stage.value / base) * 100)),
      conversion: next ? conversionRate(stage.value, next.value) : null,
    }
  })

  return { tone, height, columns } as const
}
