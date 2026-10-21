import type { IconifyIcon } from '@iconify/types'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import circleCheckIcon from '@iconify-icons/keyline-icons/circle-check'
import infoIcon from '@iconify-icons/keyline-icons/info'
import megaphoneIcon from '@iconify-icons/keyline-icons/megaphone'
import triangleAlertIcon from '@iconify-icons/keyline-icons/triangle-alert'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VBannerProps, VBannerVariant } from './VBanner.types'

export const V_BANNER_CLOSE_ICON: IconifyIcon = xIcon

export const V_BANNER_VARIANT_ICONS: Record<VBannerVariant, IconifyIcon> = {
  info: infoIcon,
  success: circleCheckIcon,
  warning: triangleAlertIcon,
  error: circleAlertIcon,
  neutral: megaphoneIcon,
}

const VARIANT_ROLE: Record<VBannerVariant, 'status' | 'alert'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  error: 'alert',
  neutral: 'status',
}

export function mountVBanner(props: VBannerProps) {
  const variant = props.variant ?? 'info'

  return {
    variant,
    size: props.size ?? 'md',
    disabled: Boolean(props.disabled),
    loading: Boolean(props.loading),
    closable: Boolean(props.closable),
    closeOnEscape: props.closeOnEscape ?? true,
    iconData: V_BANNER_VARIANT_ICONS[variant],
    closeIcon: V_BANNER_CLOSE_ICON,
    role: VARIANT_ROLE[variant],
  } as const
}
