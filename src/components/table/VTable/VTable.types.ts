export type VTableVariant = 'default' | 'bordered' | 'striped' | 'minimal' | 'comparison'
export type VTableSize = 'compact' | 'default' | 'comfortable'
export type VTableStatus = 'active' | 'in-review' | 'away' | 'inactive' | 'match' | 'unused'
export type VTableCellKind = 'text' | 'mark' | 'status'
export type VTableRowTone = 'match' | 'neutral'
export type VSortDirection = 'asc' | 'desc' | null
export interface VTableMark {
  ok: boolean
  label: string
}

export interface VTableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  /** `mark` renders a check or dash. `status` renders a pill. */
  cell?: VTableCellKind
}

export interface VTableRow {
  id: string | number
  name?: string
  role?: string
  status?: VTableStatus
  lastActive?: string
  avatar?: string
  avatarAlt?: string
  disabledActions?: boolean
  expandedContent?: string
  /** Soft row wash used by the comparison variant. */
  tone?: VTableRowTone
  [key: string]: unknown
}

export interface VTableSortState {
  key: string
  direction: Exclude<VSortDirection, null>
  priority?: number
}

export interface VTableProps {
  columns?: VTableColumn[]
  rows?: VTableRow[]
  variant?: VTableVariant
  size?: VTableSize
  loading?: boolean
  selectable?: boolean
  multiple?: boolean
  selected?: Array<string | number>
  sort?: VTableSortState[]
  search?: string
  showToolbar?: boolean
  /** Trailing row-actions column. Default true (always off for `comparison`). */
  showActions?: boolean
  /** Pagination footer. Default true (always off for `comparison`). */
  showPagination?: boolean
  page?: number
  pageSize?: number
  total?: number
  expandedRow?: string | number | null
  dataTestId?: string
}
