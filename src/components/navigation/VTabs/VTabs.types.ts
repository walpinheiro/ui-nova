export interface VTabItem {
  value: string
  label: string
  icon?: string
  disabled?: boolean
}

export type VTabsSize = 'sm' | 'md' | 'lg'
export type VTabsVariant = 'underline' | 'pill' | 'icon'

export interface VTabsProps {
  modelValue?: string
  items?: VTabItem[]
  disabled?: boolean
  size?: VTabsSize
  variant?: VTabsVariant
  dividers?: boolean
  /** Renders the tabpanel area. Set `false` to use tabs as navigation (no tabpanel/aria-controls). Default `true`. */
  panels?: boolean
  ariaLabel?: string
}
