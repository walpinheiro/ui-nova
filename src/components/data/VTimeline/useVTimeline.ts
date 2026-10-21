import { computed } from 'vue'
import type { VTimelineProps } from './VTimeline.types'
import { mountVTimeline } from './mountVTimeline'

export function useVTimeline(props: VTimelineProps) {
  const config = computed(() => mountVTimeline(props))

  const rootAttrs = computed(() => ({
    class: ['v-timeline', `v-timeline--${config.value.variant}`, `v-timeline--${config.value.size}`],
    'aria-label': props.ariaLabel,
    'data-test-id': props.dataTestId ?? 'v-timeline',
    'data-variant': config.value.variant,
  }))

  return { config, rootAttrs }
}
