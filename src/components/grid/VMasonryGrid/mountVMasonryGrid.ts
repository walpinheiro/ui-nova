import type { IconifyIcon } from '@iconify/types'
import heartIcon from '@iconify-icons/keyline-icons/heart'
import checkIcon from '@iconify-icons/keyline-icons/check'
import imageIcon from '@iconify-icons/keyline-icons/image'
import type { VMasonryGridProps } from './VMasonryGrid.types'
import { resolveCols, resolveGapCss, type VGridCols } from '../shared/gridUtils'

export const MASONRY_UI_ICONS = {
  heart: heartIcon,
  check: checkIcon,
  image: imageIcon,
} satisfies Record<string, IconifyIcon>

export function mountVMasonryGrid(props: VMasonryGridProps, viewportWidth = 1024) {
  const cols: VGridCols = props.cols ?? 3
  const gap = props.gap ?? 6
  const resolvedCols = resolveCols(cols, viewportWidth)

  return {
    cols,
    gap,
    resolvedCols,
    gapCss: resolveGapCss(gap),
    variant: props.variant ?? 'default',
    loading: Boolean(props.loading),
    empty: Boolean(props.empty),
  } as const
}
