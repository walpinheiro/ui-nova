import type { VTimelineItem, VTimelineItemState, VTimelineProps, VTimelineSize, VTimelineVariant } from './VTimeline.types'

const VARIANTS: VTimelineVariant[] = ['steps', 'feed']
const SIZES: VTimelineSize[] = ['sm', 'md']
const STATES: VTimelineItemState[] = ['complete', 'current', 'upcoming', 'error']

export interface VTimelineSection {
  key: string
  label?: string
  items: Array<VTimelineItem & { state: VTimelineItemState; last: boolean }>
}

export function mountVTimeline(props: VTimelineProps) {
  const variant = VARIANTS.includes(props.variant as VTimelineVariant) ? (props.variant as VTimelineVariant) : 'steps'
  const size = SIZES.includes(props.size as VTimelineSize) ? (props.size as VTimelineSize) : 'md'
  const items = (props.items ?? []).map((item, index, all) => ({
    ...item,
    state: STATES.includes(item.state as VTimelineItemState) ? (item.state as VTimelineItemState) : 'complete',
    last: index === all.length - 1,
  }))

  const sections: VTimelineSection[] = []
  for (const item of items) {
    const current = sections[sections.length - 1]
    if (variant === 'feed' && (!current || current.label !== item.group)) {
      sections.push({ key: `${sections.length}-${item.group ?? ''}`, label: item.group, items: [item] })
    } else if (!current) {
      sections.push({ key: 'all', items: [item] })
    } else {
      current.items.push(item)
    }
  }

  return { variant, size, items, sections } as const
}
