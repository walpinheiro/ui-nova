import type { VSliderOrientation, VSliderProps, VSliderSize } from './VSlider.types'

const SIZES: VSliderSize[] = ['sm', 'md', 'lg']
const ORIENTATIONS: VSliderOrientation[] = ['horizontal', 'vertical']

export function mountVSlider(props: VSliderProps) {
  const size: VSliderSize = SIZES.includes(props.size as VSliderSize) ? (props.size as VSliderSize) : 'md'
  const orientation: VSliderOrientation = ORIENTATIONS.includes(props.orientation as VSliderOrientation)
    ? (props.orientation as VSliderOrientation)
    : 'horizontal'
  const min = props.min ?? 0
  const max = props.max ?? 100
  const step = props.step ?? 1
  const disabled = Boolean(props.disabled)
  const range = Boolean(props.range)
  const showValue = props.showValue !== false
  const showTooltip = props.showTooltip !== false
  const snapToMarks = Boolean(props.snapToMarks)
  const marks = normalizeMarks(props.marks)

  let variant: 'single' | 'range' | 'marks' | 'vertical' | 'disabled' = 'single'
  if (disabled) variant = 'disabled'
  else if (orientation === 'vertical') variant = 'vertical'
  else if (marks.length) variant = 'marks'
  else if (range) variant = 'range'

  return {
    size,
    orientation,
    min,
    max,
    step,
    disabled,
    range,
    showValue,
    showTooltip,
    snapToMarks,
    marks,
    variant,
  } as const
}

export function normalizeMarks(marks?: number[] | Record<number, string>): Array<{ value: number; label?: string }> {
  if (!marks) return []
  if (Array.isArray(marks)) {
    return marks.map((value) => ({ value }))
  }
  return Object.entries(marks).map(([key, label]) => ({
    value: Number(key),
    label,
  }))
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function snapValue(value: number, step: number, min: number, max: number): number {
  const steps = Math.round((value - min) / step)
  const snapped = min + steps * step
  const precision = getStepPrecision(step)
  return clampValue(Number(snapped.toFixed(precision)), min, max)
}

export function snapToNearestMark(value: number, marks: number[], min: number, max: number): number {
  if (!marks.length) return value
  let nearest = marks[0]
  let distance = Math.abs(value - nearest)
  for (const mark of marks) {
    const nextDistance = Math.abs(value - mark)
    if (nextDistance < distance) {
      nearest = mark
      distance = nextDistance
    }
  }
  return clampValue(nearest, min, max)
}

function getStepPrecision(step: number): number {
  const text = String(step)
  const decimal = text.indexOf('.')
  return decimal === -1 ? 0 : text.length - decimal - 1
}

export function formatSliderValue(value: number | [number, number]): string {
  if (Array.isArray(value)) return `${value[0]} – ${value[1]}`
  return String(value)
}

export function percentForValue(value: number, min: number, max: number): number {
  if (max === min) return 0
  return ((value - min) / (max - min)) * 100
}
