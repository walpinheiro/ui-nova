export type VDatePickerSize = 'sm' | 'md' | 'lg'
export type VDatePickerVariant = 'default' | 'with-icon' | 'with-preset' | 'range'
export type VDatePickerState = 'default' | 'hover' | 'focus' | 'open' | 'filled' | 'disabled'

export interface VDatePickerPreset {
  label: string
  value: string
}

export interface VDatePickerProps {
  modelValue?: Date | null
  range?: boolean
  rangeValue?: { start: Date | null; end: Date | null }
  variant?: VDatePickerVariant
  size?: VDatePickerSize
  disabled?: boolean
  placeholder?: string
  label?: string
  format?: string
  showToday?: boolean
  showLeadingIcon?: boolean
  clearable?: boolean
  min?: Date
  max?: Date
  disabledDates?: Date[]
  eventDates?: Date[]
  preset?: string
  presets?: VDatePickerPreset[]
}
