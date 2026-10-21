import type { VBarChartProps, VBarChartTone, VBarChartValueMode, VBarChartVariant } from './VBarChart.types'

const VARIANTS: VBarChartVariant[] = ['pill', 'solid']
const TONES: VBarChartTone[] = ['primary', 'neutral', 'inverse']
const VALUE_MODES: VBarChartValueMode[] = ['active', 'all', 'none']

export function mountVBarChart(props: VBarChartProps) {
  const data = props.data ?? []
  const variant = VARIANTS.includes(props.variant as VBarChartVariant) ? (props.variant as VBarChartVariant) : 'pill'
  const tone = TONES.includes(props.tone as VBarChartTone) ? (props.tone as VBarChartTone) : 'primary'
  const showValue = VALUE_MODES.includes(props.showValue as VBarChartValueMode) ? (props.showValue as VBarChartValueMode) : 'active'
  const largest = data.reduce((acc, datum) => Math.max(acc, datum.value), 0)
  const max = props.max && props.max > 0 ? props.max : largest || 1
  const active = props.active === undefined ? data.length - 1 : props.active
  const height = props.height && props.height > 0 ? props.height : 120

  const bars = data.map((datum, index) => {
    const ratio = Math.min(1, Math.max(0, datum.value / max))
    const isActive = index === active
    return {
      ...datum,
      index,
      key: `${index}-${datum.label}`,
      percent: Math.max(ratio * 100, 2),
      text: datum.display ?? String(datum.value),
      active: isActive,
      valueVisible: showValue === 'all' || (showValue === 'active' && isActive),
    }
  })

  return { variant, tone, showValue, max, active, height, bars } as const
}
