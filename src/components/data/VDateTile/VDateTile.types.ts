export type VDateTileSize = 'sm' | 'md' | 'lg'
export type VDateTileTone = 'neutral' | 'primary' | 'warning' | 'danger'

export interface VDateTileProps {
  /** Date to display. ISO strings (`2026-09-29`) are parsed as local dates. */
  date?: Date | string | number
  /** Overrides the month line (e.g. "Sep"). */
  month?: string
  /** Overrides the day line (e.g. "29"). */
  day?: string | number
  /** BCP-47 locale for the month abbreviation. */
  locale?: string
  size?: VDateTileSize
  tone?: VDateTileTone
  dataTestId?: string
}
