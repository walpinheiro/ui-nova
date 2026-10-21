import type { VMotionLevel } from '../../../motion/types'

export type VTooltipSize = 'sm' | 'md' | 'lg' | 'xl'
export type VTooltipVariant = 'default' | 'with-icon' | 'success' | 'error' | 'brand' | 'light'
export type VTooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface VTooltipProps {
  content?: string
  placement?: VTooltipPlacement
  size?: VTooltipSize
  variant?: VTooltipVariant
  disabled?: boolean
  showArrow?: boolean
  hideDelay?: number
  ariaLabel?: string
  motion?: VMotionLevel
  /** Warm Tooltip: share open delay within a toolbar group. */
  warmGroup?: string
}
