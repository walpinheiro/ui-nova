export type VPasswordInputSize = 'sm' | 'md' | 'lg'
export type VPasswordInputStrength = 'weak' | 'medium' | 'strong'
export type VPasswordInputVariant = 'default' | 'show-hide' | 'strength' | 'requirements' | 'error'
export type VPasswordInputState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'revealed'
  | 'invalid'
  | 'disabled'

export interface VPasswordRequirement {
  id: string
  label: string
  test: (value: string) => boolean
}

export interface VPasswordInputProps {
  modelValue?: string
  label?: string
  helperText?: string
  errorMessage?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: VPasswordInputSize
  showStrength?: boolean
  requirements?: boolean
  name?: string
  id?: string
  autocomplete?: string
  revealLabel?: string
  maskLabel?: string
}
