import type { VMotionLevel } from '../../../motion/types'

export type VOtpInputSize = 'sm' | 'md' | 'lg'
export type VOtpInputVariant = 'default' | 'masked' | 'auto-submit' | 'resend'
export type VOtpInputState = 'empty' | 'active' | 'filled' | 'error' | 'disabled' | 'success'

export interface VOtpInputProps {
  modelValue?: string
  length?: number
  masked?: boolean
  autoSubmit?: boolean
  disabled?: boolean
  errorMessage?: string
  success?: boolean
  size?: VOtpInputSize
  separatorIndex?: number
  helperText?: string
  resendLabel?: string
  resendCooldown?: number
  ariaLabel?: string
  id?: string
  motion?: VMotionLevel
}
