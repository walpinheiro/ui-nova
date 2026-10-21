export type VToolbarSize = 'sm' | 'md' | 'lg'
export type VToolbarVariant = 'default' | 'compact' | 'floating' | 'editor' | 'segmented'

export interface VToolbarProps {
  disabled?: boolean
  loading?: boolean
  size?: VToolbarSize
  variant?: VToolbarVariant
  ariaLabel?: string
}

export interface VToolbarMenuItem {
  value: string
  label: string
  icon?: string
  disabled?: boolean
}

export type VToolbarButtonVariant = 'default' | 'primary' | 'toggle'

export interface VToolbarButtonProps {
  icon?: string
  label?: string
  variant?: VToolbarButtonVariant
  active?: boolean
  disabled?: boolean
  menu?: VToolbarMenuItem[]
  ariaLabel?: string
}
