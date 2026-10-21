export type VDialogSize = 'sm' | 'md' | 'lg'
export type VDialogVariant = 'basic' | 'confirmation' | 'alert' | 'form' | 'fullscreen'
export type VDialogIntent = 'neutral' | 'destructive' | 'success'

export interface VDialogProps {
  /** Controlled visibility for the native `v-model` contract. */
  modelValue?: boolean
  /** `open` is an explicit alias for consumers that prefer `v-model:open`. */
  open?: boolean
  title?: string
  description?: string
  showClose?: boolean
  /** Backdrop click and Escape dismiss the dialog when enabled. */
  dismissible?: boolean
  /** Prevents backdrop and Escape dismissal in confirmation mode. */
  persistent?: boolean
  disabled?: boolean
  loading?: boolean
  size?: VDialogSize
  variant?: VDialogVariant
  /** Semantic intent for built-in confirmation actions. */
  intent?: VDialogIntent
  cancelText?: string
  confirmText?: string
  ariaLabel?: string
  ariaDescribedby?: string
  closeLabel?: string
}

export type VDialogEmits = {
  'update:modelValue': [value: boolean]
  'update:open': [value: boolean]
  'open-change': [value: boolean]
  close: []
  dismiss: []
  confirm: [event: MouseEvent]
  cancel: []
}
