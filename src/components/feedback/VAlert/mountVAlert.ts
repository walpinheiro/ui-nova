import type { IconifyIcon } from '@iconify/types'
import circleCheckIcon from '@iconify-icons/keyline-icons/circle-check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import infoIcon from '@iconify-icons/keyline-icons/info'
import triangleAlertIcon from '@iconify-icons/keyline-icons/triangle-alert'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VAlertProps, VAlertVariant } from './VAlert.types'

export const V_ALERT_CLOSE_ICON: IconifyIcon = xIcon

export const V_ALERT_VARIANT_ICONS: Record<VAlertVariant, IconifyIcon> = {
  info: infoIcon,
  success: circleCheckIcon,
  warning: triangleAlertIcon,
  danger: circleAlertIcon,
  neutral: infoIcon,
}

export function mountVAlert(props: VAlertProps) {
  const disabled = Boolean(props.disabled)
  const loading = Boolean(props.loading)
  const variant = props.variant ?? 'info'

  return {
    size: props.size ?? 'md',
    variant,
    layout: props.layout ?? 'inline',
    disabled,
    loading,
    dismissible: Boolean(props.dismissible),
    interactiveDisabled: disabled || loading,
    iconData: V_ALERT_VARIANT_ICONS[variant],
    closeIcon: V_ALERT_CLOSE_ICON,
  } as const
}
