export type VMenuBarSize = 'sm' | 'md' | 'lg'
export type VMenuBarVariant = 'default' | 'primary' | 'subtle'

export interface VMenuBarItem {
  value: string
  label: string
  icon?: string
  disabled?: boolean
  selected?: boolean
  destructive?: boolean
  divider?: boolean
  shortcut?: string
  children?: VMenuBarItem[]
}

export interface VMenuBarMenu {
  value: string
  label: string
  disabled?: boolean
  children: VMenuBarItem[]
}

export interface VMenuBarProps {
  items?: VMenuBarMenu[]
  disabled?: boolean
  loading?: boolean
  size?: VMenuBarSize
  variant?: VMenuBarVariant
  ariaLabel?: string
  openOnHover?: boolean
  hoverDelay?: number
}
