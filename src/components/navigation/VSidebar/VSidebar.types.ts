export type VSidebarSize = 'sm' | 'md' | 'lg'
export type VSidebarVariant = 'default' | 'card' | 'workspace' | 'icons' | 'floating'
export type VSidebarItemType = 'item' | 'heading' | 'group'
export type VSidebarBadgeTone = 'default' | 'primary'

export interface VSidebarItem {
  value: string
  label: string
  /**
   * `item` (default) is a link/button, optionally with nested `children` at any depth.
   * `heading` is a flat, non-collapsible caption (skipped by keyboard navigation).
   * `group` is a section header with `children`; collapsible unless `collapsible: false`.
   */
  type?: VSidebarItemType
  /** Groups only. Defaults to `true`. */
  collapsible?: boolean
  /** Open on first render when `expandedSections` is not controlled. Groups are open by default. */
  defaultOpen?: boolean
  /** Small muted pill (e.g. "Soon"). */
  tag?: string
  /** Colored rounded-square icon (project-like items). Any CSS color. */
  iconColor?: string
  /** `primary` renders the badge as a filled primary pill. */
  badgeTone?: VSidebarBadgeTone
  icon?: string
  href?: string
  to?: string
  badge?: string | number
  disabled?: boolean
  children?: VSidebarItem[]
}

export interface VSidebarProps {
  /** Controls collapsed (icon-only rail) state. `v-model:collapsed` (primary) — `modelValue` accepted as alias. */
  collapsed?: boolean
  modelValue?: boolean
  items?: VSidebarItem[]
  activeItem?: string
  expandedSections?: string[]
  /** Opening an expandable item closes its open siblings. Default `true`. */
  accordion?: boolean
  /** Also apply accordion behaviour between sibling groups. Default `false`. */
  accordionGroups?: boolean
  /** Filter items by label while typing in the search field. Default `true`. */
  filterOnSearch?: boolean
  brandName?: string
  brandIcon?: string
  searchPlaceholder?: string
  showSearch?: boolean
  searchShortcut?: string
  userName?: string
  userEmail?: string
  userAvatar?: string
  /** Title that stays visible in the floating chip and in the open sidebar. */
  heading?: string
  /** Where the user is. Stays visible when the floating sidebar is closed or open. */
  position?: string
  /** Pins the sidebar open. The floating chip cannot collapse it. */
  locked?: boolean
  size?: VSidebarSize
  /** Panel width. Number = px, string = any CSS length. Sets `--v-sidebar-width` on the root. */
  width?: string | number
  /** Where the chevron of a collapsible group sits. Default `'end'`. */
  groupChevron?: 'start' | 'end'
  /** Direction of the chevron of an open collapsible group. `'down'` (default) rotates -90deg when closed; `'up'` shows "v" closed and "^" open. */
  groupChevronOpen?: 'up' | 'down'
  /** Chevron of expandable items. `'rotate'` (default) is ">" rotating 90deg; `'updown'` is "v" closed and "^" open. */
  chevron?: 'rotate' | 'updown'
  /** Hairline above every group except the first. Default `false`. */
  groupDividers?: boolean
  /** `card` is a soft menu. `workspace` raises the active item. `icons` is the small icon islands. `floating` is the compact card that opens downward. */
  variant?: VSidebarVariant
  showBrand?: boolean
  showFooter?: boolean
  /** Shows the collapse/expand toggle (icons rail, collapsed rail, inline). Default `true`. */
  showCollapseToggle?: boolean
  disabled?: boolean
  ariaLabel?: string
}

export interface ResolvedVSidebarItem {
  value: string
  label: string
  type: VSidebarItemType
  icon?: string
  href?: string
  to?: string
  badge?: string | number
  badgeTone: VSidebarBadgeTone
  tag?: string
  iconColor?: string
  collapsible: boolean
  defaultOpen?: boolean
  disabled: boolean
  iconData?: import('@iconify/types').IconifyIcon
  hasChildren: boolean
  children: ResolvedVSidebarItem[]
  /** Nesting depth through item parents (groups do not add depth). */
  depth: number
  parent?: string
}

export type VSidebarEmits = {
  'update:collapsed': [value: boolean]
  'update:modelValue': [value: boolean]
  'update:locked': [value: boolean]
  'update:activeItem': [value: string]
  'update:expandedSections': [value: string[]]
  select: [value: string]
  'section-toggle': [value: string, expanded: boolean]
  search: [query: string]
}
