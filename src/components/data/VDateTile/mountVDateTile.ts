import type { VDateTileProps, VDateTileSize, VDateTileTone } from './VDateTile.types'

const SIZES: VDateTileSize[] = ['sm', 'md', 'lg']
const TONES: VDateTileTone[] = ['neutral', 'primary', 'warning', 'danger']

export function parseTileDate(value: VDateTileProps['date']): Date | null {
  if (value === undefined || value === null || value === '') return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function mountVDateTile(props: VDateTileProps) {
  const size = SIZES.includes(props.size as VDateTileSize) ? (props.size as VDateTileSize) : 'md'
  const tone = TONES.includes(props.tone as VDateTileTone) ? (props.tone as VDateTileTone) : 'neutral'
  const date = parseTileDate(props.date)
  const locale = props.locale ?? 'en-US'
  const month = props.month ?? (date ? new Intl.DateTimeFormat(locale, { month: 'short' }).format(date).replace('.', '') : '')
  const day = props.day !== undefined ? String(props.day) : date ? String(date.getDate()) : ''
  const label = date ? new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date) : `${month} ${day}`.trim()
  const datetime = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : undefined

  return { size, tone, month, day, label, datetime } as const
}
