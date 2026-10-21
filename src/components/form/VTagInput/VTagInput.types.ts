export type VTagInputSize = 'sm' | 'md' | 'lg'
export type VTagInputVariant = 'default' | 'suggestions' | 'closable' | 'readonly' | 'multiline'
export type VTagInputState =
  | 'default'
  | 'empty'
  | 'typing'
  | 'focus'
  | 'disabled'
  | 'selected-suggestion'

export type VTagInputDelimiter = 'enter' | 'comma' | 'tab'

export interface VTagInputProps {
  modelValue?: string[]
  suggestions?: string[]
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  closable?: boolean
  multiline?: boolean
  maxTags?: number
  delimiters?: VTagInputDelimiter[]
  allowDuplicates?: boolean
  validateTag?: (tag: string) => boolean
  id?: string
  size?: VTagInputSize
  emptyText?: string
}
