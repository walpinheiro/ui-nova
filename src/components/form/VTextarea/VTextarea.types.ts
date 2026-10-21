export type VTextareaSize = 'sm' | 'md' | 'lg'
export type VTextareaVariant = 'default' | 'auto-resize' | 'counter' | 'helper' | 'error'
export type VTextareaState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'filled'
  | 'invalid'
  | 'disabled'
  | 'readonly'

export interface VTextareaProps {
  modelValue?: string
  label?: string
  helperText?: string
  errorMessage?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: VTextareaSize
  counter?: number
  autoResize?: boolean
  rows?: number
  name?: string
  id?: string
  spellcheck?: boolean
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}
