import type { VMotionLevel } from '../../../motion/types'

export type VCardSize = 'sm' | 'md' | 'lg'
export type VCardVariant = 'elevated' | 'outlined' | 'filled' | 'interactive'
export type VCardRefineFrameStage = 'queued' | 'generating' | 'refining' | 'complete'
export type VCardMediaPlacement = 'top' | 'start' | 'end' | 'bottom'

export interface VCardProps {
  title?: string
  description?: string
  /** Overlay category tag rendered as `VTag` (not `VBadge`). Use `#header-trailing` + `VBadge` for status. */
  badge?: string
  size?: VCardSize
  variant?: VCardVariant
  loading?: boolean
  /** When true the card becomes keyboard-focusable/actionable (tabindex 0, Enter/Space). */
  interactive?: boolean
  /**
   * Controlled selected appearance (check + primary tint). Does not toggle on click;
   * the parent owns selection, matching existing interactive/click behavior.
   */
  selected?: boolean
  /** Where `#media` sits relative to title/body. Defaults to top (current anatomy). */
  mediaPlacement?: VCardMediaPlacement
  /** Refine Frame stage for AI media generation without layout shift. */
  refineFrame?: VCardRefineFrameStage
  ariaLabel?: string
  motion?: VMotionLevel
}
export interface VCardEmits {
  click: [event: MouseEvent | KeyboardEvent]
}
