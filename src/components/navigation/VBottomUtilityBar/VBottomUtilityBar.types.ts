export type VBottomUtilityBarSize = 'sm' | 'md' | 'lg'
export type VBottomUtilityBarVariant = 'default' | 'primary' | 'subtle'

export interface VBottomUtilityBarProps {
  disabled?: boolean
  loading?: boolean
  size?: VBottomUtilityBarSize
  variant?: VBottomUtilityBarVariant
  fixed?: boolean
  safeArea?: boolean
  bordered?: boolean
  ariaLabel?: string
}
