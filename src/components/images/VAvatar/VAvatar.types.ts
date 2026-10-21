export type VAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type VAvatarShape = 'circle' | 'square'
export type VAvatarStatus = 'online' | 'busy' | 'offline'
export type VAvatarBadge = 'pro' | 'selected' | 'check'

export interface VAvatarMember {
  src?: string
  alt?: string
  initials?: string
}

export interface VAvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: VAvatarSize
  shape?: VAvatarShape
  status?: VAvatarStatus
  badge?: VAvatarBadge
  selectable?: boolean
  selected?: boolean
  loading?: boolean
  decorative?: boolean
  ariaLabel?: string
  dataTestId?: string
}

export interface VGroupAvatarProps {
  members: VAvatarMember[]
  max?: number
  size?: VAvatarSize
  shape?: VAvatarShape
  dataTestId?: string
}
