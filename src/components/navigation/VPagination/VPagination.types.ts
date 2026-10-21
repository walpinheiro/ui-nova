export type VPaginationSize = 'sm' | 'md' | 'lg'
export type VPaginationVariant = 'default' | 'compact' | 'ellipsis'

export type PaginationRangeItem =
  | { kind: 'page'; page: number }
  | { kind: 'ellipsis'; id: 'start' | 'end' }

export interface VPaginationProps {
  modelValue?: number
  total?: number
  pageSize?: number
  pageCount?: number
  siblingCount?: number
  boundaryCount?: number
  disabled?: boolean
  loading?: boolean
  size?: VPaginationSize
  variant?: VPaginationVariant
  showPageSize?: boolean
  showResultCount?: boolean
  pageSizeOptions?: number[]
  prevLabel?: string
  nextLabel?: string
  pageSizeLabel?: string
  ariaLabel?: string
}
