import type { VDescriptionListLayout, VDescriptionListProps, VDescriptionListSize } from './VDescriptionList.types'

const LAYOUTS: VDescriptionListLayout[] = ['inline', 'stacked', 'grid']
const SIZES: VDescriptionListSize[] = ['sm', 'md']

export function mountVDescriptionList(props: VDescriptionListProps) {
  const layout = LAYOUTS.includes(props.layout as VDescriptionListLayout) ? (props.layout as VDescriptionListLayout) : 'inline'
  const size = SIZES.includes(props.size as VDescriptionListSize) ? (props.size as VDescriptionListSize) : 'md'
  const columns = Math.max(1, Math.floor(props.columns ?? 2))
  const rows = (props.items ?? []).map((item) => ({ ...item, key: item.key ?? item.label }))

  return { layout, size, columns, rows } as const
}
