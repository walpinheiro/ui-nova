export type VDrawerPlacement = 'right' | 'left' | 'top' | 'bottom'
export type VDrawerSize = 'sm' | 'md' | 'lg'
export type VDrawerMotionState = 'closed' | 'opening' | 'open' | 'closing'
/** @deprecated Visual variants are not part of the drawer poster; kept for backward compatibility. */
export type VDrawerVariant = 'default' | 'primary' | 'subtle'

export interface VDrawerProps {
  /** Controlled visibility (`v-model`). */
  modelValue?: boolean
  /** Alias for `modelValue` (`v-model:open`). */
  open?: boolean
  title?: string
  /** Edge the drawer slides in from (design poster default: right). */
  placement?: VDrawerPlacement
  /** Alias for `placement`. */
  side?: VDrawerPlacement
  /** Width preset for side drawers (sm 320 / md 480 / lg 640). */
  size?: VDrawerSize
  /** Alias for `size` from the design doc code snippet (`width="md"`). */
  width?: VDrawerSize
  showClose?: boolean
  /** Backdrop click and Escape dismiss the drawer. */
  dismissible?: boolean
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  ariaDescribedby?: string
  closeLabel?: string
  variant?: VDrawerVariant
}

export type VDrawerEmits = {
  'update:modelValue': [value: boolean]
  'update:open': [value: boolean]
  'open-change': [value: boolean]
  close: []
  dismiss: []
}
