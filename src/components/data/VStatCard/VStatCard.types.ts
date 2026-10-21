import type { IconifyIcon } from '@iconify/types'

export type VStatCardSize = 'sm' | 'md' | 'lg'
export type VStatCardVariant = 'plain' | 'outlined' | 'elevated' | 'tinted'
export type VStatCardTrend = 'up' | 'down' | 'neutral'

export interface VStatCardStat {
  label: string
  value: string | number
  /** Muted text after the value (e.g. "22 claims"). */
  caption?: string
  /** Dot color before the label (any CSS color). */
  color?: string
}

export interface VStatCardProps {
  label?: string
  value?: string | number
  /** Muted line under the value (e.g. "Average, last 30 days"). */
  caption?: string
  /** Delta pill content, e.g. `14.8%` or `-3`. Trend is inferred from the sign when `trend` is omitted. */
  delta?: string | number
  trend?: VStatCardTrend
  /** Text after the delta pill (e.g. "vs $73,710 in August"). */
  deltaCaption?: string
  icon?: IconifyIcon
  /** Secondary metrics rendered in a row below a divider. */
  stats?: VStatCardStat[]
  size?: VStatCardSize
  variant?: VStatCardVariant
  loading?: boolean
  dataTestId?: string
}
