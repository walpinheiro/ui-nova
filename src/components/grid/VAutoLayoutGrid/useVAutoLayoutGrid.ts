import { computed } from 'vue'
import type { VAutoLayoutGridProps } from './VAutoLayoutGrid.types'
import { mountVAutoLayoutGrid } from './mountVAutoLayoutGrid'

export function useVAutoLayoutGrid(props: VAutoLayoutGridProps) {
  const config = computed(() => mountVAutoLayoutGrid(props))

  const rootStyle = computed(() => ({
    '--v-grid-min-item-width': `${config.value.minItemWidth}px`,
    '--v-auto-layout-gap': config.value.gapCss,
    '--v-auto-layout-row-gap': config.value.rowGapCss,
    '--v-auto-layout-column-gap': config.value.columnGapCss,
    gap: config.value.gapCss,
    rowGap: config.value.rowGapCss,
    columnGap: config.value.columnGapCss,
  }))

  const rootAttrs = computed(() => ({
    class: ['v-auto-layout-grid', `v-auto-layout-grid--${config.value.size}`],
    role: config.value.selectable ? 'grid' : 'list',
    'aria-label': props.ariaLabel ?? 'Auto layout grid',
    'data-test-id': 'v-auto-layout-grid',
    'data-behavior': config.value.behavior,
    'data-size': config.value.size,
    'data-equal-height': config.value.behavior === 'equal-height' ? 'true' : undefined,
    style: rootStyle.value,
  }))

  return { config, rootAttrs }
}
