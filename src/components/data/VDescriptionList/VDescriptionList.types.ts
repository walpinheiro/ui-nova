/** `inline`: label left, value right. `stacked`: label above value. `grid`: stacked pairs flowing in columns. */
export type VDescriptionListLayout = 'inline' | 'stacked' | 'grid'
export type VDescriptionListSize = 'sm' | 'md'

export interface VDescriptionItem {
  /** Stable key, also used for the `value-{key}` slot. Defaults to the label. */
  key?: string
  label: string
  value?: string | number
  /** Muted middle column (inline) or line under the label (stacked). */
  hint?: string
}

export interface VDescriptionListProps {
  items?: VDescriptionItem[]
  layout?: VDescriptionListLayout
  size?: VDescriptionListSize
  /** Hairline between rows. */
  dividers?: boolean
  /** Emphasized summary row rendered after the items (e.g. "Claimed · $1,840"). */
  total?: { label: string; value: string | number }
  /** Grid layout column count. */
  columns?: number
  ariaLabel?: string
  dataTestId?: string
}
