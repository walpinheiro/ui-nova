import type { IconifyIcon } from '@iconify/types'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronUpIcon from '@iconify-icons/keyline-icons/chevron-up'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import type { VNumberInputProps, VNumberInputSize, VNumberInputVariant } from './VNumberInput.types'

export const V_NUMBER_INPUT_INCREMENT_ICON: IconifyIcon = chevronUpIcon
export const V_NUMBER_INPUT_DECREMENT_ICON: IconifyIcon = chevronDownIcon
export const V_NUMBER_INPUT_ERROR_ICON: IconifyIcon = circleAlertIcon

const SIZES: VNumberInputSize[] = ['sm', 'md', 'lg']

export function clampNumber(value: number, min?: number, max?: number): number {
  let next = value
  if (typeof min === 'number') next = Math.max(min, next)
  if (typeof max === 'number') next = Math.min(max, next)
  return next
}

export function parseNumberInput(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '-' || trimmed === '.') return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

export function mountVNumberInput(props: VNumberInputProps) {
  const size: VNumberInputSize = SIZES.includes(props.size as VNumberInputSize) ? (props.size as VNumberInputSize) : 'md'
  const disabled = Boolean(props.disabled)
  const readonly = Boolean(props.readonly)
  const hasError = Boolean(props.errorMessage)
  const step = typeof props.step === 'number' && props.step > 0 ? props.step : 1
  const min = typeof props.min === 'number' ? props.min : undefined
  const max = typeof props.max === 'number' ? props.max : undefined

  let variant: VNumberInputVariant = 'stepper'
  if (hasError) variant = 'error'
  else if (props.prefix) variant = 'currency'
  else if (props.suffix) variant = 'percentage'
  else if (typeof min === 'number' || typeof max === 'number') variant = 'min-max'
  else variant = 'default'

  return {
    size,
    disabled,
    readonly,
    hasError,
    step,
    min,
    max,
    variant,
    incrementIcon: V_NUMBER_INPUT_INCREMENT_ICON,
    decrementIcon: V_NUMBER_INPUT_DECREMENT_ICON,
    errorIcon: V_NUMBER_INPUT_ERROR_ICON,
  } as const
}
