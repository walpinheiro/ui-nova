export type VResizablePanelSizePreset = 'sm' | 'md' | 'lg'
/** v-model:size — número (px) ou preset: sm=240, md=320, lg=480 (spec §3). */
export type VResizablePanelSize = number | VResizablePanelSizePreset
export type VResizablePanelVariant = 'left' | 'right' | 'bottom' | 'collapsible'
export type VResizablePanelOrientation = 'vertical' | 'horizontal'

export const V_RESIZABLE_PANEL_PRESETS = { sm: 240, md: 320, lg: 480 } as const
export const V_RESIZABLE_PANEL_COLLAPSED_SIZE = 48
export const V_RESIZABLE_PANEL_KEYBOARD_STEP = 16

export interface VResizablePanelProps {
  /** v-model:size — largura (vertical) ou altura (horizontal) em px, ou preset sm|md|lg. */
  size?: VResizablePanelSize
  /** vertical = sidebar (handle vertical); horizontal = bottom drawer (handle horizontal). */
  orientation?: VResizablePanelOrientation
  /** Tamanho mínimo permitido em px (spec §2 parte 4). */
  min?: number
  /** Tamanho máximo permitido em px (spec §2 parte 5). */
  max?: number
  /** Exibe o trigger de colapso ‹/› (spec §2 parte 6). */
  collapsible?: boolean
  variant?: VResizablePanelVariant
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

export type VResizablePanelEmits = {
  'update:size': [size: number]
  resize: [size: number]
  collapse: []
  expand: []
}

export type VResizablePanelEmitFn = {
  (e: 'update:size', size: number): void
  (e: 'resize', size: number): void
  (e: 'collapse'): void
  (e: 'expand'): void
}
