import type { IconifyIcon } from '@iconify/types'
import listIcon from '@iconify-icons/keyline-icons/list'
import gridIcon from '@iconify-icons/keyline-icons/grid-2x2'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import sunIcon from '@iconify-icons/keyline-icons/sun'
import moonIcon from '@iconify-icons/keyline-icons/moon'
import monitorIcon from '@iconify-icons/keyline-icons/monitor'
import chevronsUpDownIcon from '@iconify-icons/keyline-icons/chevrons-up-down'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import starIcon from '@iconify-icons/keyline-icons/star'
import type {
  VSegmentedControlOption,
  VSegmentedControlProps,
  VSegmentedControlSize,
  VSegmentedControlVariant,
} from './VSegmentedControl.types'

const SIZES: VSegmentedControlSize[] = ['sm', 'md', 'lg']
const VARIANTS: VSegmentedControlVariant[] = ['default', 'pill']

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  list: listIcon,
  grid: gridIcon,
  calendar: calendarIcon,
  sun: sunIcon,
  moon: moonIcon,
  monitor: monitorIcon,
  sort: chevronsUpDownIcon,
  fire: sparklesIcon,
  star: starIcon,
}

export const DEFAULT_SEGMENTED_OPTIONS: VSegmentedControlOption[] = [
  { value: 'list', icon: 'list', label: 'List' },
  { value: 'grid', icon: 'grid', label: 'Grid' },
  { value: 'calendar', icon: 'calendar', label: 'Calendar' },
]

export function resolveSegmentedIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return KEYLINE_ICONS[icon.toLowerCase()]
}

export function mountVSegmentedControl(props: VSegmentedControlProps) {
  const size: VSegmentedControlSize = SIZES.includes(props.size as VSegmentedControlSize)
    ? (props.size as VSegmentedControlSize)
    : 'md'
  const rawVariant = props.variant as string | undefined
  const legacy: Record<string, VSegmentedControlVariant> = { primary: 'default', subtle: 'default' }
  const variant: VSegmentedControlVariant = rawVariant && legacy[rawVariant]
    ? legacy[rawVariant]
    : VARIANTS.includes(props.variant as VSegmentedControlVariant)
      ? (props.variant as VSegmentedControlVariant)
      : 'default'
  const options = props.options ?? DEFAULT_SEGMENTED_OPTIONS
  const items = options.map((option) => ({
    ...option,
    iconData: resolveSegmentedIcon(option.icon),
  }))
  const selected = props.modelValue ?? items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? ''

  return {
    size,
    variant,
    items,
    disabled: Boolean(props.disabled),
    selected,
  } as const
}
