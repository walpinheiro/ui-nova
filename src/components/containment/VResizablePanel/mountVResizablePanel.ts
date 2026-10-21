import type { IconifyIcon } from '@iconify/types'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronLeftIcon from '@iconify-icons/keyline-icons/chevron-left'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import chevronUpIcon from '@iconify-icons/keyline-icons/chevron-up'
import type {
  VResizablePanelOrientation,
  VResizablePanelProps,
  VResizablePanelSize,
  VResizablePanelSizePreset,
  VResizablePanelVariant,
} from './VResizablePanel.types'
import { V_RESIZABLE_PANEL_PRESETS } from './VResizablePanel.types'

export const V_RESIZABLE_PANEL_UI_ICONS = {
  chevronLeft: chevronLeftIcon,
  chevronRight: chevronRightIcon,
  chevronUp: chevronUpIcon,
  chevronDown: chevronDownIcon,
} as const satisfies Record<string, IconifyIcon>

export interface VResizablePanelMountConfig {
  sizePx: number
  orientation: VResizablePanelOrientation
  minPx: number
  maxPx: number
  variant: VResizablePanelVariant
  disabled: boolean
  collapsible: boolean
}

export function resolveSizePx(size: VResizablePanelSize | undefined, fallback: VResizablePanelSizePreset = 'md'): number {
  if (typeof size === 'number' && Number.isFinite(size)) return Math.max(0, Math.round(size))
  const preset = (typeof size === 'string' ? size : fallback) as VResizablePanelSizePreset
  return V_RESIZABLE_PANEL_PRESETS[preset] ?? V_RESIZABLE_PANEL_PRESETS[fallback]
}

export function clampSizePx(value: number, min: number, max: number): number {
  return Math.min(Math.max(Math.round(value), min), max)
}

export function mountVResizablePanel(props: VResizablePanelProps): VResizablePanelMountConfig {
  const orientation = props.orientation ?? (props.variant === 'bottom' ? 'horizontal' : 'vertical')
  const variant: VResizablePanelVariant = props.variant ?? (orientation === 'horizontal' ? 'bottom' : 'left')
  const raw = resolveSizePx(props.size ?? 'md')
  const minPx = props.min ?? 0
  const maxPx = props.max ?? 1200
  return {
    sizePx: clampSizePx(raw, minPx, maxPx),
    orientation,
    minPx,
    maxPx,
    variant,
    disabled: Boolean(props.disabled || props.loading),
    collapsible: Boolean(props.collapsible || variant === 'collapsible'),
  } as const
}
