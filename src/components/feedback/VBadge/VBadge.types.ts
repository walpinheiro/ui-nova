export type VBadgeSize = 'xs' | 'sm' | 'md' | 'lg'
export type VBadgeVariant =
  | 'neutral'
  | 'default'
  | 'primary'
  | 'purple'
  | 'success'
  | 'warning'
  | 'danger'
  | 'count'
  | 'dot'
  | 'outlined'
  | 'subtle'

export type VBadgeNormalizedVariant = Exclude<VBadgeVariant, 'default' | 'subtle'>

export interface VBadgeProps {
  size?: VBadgeSize
  variant?: VBadgeVariant
  count?: string | number
  dot?: boolean
  /** Overrides the dot color (any CSS color). Defaults to the badge tone. */
  dotColor?: string
  icon?: string
  interactive?: boolean
  removable?: boolean
  leaving?: boolean
  selected?: boolean
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  removeLabel?: string
  live?: boolean
  dataTestId?: string
  removeTestId?: string
}
