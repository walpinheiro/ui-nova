export type VFilterBarSize = 'sm' | 'md' | 'lg'
export type VFilterBarVariant = 'basic' | 'chips' | 'advanced' | 'sticky'
export type VFilterChipSeverity = 'default' | 'success' | 'warning' | 'danger'

export interface VFilterChip {
  id: string
  label: string
  severity?: VFilterChipSeverity
  dot?: boolean
}

export interface VFilterSelectOption {
  label: string
  value: string
}

export interface VFilterSelect {
  id: string
  label: string
  value: string
  options: VFilterSelectOption[]
}

export interface VFilterBarProps {
  search?: string
  filters?: Record<string, string>
  dateRange?: string
  chips?: VFilterChip[]
  selects?: VFilterSelect[]
  resultsCount?: number
  totalCount?: number
  activeCount?: number
  size?: VFilterBarSize
  variant?: VFilterBarVariant
  sticky?: boolean
  loading?: boolean
  disabled?: boolean
  searchShortcut?: boolean
  title?: string
  dataTestId?: string
}
