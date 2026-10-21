import type { VDropdownMenuItem } from '../VDropdownMenu/VDropdownMenu.types'

export type VContextMenuSize = 'sm' | 'md' | 'lg'

/** Same shape as {@link VDropdownMenuItem}. */
export type VContextMenuItem = VDropdownMenuItem

export interface VContextMenuProps {
  modelValue?: boolean
  x?: number
  y?: number
  items?: VContextMenuItem[]
  disabled?: boolean
  loading?: boolean
  size?: VContextMenuSize
  ariaLabel?: string
}
