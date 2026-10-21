export type VTextInputSize = 'sm' | 'md' | 'lg'
export type VTextInputType = 'text' | 'email' | 'url' | 'search' | 'tel'
export type VTextInputVariant =
  | 'default'
  | 'placeholder'
  | 'leading-icon'
  | 'prefix-suffix'
  | 'error'
  | 'success'
export type VTextInputState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'filled'
  | 'invalid'
  | 'disabled'

export interface VTextInputProps {
  modelValue?: string
  label?: string
  helperText?: string
  errorMessage?: string
  successMessage?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: VTextInputSize
  clearable?: boolean
  clearLabel?: string
  leadingIcon?: string
  prefix?: string
  suffix?: string
  name?: string
  id?: string
  autocomplete?: string
  type?: VTextInputType
  spellcheck?: boolean
  autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
}
