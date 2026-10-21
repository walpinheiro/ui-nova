export type VSkeletonSize = 'xs' | 'sm' | 'md' | 'lg'
export type VSkeletonVariant = 'text' | 'avatar' | 'card' | 'table-row' | 'chart'

export interface VSkeletonProps {
  /** Content pattern rendered by the skeleton. */
  variant?: VSkeletonVariant
  /** Scale of shapes within the selected variant. */
  size?: VSkeletonSize
  /** Number of text lines when `variant` is `text`. */
  lines?: number
  /** Enables the shimmer animation while content is loading. */
  animated?: boolean
  /** Freezes the shimmer while keeping the placeholder visible. */
  paused?: boolean
  /** Marks the placeholder unavailable and removes motion. */
  disabled?: boolean
  /** Accessible name announced to assistive technology. */
  ariaLabel?: string
}
