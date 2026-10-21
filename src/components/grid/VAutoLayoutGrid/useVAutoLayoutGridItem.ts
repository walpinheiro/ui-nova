import { computed } from 'vue'
import type { VAutoLayoutGridItemProps } from './VAutoLayoutGrid.types'

export function useVAutoLayoutGridItem(props: VAutoLayoutGridItemProps) {
  const testId = computed(() =>
    props.id ? `v-auto-layout-grid-item-${props.id}` : 'v-auto-layout-grid-item',
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-auto-layout-grid__item',
      props.selected ? 'v-auto-layout-grid__item--selected' : null,
      props.disabled ? 'v-auto-layout-grid__item--disabled' : null,
      props.dragging ? 'v-auto-layout-grid__item--dragging' : null,
      props.interactive !== false ? 'v-auto-layout-grid__item--interactive' : null,
    ],
    role: 'gridcell',
    tabindex: props.disabled || props.interactive === false ? -1 : 0,
    'data-test-id': testId.value,
    'data-selected': props.selected ? 'true' : 'false',
    'data-disabled': props.disabled ? 'true' : undefined,
    'data-dragging': props.dragging ? 'true' : undefined,
    'aria-selected': props.selected,
    'aria-disabled': props.disabled || undefined,
    style: rootStyle.value,
  }))

  const rootStyle = computed(() => {
    const style: Record<string, string> = {}
    if (props.colSpan && props.colSpan > 1) style.gridColumn = `span ${Math.floor(props.colSpan)}`
    if (props.rowSpan && props.rowSpan > 1) style.gridRow = `span ${Math.floor(props.rowSpan)}`
    return style
  })

  return { rootAttrs, rootStyle, testId }
}
