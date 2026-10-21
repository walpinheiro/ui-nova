import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import eyeOffIcon from '@iconify-icons/keyline-icons/eye-off'
import eyeIcon from '@iconify-icons/keyline-icons/eye'
import type {
  VPasswordInputProps,
  VPasswordInputSize,
  VPasswordInputStrength,
  VPasswordInputVariant,
  VPasswordRequirement,
} from './VPasswordInput.types'

export const V_PASSWORD_INPUT_SHOW_ICON: IconifyIcon = eyeIcon
export const V_PASSWORD_INPUT_HIDE_ICON: IconifyIcon = eyeOffIcon
export const V_PASSWORD_INPUT_ERROR_ICON: IconifyIcon = circleAlertIcon
export const V_PASSWORD_INPUT_CHECK_ICON: IconifyIcon = checkIcon

const SIZES: VPasswordInputSize[] = ['sm', 'md', 'lg']

export const V_PASSWORD_DEFAULT_REQUIREMENTS: VPasswordRequirement[] = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'number', label: 'Include a number', test: (v) => /\d/.test(v) },
  { id: 'special', label: 'Include a special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
  { id: 'uppercase', label: 'Include an uppercase letter', test: (v) => /[A-Z]/.test(v) },
]

export function evaluatePasswordStrength(value: string): VPasswordInputStrength {
  if (!value) return 'weak'
  let score = 0
  if (value.length >= 8) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1
  if (/[A-Z]/.test(value)) score += 1
  if (score <= 1) return 'weak'
  if (score <= 3) return 'medium'
  return 'strong'
}

export function strengthLabel(strength: VPasswordInputStrength): string {
  if (strength === 'weak') return 'Weak password'
  if (strength === 'medium') return 'Good'
  return 'Great password!'
}

export function strengthSegments(strength: VPasswordInputStrength): number {
  if (strength === 'weak') return 1
  if (strength === 'medium') return 2
  return 3
}

export function mountVPasswordInput(props: VPasswordInputProps) {
  const size: VPasswordInputSize = SIZES.includes(props.size as VPasswordInputSize) ? (props.size as VPasswordInputSize) : 'md'
  const disabled = Boolean(props.disabled)
  const readonly = Boolean(props.readonly)
  const hasError = Boolean(props.errorMessage)
  const showStrength = Boolean(props.showStrength)
  const showRequirements = Boolean(props.requirements)
  const strength = evaluatePasswordStrength(props.modelValue ?? '')

  let variant: VPasswordInputVariant = 'show-hide'
  if (hasError) variant = 'error'
  else if (showRequirements) variant = 'requirements'
  else if (showStrength) variant = 'strength'

  return {
    size,
    disabled,
    readonly,
    hasError,
    showStrength,
    showRequirements,
    strength,
    strengthLabel: strengthLabel(strength),
    strengthSegments: strengthSegments(strength),
    requirements: V_PASSWORD_DEFAULT_REQUIREMENTS,
    variant,
    showIcon: V_PASSWORD_INPUT_SHOW_ICON,
    hideIcon: V_PASSWORD_INPUT_HIDE_ICON,
    errorIcon: V_PASSWORD_INPUT_ERROR_ICON,
    checkIcon: V_PASSWORD_INPUT_CHECK_ICON,
  } as const
}
