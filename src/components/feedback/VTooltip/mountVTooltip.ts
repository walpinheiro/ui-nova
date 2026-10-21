import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import infoIcon from '@iconify-icons/keyline-icons/info'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import type { VTooltipProps, VTooltipSize, VTooltipVariant } from './VTooltip.types'

export const V_TOOLTIP_MAX_WIDTHS: Record<VTooltipSize, string> = {
  sm: '160px',
  md: '200px',
  lg: '240px',
  xl: '320px',
}

export const V_TOOLTIP_VARIANT_ICONS: Partial<Record<VTooltipVariant, IconifyIcon>> = {
  'with-icon': infoIcon,
  success: checkIcon,
  error: circleAlertIcon,
  brand: sparklesIcon,
}

export function mountVTooltip(props: VTooltipProps) {
  const variant = props.variant ?? 'default'
  const size = props.size ?? 'md'

  return {
    size,
    variant,
    placement: props.placement ?? 'top',
    disabled: Boolean(props.disabled),
    showArrow: props.showArrow ?? true,
    hideDelay: props.hideDelay ?? 500,
    content: props.content ?? '',
    maxWidth: V_TOOLTIP_MAX_WIDTHS[size],
    iconData: V_TOOLTIP_VARIANT_ICONS[variant] ?? null,
    showIcon: variant !== 'default' && variant !== 'light' && Boolean(V_TOOLTIP_VARIANT_ICONS[variant]),
    testId: `tooltip-${variant === 'with-icon' ? 'with-icon' : variant}`,
  } as const
}
