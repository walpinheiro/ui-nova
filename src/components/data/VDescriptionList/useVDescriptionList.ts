import { computed } from 'vue'
import type { VDescriptionListProps } from './VDescriptionList.types'
import { mountVDescriptionList } from './mountVDescriptionList'

export function useVDescriptionList(props: VDescriptionListProps) {
  const config = computed(() => mountVDescriptionList(props))

  const rootAttrs = computed(() => ({
    class: [
      'v-description-list',
      `v-description-list--${config.value.layout}`,
      `v-description-list--${config.value.size}`,
      { 'v-description-list--dividers': props.dividers },
    ],
    'aria-label': props.ariaLabel,
    'data-test-id': props.dataTestId ?? 'v-description-list',
    'data-layout': config.value.layout,
    style: { '--v-description-columns': String(config.value.columns) },
  }))

  return { config, rootAttrs }
}
