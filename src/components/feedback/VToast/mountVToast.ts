import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import infoIcon from '@iconify-icons/keyline-icons/info'
import pauseIcon from '@iconify-icons/keyline-icons/pause'
import triangleAlertIcon from '@iconify-icons/keyline-icons/triangle-alert'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VToastProps, VToastVariant } from './VToast.types'

export const V_TOAST_CLOSE_ICON: IconifyIcon = xIcon
export const V_TOAST_PAUSE_ICON: IconifyIcon = pauseIcon

export const V_TOAST_VARIANT_ICONS: Record<Exclude<VToastVariant, 'loading'>, IconifyIcon> = {
  info: infoIcon,
  success: checkIcon,
  warning: triangleAlertIcon,
  error: circleAlertIcon,
}

export function mountVToast(props: VToastProps) {
  const variant = props.loading ? 'loading' : (props.variant ?? 'info')
  const size = props.size ?? 'md'

  return {
    size,
    variant,
    duration: props.duration ?? 5000,
    closable: props.closable ?? true,
    showProgress: props.showProgress ?? true,
    loading: Boolean(props.loading) || variant === 'loading',
    disabled: Boolean(props.disabled),
    message: props.message ?? '',
    iconData: variant === 'loading' ? null : V_TOAST_VARIANT_ICONS[variant],
    closeIcon: V_TOAST_CLOSE_ICON,
    pauseIcon: V_TOAST_PAUSE_ICON,
    testId: variant === 'loading' ? 'toast-loading' : `toast-${variant}`,
  } as const
}
