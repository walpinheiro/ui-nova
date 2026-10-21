import type { IconifyIcon } from '@iconify/types'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import deleteIcon from '@iconify-icons/keyline-icons/delete'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import shieldIcon from '@iconify-icons/keyline-icons/shield'
import bookOpenIcon from '@iconify-icons/keyline-icons/book-open'
import homeIcon from '@iconify-icons/keyline-icons/home'
import starIcon from '@iconify-icons/keyline-icons/star'
import mailIcon from '@iconify-icons/keyline-icons/mail'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import type {
  VTreeNavigationFlatNode,
  VTreeNavigationItem,
  VTreeNavigationProps,
  VTreeNavigationSize,
  VTreeNavigationVariant,
} from './VTreeNavigation.types'

const SIZES: VTreeNavigationSize[] = ['sm', 'md', 'lg']
const VARIANTS: VTreeNavigationVariant[] = ['file', 'settings', 'documentation', 'simple']

export const TREE_NAVIGATION_UI_ICONS = {
  chevronRight: chevronRightIcon,
  chevronDown: chevronDownIcon,
} as const

const ICON_MAP: Record<string, Record<string, IconifyIcon>> = {
  file: {
    folder: folderIcon,
    file: fileTextIcon,
    document: fileTextIcon,
    trash: deleteIcon,
    default: fileTextIcon,
  },
  settings: {
    settings: settingsIcon,
    gear: settingsIcon,
    appearance: settingsIcon,
    privacy: shieldIcon,
    default: settingsIcon,
  },
  documentation: {
    book: bookOpenIcon,
    doc: fileTextIcon,
    guide: bookOpenIcon,
    default: bookOpenIcon,
  },
  simple: {
    home: homeIcon,
    about: starIcon,
    star: starIcon,
    contact: mailIcon,
    default: homeIcon,
  },
}

export const HERO_TREE_ITEMS: VTreeNavigationItem[] = [
  {
    key: 'workspace',
    label: 'Workspace',
    icon: 'folder',
    count: 12,
    children: [
      {
        key: 'projects',
        label: 'Projects',
        icon: 'folder',
        count: 8,
        children: [
          { key: 'vueui-nova', label: 'vueui-nova', icon: 'folder', count: 3 },
          { key: 'marketing', label: 'marketing', icon: 'folder', count: 2 },
          { key: 'design-system', label: 'design-system', icon: 'folder', count: 3 },
        ],
      },
      { key: 'resources', label: 'Resources', icon: 'folder' },
      {
        key: 'documentation',
        label: 'Documentation',
        icon: 'book',
        children: [
          { key: 'getting-started', label: 'Getting Started', icon: 'doc' },
          { key: 'components', label: 'Components', icon: 'doc', count: 24 },
          { key: 'guides', label: 'Guides', icon: 'doc', count: 12 },
          { key: 'changelog', label: 'Changelog', icon: 'doc', count: 5 },
        ],
      },
    ],
  },
  { key: 'trash', label: 'Trash', icon: 'trash', count: 4 },
]

export const VARIANT_TREE_ITEMS: Record<VTreeNavigationVariant, VTreeNavigationItem[]> = {
  file: [
    {
      key: 'documents',
      label: 'Documents',
      icon: 'folder',
      children: [
        { key: 'photos', label: 'Photos', icon: 'folder' },
        { key: 'work', label: 'Work', icon: 'folder' },
      ],
    },
    { key: 'notes', label: 'Notes.txt', icon: 'file' },
  ],
  settings: [
    { key: 'appearance', label: 'Appearance', icon: 'settings' },
    { key: 'notifications', label: 'Notifications', icon: 'settings' },
    { key: 'privacy', label: 'Privacy', icon: 'settings' },
    { key: 'advanced', label: 'Advanced', icon: 'settings' },
  ],
  documentation: [
    { key: 'introduction', label: 'Introduction', icon: 'book' },
    { key: 'components', label: 'Components', icon: 'book' },
    { key: 'guides', label: 'Guides', icon: 'book' },
    { key: 'api-reference', label: 'API Reference', icon: 'book' },
  ],
  simple: [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'about', label: 'About', icon: 'star' },
    { key: 'services', label: 'Services', icon: 'star' },
    { key: 'contact', label: 'Contact', icon: 'contact' },
  ],
}

export function resolveVariant(raw?: VTreeNavigationProps['variant']): VTreeNavigationVariant {
  const legacy: Record<string, VTreeNavigationVariant> = {
    default: 'file',
    primary: 'settings',
    subtle: 'simple',
  }
  if (raw && legacy[raw]) return legacy[raw]
  return VARIANTS.includes(raw as VTreeNavigationVariant) ? (raw as VTreeNavigationVariant) : 'file'
}

export function resolveItems(props: VTreeNavigationProps, variant: VTreeNavigationVariant): VTreeNavigationItem[] {
  if (props.items !== undefined) return props.items
  return variant === 'file' ? HERO_TREE_ITEMS : VARIANT_TREE_ITEMS[variant]
}

export function resolveIconData(
  item: VTreeNavigationItem,
  variant: VTreeNavigationVariant,
  iconField = 'icon',
): IconifyIcon {
  const raw = String(item[iconField] ?? item.icon ?? '').toLowerCase()
  const map = ICON_MAP[variant]
  if (!raw) return map.default
  return map[raw] ?? map.default
}

export function resolveCount(item: VTreeNavigationItem, showCounts: boolean): number | undefined {
  if (!showCounts) return undefined
  if (typeof item.count === 'number') return item.count
  if (item.children?.length) return item.children.length
  return undefined
}

export function defaultExpandedKeys(items: VTreeNavigationItem[]): string[] {
  const keys: string[] = []
  for (const item of items) {
    if (item.children?.length) {
      keys.push(item.key)
      for (const child of item.children) {
        if (child.children?.length) keys.push(child.key)
      }
    }
  }
  return keys
}

export function flattenVisibleTree(
  items: VTreeNavigationItem[],
  expandedKeys: Set<string>,
  depth = 0,
  parentKey: string | null = null,
): VTreeNavigationFlatNode[] {
  const nodes: VTreeNavigationFlatNode[] = []
  for (const item of items) {
    const hasChildren = Boolean(item.children?.length)
    const isExpanded = expandedKeys.has(item.key)
    nodes.push({ item, depth, hasChildren, isExpanded, parentKey })
    if (hasChildren && isExpanded) {
      nodes.push(...flattenVisibleTree(item.children!, expandedKeys, depth + 1, item.key))
    }
  }
  return nodes
}

export function mountVTreeNavigation(props: VTreeNavigationProps) {
  const size: VTreeNavigationSize = SIZES.includes(props.size as VTreeNavigationSize)
    ? (props.size as VTreeNavigationSize)
    : 'md'
  const variant = resolveVariant(props.variant)
  const items = resolveItems(props, variant)

  return {
    size,
    variant,
    items,
    defaultExpandedKeys: defaultExpandedKeys(items),
    defaultActive: props.active ?? (variant === 'file' ? 'vueui-nova' : items[0]?.key ?? ''),
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    multiple: Boolean(props.multiple),
    showCounts: props.showCounts !== false,
    iconField: props.iconField ?? 'icon',
    lazy: Boolean(props.lazy),
    ariaLabel: props.ariaLabel ?? 'Tree navigation',
  } as const
}
