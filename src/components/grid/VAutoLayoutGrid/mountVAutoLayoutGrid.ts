import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import type { VAutoLayoutGridProps } from './VAutoLayoutGrid.types'

export const AUTO_LAYOUT_GRID_UI_ICONS = {
  check: checkIcon,
} satisfies Record<string, IconifyIcon>

const SIZE_GAP_CSS: Record<string, string> = {
  compact: 'var(--v-space-2)',
  medium: 'var(--v-space-4)',
  spacious: 'var(--v-space-6)',
}

/** Gap props are expressed in pixels; when omitted, `size` picks the token. */
export function mountVAutoLayoutGrid(props: VAutoLayoutGridProps) {
  const size = props.size ?? 'medium'
  const base = props.gap !== undefined ? `${props.gap}px` : (SIZE_GAP_CSS[size] ?? SIZE_GAP_CSS.medium)
  const rowGapCss = props.rowGap !== undefined ? `${props.rowGap}px` : base
  const columnGapCss = props.columnGap !== undefined ? `${props.columnGap}px` : base

  return {
    minItemWidth: props.minItemWidth ?? 280,
    gapCss: base,
    rowGapCss,
    columnGapCss,
    behavior: props.behavior ?? 'auto-fit',
    size,
    selectable: Boolean(props.selectable),
  } as const
}
