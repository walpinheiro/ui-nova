import type { VMotionLevel } from '../../../motion/types'

export type VSelectSize = 'sm' | 'md' | 'lg'

export type VSelectState = 'default' | 'open' | 'filled' | 'invalid' | 'disabled'

export interface VSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface VSelectProps {
  modelValue?: string
  options?: VSelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  errorMessage?: string
  leadingIcon?: string
  size?: VSelectSize
  clearable?: boolean
  clearValue?: string
  id?: string
  motion?: VMotionLevel
}
