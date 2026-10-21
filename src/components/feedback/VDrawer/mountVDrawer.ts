import type { VDrawerPlacement, VDrawerProps, VDrawerSize } from './VDrawer.types'

const PLACEMENTS: VDrawerPlacement[] = ['right', 'left', 'top', 'bottom']
const SIZES: VDrawerSize[] = ['sm', 'md', 'lg']

export function mountVDrawer(props: VDrawerProps) {
  const rawPlacement = props.placement ?? props.side
  const placement: VDrawerPlacement = PLACEMENTS.includes(rawPlacement as VDrawerPlacement)
    ? (rawPlacement as VDrawerPlacement)
    : 'right'

  const rawSize = props.size ?? props.width
  const size: VDrawerSize = SIZES.includes(rawSize as VDrawerSize) ? (rawSize as VDrawerSize) : 'md'
  const open = Boolean(props.modelValue ?? props.open ?? false)

  return {
    placement,
    size,
    open,
    showClose: props.showClose ?? true,
    dismissible: props.dismissible ?? true,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
