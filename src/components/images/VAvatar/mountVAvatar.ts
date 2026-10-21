import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import crownIcon from '@iconify-icons/keyline-icons/crown'
import userIcon from '@iconify-icons/keyline-icons/user'
import type { VAvatarBadge, VAvatarProps, VAvatarSize } from './VAvatar.types'

export const V_AVATAR_USER_ICON: IconifyIcon = userIcon
export const V_AVATAR_CHECK_ICON: IconifyIcon = checkIcon
export const V_AVATAR_CROWN_ICON: IconifyIcon = crownIcon

const SIZE_MAP: Record<VAvatarSize, string> = {
  xs: 'var(--v-avatar-size-xs)',
  sm: 'var(--v-avatar-size-sm)',
  md: 'var(--v-avatar-size-md)',
  lg: 'var(--v-avatar-size-lg)',
  xl: 'var(--v-avatar-size-xl)',
}

const BADGE_ICONS: Partial<Record<VAvatarBadge, IconifyIcon>> = {
  pro: crownIcon,
  selected: checkIcon,
  check: checkIcon,
}

export function mountVAvatar(props: VAvatarProps) {
  const size = props.size ?? 'md'
  const shape = props.shape ?? 'circle'
  const interactive = Boolean(props.selectable)
  const hasImage = Boolean(props.src) && !props.loading
  const hasInitials = Boolean(props.initials) && !hasImage
  const showIcon = !hasImage && !hasInitials
  const badgeIcon = props.badge ? BADGE_ICONS[props.badge] : undefined
  const statusTestId = props.status ? `avatar-status-${props.status}` : undefined

  return {
    size,
    shape,
    interactive,
    disabled: Boolean(props.loading),
    hasImage,
    hasInitials,
    showIcon,
    badgeIcon,
    statusTestId,
    dimension: SIZE_MAP[size],
    smallIndicators: size === 'xs' || size === 'sm',
    ariaLabel:
      props.ariaLabel ??
      (props.decorative
        ? undefined
        : [props.alt, props.initials, props.status ? `${props.status}` : undefined]
            .filter(Boolean)
            .join(', ')),
    testId: props.dataTestId ?? 'avatar',
    sizeTestId: `avatar-size-${size}`,
  } as const
}
