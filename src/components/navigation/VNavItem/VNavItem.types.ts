export type VNavItemSize = 'sm' | 'md' | 'lg'
export type VNavItemBadgeTone = 'default' | 'primary'
export type VNavItemVariant = 'default' | 'primary' | 'subtle' | 'soft' | 'raised'

export interface VNavItemProps {
  label?: string
  value?: string | number
  href?: string
  icon?: string
  badge?: string | number
  /** `primary` renders the badge as a filled primary pill. */
  badgeTone?: VNavItemBadgeTone
  /** Small muted pill after the label (e.g. "Soon"). */
  tag?: string
  /** Renders the icon as a colored rounded square (any CSS color). */
  iconColor?: string
  /** Id of the submenu this item controls (`aria-controls`). */
  ariaControls?: string
  active?: boolean
  disabled?: boolean
  loading?: boolean
  collapsed?: boolean
  size?: VNavItemSize
  variant?: VNavItemVariant
  ariaLabel?: string
  dataTestId?: string
  expandable?: boolean
  expanded?: boolean
}

export type VNavItemEmits = {
  click: [event: MouseEvent]
  select: [payload: { value?: string | number; href?: string }]
  keydown: [event: KeyboardEvent]
}
