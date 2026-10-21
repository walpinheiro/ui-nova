import type { VSplitViewMode, VSplitViewOrientation, VSplitViewProps } from './VSplitView.types'

export interface VSplitViewMountConfig {
  orientation: VSplitViewOrientation
  mode: VSplitViewMode
  collapsible: boolean
  disabled: boolean
  /** Numero de panes derivado dos slots ou de sizes. Minimo 2. */
  paneCount: number
  defaultSizePx: number
  minSizePx: number
  maxSizePx: number
}

function toPx(value: number | string | undefined, fallback: number): number {
  if (value === undefined) return fallback
  if (typeof value === 'number') return value
  const parsed = Number.parseFloat(String(value))
  return Number.isFinite(parsed) ? parsed : fallback
}

/** Normalizacao deterministica: resolve orientacao/modo, panes e limites de tamanho. */
export function mountVSplitView(props: VSplitViewProps, slotPaneCount = 0): VSplitViewMountConfig {
  const orientation: VSplitViewOrientation = props.orientation ?? 'vertical'
  const collapsible = props.mode === 'collapsible' ? true : Boolean(props.collapsible)
  const mode: VSplitViewMode = props.mode ?? 'resizable'
  const sizesCount = Array.isArray(props.sizes) ? props.sizes.length : 0
  const paneCount = Math.max(2, sizesCount, slotPaneCount)
  const defaultSizePx = toPx(props.defaultSize, 280)
  const minSizePx = toPx(props.minSize, 200)
  const rawMax = toPx(props.maxSize, 600)
  const maxSizePx = Math.max(rawMax, minSizePx)
  return { orientation, mode, collapsible, disabled: Boolean(props.disabled), paneCount, defaultSizePx, minSizePx, maxSizePx }
}
