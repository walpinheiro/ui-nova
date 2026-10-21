import type { IconifyIcon } from '@iconify/types'
import gripIcon from '@iconify-icons/keyline-icons/grip-vertical'
import xIcon from '@iconify-icons/keyline-icons/x'
import lockIcon from '@iconify-icons/keyline-icons/lock'
import type { VDashboardWidgetGridProps } from './VDashboardWidgetGrid.types'
import { resolveGapCss } from '../shared/gridUtils'

export const DASHBOARD_WIDGET_GRID_UI_ICONS = {
  grip: gripIcon,
  close: xIcon,
  lock: lockIcon,
} satisfies Record<string, IconifyIcon>

export function mountVDashboardWidgetGrid(props: VDashboardWidgetGridProps) {
  return {
    cols: props.cols ?? 12,
    rowHeight: props.rowHeight ?? 128,
    gap: props.gap ?? 4,
    gapCss: resolveGapCss(props.gap ?? 4),
    variant: props.variant ?? 'freeform',
    editMode: Boolean(props.editMode),
    layout: props.layout ?? [],
  } as const
}
