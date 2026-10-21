import type { IconifyIcon } from '@iconify/types'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronLeftIcon from '@iconify-icons/keyline-icons/chevron-left'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import chevronUpIcon from '@iconify-icons/keyline-icons/chevron-up'
import xIcon from '@iconify-icons/keyline-icons/x'
import type {
  VDateRangePickerPreset,
  VDateRangePickerProps,
  VDateRangePickerSize,
  VDateRangePickerVariant,
} from './VDateRangePicker.types'

export const V_DATE_RANGE_PICKER_CALENDAR_ICON: IconifyIcon = calendarIcon
export const V_DATE_RANGE_PICKER_CLEAR_ICON: IconifyIcon = xIcon
export const V_DATE_RANGE_PICKER_CHEVRON_DOWN_ICON: IconifyIcon = chevronDownIcon
export const V_DATE_RANGE_PICKER_CHEVRON_UP_ICON: IconifyIcon = chevronUpIcon
export const V_DATE_RANGE_PICKER_PREV_ICON: IconifyIcon = chevronLeftIcon
export const V_DATE_RANGE_PICKER_NEXT_ICON: IconifyIcon = chevronRightIcon

export const V_DATE_RANGE_PICKER_DEFAULT_PRESETS: VDateRangePickerPreset[] = [
  { label: 'Last 7 days', range: '7d' },
  { label: 'Last 30 days', range: '30d' },
  { label: 'Last 90 days', range: '90d' },
  { label: 'This month', range: 'this-month' },
  { label: 'Last month', range: 'last-month' },
  { label: 'Custom range', range: 'custom' },
]

const SIZES: VDateRangePickerSize[] = ['sm', 'md', 'lg']
const VARIANTS: VDateRangePickerVariant[] = ['default', 'presets', 'inline', 'compact', 'with-time']

export function mountVDateRangePicker(props: VDateRangePickerProps) {
  const size: VDateRangePickerSize = SIZES.includes(props.size as VDateRangePickerSize)
    ? (props.size as VDateRangePickerSize)
    : 'md'
  const variant: VDateRangePickerVariant = VARIANTS.includes(props.variant as VDateRangePickerVariant)
    ? (props.variant as VDateRangePickerVariant)
    : 'default'
  const disabled = Boolean(props.disabled)
  const enableTime = variant === 'with-time' || Boolean(props.enableTime)

  return {
    size,
    variant,
    disabled,
    enableTime,
    placeholder: props.placeholder ?? 'Select date range',
    format: props.format ?? 'MMM d, yyyy',
    compactFormat: props.compactFormat ?? 'MM/dd',
    presets: props.presets ?? V_DATE_RANGE_PICKER_DEFAULT_PRESETS,
    calendarIcon: V_DATE_RANGE_PICKER_CALENDAR_ICON,
    clearIcon: V_DATE_RANGE_PICKER_CLEAR_ICON,
    chevronDownIcon: V_DATE_RANGE_PICKER_CHEVRON_DOWN_ICON,
    chevronUpIcon: V_DATE_RANGE_PICKER_CHEVRON_UP_ICON,
    prevIcon: V_DATE_RANGE_PICKER_PREV_ICON,
    nextIcon: V_DATE_RANGE_PICKER_NEXT_ICON,
  } as const
}
