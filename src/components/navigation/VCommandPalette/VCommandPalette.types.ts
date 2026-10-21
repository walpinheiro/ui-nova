export type VCommandPaletteSize = 'sm' | 'md' | 'lg'
export type VCommandPaletteVariant =
  | 'global-search'
  | 'quick-actions'
  | 'file-switcher'
  | 'settings-palette'

export interface VCommandPaletteItem {
  id: string
  label: string
  shortcut?: string
  icon?: string
  keywords?: string[]
  disabled?: boolean
}

export interface VCommandPaletteGroup {
  id: string
  label: string
  items: VCommandPaletteItem[]
}

export interface VCommandPaletteProps {
  /** Controlled visibility (`v-model`). */
  modelValue?: boolean
  /** Alias for `v-model:open`. */
  open?: boolean
  /** Search query (`v-model:query`). */
  query?: string
  placeholder?: string
  items?: VCommandPaletteGroup[]
  loading?: boolean
  disabled?: boolean
  dismissible?: boolean
  size?: VCommandPaletteSize
  variant?: VCommandPaletteVariant
  shortcutLabel?: string
  emptyTitle?: string
  emptyHint?: string
  searchLabel?: string
  ariaLabel?: string
}

export type VCommandPaletteEmits = {
  'update:modelValue': [value: boolean]
  'update:open': [value: boolean]
  'update:query': [value: string]
  'open-change': [value: boolean]
  select: [item: VCommandPaletteItem]
  close: []
  dismiss: []
}
