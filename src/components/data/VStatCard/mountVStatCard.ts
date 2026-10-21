import type { VStatCardProps, VStatCardSize, VStatCardTrend, VStatCardVariant } from './VStatCard.types'

const SIZES: VStatCardSize[] = ['sm', 'md', 'lg']
const VARIANTS: VStatCardVariant[] = ['plain', 'outlined', 'elevated', 'tinted']
const TRENDS: VStatCardTrend[] = ['up', 'down', 'neutral']

export function inferTrend(delta: string | number | undefined): VStatCardTrend {
  if (delta === undefined || delta === '') return 'neutral'
  const text = String(delta).trim()
  if (text.startsWith('-') || text.startsWith('−')) return 'down'
  const numeric = Number.parseFloat(text.replace(/[^\d.-]/g, ''))
  if (Number.isNaN(numeric) || numeric === 0) return 'neutral'
  return numeric > 0 ? 'up' : 'down'
}

export function mountVStatCard(props: VStatCardProps) {
  const size = SIZES.includes(props.size as VStatCardSize) ? (props.size as VStatCardSize) : 'md'
  const variant = VARIANTS.includes(props.variant as VStatCardVariant) ? (props.variant as VStatCardVariant) : 'outlined'
  const trend = TRENDS.includes(props.trend as VStatCardTrend) ? (props.trend as VStatCardTrend) : inferTrend(props.delta)
  const hasDelta = props.delta !== undefined && props.delta !== ''

  return {
    size,
    variant,
    trend,
    hasDelta,
    deltaText: hasDelta ? String(props.delta).replace(/^[-−+]/, '') : '',
    stats: props.stats ?? [],
  } as const
}
