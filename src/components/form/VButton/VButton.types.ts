import type { VMotionLevel } from '../../../motion/types'

export type VButtonSize = 'sm' | 'md' | 'lg'
export type VButtonShape = 'default' | 'pill'
export type VButtonType = 'button' | 'submit' | 'reset'
export type VButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'destructive'
  /** Dark solid CTA (light: neutral-900 + white text; dark inverts). */
  | 'inverse'
  | 'icon'
  | 'loading'
export type VButtonMicroInteraction = 'default' | 'fuse' | 'hold' | 'favorite'

export interface VButtonProps {
  disabled?: boolean
  loading?: boolean
  size?: VButtonSize
  /** `pill` is the fully rounded action used in dashboard headers. */
  shape?: VButtonShape
  variant?: VButtonVariant
  /** Native button behavior. Defaults to button to avoid accidental form submits. */
  type?: VButtonType
  ariaLabel?: string
  motion?: VMotionLevel
  /** Expressive micro-interaction pattern (Fuse, Hold, Pulse Heart). */
  microInteraction?: VButtonMicroInteraction
  /** Fuse Button: undo window in ms after action. */
  undoWindow?: number
  /** Hold Button: ms to hold before confirm. */
  holdDuration?: number
  /** Pulse Heart: displayed count. */
  favoriteCount?: number
}
