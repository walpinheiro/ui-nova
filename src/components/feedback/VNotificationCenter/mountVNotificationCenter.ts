import type { IconifyIcon } from '@iconify/types'
import bellIcon from '@iconify-icons/keyline-icons/bell'
import moreHorizontalIcon from '@iconify-icons/keyline-icons/more-horizontal'
import xIcon from '@iconify-icons/keyline-icons/x'
import type {
  VNotificationCenterProps,
  VNotificationCenterTab,
} from './VNotificationCenter.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

export const V_NOTIFICATION_CENTER_BELL_ICON: IconifyIcon = bellIcon
export const V_NOTIFICATION_CENTER_CLOSE_ICON: IconifyIcon = xIcon
export const V_NOTIFICATION_CENTER_MENU_ICON: IconifyIcon = moreHorizontalIcon

export const V_NOTIFICATION_CENTER_TABS: Array<{ key: VNotificationCenterTab; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'mentions', label: 'Mentions' },
  { key: 'updates', label: 'Updates' },
]

export function mountVNotificationCenter(props: VNotificationCenterProps) {
  const variant = props.variant ?? 'default'
  const notifications = props.notifications ?? []

  return {
    size: props.size ?? 'md',
    variant,
    placement: props.placement ?? 'bottom-end',
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    activeTab: props.activeTab ?? 'all',
    searchQuery: props.searchQuery ?? '',
    notifications,
    unreadCount: notifications.filter((item) => item.unread).length,
    headerTitle: props.headerTitle ?? 'Notifications',
    markAllLabel: props.markAllLabel ?? 'Mark all as read',
    viewAllLabel: props.viewAllLabel ?? 'View all notifications',
    emptyLabel: props.emptyLabel ?? 'No notifications yet.',
    triggerLabel: props.triggerLabel ?? 'Open notifications',
    closeLabel: props.closeLabel ?? 'Close notifications',
    motion: props.motion ?? V_MOTION_DEFAULT,
    expressiveLabel: props.expressiveLabel ?? 'Notifications on',
    bellIcon: V_NOTIFICATION_CENTER_BELL_ICON,
    closeIcon: V_NOTIFICATION_CENTER_CLOSE_ICON,
    menuIcon: V_NOTIFICATION_CENTER_MENU_ICON,
    tabs: V_NOTIFICATION_CENTER_TABS,
    showTrigger: variant !== 'feed',
    showPanelInline: variant === 'feed',
    isDrawer: variant === 'drawer',
  } as const
}
