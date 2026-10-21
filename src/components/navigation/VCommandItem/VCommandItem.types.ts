export type VCommandItemSize = 'sm' | 'md' | 'lg'
export type VCommandItemVariant = 'default' | 'primary' | 'subtle'

export interface VCommandItemProps {
  id?: string
  label?: string
  icon?: string
  shortcut?: string
  selected?: boolean
  disabled?: boolean
  loading?: boolean
  size?: VCommandItemSize
  variant?: VCommandItemVariant
  ariaLabel?: string
  dataTestId?: string
  domId?: string
}

export type VCommandItemEmits = {
  click: [event: MouseEvent]
  select: [payload: { id?: string; label?: string }]
}
