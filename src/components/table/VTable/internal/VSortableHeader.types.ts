import type { VSortDirection } from '../VTable.types'

export type VSortableHeaderSize = 'sm' | 'md' | 'lg'

export interface VSortableHeaderProps {
  label: string
  direction?: VSortDirection
  sortPriority?: number
  disabled?: boolean
  size?: VSortableHeaderSize
  leadingIcon?: boolean
  columnKey?: string
  dataTestId?: string
}
