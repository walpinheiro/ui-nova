export type VTopBarSize = 'sm' | 'md' | 'lg'
export type VTopBarVariant = 'default' | 'primary' | 'subtle' | 'app'

export interface VTopBarItem {
  value: string
  label: string
}

export interface VTopBarProps {
  title?: string
  disabled?: boolean
  loading?: boolean
  bordered?: boolean
  sticky?: boolean
  size?: VTopBarSize
  variant?: VTopBarVariant
  /** Center navigation. The active item renders as a solid pill. */
  items?: VTopBarItem[]
  activeItem?: string
  ariaLabel?: string
}

export type VTopBarEmits = {
  select: [value: string]
  'update:activeItem': [value: string]
}
