export type VBarChartVariant = 'pill' | 'solid'
/** `primary` fits plain surfaces; `inverse` draws translucent white bars for tinted/gradient backgrounds. */
export type VBarChartTone = 'primary' | 'neutral' | 'inverse'
export type VBarChartValueMode = 'active' | 'all' | 'none'

export interface VBarChartDatum {
  label: string
  value: number
  /** Formatted value for the tooltip/label (e.g. "$84.6K"). */
  display?: string
}

export interface VBarChartProps {
  data?: VBarChartDatum[]
  /** Index of the emphasized bar (`v-model:active`). Defaults to the last bar; `-1` emphasizes none. */
  active?: number
  /** Plot height in px (labels excluded). */
  height?: number
  variant?: VBarChartVariant
  tone?: VBarChartTone
  /** Which bars show their value above them. */
  showValue?: VBarChartValueMode
  showLabels?: boolean
  /** Bars become buttons that set `active` on click/focus. */
  interactive?: boolean
  max?: number
  ariaLabel?: string
  dataTestId?: string
}

export type VBarChartEmits = {
  'update:active': [index: number]
  select: [datum: VBarChartDatum, index: number]
}
