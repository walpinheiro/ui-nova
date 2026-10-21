export type VNotificationItemSize = 'sm' | 'md' | 'lg'
export type VNotificationItemVariant = 'avatar' | 'system' | 'success' | 'actionable' | 'default'

export interface VNotificationItemAction {
  label: string
  key?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export interface VNotificationItemProps {
  avatar?: string
  avatarAlt?: string
  title?: string
  preview?: string
  time?: string
  unread?: boolean
  variant?: VNotificationItemVariant
  size?: VNotificationItemSize
  disabled?: boolean
  loading?: boolean
  dismissible?: boolean
  showMenu?: boolean
  actions?: VNotificationItemAction[]
  ariaLabel?: string
  dismissLabel?: string
  menuLabel?: string
}

export type VNotificationItemEmit = {
  (event: 'click'): void
  (event: 'dismiss'): void
  (event: 'menu'): void
  (event: 'action', key: string): void
  (event: 'update:unread', value: boolean): void
}
