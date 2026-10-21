export type VBarListSize = 'sm' | 'md'
/** `inline`: label · bar · value on one row. `stacked`: label and value above the bar. */
export type VBarListLayout = 'inline' | 'stacked'
/** Which bars get the strong fill; the rest render soft. */
export type VBarListEmphasis = 'max' | 'first' | 'all' | 'none'

export interface VBarListItem {
  label: string
  value: number
  /** Text shown in the value column. Defaults to the raw value (or `value%` when `unit="%"`). */
  display?: string
  /** Muted text under/after the label. */
  hint?: string
  /** Fill color for this bar (any CSS color). Overrides emphasis. */
  color?: string
  /** Forces strong emphasis for this item. */
  emphasized?: boolean
}

export interface VBarListProps {
  items?: VBarListItem[]
  /** Scale maximum. Defaults to the largest value. */
  max?: number
  /** Suffix appended to values without `display` (e.g. `%`, ` days`). */
  unit?: string
  layout?: VBarListLayout
  emphasis?: VBarListEmphasis
  size?: VBarListSize
  showValue?: boolean
  ariaLabel?: string
  dataTestId?: string
}
