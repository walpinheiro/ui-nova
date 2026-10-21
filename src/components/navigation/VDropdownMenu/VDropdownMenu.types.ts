export type VDropdownMenuSize = 'sm' | 'md' | 'lg'
export type VDropdownMenuVariant = 'secondary' | 'primary' | 'ghost' | 'destructive'
export type VDropdownMenuTriggerStyle = 'default' | 'field' | 'icon'
export type VDropdownMenuMenuAlign = 'start' | 'end'

export interface VDropdownMenuItem {
  value: string
  label: string
  icon?: string
  disabled?: boolean
  selected?: boolean
  destructive?: boolean
  divider?: boolean
  children?: VDropdownMenuItem[]
}

export interface VDropdownMenuProps {
  modelValue?: boolean
  value?: string
  label?: string
  icon?: string
  showTriggerIcon?: boolean
  showChevron?: boolean
  items?: VDropdownMenuItem[]
  disabled?: boolean
  loading?: boolean
  size?: VDropdownMenuSize
  variant?: VDropdownMenuVariant | 'default' | 'subtle'
  triggerStyle?: VDropdownMenuTriggerStyle
  menuAlign?: VDropdownMenuMenuAlign
  ariaLabel?: string
}
