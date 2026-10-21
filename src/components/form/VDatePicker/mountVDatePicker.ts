import type { IconifyIcon } from '@iconify/types'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronLeftIcon from '@iconify-icons/keyline-icons/chevron-left'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import chevronUpIcon from '@iconify-icons/keyline-icons/chevron-up'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VDatePickerPreset, VDatePickerProps, VDatePickerSize, VDatePickerVariant } from './VDatePicker.types'

export const V_DATE_PICKER_CALENDAR_ICON: IconifyIcon = calendarIcon
export const V_DATE_PICKER_CLEAR_ICON: IconifyIcon = xIcon
export const V_DATE_PICKER_CHEVRON_DOWN_ICON: IconifyIcon = chevronDownIcon
export const V_DATE_PICKER_CHEVRON_UP_ICON: IconifyIcon = chevronUpIcon
export const V_DATE_PICKER_PREV_ICON: IconifyIcon = chevronLeftIcon
export const V_DATE_PICKER_NEXT_ICON: IconifyIcon = chevronRightIcon

export const V_DATE_PICKER_DEFAULT_PRESETS: VDatePickerPreset[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'This month', value: 'this-month' },
]

const SIZES: VDatePickerSize[] = ['sm', 'md', 'lg']
const VARIANTS: VDatePickerVariant[] = ['default', 'with-icon', 'with-preset', 'range']

export function mountVDatePicker(props: VDatePickerProps) {
  const size: VDatePickerSize = SIZES.includes(props.size as VDatePickerSize) ? (props.size as VDatePickerSize) : 'md'
  const variant: VDatePickerVariant = VARIANTS.includes(props.variant as VDatePickerVariant)
    ? (props.variant as VDatePickerVariant)
    : props.range
      ? 'range'
      : props.showLeadingIcon
        ? 'with-icon'
        : 'default'
  const disabled = Boolean(props.disabled)
  const showToday = props.showToday !== false
  const clearable = props.clearable !== false
  const showLeadingIcon = variant === 'with-icon' || variant === 'range' || Boolean(props.showLeadingIcon)

  return {
    size,
    variant,
    disabled,
    showToday,
    clearable,
    showLeadingIcon,
    placeholder: props.placeholder ?? 'Select date',
    format: props.format ?? 'MMM d, yyyy',
    presets: props.presets ?? V_DATE_PICKER_DEFAULT_PRESETS,
    calendarIcon: V_DATE_PICKER_CALENDAR_ICON,
    clearIcon: V_DATE_PICKER_CLEAR_ICON,
    chevronDownIcon: V_DATE_PICKER_CHEVRON_DOWN_ICON,
    chevronUpIcon: V_DATE_PICKER_CHEVRON_UP_ICON,
    prevIcon: V_DATE_PICKER_PREV_ICON,
    nextIcon: V_DATE_PICKER_NEXT_ICON,
  } as const
}
