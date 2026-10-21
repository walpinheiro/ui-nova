export type VPopoverSize = 'sm' | 'md' | 'lg'
export type VPopoverPlacement = 'top' | 'bottom' | 'left' | 'right'
export type VPopoverTrigger = 'click' | 'hover' | 'focus'
export type VPopoverCloseReason = 'close' | 'escape' | 'outside' | 'trigger' | 'hover' | 'focus'

export interface VPopoverProps {
  open?: boolean
  modelValue?: boolean
  disabled?: boolean
  size?: VPopoverSize
  placement?: VPopoverPlacement
  trigger?: VPopoverTrigger
  closable?: boolean
  showArrow?: boolean
  title?: string
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
}

export interface VPopoverEmits {
  'update:open': [value: boolean]
  'update:modelValue': [value: boolean]
  'open-change': [value: boolean]
  close: [reason: VPopoverCloseReason]
  dismiss: [reason: Exclude<VPopoverCloseReason, 'close'>]
}
