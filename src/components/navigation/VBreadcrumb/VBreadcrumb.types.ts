export interface VBreadcrumbItem {
  label: string
  to?: string
  href?: string
  disabled?: boolean
  icon?: string
}

export type VBreadcrumbSize = 'sm' | 'md' | 'lg'
export type VBreadcrumbVariant = 'default' | 'compact' | 'icons' | 'overflow'

export interface VBreadcrumbProps {
  items?: VBreadcrumbItem[]
  size?: VBreadcrumbSize
  variant?: VBreadcrumbVariant
  maxItems?: number
  ariaLabel?: string
}

import type { IconifyIcon } from '@iconify/types'

export interface ResolvedVBreadcrumbItem {
  label: string
  href?: string
  disabled: boolean
  isCurrent: boolean
  iconData?: IconifyIcon
  homeIconData?: IconifyIcon
  showHomeIcon: boolean
  originalIndex: number
}

export type VBreadcrumbSegment =
  | { type: 'item'; item: ResolvedVBreadcrumbItem }
  | { type: 'overflow'; items: ResolvedVBreadcrumbItem[] }
