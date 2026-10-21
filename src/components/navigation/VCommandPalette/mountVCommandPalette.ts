import type { IconifyIcon } from '@iconify/types'
import searchIcon from '@iconify-icons/keyline-icons/search'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import homeIcon from '@iconify-icons/keyline-icons/home'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import usersIcon from '@iconify-icons/keyline-icons/users'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import chartBarIcon from '@iconify-icons/keyline-icons/chart-bar'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import userPlusIcon from '@iconify-icons/keyline-icons/user-plus'
import zapIcon from '@iconify-icons/keyline-icons/zap'
import fileIcon from '@iconify-icons/keyline-icons/file'
import gridIcon from '@iconify-icons/keyline-icons/grid-2x2'
import moonIcon from '@iconify-icons/keyline-icons/moon'
import keyboardIcon from '@iconify-icons/keyline-icons/keyboard'
import clockIcon from '@iconify-icons/keyline-icons/clock'
import type {
  VCommandPaletteGroup,
  VCommandPaletteItem,
  VCommandPaletteProps,
  VCommandPaletteSize,
  VCommandPaletteVariant,
} from './VCommandPalette.types'

const SIZES: VCommandPaletteSize[] = ['sm', 'md', 'lg']
const VARIANTS: VCommandPaletteVariant[] = [
  'global-search',
  'quick-actions',
  'file-switcher',
  'settings-palette',
]

const LEGACY_VARIANT: Record<string, VCommandPaletteVariant> = {
  default: 'global-search',
  primary: 'quick-actions',
  subtle: 'settings-palette',
}

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  search: searchIcon,
  settings: settingsIcon,
  document: fileTextIcon,
  home: homeIcon,
  folder: folderIcon,
  users: usersIcon,
  calendar: calendarIcon,
  chart: chartBarIcon,
  plus: plusIcon,
  'user-plus': userPlusIcon,
  bolt: zapIcon,
  file: fileIcon,
  grid: gridIcon,
  moon: moonIcon,
  command: keyboardIcon,
  clock: clockIcon,
  zap: zapIcon,
}

const variantPlaceholders: Record<VCommandPaletteVariant, string> = {
  'global-search': 'Search for anything…',
  'quick-actions': 'Type a command…',
  'file-switcher': 'Go to file…',
  'settings-palette': 'Search settings…',
}

const variantInputIcons: Record<VCommandPaletteVariant, string> = {
  'global-search': 'search',
  'quick-actions': 'bolt',
  'file-switcher': 'file',
  'settings-palette': 'settings',
}

export const DEFAULT_COMMAND_GROUPS: VCommandPaletteGroup[] = [
  {
    id: 'recent',
    label: 'Recent',
    items: [
      { id: 'open-settings', label: 'Open settings', shortcut: '⌘,', icon: 'settings' },
      { id: 'view-docs', label: 'View documentation', shortcut: '⌘D', icon: 'document' },
      { id: 'create-component', label: 'Create new component', shortcut: '⌘N', icon: 'document' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    items: [
      { id: 'browse-components', label: 'Browse components', shortcut: '⌘2', icon: 'grid' },
      { id: 'view-analytics', label: 'View analytics', shortcut: '⌘3', icon: 'chart' },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { id: 'toggle-dark-mode', label: 'Toggle dark mode', shortcut: '⌘D', icon: 'moon' },
      { id: 'open-palette', label: 'Open command palette', shortcut: '⌘K', icon: 'command' },
    ],
  },
]

export function resolveCommandIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return KEYLINE_ICONS[icon.toLowerCase()]
}

function normalizeVariant(raw?: string): VCommandPaletteVariant {
  if (raw && LEGACY_VARIANT[raw]) return LEGACY_VARIANT[raw]
  return VARIANTS.includes(raw as VCommandPaletteVariant)
    ? (raw as VCommandPaletteVariant)
    : 'global-search'
}

function itemMatchesQuery(item: VCommandPaletteItem, query: string) {
  const haystack = [item.label, ...(item.keywords ?? [])].join(' ').toLowerCase()
  return haystack.includes(query)
}

export function filterCommandGroups(groups: VCommandPaletteGroup[], query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return groups
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => itemMatchesQuery(item, normalized)),
    }))
    .filter((group) => group.items.length > 0)
}

export function flattenCommandItems(groups: VCommandPaletteGroup[]) {
  return groups.flatMap((group) => group.items.filter((item) => !item.disabled))
}

export function mountVCommandPalette(props: VCommandPaletteProps) {
  const size: VCommandPaletteSize = SIZES.includes(props.size as VCommandPaletteSize)
    ? (props.size as VCommandPaletteSize)
    : 'md'
  const variant = normalizeVariant(props.variant)
  const open = Boolean(props.modelValue ?? props.open ?? false)

  return {
    size,
    variant,
    open,
    items: props.items ?? DEFAULT_COMMAND_GROUPS,
    placeholder: props.placeholder ?? variantPlaceholders[variant],
    inputIcon: variantInputIcons[variant],
    shortcutLabel: props.shortcutLabel ?? '⌘K',
    emptyTitle: props.emptyTitle ?? 'No results found',
    emptyHint: props.emptyHint ?? 'Try a different search term.',
    searchLabel: props.searchLabel ?? 'Search commands',
    dismissible: props.dismissible !== false,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
