export type VColorPickerSize = 'sm' | 'md' | 'lg'
export type VColorPickerVariant = 'popover' | 'inline' | 'hex' | 'opacity' | 'preset'
export type VColorPickerState = 'default' | 'hover' | 'focus' | 'open' | 'selected' | 'disabled'

export interface VColorPickerProps {
  modelValue?: string
  variant?: VColorPickerVariant
  size?: VColorPickerSize
  disabled?: boolean
  showAlpha?: boolean
  presets?: string[]
  recentColors?: string[]
  label?: string
  inlineSwatches?: string[]
  selected?: boolean
}
