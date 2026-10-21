import type { IconifyIcon } from '@iconify/types'
import arrowUpRightIcon from '@iconify-icons/keyline-icons/arrow-up-right'
import checkIcon from '@iconify-icons/keyline-icons/check'
import infoIcon from '@iconify-icons/keyline-icons/info'
import moreHorizontalIcon from '@iconify-icons/keyline-icons/more-horizontal'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VNotificationItemProps, VNotificationItemVariant } from './VNotificationItem.types'

export const V_NOTIFICATION_ITEM_CLOSE_ICON: IconifyIcon = xIcon
export const V_NOTIFICATION_ITEM_MENU_ICON: IconifyIcon = moreHorizontalIcon

export const V_NOTIFICATION_ITEM_VARIANT_ICONS: Record<VNotificationItemVariant, IconifyIcon> = {
  avatar: infoIcon,
  system: infoIcon,
  success: checkIcon,
  actionable: arrowUpRightIcon,
  default: infoIcon,
}

export function mountVNotificationItem(props: VNotificationItemProps) {
  const variant = props.variant ?? 'default'

  return {
    size: props.size ?? 'md',
    variant,
    unread: Boolean(props.unread),
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    dismissible: Boolean(props.dismissible),
    showMenu: props.showMenu ?? true,
    hasAvatar: Boolean(props.avatar),
    iconData: V_NOTIFICATION_ITEM_VARIANT_ICONS[variant],
    closeIcon: V_NOTIFICATION_ITEM_CLOSE_ICON,
    menuIcon: V_NOTIFICATION_ITEM_MENU_ICON,
  } as const
}
