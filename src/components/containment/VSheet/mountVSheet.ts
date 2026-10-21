import type { VSheetProps, VSheetSide, VSheetSize } from './VSheet.types'

const SIDES: VSheetSide[] = ['right', 'left', 'bottom', 'top']
const SIZES: VSheetSize[] = ['sm', 'md', 'lg', 'xl']

export function mountVSheet(props: VSheetProps) {
  const side: VSheetSide = SIDES.includes(props.side as VSheetSide) ? (props.side as VSheetSide) : 'right'
  const size: VSheetSize = SIZES.includes(props.size as VSheetSize) ? (props.size as VSheetSize) : 'md'
  const open = Boolean(props.open ?? props.modelValue ?? true)
  return {
    side,
    size,
    open,
    fullHeight: Boolean(props.fullHeight),
    showClose: props.showClose ?? true,
    dismissible: props.dismissible ?? true,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
