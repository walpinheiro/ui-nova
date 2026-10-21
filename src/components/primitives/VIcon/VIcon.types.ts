import type { IconifyIcon } from '@iconify/types'

export type VIconSize = 'sm' | 'md' | 'lg'

export interface VIconProps {
  icon?: IconifyIcon
  size?: VIconSize
}

export type { IconifyIcon }
