import { computed } from 'vue'
import type { VMasonryGridProps } from './VMasonryGrid.types'
import { mountVMasonryGrid } from './mountVMasonryGrid'
import { resolveGapCss, useGridCols } from '../shared/gridUtils'

export function useVMasonryGrid(props: VMasonryGridProps) {
  const colsRef = computed(() => props.cols ?? 3)
  const { resolvedCols } = useGridCols(colsRef)
  const config = computed(() => mountVMasonryGrid(props, resolvedCols.value))

  const rootStyle = computed(() => ({
    '--v-masonry-cols': String(resolvedCols.value),
    '--v-masonry-gap': resolveGapCss(props.gap ?? 6),
    columnCount: resolvedCols.value,
    columnGap: resolveGapCss(props.gap ?? 6),
  }))

  const rootAttrs = computed(() => ({
    class: [
      'v-masonry-grid',
      `v-masonry-grid--${config.value.variant}`,
      config.value.loading ? 'v-masonry-grid--loading' : null,
      config.value.empty ? 'v-masonry-grid--empty' : null,
    ],
    role: 'list',
    'aria-label': props.ariaLabel ?? 'Masonry grid',
    'aria-busy': config.value.loading || undefined,
    'data-test-id': 'masonry-grid',
    'data-cols': String(resolvedCols.value),
    'data-state': config.value.loading ? 'loading' : config.value.empty ? 'empty' : 'default',
    style: rootStyle.value,
  }))

  return { config, rootAttrs, resolvedCols }
}
