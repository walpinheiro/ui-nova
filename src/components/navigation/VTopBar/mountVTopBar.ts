import type { VTopBarItem, VTopBarProps, VTopBarVariant } from './VTopBar.types'

const VARIANTS: VTopBarVariant[] = ['default', 'primary', 'subtle', 'app']

export function mountVTopBar(props: VTopBarProps) {
  const variant: VTopBarVariant = VARIANTS.includes(props.variant as VTopBarVariant)
    ? (props.variant as VTopBarVariant)
    : 'default'
  const items: VTopBarItem[] = props.items ?? []

  return {
    size: props.size ?? 'md',
    variant,
    title: props.title ?? '',
    items,
    bordered: props.bordered ?? true,
    sticky: props.sticky ?? false,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
