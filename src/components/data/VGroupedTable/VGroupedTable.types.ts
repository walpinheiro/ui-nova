import type { IconifyIcon } from '@iconify/types'

export type VGroupedTableSize = 'compact' | 'default'
export type VGroupedTableAlign = 'start' | 'end' | 'center'

export interface VGroupedTableColumn {
  key: string
  label: string
  /** Header icon; shown instead of the label when `iconOnlyHeader` is set. */
  icon?: IconifyIcon
  iconOnlyHeader?: boolean
  width?: string
  align?: VGroupedTableAlign
  /**
   * Container width (px) from which this column is shown. Narrower containers hide it,
   * so the table "snaps" between layouts as its panel is resized.
   */
  minWidth?: number
  /** When hidden, render this column's value inline (muted) after the given column's cell. */
  collapseInto?: string
}

export interface VGroupedTableRow {
  id: string | number
  [key: string]: unknown
}

export interface VGroupedTableGroup {
  id: string
  label: string
  /** Status glyph before the label. */
  icon?: IconifyIcon
  /** Icon color (any CSS color). */
  color?: string
  /** Defaults to `rows.length`. */
  count?: number
  rows: VGroupedTableRow[]
}

export interface VGroupedTableProps {
  columns?: VGroupedTableColumn[]
  groups?: VGroupedTableGroup[]
  /** Collapsed group ids (`v-model:collapsed`). */
  collapsed?: string[]
  collapsible?: boolean
  /** Column header row. `auto` shows it once at least `headerMinWidth` px are available. */
  showHeader?: boolean | 'auto'
  headerMinWidth?: number
  size?: VGroupedTableSize
  /** Rows become focusable and emit `row-click`. */
  interactive?: boolean
  /** Forces the measured width (SSR/tests). Normally measured with ResizeObserver. */
  containerWidth?: number
  ariaLabel?: string
  dataTestId?: string
}

export type VGroupedTableEmits = {
  'update:collapsed': [value: string[]]
  'group-toggle': [groupId: string, collapsed: boolean]
  'row-click': [row: VGroupedTableRow, group: VGroupedTableGroup]
}
