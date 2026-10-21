import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import type { VProgressProps, VProgressSize, VProgressState, VProgressVariant } from './VProgress.types'

const SIZES: VProgressSize[] = ['sm', 'md', 'lg']
const VARIANTS: VProgressVariant[] = ['linear', 'circular']
const STATES: VProgressState[] = ['determinate', 'indeterminate', 'success', 'error']

export const V_PROGRESS_COMPLETE_ICON: IconifyIcon = checkIcon
export const V_PROGRESS_ERROR_ICON: IconifyIcon = circleAlertIcon

const CIRCULAR_RADIUS = 45
export const V_PROGRESS_CIRCULAR_CIRCUMFERENCE = 2 * Math.PI * CIRCULAR_RADIUS

export const V_PROGRESS_CIRCULAR_SIZES: Record<VProgressSize, number> = {
  sm: 48,
  md: 64,
  lg: 80,
}

export const V_PROGRESS_RING_WIDTHS: Record<VProgressSize, number> = {
  sm: 2,
  md: 3,
  lg: 4,
}

function resolveRingStrokeWidth(size: VProgressSize): number {
  return (V_PROGRESS_RING_WIDTHS[size] / V_PROGRESS_CIRCULAR_SIZES[size]) * 100
}

function clampValue(value: number): number {
  return Math.min(100, Math.max(0, value))
}

function normalizeState(props: VProgressProps): VProgressState {
  if (props.state && STATES.includes(props.state)) return props.state
  return 'determinate'
}

function resolveValue(state: VProgressState, value?: number): number {
  if (state === 'success') return 100
  if (state === 'indeterminate') return 0
  return clampValue(value ?? 0)
}

function resolveLabel(state: VProgressState, value: number, label?: string | boolean): string | undefined {
  if (label === false) return undefined
  if (typeof label === 'string') return label
  if (state === 'indeterminate') return undefined
  if (state === 'success') return '100%'
  return `${value}%`
}

function resolveAriaLabel(
  state: VProgressState,
  value: number,
  ariaLabel?: string,
  label?: string | boolean,
): string {
  if (ariaLabel) return ariaLabel
  if (typeof label === 'string') return label
  if (state === 'indeterminate') return 'Loading'
  if (state === 'success') return 'Complete'
  if (state === 'error') return 'Error'
  return `Progress ${value}%`
}

export function mountVProgress(props: VProgressProps) {
  const size = SIZES.includes(props.size as VProgressSize) ? (props.size as VProgressSize) : 'md'
  const variant = VARIANTS.includes(props.variant as VProgressVariant)
    ? (props.variant as VProgressVariant)
    : 'linear'
  const state = normalizeState(props)
  const value = resolveValue(state, props.value)
  const isDeterminate = state === 'determinate' || state === 'success' || state === 'error'
  const labelText = resolveLabel(state, value, props.label)
  const showLabel = labelText !== undefined
  const showSuccessIcon = state === 'success'
  const showErrorIcon = state === 'error'
  const valueTestId = state === 'indeterminate' ? 'progress-indeterminate' : 'progress-value'

  return {
    size,
    variant,
    state,
    value,
    valueRatio: value / 100,
    isDeterminate,
    labelText,
    showLabel,
    showSuccessIcon,
    showErrorIcon,
    completeIcon: V_PROGRESS_COMPLETE_ICON,
    errorIcon: V_PROGRESS_ERROR_ICON,
    ariaLabel: resolveAriaLabel(state, value, props.ariaLabel, props.label),
    testId: props.dataTestId ?? 'progress-container',
    valueTestId,
    circularSize: V_PROGRESS_CIRCULAR_SIZES[size],
    ringStrokeWidth: resolveRingStrokeWidth(size),
    circularCircumference: V_PROGRESS_CIRCULAR_CIRCUMFERENCE,
  } as const
}
