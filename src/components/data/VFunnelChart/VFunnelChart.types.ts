export type VFunnelChartTone = 'primary' | 'inverse'

export interface VFunnelStage {
  label: string
  value: number
  /** Formatted headline value (e.g. "$182.4K"). Defaults to `value`. */
  display?: string
  /** Muted line under the value (e.g. "118 claims"). */
  caption?: string
}

export interface VFunnelChartProps {
  stages?: VFunnelStage[]
  /** Capsule height in px. */
  height?: number
  /** Shows the stage-to-stage conversion chip between columns. */
  showConversion?: boolean
  tone?: VFunnelChartTone
  ariaLabel?: string
  dataTestId?: string
}
