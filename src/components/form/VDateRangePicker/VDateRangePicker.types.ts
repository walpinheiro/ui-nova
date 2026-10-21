export type VDateRangePickerSize = 'sm' | 'md' | 'lg'
export type VDateRangePickerVariant = 'default' | 'presets' | 'inline' | 'compact' | 'with-time'
export type VDateRangePickerState = 'default' | 'hover' | 'focus' | 'open' | 'range-selected' | 'disabled'

export interface VDateRangePickerPreset {
  label: string
  range: string
}

export interface VDateRangeValue {
  start: Date | null
  end: Date | null
}

export interface VDateRangePickerProps {
  modelValue?: VDateRangeValue | null
  variant?: VDateRangePickerVariant
  size?: VDateRangePickerSize
  disabled?: boolean
  placeholder?: string
  label?: string
  format?: string
  compactFormat?: string
  enableTime?: boolean
  presets?: VDateRangePickerPreset[]
  min?: Date
  max?: Date
  disabledDates?: Date[]
}
