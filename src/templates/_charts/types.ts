export interface LineSeries {
  id: string
  label: string
  data: number[]
  /** Any CSS color, usually a local var that has a dark variant, e.g. `var(--chart-pos)`. */
  color: string
  dashed?: boolean
  /** Soft gradient fill below the line. */
  area?: boolean
  /** Draw a point marker on the active index. Defaults to true (never for dashed series). */
  marker?: boolean
  width?: number
}

export interface TooltipPoint {
  series: LineSeries
  value: number
}
