import { computed, onMounted, onUnmounted, ref, unref, type MaybeRef } from 'vue'

export type VGridBreakpoint = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type VGridColsMap = Partial<Record<VGridBreakpoint, number>>
export type VGridCols = number | VGridColsMap

const BREAKPOINT_MIN: Record<Exclude<VGridBreakpoint, 'default'>, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

const BREAKPOINT_ORDER: Exclude<VGridBreakpoint, 'default'>[] = ['xl', 'lg', 'md', 'sm', 'xs']

export function resolveGapCss(gap: number): string {
  const known = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24]
  if (known.includes(gap)) return `var(--v-space-${gap})`
  return `${gap}px`
}

export function resolveCols(cols: VGridCols, width: number): number {
  if (typeof cols === 'number') return Math.max(1, cols)
  // Mobile-first: the largest breakpoint the width reaches wins (BREAKPOINT_ORDER is xl → xs).
  for (const bp of BREAKPOINT_ORDER) {
    if (width >= BREAKPOINT_MIN[bp] && cols[bp] !== undefined) {
      return Math.max(1, cols[bp]!)
    }
  }
  return Math.max(1, cols.default ?? 1)
}

export function useGridCols(cols: MaybeRef<VGridCols>) {
  const width = ref(1024)

  onMounted(() => {
    width.value = window.innerWidth
    const onResize = () => {
      width.value = window.innerWidth
    }
    window.addEventListener('resize', onResize, { passive: true })
    onUnmounted(() => window.removeEventListener('resize', onResize))
  })

  const resolvedCols = computed(() => resolveCols(unref(cols), width.value))

  return { resolvedCols, width }
}
