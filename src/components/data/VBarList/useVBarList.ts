import { computed } from 'vue'
import type { VBarListProps } from './VBarList.types'
import { mountVBarList } from './mountVBarList'

export function useVBarList(props: VBarListProps) {
  const config = computed(() => mountVBarList(props))

  const rootAttrs = computed(() => ({
    class: ['v-bar-list', `v-bar-list--${config.value.size}`, `v-bar-list--${config.value.layout}`],
    'aria-label': props.ariaLabel,
    'data-test-id': props.dataTestId ?? 'v-bar-list',
    'data-layout': config.value.layout,
  }))

  return { config, rootAttrs }
}
