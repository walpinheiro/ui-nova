import type { VGroupedTableColumn, VGroupedTableProps, VGroupedTableSize } from './VGroupedTable.types'

const SIZES: VGroupedTableSize[] = ['compact', 'default']

export function resolveColumns(columns: VGroupedTableColumn[], width: number) {
  const visible = columns.filter((column) => !column.minWidth || width >= column.minWidth)
  const visibleKeys = new Set(visible.map((column) => column.key))
  const collapsed = new Map<string, VGroupedTableColumn[]>()
  for (const column of columns) {
    if (visibleKeys.has(column.key) || !column.collapseInto || !visibleKeys.has(column.collapseInto)) continue
    collapsed.set(column.collapseInto, [...(collapsed.get(column.collapseInto) ?? []), column])
  }
  return { visible, collapsed }
}

export function mountVGroupedTable(props: VGroupedTableProps, measuredWidth: number) {
  const size = SIZES.includes(props.size as VGroupedTableSize) ? (props.size as VGroupedTableSize) : 'default'
  const width = props.containerWidth ?? measuredWidth
  const { visible, collapsed } = resolveColumns(props.columns ?? [], width)
  const collapsedIds = new Set(props.collapsed ?? [])
  const headerMode = props.showHeader ?? 'auto'
  const showHeader = headerMode === 'auto' ? width >= (props.headerMinWidth ?? 640) : headerMode

  const groups = (props.groups ?? []).map((group) => ({
    ...group,
    count: group.count ?? group.rows.length,
    collapsed: props.collapsible !== false && collapsedIds.has(group.id),
  }))

  return { size, width, visible, collapsed, groups, showHeader } as const
}
