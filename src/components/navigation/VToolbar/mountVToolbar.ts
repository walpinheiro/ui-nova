import type { VToolbarProps, VToolbarSize, VToolbarVariant } from './VToolbar.types'

const SIZES: VToolbarSize[] = ['sm', 'md', 'lg']
const VARIANTS: VToolbarVariant[] = ['default', 'compact', 'floating', 'editor', 'segmented']

export function mountVToolbar(props: VToolbarProps) {
  const size: VToolbarSize = SIZES.includes(props.size as VToolbarSize) ? (props.size as VToolbarSize) : 'md'
  const rawVariant = props.variant as string | undefined
  const legacy: Record<string, VToolbarVariant> = { primary: 'floating', subtle: 'compact' }
  const variant: VToolbarVariant = rawVariant && legacy[rawVariant]
    ? legacy[rawVariant]
    : VARIANTS.includes(props.variant as VToolbarVariant)
      ? (props.variant as VToolbarVariant)
      : 'default'

  return {
    size,
    variant,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
