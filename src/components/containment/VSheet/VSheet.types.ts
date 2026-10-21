export type VSheetSide = 'right' | 'left' | 'bottom' | 'top'
export type VSheetSize = 'sm' | 'md' | 'lg' | 'xl'
export type VSheetMotionState = 'closed' | 'opening' | 'open' | 'closing'

export interface VSheetTestIds {
  root?: string
  backdrop?: string
  panel?: string
  header?: string
  title?: string
  content?: string
  footer?: string
  close?: string
  divider?: string
  prepend?: string
}

export interface VSheetProps {
  /** Controls visibility. `v-model:open` (primary) — `modelValue` accepted as alias. */
  open?: boolean
  modelValue?: boolean
  /** Edge the sheet slides in from. */
  side?: VSheetSide
  /** Width preset for side sheets (sm 320 / md 480 / lg 640 / xl 800). */
  size?: VSheetSize
  /** Immersive full-viewport height (bottom → 100vh; side sheets keep edge-to-edge height). */
  fullHeight?: boolean
  title?: string
  description?: string
  showClose?: boolean
  closeLabel?: string
  /** Backdrop click + Escape dismiss the sheet. */
  dismissible?: boolean
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  ariaDescribedby?: string
  /** Optional root/surface class for composed surfaces (e.g. VDrawer). */
  rootClass?: string
  surfaceClass?: string
  testIds?: VSheetTestIds
  /** Extra data-* attributes on the root wrapper (for composed surfaces like VDrawer). */
  rootDataAttrs?: Record<string, string | undefined>
}

export type VSheetEmits = {
  'update:open': [value: boolean]
  'update:modelValue': [value: boolean]
  'open-change': [value: boolean]
  close: []
  dismiss: []
}
