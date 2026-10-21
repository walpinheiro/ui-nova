import type { VBarListEmphasis, VBarListLayout, VBarListProps, VBarListSize } from './VBarList.types'

const SIZES: VBarListSize[] = ['sm', 'md']
const LAYOUTS: VBarListLayout[] = ['inline', 'stacked']
const EMPHASES: VBarListEmphasis[] = ['max', 'first', 'all', 'none']

export function mountVBarList(props: VBarListProps) {
  const items = props.items ?? []
  const size = SIZES.includes(props.size as VBarListSize) ? (props.size as VBarListSize) : 'md'
  const layout = LAYOUTS.includes(props.layout as VBarListLayout) ? (props.layout as VBarListLayout) : 'inline'
  const emphasis = EMPHASES.includes(props.emphasis as VBarListEmphasis) ? (props.emphasis as VBarListEmphasis) : 'max'
  const largest = items.reduce((acc, item) => Math.max(acc, item.value), 0)
  const max = props.max && props.max > 0 ? props.max : largest || 1
  const unit = props.unit ?? ''

  const rows = items.map((item, index) => {
    const ratio = Math.min(1, Math.max(0, item.value / max))
    const strong =
      item.emphasized ??
      (emphasis === 'all' || (emphasis === 'first' && index === 0) || (emphasis === 'max' && item.value === largest && largest > 0))
    return {
      ...item,
      key: `${index}-${item.label}`,
      percent: Math.round(ratio * 1000) / 10,
      strong,
      text: item.display ?? `${item.value}${unit}`,
    }
  })

  return { size, layout, emphasis, max, rows } as const
}
