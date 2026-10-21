export type VTimeRangeSize = 'sm' | 'md'

export interface VTimeRangeProps {
  /** Start time `HH:MM` (`v-model:start`). */
  start?: string
  /** End time `HH:MM` (`v-model:end`). An end before the start wraps past midnight. */
  end?: string
  /** Minute step for the native time inputs. */
  step?: number
  showDuration?: boolean
  closable?: boolean
  disabled?: boolean
  size?: VTimeRangeSize
  startLabel?: string
  endLabel?: string
  dataTestId?: string
}

export type VTimeRangeEmits = {
  'update:start': [value: string]
  'update:end': [value: string]
  change: [range: { start: string; end: string; minutes: number }]
  close: []
}
