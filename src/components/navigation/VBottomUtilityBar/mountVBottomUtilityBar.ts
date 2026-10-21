import type { VBottomUtilityBarProps, VBottomUtilityBarSize } from './VBottomUtilityBar.types'

const SIZES: VBottomUtilityBarSize[] = ['sm', 'md', 'lg']

export function mountVBottomUtilityBar(props: VBottomUtilityBarProps) {
  const size: VBottomUtilityBarSize = SIZES.includes(props.size as VBottomUtilityBarSize)
    ? (props.size as VBottomUtilityBarSize)
    : 'md'

  return {
    size,
    variant: props.variant ?? 'default',
    fixed: props.fixed !== false,
    safeArea: props.safeArea !== false,
    bordered: props.bordered !== false,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
