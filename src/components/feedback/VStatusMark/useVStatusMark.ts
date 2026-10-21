import { computed } from 'vue'
import type { VStatusMarkProps } from './VStatusMark.types'
import { mountVStatusMark } from './mountVStatusMark'

export function useVStatusMark(props: VStatusMarkProps) {
  const config = computed(() => mountVStatusMark(props))
  const isExpressive = computed(() => props.motion === 'expressive')

  const rootAttrs = computed(() => ({
    class: [
      'v-status-mark',
      `v-status-mark--${config.value.size}`,
      `v-status-mark--${config.value.state}`,
      {
        'v-status-mark--expressive': isExpressive.value,
        'v-status-mark--spinning': config.value.spinning,
      },
    ],
    role: 'status',
    'aria-live': 'polite' as const,
    'aria-label': config.value.label,
    'data-test-id': 'v-status-mark',
    'data-state': config.value.state,
    'data-size': config.value.size,
  }))

  return { config, rootAttrs }
}
