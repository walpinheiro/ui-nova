export type VPanelSize = 'sm' | 'md' | 'lg'
export type VPanelVariant = 'default' | 'bordered' | 'elevated' | 'filled'
export type VPanelHeadingLevel = '2' | '3'

export interface VPanelProps {
  title?: string
  description?: string
  icon?: string
  headingLevel?: VPanelHeadingLevel
  size?: VPanelSize
  variant?: VPanelVariant
  /** Controls visibility. `v-model:open` (primary) — `modelValue` accepted as alias. */
  open?: boolean
  modelValue?: boolean
  /** When true the panel becomes keyboard-focusable (tabindex 0). */
  interactive?: boolean
  ariaLabel?: string
}
