import type { VMotionLevel } from '../../../motion/types'

export type VSwitchSize = 'sm' | 'md' | 'lg'
export type VSwitchState = 'off' | 'on' | 'disabled'

export interface VSwitchProps {
  modelValue?: boolean
  label?: string
  description?: string
  disabled?: boolean
  size?: VSwitchSize
  name?: string
  id?: string
  showIcon?: boolean
  ariaLabel?: string
  motion?: VMotionLevel
}
