import type { IconifyIcon } from '@iconify/types'
import bellIcon from '@iconify-icons/keyline-icons/bell'
import searchIcon from '@iconify-icons/keyline-icons/search'
import sunIcon from '@iconify-icons/keyline-icons/sun'
import xIcon from '@iconify-icons/keyline-icons/x'
import layoutDashboardIcon from '@iconify-icons/keyline-icons/layout-dashboard'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import fileIcon from '@iconify-icons/keyline-icons/file-text'
import usersIcon from '@iconify-icons/keyline-icons/users'
import chartBarIcon from '@iconify-icons/keyline-icons/chart-bar'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import uploadIcon from '@iconify-icons/keyline-icons/upload'
import userPlusIcon from '@iconify-icons/keyline-icons/user-plus'
import type { VAppShellNavItem, VAppShellProps, VAppShellQuickAction, VAppShellShortcut } from './VAppShell.types'

export const APP_SHELL_UI_ICONS = {
  bell: bellIcon,
  search: searchIcon,
  sun: sunIcon,
  close: xIcon,
  dashboard: layoutDashboardIcon,
  folder: folderIcon,
  file: fileIcon,
  users: usersIcon,
  chart: chartBarIcon,
  settings: settingsIcon,
  plus: plusIcon,
  upload: uploadIcon,
  userPlus: userPlusIcon,
} satisfies Record<string, IconifyIcon>

const NAV_ICON_MAP: Record<string, IconifyIcon> = {
  dashboard: layoutDashboardIcon,
  projects: folderIcon,
  documents: fileIcon,
  team: usersIcon,
  analytics: chartBarIcon,
  settings: settingsIcon,
}

const DEFAULT_NAV: VAppShellNavItem[] = [
  { value: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { value: 'projects', label: 'Projects', icon: 'projects' },
  { value: 'documents', label: 'Documents', icon: 'documents' },
  { value: 'team', label: 'Team', icon: 'team' },
  { value: 'analytics', label: 'Analytics', icon: 'analytics' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]

const DEFAULT_QUICK_ACTIONS: VAppShellQuickAction[] = [
  { name: 'new-project', label: 'New project', icon: 'plus' },
  { name: 'import-data', label: 'Import data', icon: 'upload' },
  { name: 'invite-team', label: 'Invite team', icon: 'userPlus' },
  { name: 'view-analytics', label: 'View analytics', icon: 'chart' },
]

const DEFAULT_SHORTCUTS: VAppShellShortcut[] = [
  { keys: '⌘K', label: 'Search' },
  { keys: '⌘N', label: 'New item' },
  { keys: '⌘/', label: 'Command menu' },
  { keys: '⌘?', label: 'Help' },
]

export function mountVAppShell(props: VAppShellProps) {
  return {
    variant: props.variant ?? 'dashboard',
    layoutMode: props.layoutMode ?? 'desktop',
    brandName: props.brandName ?? 'VueUI Nova',
    searchPlaceholder: props.searchPlaceholder ?? 'Search anything…',
    searchShortcut: props.searchShortcut ?? '⌘K',
    navItems: props.navItems ?? DEFAULT_NAV,
    quickActions: props.quickActions ?? DEFAULT_QUICK_ACTIONS,
    shortcuts: props.shortcuts ?? DEFAULT_SHORTCUTS,
    userAvatar: props.userAvatar ?? 'JD',
    showUtility: props.showUtility !== false,
    showBuiltInTopBar: props.showBuiltInTopBar !== false,
  } as const
}

export function resolveNavIcon(name?: string): IconifyIcon | undefined {
  if (!name) return undefined
  return NAV_ICON_MAP[name.toLowerCase()] ?? NAV_ICON_MAP[name]
}

export function resolveQuickActionIcon(name?: string): IconifyIcon {
  if (!name) return plusIcon
  return (APP_SHELL_UI_ICONS as Record<string, IconifyIcon>)[name] ?? plusIcon
}
