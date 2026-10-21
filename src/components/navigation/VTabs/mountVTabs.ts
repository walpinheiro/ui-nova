import type { IconifyIcon } from '@iconify/types'
import homeIcon from '@iconify-icons/keyline-icons/home'
import chartBarIcon from '@iconify-icons/keyline-icons/chart-bar'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import shieldIcon from '@iconify-icons/keyline-icons/shield'
import type { VTabItem, VTabsProps, VTabsSize, VTabsVariant } from './VTabs.types'

const SIZES: VTabsSize[] = ['sm', 'md', 'lg']
const VARIANTS: VTabsVariant[] = ['underline', 'pill', 'icon']

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  home: homeIcon,
  analytics: chartBarIcon,
  chart: chartBarIcon,
  settings: settingsIcon,
  security: shieldIcon,
  overview: homeIcon,
}

export const DEFAULT_TABS: VTabItem[] = [
  { value: 'overview', label: 'Overview', icon: 'home' },
  { value: 'features', label: 'Features' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'faq', label: 'FAQ' },
]

export function resolveTabIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return KEYLINE_ICONS[icon.toLowerCase()]
}

export function mountVTabs(props: VTabsProps) {
  const items = (props.items ?? DEFAULT_TABS).map((item) => ({
    ...item,
    iconData: resolveTabIcon(item.icon),
  }))
  const size: VTabsSize = SIZES.includes(props.size as VTabsSize) ? (props.size as VTabsSize) : 'md'
  const rawVariant = props.variant as string | undefined
  const legacy: Record<string, VTabsVariant> = {
    default: 'underline',
    primary: 'pill',
    subtle: 'underline',
  }
  const variant: VTabsVariant = rawVariant && legacy[rawVariant]
    ? legacy[rawVariant]
    : VARIANTS.includes(props.variant as VTabsVariant)
      ? (props.variant as VTabsVariant)
      : 'underline'
  const showIcons = variant === 'icon'

  return {
    size,
    variant,
    items,
    showIcons,
    dividers: Boolean(props.dividers),
    disabled: Boolean(props.disabled),
    selected: props.modelValue ?? items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? 'overview',
  } as const
}
