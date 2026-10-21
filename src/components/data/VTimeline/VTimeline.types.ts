import type { IconifyIcon } from '@iconify/types'

/** `steps`: markers + connector (process timeline). `feed`: avatar rows grouped by `group` (activity log). */
export type VTimelineVariant = 'steps' | 'feed'
export type VTimelineSize = 'sm' | 'md'
export type VTimelineItemState = 'complete' | 'current' | 'upcoming' | 'error'

export interface VTimelineItem {
  id: string | number
  title: string
  description?: string
  /** Right-aligned meta (e.g. "Sep 18", "4h ago"). */
  time?: string
  /** Steps variant marker state. Defaults to `complete`. */
  state?: VTimelineItemState
  /** Custom marker icon (steps) — replaces the state glyph. */
  icon?: IconifyIcon
  /** Feed variant actor. */
  avatar?: { src?: string; initials?: string; alt?: string }
  /** Feed variant section heading (e.g. "Today", "Earlier"). Consecutive items share one heading. */
  group?: string
}

export interface VTimelineProps {
  items?: VTimelineItem[]
  variant?: VTimelineVariant
  size?: VTimelineSize
  ariaLabel?: string
  dataTestId?: string
}
