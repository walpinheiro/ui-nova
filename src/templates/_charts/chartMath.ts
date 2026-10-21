/** Pure helpers for the template-local SVG charts (no DOM, unit-tested). */

export interface ChartPoint {
  x: number
  y: number
}

export function linearScale(d0: number, d1: number, r0: number, r1: number): (v: number) => number {
  const span = d1 - d0 || 1
  return (v) => r0 + ((v - d0) / span) * (r1 - r0)
}

const fmt = (n: number): string => (Math.round(n * 100) / 100).toString()

/** Evenly spaced x positions for `count` categories across [left, right]. */
export function bandPositions(count: number, left: number, right: number): number[] {
  if (count <= 1) return [(left + right) / 2]
  const step = (right - left) / (count - 1)
  return Array.from({ length: count }, (_, i) => left + i * step)
}

export function linearPath(pts: ChartPoint[]): string {
  if (!pts.length) return ''
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${fmt(p.x)} ${fmt(p.y)}`).join(' ')
}

const sign = (n: number): number => (n < 0 ? -1 : 1)

/** Monotone-X cubic interpolation (Fritsch-Carlson): never overshoots the data. */
export function monotonePath(pts: ChartPoint[]): string {
  const n = pts.length
  if (n < 3) return linearPath(pts)
  const slopes: number[] = []
  const h: number[] = []
  for (let i = 0; i < n - 1; i++) {
    h[i] = pts[i + 1].x - pts[i].x || 1e-6
    slopes[i] = (pts[i + 1].y - pts[i].y) / h[i]
  }
  const t: number[] = new Array(n)
  t[0] = slopes[0]
  t[n - 1] = slopes[n - 2]
  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) {
      t[i] = 0
    } else {
      const p = (slopes[i - 1] * h[i] + slopes[i] * h[i - 1]) / (h[i - 1] + h[i])
      t[i] =
        (sign(slopes[i - 1]) + sign(slopes[i])) *
        Math.min(Math.abs(slopes[i - 1]), Math.abs(slopes[i]), 0.5 * Math.abs(p))
    }
  }
  let d = `M${fmt(pts[0].x)} ${fmt(pts[0].y)}`
  for (let i = 0; i < n - 1; i++) {
    const dx = h[i] / 3
    d += ` C${fmt(pts[i].x + dx)} ${fmt(pts[i].y + dx * t[i])} ${fmt(pts[i + 1].x - dx)} ${fmt(pts[i + 1].y - dx * t[i + 1])} ${fmt(pts[i + 1].x)} ${fmt(pts[i + 1].y)}`
  }
  return d
}

export function linePath(pts: ChartPoint[], smooth = true): string {
  return smooth ? monotonePath(pts) : linearPath(pts)
}

/** Closed area under a line down to `baseY`. */
export function areaPath(pts: ChartPoint[], baseY: number, smooth = true): string {
  if (!pts.length) return ''
  const line = linePath(pts, smooth)
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${line} L${fmt(last.x)} ${fmt(baseY)} L${fmt(first.x)} ${fmt(baseY)} Z`
}

/** Stepped (funnel-like) area: each value holds across its own band. */
export function stepAreaPath(
  values: number[],
  left: number,
  right: number,
  baseY: number,
  yOf: (v: number) => number,
): string {
  const n = values.length
  if (!n) return ''
  const w = (right - left) / n
  let d = `M${fmt(left)} ${fmt(baseY)} L${fmt(left)} ${fmt(yOf(values[0]))}`
  values.forEach((v, i) => {
    const x1 = left + w * (i + 1)
    d += ` L${fmt(x1)} ${fmt(yOf(v))}`
    if (i < n - 1) d += ` L${fmt(x1)} ${fmt(yOf(values[i + 1]))}`
  })
  return `${d} L${fmt(right)} ${fmt(baseY)} Z`
}

/**
 * Smooth funnel: one flat-topped column per value, neighbouring tops joined by cubic bezier
 * S-curves, rounded outer top corners. Returns the open top edge and the closed area.
 */
export function curvedStepPaths(
  values: number[],
  left: number,
  right: number,
  baseY: number,
  yOf: (v: number) => number,
  blend = 0.9,
  radius = 10,
): { line: string; area: string } {
  const n = values.length
  if (!n) return { line: '', area: '' }
  const w = (right - left) / n
  const t = w * blend
  const startX = (i: number): number => left + w * i + (i > 0 ? t / 2 : 0)
  const endX = (i: number): number => left + w * (i + 1) - (i < n - 1 ? t / 2 : 0)
  const r = Math.min(radius, w / 4)
  const y0 = yOf(values[0])
  let line = `M${fmt(left)} ${fmt(y0 + r)} Q${fmt(left)} ${fmt(y0)} ${fmt(left + r)} ${fmt(y0)}`
  for (let i = 0; i < n; i++) {
    const y = yOf(values[i])
    if (i < n - 1) {
      const yn = yOf(values[i + 1])
      const x1 = endX(i)
      const x2 = startX(i + 1)
      const mid = (x1 + x2) / 2
      line += ` L${fmt(x1)} ${fmt(y)} C${fmt(mid)} ${fmt(y)} ${fmt(mid)} ${fmt(yn)} ${fmt(x2)} ${fmt(yn)}`
    } else {
      line += ` L${fmt(right - r)} ${fmt(y)} Q${fmt(right)} ${fmt(y)} ${fmt(right)} ${fmt(y + r)}`
    }
  }
  const area = `${line} L${fmt(right)} ${fmt(baseY)} L${fmt(left)} ${fmt(baseY)} Z`
  return { line, area }
}

/** Index of the x position nearest to `x`. */
export function nearestIndex(x: number, xs: number[]): number {
  let best = 0
  let dist = Infinity
  for (let i = 0; i < xs.length; i++) {
    const d = Math.abs(xs[i] - x)
    if (d < dist) {
      dist = d
      best = i
    }
  }
  return best
}

export function clampIndex(i: number, length: number): number {
  return Math.max(0, Math.min(length - 1, i))
}
