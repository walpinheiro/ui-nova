import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import minusIcon from '@iconify-icons/keyline-icons/minus'
import type { VTableColumn, VTableMark, VTableProps, VTableRow, VTableStatus, VTableVariant } from './VTable.types'

export const V_TABLE_STATUS_LABELS: Record<VTableStatus, string> = {
  active: 'Active',
  'in-review': 'In Review',
  away: 'Away',
  inactive: 'Inactive',
  match: 'Match',
  unused: 'Unused',
}

export const V_TABLE_STATUS_VARIANTS: Record<VTableStatus, string> = {
  active: 'success',
  'in-review': 'primary',
  away: 'warning',
  inactive: 'neutral',
  match: 'success',
  unused: 'neutral',
}

export const V_TABLE_MARK_ICONS: Record<'check' | 'unused', IconifyIcon> = {
  check: checkIcon,
  unused: minusIcon,
}

const VARIANTS: VTableVariant[] = ['default', 'bordered', 'striped', 'minimal', 'comparison']

export function readTableMark(value: unknown): VTableMark | null {
  if (!value || typeof value !== 'object') return null
  if (!('ok' in value) || !('label' in value)) return null
  const mark = value as VTableMark
  return { ok: Boolean(mark.ok), label: String(mark.label) }
}

export function isKnownTableStatus(value: unknown): value is VTableStatus {
  return typeof value === 'string' && value in V_TABLE_STATUS_LABELS
}

export function isStatusColumn(column: VTableColumn, row: VTableRow) {
  if (column.cell === 'status') return isKnownTableStatus(row[column.key])
  return column.key === 'status' && isKnownTableStatus(row.status)
}

export function mountVTable(props: VTableProps) {
  const variant: VTableVariant = VARIANTS.includes(props.variant as VTableVariant)
    ? (props.variant as VTableVariant)
    : 'default'
  const comparison = variant === 'comparison'
  const size = props.size ?? 'default'
  const columns = props.columns ?? []
  const rows = props.rows ?? []

  return {
    variant,
    size,
    columns,
    rows,
    selectable: comparison ? false : Boolean(props.selectable),
    multiple: Boolean(props.multiple),
    loading: Boolean(props.loading),
    showToolbar: comparison ? false : (props.showToolbar ?? true),
    showActions: comparison ? false : (props.showActions ?? true),
    showPagination: comparison ? false : (props.showPagination ?? true),
    isEmpty: !props.loading && rows.length === 0,
    testId: props.dataTestId ?? 'table',
    pageSize: props.pageSize ?? 10,
    page: props.page ?? 1,
    total: props.total ?? rows.length,
  } as const
}
