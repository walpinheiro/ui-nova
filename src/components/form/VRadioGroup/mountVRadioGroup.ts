import type { IconifyIcon } from '@iconify/types'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import type { VRadioGroupLayout, VRadioGroupProps, VRadioGroupSize } from './VRadioGroup.types'

export const V_RADIO_GROUP_ERROR_ICON: IconifyIcon = circleAlertIcon

const SIZES: VRadioGroupSize[] = ['sm', 'md', 'lg']
const LAYOUTS: VRadioGroupLayout[] = ['vertical', 'horizontal', 'card']

export function mountVRadioGroup(props: VRadioGroupProps) {
  const size: VRadioGroupSize = SIZES.includes(props.size as VRadioGroupSize) ? (props.size as VRadioGroupSize) : 'md'
  const layout: VRadioGroupLayout = LAYOUTS.includes(props.layout as VRadioGroupLayout)
    ? (props.layout as VRadioGroupLayout)
    : 'vertical'
  const disabled = Boolean(props.disabled)
  const hasError = Boolean(props.errorMessage)
  const selected = props.modelValue ?? ''
  const groupName = props.name ?? props.id ?? 'v-radiogroup'

  const options = (props.options ?? []).map((option) => ({
    ...option,
    disabled: disabled || Boolean(option.disabled),
    selected: option.value === selected,
  }))

  return {
    size,
    layout,
    disabled,
    hasError,
    selected,
    groupName,
    options,
    errorIcon: V_RADIO_GROUP_ERROR_ICON,
  } as const
}
