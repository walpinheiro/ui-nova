import type { IconifyIcon } from '@iconify/types'

export type VSearchFieldSize = 'sm' | 'md' | 'lg'
export type VSearchFieldVariant = 'standard' | 'shortcut' | 'command'
export type VSearchFieldState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'typing'
  | 'filled'
  | 'suggestions-open'
  | 'loading'
  | 'disabled'

export interface VSearchFieldSuggestion {
  value: string
  label: string
  category?: string
  icon?: string | IconifyIcon
}

export interface VSearchFieldProps {
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  size?: VSearchFieldSize
  variant?: VSearchFieldVariant
  shortcut?: boolean
  shortcutKeys?: string
  clearable?: boolean
  clearLabel?: string
  suggestions?: VSearchFieldSuggestion[]
  name?: string
  id?: string
  autocomplete?: string
  ariaLabel?: string
}
