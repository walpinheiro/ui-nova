import type { VMotionLevel } from '../../../motion/types'

export type VRadioGroupSize = 'sm' | 'md' | 'lg'
export type VRadioGroupLayout = 'vertical' | 'horizontal' | 'card'

export interface VRadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface VRadioGroupProps {
  modelValue?: string
  options: VRadioOption[]
  label?: string
  description?: string
  errorMessage?: string
  disabled?: boolean
  size?: VRadioGroupSize
  layout?: VRadioGroupLayout
  name?: string
  id?: string
  required?: boolean
  motion?: VMotionLevel
}
