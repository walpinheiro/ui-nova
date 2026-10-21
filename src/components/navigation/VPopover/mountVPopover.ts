import type { VPopoverPlacement, VPopoverProps, VPopoverSize, VPopoverTrigger } from './VPopover.types'

export interface VPopoverConfig {
  open: boolean
  disabled: boolean
  size: VPopoverSize
  placement: VPopoverPlacement
  trigger: VPopoverTrigger
  closable: boolean
  showArrow: boolean
  title: string
}

export function mountVPopover(props: VPopoverProps): VPopoverConfig {
  return {
    open: Boolean(props.open ?? props.modelValue),
    disabled: Boolean(props.disabled),
    size: props.size ?? 'md',
    placement: props.placement ?? 'bottom',
    trigger: props.trigger ?? 'click',
    closable: props.closable ?? true,
    showArrow: props.showArrow ?? true,
    title: props.title ?? '',
  }
}
