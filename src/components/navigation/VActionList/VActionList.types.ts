import type { IconifyIcon } from '@iconify/types'

export type VActionListVariant = 'plain' | 'card'
export type VActionListSize = 'sm' | 'md'
/** Trailing affordance: disclosure chevron, external link arrow, or nothing. */
export type VActionListTrailing = 'chevron' | 'external' | 'none'

export interface VActionListItem {
  value: string
  label: string
  icon?: IconifyIcon
  /** Muted text before the trailing affordance (e.g. "0", "main"). */
  hint?: string
  trailing?: VActionListTrailing
  href?: string
  disabled?: boolean
  /** Mark the row as the current selection. */
  active?: boolean
}

export interface VActionListSection {
  id: string
  label?: string
  /** Icon button in the section header (emits `section-action`). */
  actionIcon?: IconifyIcon
  actionLabel?: string
  items?: VActionListItem[]
}

export interface VActionListProps {
  sections?: VActionListSection[]
  variant?: VActionListVariant
  size?: VActionListSize
  /** Hairline between sections. */
  dividers?: boolean
  ariaLabel?: string
  dataTestId?: string
}

export type VActionListEmits = {
  select: [item: VActionListItem, section: VActionListSection]
  'section-action': [sectionId: string]
}
