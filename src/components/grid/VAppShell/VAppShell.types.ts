export type VAppShellVariant = 'dashboard' | 'editor' | 'settings' | 'content-management'
export type VAppShellLayoutMode = 'desktop' | 'compact' | 'tablet'

export interface VAppShellNavItem {
  value: string
  label: string
  icon?: string
  disabled?: boolean
}

export interface VAppShellQuickAction {
  name: string
  label: string
  icon?: string
}

export interface VAppShellShortcut {
  keys: string
  label: string
}

export interface VAppShellProps {
  variant?: VAppShellVariant
  layoutMode?: VAppShellLayoutMode
  sidebarCollapsed?: boolean
  utilityOpen?: boolean
  brandName?: string
  searchPlaceholder?: string
  searchShortcut?: string
  searchQuery?: string
  activeNavItem?: string
  navItems?: VAppShellNavItem[]
  quickActions?: VAppShellQuickAction[]
  shortcuts?: VAppShellShortcut[]
  userAvatar?: string
  showUtility?: boolean
  showBuiltInTopBar?: boolean
}

export interface VAppShellEmits {
  'update:sidebarCollapsed': [collapsed: boolean]
  'update:utilityOpen': [open: boolean]
  'update:searchQuery': [query: string]
  'update:activeNavItem': [value: string]
  nav: [value: string]
  search: [query: string]
  'quick-action': [name: string]
  shortcut: [keys: string]
}

export type VAppShellEmitFn = (
  event: keyof VAppShellEmits,
  ...args: VAppShellEmits[keyof VAppShellEmits]
) => void
