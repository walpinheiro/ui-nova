export interface SpringConfig {
  visualDuration: number
  bounce: number
}

export const SPRING_PRESETS = {
  snappy: { visualDuration: 0.16, bounce: 0.1 },
  bouncy: { visualDuration: 0.2, bounce: 0.35 },
  critical: { visualDuration: 0.24, bounce: 0 },
} as const satisfies Record<string, SpringConfig>

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Damped spring step (simplified, no external deps). */
export function springStep(
  current: number,
  target: number,
  velocity: number,
  stiffness = 180,
  damping = 18,
  dt = 1 / 60,
): { value: number; velocity: number } {
  const force = -stiffness * (current - target) - damping * velocity
  const nextVelocity = velocity + force * dt
  const nextValue = current + nextVelocity * dt
  return { value: nextValue, velocity: nextVelocity }
}

export function zetaFromBounce(bounce: number): number {
  if (bounce <= 0) return 1
  return -Math.log(bounce) / Math.sqrt(Math.PI ** 2 + Math.log(bounce) ** 2)
}

export function springReadings(
  t: number,
  doneOpacity = 0.42,
  strikeLag = 0.12,
): {
  fillScale: number
  boxScale: number
  tickOffset: number
  wordOpacity: number
  ruleScale: number
} {
  const held = clamp01(t)
  const ruleEnd = 0.84
  const swell = 0.35
  return {
    fillScale: Math.max(t, 0),
    boxScale: 1 + swell * Math.max(0, t - 1),
    tickOffset: 1 - held,
    wordOpacity: 1 - (1 - doneOpacity) * held,
    ruleScale: clamp01((held - strikeLag) / (ruleEnd - strikeLag)),
  }
}
