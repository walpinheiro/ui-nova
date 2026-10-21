export type DateRangeValue = { start: Date | null; end: Date | null }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime()
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setDate(1)
  d.setMonth(d.getMonth() + amount)
  return d
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

export function getMonthLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function getWeekdayLabels(): string[] {
  return [...WEEKDAYS]
}

export function getCalendarDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const startOffset = first.getDay()
  const gridStart = addDays(first, -startOffset)
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}

export function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  const t = startOfDay(day).getTime()
  const s = startOfDay(start).getTime()
  const e = startOfDay(end).getTime()
  const min = Math.min(s, e)
  const max = Math.max(s, e)
  return t >= min && t <= max
}

export function isRangeStart(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start) return false
  if (!end) return isSameDay(day, start)
  return isSameDay(day, start) || isSameDay(day, end)
}

export function formatDate(date: Date, format = 'MMM d, yyyy'): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const tokens: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    MMM: MONTHS[date.getMonth()],
    MM: pad(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    dd: pad(date.getDate()),
    d: String(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
  }

  return format.replace(/yyyy|MMM|MM|M|dd|d|HH|mm/g, (token) => tokens[token] ?? token)
}

export function formatDateRange(range: DateRangeValue, format = 'MMM d, yyyy', separator = ' – '): string {
  if (!range.start && !range.end) return ''
  if (range.start && !range.end) return formatDate(range.start, format)
  if (!range.start && range.end) return formatDate(range.end, format)
  if (range.start && range.end && isSameDay(range.start, range.end)) {
    return formatDate(range.start, format)
  }
  return `${formatDate(range.start!, format)}${separator}${formatDate(range.end!, format)}`
}

export function isDateDisabled(
  day: Date,
  options: {
    min?: Date
    max?: Date
    disabledDates?: Date[]
    disabledWeekdays?: number[]
  } = {},
): boolean {
  const t = startOfDay(day).getTime()
  if (options.min && t < startOfDay(options.min).getTime()) return true
  if (options.max && t > startOfDay(options.max).getTime()) return true
  if (options.disabledWeekdays?.includes(day.getDay())) return true
  if (options.disabledDates?.some((d) => isSameDay(d, day))) return true
  return false
}

export function resolvePresetRange(key: string, today = new Date()): DateRangeValue {
  const end = startOfDay(today)
  switch (key) {
    case '7d':
      return { start: addDays(end, -6), end }
    case '30d':
      return { start: addDays(end, -29), end }
    case '90d':
      return { start: addDays(end, -89), end }
    case 'this-month': {
      const start = new Date(end.getFullYear(), end.getMonth(), 1)
      return { start, end }
    }
    case 'last-month': {
      const start = new Date(end.getFullYear(), end.getMonth() - 1, 1)
      const last = new Date(end.getFullYear(), end.getMonth(), 0)
      return { start, end: last }
    }
    default:
      return { start: null, end: null }
  }
}

export function toDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
