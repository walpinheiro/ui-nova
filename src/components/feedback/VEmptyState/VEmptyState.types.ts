export type VEmptyStateSize = 'sm' | 'md' | 'lg'
export type VEmptyStateVariant = 'default' | 'results' | 'files' | 'notifications' | 'create'

export interface VEmptyStateAction {
  label: string
  icon?: string
}

export interface VEmptyStateProps {
  title?: string
  description?: string
  action?: VEmptyStateAction
  size?: VEmptyStateSize
  variant?: VEmptyStateVariant
  compact?: boolean
  showIllustration?: boolean
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  headingLevel?: 2 | 3 | 4
}

export type VEmptyStateEmit = {
  (event: 'action'): void
}
