import type { VCardGridGap, VCardGridProps } from './VCardGrid.types'
import { resolveGapCss, type VGridCols } from '../shared/gridUtils'

const BREAKPOINTS = [
  ['xs', 0],
  ['sm', 640],
  ['md', 768],
  ['lg', 1024],
  ['xl', 1280],
] as const

/** Resolve `cols` for a viewport width: the largest matching breakpoint wins (mobile-first). */
export function resolveCardGridCols(cols: VGridCols, width: number): number {
  if (typeof cols === 'number') return Math.max(1, cols)
  let resolved = cols.default ?? 1
  for (const [bp, min] of BREAKPOINTS) {
    if (width >= min && cols[bp] !== undefined) resolved = cols[bp]!
  }
  return Math.max(1, resolved)
}

export function mountVCardGrid(props: VCardGridProps, viewportWidth = 1024) {
  const cols: VGridCols = props.cols ?? 3
  const gap: VCardGridGap = props.gap ?? 6
  const resolvedCols = resolveCardGridCols(cols, viewportWidth)

  return {
    cols,
    gap,
    resolvedCols,
    gapCss: resolveGapCss(gap),
  } as const
}
