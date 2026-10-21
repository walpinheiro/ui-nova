import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import type { VCardGridProps } from './VCardGrid.types'
import { mountVCardGrid, resolveCardGridCols } from './mountVCardGrid'
import { resolveGapCss } from '../shared/gridUtils'

export function useVCardGrid(props: VCardGridProps) {
  const width = ref(typeof window === 'undefined' ? 1024 : window.innerWidth)
  if (getCurrentInstance()) {
    const onResize = () => {
      width.value = window.innerWidth
    }
    onMounted(() => {
      onResize()
      window.addEventListener('resize', onResize, { passive: true })
    })
    onUnmounted(() => window.removeEventListener('resize', onResize))
  }
  const resolvedCols = computed(() => resolveCardGridCols(props.cols ?? 3, width.value))
  const config = computed(() => mountVCardGrid(props, width.value))

  const autoFill = computed(() => !!props.minCardWidth && props.minCardWidth > 0)

  const rootStyle = computed(() => ({
    '--v-cardgrid-cols': String(resolvedCols.value),
    '--v-cardgrid-gap': resolveGapCss(props.gap ?? 6),
    gridTemplateColumns: autoFill.value
      ? `repeat(auto-fill, minmax(min(100%, ${props.minCardWidth}px), 1fr))`
      : `repeat(${resolvedCols.value}, minmax(0, 1fr))`,
    gap: resolveGapCss(props.gap ?? 6),
  }))

  const rootAttrs = computed(() => ({
    class: 'v-cardgrid',
    role: 'list',
    'aria-label': props.ariaLabel ?? 'Card grid',
    'data-test-id': 'v-cardgrid',
    'data-cols': autoFill.value ? 'auto' : String(resolvedCols.value),
    'data-min-card-width': autoFill.value ? String(props.minCardWidth) : undefined,
    style: rootStyle.value,
  }))

  return { config, rootAttrs, resolvedCols }
}
