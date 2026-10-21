import type { VMotionLevel } from '../../../motion/types'

export type VNumberInputSize = 'sm' | 'md' | 'lg'
export type VNumberInputVariant = 'default' | 'stepper' | 'currency' | 'percentage' | 'min-max' | 'error'
export type VNumberInputInteraction = 'default' | 'scrub'
export type VNumberInputState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'pressed-stepper'
  | 'invalid'
  | 'disabled'

export interface VNumberInputProps {
  modelValue?: number | null
  label?: string
  helperText?: string
  errorMessage?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: VNumberInputSize
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  name?: string
  id?: string
  motion?: VMotionLevel
  /** Scrub Field: drag horizontally to change value. */
  interaction?: VNumberInputInteraction
}
