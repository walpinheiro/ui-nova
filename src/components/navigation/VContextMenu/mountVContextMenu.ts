import {
  DEFAULT_DROPDOWN_ITEMS,
  DROPDOWN_MENU_UI_ICONS,
  resolveDropdownIcon,
} from '../VDropdownMenu/mountVDropdownMenu'
import type { VContextMenuItem, VContextMenuProps, VContextMenuSize } from './VContextMenu.types'

const SIZES: VContextMenuSize[] = ['sm', 'md', 'lg']

export const DEFAULT_CONTEXT_MENU_ITEMS: VContextMenuItem[] = DEFAULT_DROPDOWN_ITEMS

export const CONTEXT_MENU_UI_ICONS = DROPDOWN_MENU_UI_ICONS

export function resolveContextMenuIcon(icon?: string) {
  return resolveDropdownIcon(icon)
}

export function mountVContextMenu(props: VContextMenuProps) {
  const size: VContextMenuSize = SIZES.includes(props.size as VContextMenuSize)
    ? (props.size as VContextMenuSize)
    : 'md'

  return {
    size,
    items: props.items ?? DEFAULT_CONTEXT_MENU_ITEMS,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
