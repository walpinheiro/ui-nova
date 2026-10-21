import type { IconifyIcon } from '@iconify/types'
import eyeIcon from '@iconify-icons/keyline-icons/eye'
import penLineIcon from '@iconify-icons/keyline-icons/pen-line'
import deleteIcon from '@iconify-icons/keyline-icons/delete'
import shareIcon from '@iconify-icons/keyline-icons/share'
import linkIcon from '@iconify-icons/keyline-icons/link'
import copyIcon from '@iconify-icons/keyline-icons/copy'
import mailIcon from '@iconify-icons/keyline-icons/mail'
import moreHorizontalIcon from '@iconify-icons/keyline-icons/more-horizontal'
import checkIcon from '@iconify-icons/keyline-icons/check'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import type {
  VDropdownMenuItem,
  VDropdownMenuProps,
  VDropdownMenuSize,
  VDropdownMenuVariant,
} from './VDropdownMenu.types'

const SIZES: VDropdownMenuSize[] = ['sm', 'md', 'lg']
const VARIANTS: VDropdownMenuVariant[] = ['secondary', 'primary', 'ghost', 'destructive']

const LEGACY_VARIANT: Record<string, VDropdownMenuVariant> = {
  default: 'secondary',
  subtle: 'ghost',
}

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  eye: eyeIcon,
  edit: penLineIcon,
  trash: deleteIcon,
  share: shareIcon,
  link: linkIcon,
  duplicate: copyIcon,
  slack: shareIcon,
  email: mailIcon,
  'more-horizontal': moreHorizontalIcon,
}

export const DEFAULT_DROPDOWN_ITEMS: VDropdownMenuItem[] = [
  { value: 'view', label: 'View details', icon: 'eye' },
  {
    value: 'share',
    label: 'Share',
    icon: 'share',
    children: [
      { value: 'copy-link', label: 'Copy link', icon: 'link' },
      { value: 'slack', label: 'Share to Slack', icon: 'slack' },
      { value: 'email', label: 'Share to email', icon: 'email' },
    ],
  },
  { value: 'rename', label: 'Rename', icon: 'edit' },
  { value: 'duplicate', label: 'Duplicate', icon: 'duplicate' },
  { value: 'divider-delete', label: '', divider: true },
  { value: 'delete', label: 'Delete', icon: 'trash', destructive: true },
]

export function resolveDropdownIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return KEYLINE_ICONS[icon.toLowerCase()]
}

export const DROPDOWN_MENU_UI_ICONS = {
  check: checkIcon,
  chevronDown: chevronDownIcon,
  chevronRight: chevronRightIcon,
} as const

export function mountVDropdownMenu(props: VDropdownMenuProps) {
  const size: VDropdownMenuSize = SIZES.includes(props.size as VDropdownMenuSize)
    ? (props.size as VDropdownMenuSize)
    : 'md'
  const rawVariant = props.variant as string | undefined
  const variant: VDropdownMenuVariant = rawVariant && LEGACY_VARIANT[rawVariant]
    ? LEGACY_VARIANT[rawVariant]
    : VARIANTS.includes(props.variant as VDropdownMenuVariant)
      ? (props.variant as VDropdownMenuVariant)
      : 'secondary'

  const rawItems = props.items ?? DEFAULT_DROPDOWN_ITEMS
  const items = rawItems.map((item) => ({
    ...item,
    selected: props.value !== undefined ? item.value === props.value : item.selected,
  }))
  const selectedItem = items.find((item) => !item.divider && item.value === props.value)
  const triggerStyle = props.triggerStyle ?? 'default'
  const menuAlign = props.menuAlign ?? (triggerStyle === 'field' ? 'end' : 'start')
  const showChevron = props.showChevron !== undefined ? props.showChevron : triggerStyle !== 'icon'

  return {
    size,
    variant,
    items,
    label: selectedItem?.label ?? props.label ?? 'More options',
    showTriggerIcon: props.showTriggerIcon !== false,
    showChevron,
    triggerStyle,
    menuAlign,
    triggerIconData: resolveDropdownIcon(props.icon ?? 'more-horizontal'),
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
