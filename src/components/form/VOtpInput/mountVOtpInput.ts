import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import type { VOtpInputProps, VOtpInputSize } from './VOtpInput.types'

export const V_OTP_INPUT_SUCCESS_ICON: IconifyIcon = checkIcon
export const V_OTP_INPUT_ERROR_ICON: IconifyIcon = circleAlertIcon

const SIZES: VOtpInputSize[] = ['sm', 'md', 'lg']

export function mountVOtpInput(props: VOtpInputProps) {
  const size: VOtpInputSize = SIZES.includes(props.size as VOtpInputSize) ? (props.size as VOtpInputSize) : 'md'
  const length = props.length ?? 6
  const disabled = Boolean(props.disabled)
  const masked = Boolean(props.masked)
  const autoSubmit = Boolean(props.autoSubmit)
  const hasError = Boolean(props.errorMessage)
  const hasSuccess = Boolean(props.success) && !hasError
  const resendCooldown = props.resendCooldown ?? 0
  const hasResend = resendCooldown > 0 || Boolean(props.resendLabel)
  const helperText = props.helperText
  const resendLabel = props.resendLabel ?? 'Resend code'
  const separatorIndex = props.separatorIndex

  let variant: 'default' | 'masked' | 'auto-submit' | 'resend' = 'default'
  if (masked) variant = 'masked'
  else if (autoSubmit) variant = 'auto-submit'
  else if (hasResend) variant = 'resend'

  return {
    size,
    length,
    disabled,
    masked,
    autoSubmit,
    hasError,
    hasSuccess,
    resendCooldown,
    hasResend,
    helperText,
    resendLabel,
    separatorIndex,
    variant,
    successIcon: V_OTP_INPUT_SUCCESS_ICON,
    errorIcon: V_OTP_INPUT_ERROR_ICON,
  } as const
}

export function sanitizeOtpValue(value: string, length: number): string {
  return value.replace(/\D/g, '').slice(0, length)
}

export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
