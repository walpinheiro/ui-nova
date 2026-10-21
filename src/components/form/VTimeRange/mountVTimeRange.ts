import type { VTimeRangeProps, VTimeRangeSize } from './VTimeRange.types'

const SIZES: VTimeRangeSize[] = ['sm', 'md']

export function parseTime(value: string | undefined): number | null {
  const match = value?.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

export function rangeMinutes(start: string | undefined, end: string | undefined): number | null {
  const from = parseTime(start)
  const to = parseTime(end)
  if (from === null || to === null) return null
  return to >= from ? to - from : to + 24 * 60 - from
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return ''
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest}min`
  return rest ? `${hours}h ${rest}min` : `${hours}h`
}

export function mountVTimeRange(props: VTimeRangeProps) {
  const size = SIZES.includes(props.size as VTimeRangeSize) ? (props.size as VTimeRangeSize) : 'md'
  const minutes = rangeMinutes(props.start, props.end)
  return {
    size,
    minutes,
    duration: formatDuration(minutes),
    stepSeconds: Math.max(1, Math.floor(props.step ?? 5)) * 60,
  } as const
}
