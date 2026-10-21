import type { IconifyIcon } from '@iconify/types'
import crownIcon from '@iconify-icons/keyline-icons/crown'
import triangleAlertIcon from '@iconify-icons/keyline-icons/triangle-alert'
import infoIcon from '@iconify-icons/keyline-icons/info'
import checkIcon from '@iconify-icons/keyline-icons/check'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VBadgeProps } from './VBadge.types'

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  crown: crownIcon,
  warning: triangleAlertIcon,
  alert: triangleAlertIcon,
  info: infoIcon,
  check: checkIcon,
}

export function mountVBadge(props: VBadgeProps) {
  const requestedVariant = props.variant ?? (props.count !== undefined ? 'count' : props.dot ? 'dot' : 'neutral')
  const variant = requestedVariant === 'default' || requestedVariant === 'subtle' ? 'neutral' : requestedVariant
  const removable = Boolean(props.removable)
  const interactive = Boolean(props.interactive && !removable)
  const iconKey = props.icon?.toLowerCase()
  const iconData = iconKey
    ? KEYLINE_ICONS[iconKey]
    : variant === 'warning'
      ? KEYLINE_ICONS.warning
      : undefined

  return {
    size: props.size ?? 'md',
    variant,
    interactive,
    removable,
    removeIcon: xIcon,
    removeTestId: props.removeTestId ?? 'badge-remove',
    disabled: Boolean(props.disabled || props.loading),
    showCount: props.count !== undefined,
    showDot: Boolean(props.dot || variant === 'dot'),
    iconData,
    fallbackLabel: variant === 'count' ? 'Count' : variant === 'dot' || props.dot ? 'Online' : 'Badge',
    live: Boolean(props.live || props.count !== undefined || props.dot || variant === 'count' || variant === 'dot'),
    testId: props.dataTestId ?? 'badge',
  } as const
}
