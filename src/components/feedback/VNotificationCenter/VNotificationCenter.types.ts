import type { VMotionLevel } from '../../../motion/types'
import type { VNotificationItemVariant } from '../VNotificationItem/VNotificationItem.types'

export type VNotificationCenterSize = 'sm' | 'md' | 'lg'
export type VNotificationCenterVariant = 'compact' | 'grouped' | 'feed' | 'drawer' | 'default'
export type VNotificationCenterTab = 'all' | 'unread' | 'mentions' | 'updates'
export type VNotificationCenterPlacement = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start'

export interface VNotificationCenterItem {
  id: string
  title: string
  preview?: string
  time?: string
  unread?: boolean
  variant?: VNotificationItemVariant
  avatar?: string
  avatarAlt?: string
  group?: string
  tab?: VNotificationCenterTab
}

export interface VNotificationCenterProps {
  modelValue?: boolean
  notifications?: VNotificationCenterItem[]
  size?: VNotificationCenterSize
  variant?: VNotificationCenterVariant
  placement?: VNotificationCenterPlacement
  activeTab?: VNotificationCenterTab
  searchQuery?: string
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  triggerLabel?: string
  headerTitle?: string
  markAllLabel?: string
  viewAllLabel?: string
  emptyLabel?: string
  closeLabel?: string
  motion?: VMotionLevel
  /** Expressive pill label shown when the bell toggle is open. */
  expressiveLabel?: string
}

export type VNotificationCenterEmit = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'mark-all-read'): void
  (event: 'view-all'): void
  (event: 'item-click', id: string): void
  (event: 'update:activeTab', value: VNotificationCenterTab): void
  (event: 'update:searchQuery', value: string): void
}
