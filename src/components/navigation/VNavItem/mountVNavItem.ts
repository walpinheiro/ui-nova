import type { IconifyIcon } from '@iconify/types'
import homeIcon from '@iconify-icons/keyline-icons/home'
import chartBarIcon from '@iconify-icons/keyline-icons/chart-bar'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import usersIcon from '@iconify-icons/keyline-icons/users'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import layoutDashboardIcon from '@iconify-icons/keyline-icons/layout-dashboard'
import zapIcon from '@iconify-icons/keyline-icons/zap'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import bookOpenIcon from '@iconify-icons/keyline-icons/book-open'
import messageIcon from '@iconify-icons/keyline-icons/message'
import type { VNavItemProps, VNavItemSize } from './VNavItem.types'

const SIZES: VNavItemSize[] = ['sm', 'md', 'lg']

export const NAV_ITEM_ICONS: Record<string, IconifyIcon> = {
  home: homeIcon,
  dashboard: homeIcon,
  chart: chartBarIcon,
  analytics: chartBarIcon,
  folder: folderIcon,
  projects: folderIcon,
  team: usersIcon,
  users: usersIcon,
  design: layoutDashboardIcon,
  integrations: zapIcon,
  settings: settingsIcon,
  sparkle: sparklesIcon,
  sparkles: sparklesIcon,
  book: bookOpenIcon,
  message: messageIcon,
  chat: messageIcon,
  canvas: layoutDashboardIcon,
  workbench: folderIcon,
}

export function resolveNavItemIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return NAV_ITEM_ICONS[icon.toLowerCase()]
}

export function mountVNavItem(props: VNavItemProps) {
  const size: VNavItemSize = SIZES.includes(props.size as VNavItemSize)
    ? (props.size as VNavItemSize)
    : 'md'

  return {
    size,
    variant: props.variant ?? 'default',
    label: props.label ?? '',
    value: props.value,
    href: props.href,
    iconData: resolveNavItemIcon(props.icon),
    badge: props.badge,
    badgeTone: props.badgeTone === 'primary' ? 'primary' : 'default',
    tag: props.tag,
    iconColor: props.iconColor,
    showBadge: props.badge !== undefined && props.badge !== null && `${props.badge}`.length > 0,
    active: Boolean(props.active),
    collapsed: Boolean(props.collapsed),
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    isLink: Boolean(props.href),
    testId: props.dataTestId ?? 'v-nav-item',
  } as const
}
