import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import type { IconifyIcon } from '@iconify/types'
import type { VTextareaProps, VTextareaSize, VTextareaVariant } from './VTextarea.types'

export const V_TEXTAREA_ERROR_ICON: IconifyIcon = circleAlertIcon

const SIZES: VTextareaSize[] = ['sm', 'md', 'lg']

export function mountVTextarea(props: VTextareaProps) {
  const size: VTextareaSize = SIZES.includes(props.size as VTextareaSize) ? (props.size as VTextareaSize) : 'md'
  const disabled = Boolean(props.disabled)
  const readonly = Boolean(props.readonly)
  const hasError = Boolean(props.errorMessage)
  const autoResize = Boolean(props.autoResize)
  const counter = typeof props.counter === 'number' && props.counter > 0 ? props.counter : undefined

  let variant: VTextareaVariant = 'default'
  if (hasError) variant = 'error'
  else if (props.helperText) variant = 'helper'
  else if (counter) variant = 'counter'
  else if (autoResize) variant = 'auto-resize'

  return {
    size,
    disabled,
    readonly,
    hasError,
    autoResize,
    counter,
    variant,
    errorIcon: V_TEXTAREA_ERROR_ICON,
    rows: props.rows ?? (size === 'sm' ? 3 : size === 'lg' ? 5 : 4),
    resize: props.resize ?? 'vertical',
  } as const
}
