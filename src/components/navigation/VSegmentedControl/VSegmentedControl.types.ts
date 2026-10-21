import type { VMotionLevel } from '../../../motion/types'

export interface VSegmentedControlOption {
  value: string
  label?: string
  icon?: string
  disabled?: boolean
  ariaLabel?: string
}

export type VSegmentedControlSize = 'sm' | 'md' | 'lg'
export type VSegmentedControlVariant = 'default' | 'pill'

export interface VSegmentedControlProps {
  modelValue?: string
  options?: VSegmentedControlOption[]
  disabled?: boolean
  /** Stretch to the container width with equally sized segments. */
  fullWidth?: boolean
  size?: VSegmentedControlSize
  variant?: VSegmentedControlVariant
  ariaLabel?: string
  motion?: VMotionLevel
}
