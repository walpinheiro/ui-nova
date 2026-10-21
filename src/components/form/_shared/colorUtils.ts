export type RgbColor = { r: number; g: number; b: number; a: number }
export type HslColor = { h: number; s: number; l: number; a: number }

export const DEFAULT_COLOR: RgbColor = { r: 99, g: 102, b: 241, a: 1 }

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function hslToRgb({ h, s, l, a = 1 }: HslColor): RgbColor {
  const sat = s / 100
  const light = l / 100
  const c = (1 - Math.abs(2 * light - 1)) * sat
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = light - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a,
  }
}

export function rgbToHsl({ r, g, b, a = 1 }: RgbColor): HslColor {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6
        break
      case gn:
        h = (bn - rn) / delta + 2
        break
      default:
        h = (rn - gn) / delta + 4
    }
    h *= 60
    if (h < 0) h += 360
  }

  return { h, s: s * 100, l: l * 100, a }
}

export function rgbToHex(color: RgbColor, includeAlpha = false): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  const base = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase()
  if (!includeAlpha || color.a >= 1) return base
  return `${base}${toHex(color.a * 255)}`.toUpperCase()
}

export function hexToRgb(hex: string): RgbColor | null {
  const normalized = hex.trim().replace(/^#/, '')
  if (![3, 4, 6, 8].includes(normalized.length)) return null
  if (!/^[0-9a-fA-F]+$/.test(normalized)) return null

  const expand = (value: string) =>
    value.length === 1 ? value + value : value.length === 2 ? value : value

  let r = 0
  let g = 0
  let b = 0
  let a = 255

  if (normalized.length === 3 || normalized.length === 4) {
    r = parseInt(expand(normalized[0]!), 16)
    g = parseInt(expand(normalized[1]!), 16)
    b = parseInt(expand(normalized[2]!), 16)
    if (normalized.length === 4) a = parseInt(expand(normalized[3]!), 16)
  } else {
    r = parseInt(normalized.slice(0, 2), 16)
    g = parseInt(normalized.slice(2, 4), 16)
    b = parseInt(normalized.slice(4, 6), 16)
    if (normalized.length === 8) a = parseInt(normalized.slice(6, 8), 16)
  }

  return { r, g, b, a: a / 255 }
}

export function parseColor(value?: string | null): RgbColor {
  if (!value) return { ...DEFAULT_COLOR }
  const rgb = hexToRgb(value)
  return rgb ?? { ...DEFAULT_COLOR }
}

export function colorToCss(color: RgbColor): string {
  if (color.a >= 1) return rgbToHex(color)
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
}

export function getContrastColor(color: RgbColor): '#FFFFFF' | '#111827' {
  const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255
  return luminance > 0.62 ? '#111827' : '#FFFFFF'
}

export function normalizeHexInput(value: string): string {
  const trimmed = value.trim()
  if (!trimmed.startsWith('#')) return `#${trimmed.replace(/[^0-9a-fA-F]/g, '').slice(0, 8)}`
  return `#${trimmed.slice(1).replace(/[^0-9a-fA-F]/g, '').slice(0, 8)}`
}
