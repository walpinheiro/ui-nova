import type { VMotionLevel, VMotionStrike } from '../../../motion/types'

export type VCheckboxSize = 'sm' | 'md' | 'lg'
export type VCheckboxVisualState = 'unchecked' | 'checked' | 'indeterminate' | 'disabled'

export interface VCheckboxProps {
  modelValue?: boolean
  indeterminate?: boolean
  /** Micro-interaction intensity. `expressive` enables Spring Check animation. */
  motion?: VMotionLevel
  /** Strike-through direction when checked (expressive mode). */
  strikeThrough?: boolean | VMotionStrike
  /** Label opacity when checked in expressive mode (0–1). */
  doneOpacity?: number
  label?: string
  description?: string
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  size?: VCheckboxSize
  name?: string
  id?: string
  value?: string | number | boolean
  required?: boolean
  linkHref?: string
  linkLabel?: string
}
