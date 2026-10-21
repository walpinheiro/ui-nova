import type { VGridCols } from '../shared/gridUtils'

export type VDashboardWidgetGridVariant = 'freeform' | 'analytics' | 'editorial' | 'compact'
export type VDashboardWidgetSize = 'sm' | 'md' | 'lg' | 'xl'

export interface VDashboardWidgetLayoutItem {
  id: string
  x: number
  y: number
  w: number
  h: number
  title?: string
  locked?: boolean
  disabled?: boolean
}

export interface VDashboardWidgetGridProps {
  /** Number of columns, or a breakpoint map resolved against the grid's own width (e.g. `{ default: 1, sm: 4, lg: 12 }`). */
  cols?: VGridCols
  rowHeight?: number
  gap?: number
  variant?: VDashboardWidgetGridVariant
  editMode?: boolean
  /** Controlled layout (`v-model:layout`). Items matched to widgets by `id` override the widget's own x/y/w/h. */
  layout?: VDashboardWidgetLayoutItem[]
  /** Label of the built-in toolbar "add" button. */
  addLabel?: string
  /** Hides the built-in toolbar (use the `toolbar` slot or external controls). */
  hideToolbar?: boolean
  ariaLabel?: string
}

export interface VDashboardWidgetProps {
  id?: string
  title?: string
  x?: number
  y?: number
  w?: number
  h?: number
  locked?: boolean
  disabled?: boolean
  focused?: boolean
  closable?: boolean
}

export interface VDashboardWidgetGridEmits {
  'update:layout': [layout: VDashboardWidgetLayoutItem[]]
  'update:editMode': [editMode: boolean]
  /** The toolbar "+ Add widget" button was pressed. */
  add: []
}

export interface VDashboardWidgetEmits {
  close: []
  move: [payload: { x: number; y: number }]
  resize: [payload: { w: number; h: number }]
}

export const DASHBOARD_WIDGET_GRID_KEY = Symbol('VDashboardWidgetGrid')

export interface VDashboardWidgetGridContext {
  cols: number
  rowHeight: number
  gap: number
  editMode: boolean
  draggingId: string | null
  setDraggingId: (id: string | null) => void
  /** Registers a widget; returns a function that unregisters it. */
  register: (rect: VDashboardWidgetLayoutItem) => () => void
  /** Props of a registered widget changed (uncontrolled placement). */
  syncFromProps: (rect: VDashboardWidgetLayoutItem) => void
  /** Current resolved cell of a widget. */
  getRect: (id: string) => { x: number; y: number; w: number; h: number; locked?: boolean } | undefined
  /** Live move/resize while interacting. Returns false when rejected (collides with locked). */
  update: (id: string, patch: Partial<{ x: number; y: number; w: number; h: number }>) => boolean
  /** Interaction finished: emits update:layout. */
  commit: () => void
  /** Pixel size of one cell (including its gap). */
  cellSize: () => { w: number; h: number }
}
