import type { IconifyIcon } from '@iconify/types'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import linkIcon from '@iconify-icons/keyline-icons/link'
import mailIcon from '@iconify-icons/keyline-icons/mail'
import mapPinIcon from '@iconify-icons/keyline-icons/map-pin'
import searchIcon from '@iconify-icons/keyline-icons/search'
import userIcon from '@iconify-icons/keyline-icons/user'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VTextInputProps, VTextInputSize, VTextInputType, VTextInputVariant } from './VTextInput.types'

export const V_TEXT_INPUT_CLEAR_ICON: IconifyIcon = xIcon
export const V_TEXT_INPUT_ERROR_ICON: IconifyIcon = circleAlertIcon
export const V_TEXT_INPUT_SUCCESS_ICON: IconifyIcon = checkIcon

const SIZES: VTextInputSize[] = ['sm', 'md', 'lg']
const TYPES: VTextInputType[] = ['text', 'email', 'url', 'search', 'tel']

export const V_TEXT_INPUT_LEADING_ICONS: Record<string, IconifyIcon> = {
  search: searchIcon,
  calendar: calendarIcon,
  user: userIcon,
  mail: mailIcon,
  email: mailIcon,
  'map-pin': mapPinIcon,
  pin: mapPinIcon,
  link: linkIcon,
}

export function resolveVTextInputLeadingIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return V_TEXT_INPUT_LEADING_ICONS[icon.toLowerCase()]
}

export function mountVTextInput(props: VTextInputProps) {
  const size: VTextInputSize = SIZES.includes(props.size as VTextInputSize) ? (props.size as VTextInputSize) : 'md'
  const type: VTextInputType = TYPES.includes(props.type as VTextInputType) ? (props.type as VTextInputType) : 'text'
  const disabled = Boolean(props.disabled)
  const readonly = Boolean(props.readonly)
  const clearable = Boolean(props.clearable)
  const hasError = Boolean(props.errorMessage)
  const hasSuccess = Boolean(props.successMessage) && !hasError
  const leadingIconData = resolveVTextInputLeadingIcon(props.leadingIcon)

  let variant: VTextInputVariant = 'default'
  if (hasError) variant = 'error'
  else if (hasSuccess) variant = 'success'
  else if (props.prefix || props.suffix) variant = 'prefix-suffix'
  else if (props.leadingIcon || leadingIconData) variant = 'leading-icon'
  else if (props.placeholder) variant = 'placeholder'

  return {
    size,
    type,
    disabled,
    readonly,
    clearable,
    hasError,
    hasSuccess,
    leadingIconData,
    variant,
    clearIcon: V_TEXT_INPUT_CLEAR_ICON,
    errorIcon: V_TEXT_INPUT_ERROR_ICON,
    successIcon: V_TEXT_INPUT_SUCCESS_ICON,
  } as const
}
