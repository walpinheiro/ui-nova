import { computed, useId } from 'vue'
import type { VSectionProps } from './VSection.types'
import { mountVSection } from './mountVSection'

export function useVSection(props: VSectionProps) {
  const config = computed(() => mountVSection(props))
  const headingId = useId()
  const hasHeading = computed(() => Boolean(props.title))

  const rootAttrs = computed(() => ({
    class: [
      'v-section',
      `v-section--${config.value.size}`,
      `v-section--${config.value.variant}`,
    ],
    'aria-labelledby': hasHeading.value ? headingId : undefined,
    'aria-label': !hasHeading.value ? (props.ariaLabel ?? undefined) : props.ariaLabel,
    'data-test-id': 'v-section',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': 'default',
  }))

  return { config, headingId, rootAttrs }
}
