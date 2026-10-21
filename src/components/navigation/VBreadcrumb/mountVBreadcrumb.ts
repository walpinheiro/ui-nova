import type { IconifyIcon } from '@iconify/types'
import homeIcon from '@iconify-icons/keyline-icons/home'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import type {
  ResolvedVBreadcrumbItem,
  VBreadcrumbItem,
  VBreadcrumbProps,
  VBreadcrumbSegment,
  VBreadcrumbSize,
  VBreadcrumbVariant,
} from './VBreadcrumb.types'

const SIZES: VBreadcrumbSize[] = ['sm', 'md', 'lg']
const VARIANTS: VBreadcrumbVariant[] = ['default', 'compact', 'icons', 'overflow']

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  home: homeIcon,
  folder: folderIcon,
  document: fileTextIcon,
  file: fileTextIcon,
  projects: folderIcon,
}

export const DEFAULT_BREADCRUMB_ITEMS: VBreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Marketing Site', to: '/projects/marketing' },
  { label: 'Assets' },
]

export const ICON_BREADCRUMB_ITEMS: VBreadcrumbItem[] = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Projects', to: '/projects', icon: 'folder' },
  { label: 'Marketing Site', to: '/projects/marketing', icon: 'document' },
  { label: 'Assets' },
]

export function resolveBreadcrumbIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return KEYLINE_ICONS[icon.toLowerCase()]
}

function resolveHref(item: VBreadcrumbItem, index: number, total: number) {
  if (index === total - 1 && !item.to && !item.href) return undefined
  return item.href ?? item.to
}

export function resolveVBreadcrumbItems(
  items: VBreadcrumbItem[],
  variant: VBreadcrumbVariant,
): ResolvedVBreadcrumbItem[] {
  const showHomeIcon = variant === 'default' || variant === 'overflow'
  const showItemIcons = variant === 'icons'

  return items.map((item, index) => {
    const href = resolveHref(item, index, items.length)
    const isCurrent = href === undefined
    const iconData = showItemIcons ? resolveBreadcrumbIcon(item.icon ?? item.label) : undefined

    return {
      label: item.label,
      href,
      disabled: Boolean(item.disabled),
      isCurrent,
      iconData,
      homeIconData: showHomeIcon && index === 0 ? homeIcon : undefined,
      showHomeIcon: showHomeIcon && index === 0,
      originalIndex: index,
    }
  })
}

export function buildVBreadcrumbSegments(
  items: ResolvedVBreadcrumbItem[],
  variant: VBreadcrumbVariant,
  maxItems: number,
): VBreadcrumbSegment[] {
  const shouldOverflow = variant === 'overflow' || items.length > maxItems
  if (!shouldOverflow || items.length <= 3) {
    return items.map((item) => ({ type: 'item' as const, item }))
  }

  const hidden = items.slice(1, -2)
  const segments: VBreadcrumbSegment[] = [{ type: 'item', item: items[0]! }]
  if (hidden.length > 0) segments.push({ type: 'overflow', items: hidden })
  segments.push(...items.slice(-2).map((item) => ({ type: 'item' as const, item })))
  return segments
}

export function mountVBreadcrumb(props: VBreadcrumbProps) {
  const rawVariant = props.variant as string | undefined
  const legacy: Record<string, VBreadcrumbVariant> = {
    primary: 'default',
    subtle: 'compact',
  }
  const variant: VBreadcrumbVariant = rawVariant && legacy[rawVariant]
    ? legacy[rawVariant]
    : VARIANTS.includes(props.variant as VBreadcrumbVariant)
      ? (props.variant as VBreadcrumbVariant)
      : 'default'
  const size: VBreadcrumbSize = SIZES.includes(props.size as VBreadcrumbSize)
    ? (props.size as VBreadcrumbSize)
    : 'md'
  const items = props.items ?? DEFAULT_BREADCRUMB_ITEMS
  const maxItems = props.maxItems ?? 4
  const resolvedItems = resolveVBreadcrumbItems(items, variant)
  const segments = buildVBreadcrumbSegments(resolvedItems, variant, maxItems)

  return {
    size,
    variant,
    items,
    resolvedItems,
    segments,
    maxItems,
    ariaLabel: props.ariaLabel ?? 'Breadcrumb',
  } as const
}
