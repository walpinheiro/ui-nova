import { computed } from 'vue'
import type { VMasonryItemProps } from './VMasonryGrid.types'

export function useVMasonryItem(props: VMasonryItemProps) {
  const testId = computed(() => (props.id ? `masonry-tile-${props.id}` : 'masonry-tile'))

  const rootAttrs = computed(() => ({
    class: [
      'v-masonry-grid__tile',
      props.selected ? 'v-masonry-grid__tile--selected' : null,
      props.interactive !== false ? 'v-masonry-grid__tile--interactive' : null,
    ],
    role: 'listitem',
    tabindex: props.interactive !== false ? 0 : undefined,
    'data-test-id': testId.value,
    'data-selected': props.selected ? 'true' : undefined,
    'aria-label': props.title,
  }))

  return { rootAttrs, testId }
}
