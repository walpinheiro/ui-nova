export const GESTURE_DEFAULTS = {
  swipeThreshold: 80,
  flickVelocity: 0.5,
  rubberBandFactor: 0.35,
} as const

export function rubberBand(value: number, min: number, max: number, factor = GESTURE_DEFAULTS.rubberBandFactor): number {
  if (value < min) return min - (min - value) * factor
  if (value > max) return max + (value - max) * factor
  return value
}

export function snapFromVelocity(
  offset: number,
  velocity: number,
  threshold = GESTURE_DEFAULTS.swipeThreshold,
  flick = GESTURE_DEFAULTS.flickVelocity,
): boolean {
  return offset > threshold || (velocity > flick && offset > threshold * 0.4)
}
