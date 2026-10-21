import type { VMotionLevel } from '../../../motion/types'

export type VSliderSize = 'sm' | 'md' | 'lg'
export type VSliderOrientation = 'horizontal' | 'vertical'
export type VSliderVariant = 'single' | 'range' | 'marks' | 'vertical' | 'disabled'
export type VSliderState = 'default' | 'hover' | 'focus' | 'dragging' | 'disabled'

export type VSliderModelValue = number | [number, number]

export interface VSliderProps {
  modelValue?: VSliderModelValue
  min?: number
  max?: number
  step?: number
  range?: boolean
  marks?: number[] | Record<number, string>
  orientation?: VSliderOrientation
  disabled?: boolean
  size?: VSliderSize
  showValue?: boolean
  showTooltip?: boolean
  snapToMarks?: boolean
  ariaLabel?: string
  id?: string
  motion?: VMotionLevel
}

export type VSliderThumb = 'min' | 'max' | 'single'
