import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import infoIcon from '@iconify-icons/keyline-icons/info'
import minusIcon from '@iconify-icons/keyline-icons/minus'
import type { VCheckboxProps, VCheckboxSize } from './VCheckbox.types'

export const V_CHECKBOX_CHECK_ICON: IconifyIcon = checkIcon
export const V_CHECKBOX_INDETERMINATE_ICON: IconifyIcon = minusIcon
export const V_CHECKBOX_ERROR_ICON: IconifyIcon = circleAlertIcon
export const V_CHECKBOX_HELPER_ICON: IconifyIcon = infoIcon

const SIZES: VCheckboxSize[] = ['sm', 'md', 'lg']

export function mountVCheckbox(props: VCheckboxProps) {
  const size: VCheckboxSize = SIZES.includes(props.size as VCheckboxSize) ? (props.size as VCheckboxSize) : 'md'
  const disabled = Boolean(props.disabled)
  const hasError = Boolean(props.errorMessage)
  const checked = Boolean(props.modelValue)
  const indeterminate = Boolean(props.indeterminate && !checked)

  return {
    size,
    disabled,
    hasError,
    checked,
    indeterminate,
    checkIcon: V_CHECKBOX_CHECK_ICON,
    indeterminateIcon: V_CHECKBOX_INDETERMINATE_ICON,
    errorIcon: V_CHECKBOX_ERROR_ICON,
    helperIcon: V_CHECKBOX_HELPER_ICON,
  } as const
}
