import type { VButtonProps, VButtonShape, VButtonSize, VButtonType, VButtonVariant } from './VButton.types'

const SIZES: VButtonSize[] = ['sm', 'md', 'lg']
const SHAPES: VButtonShape[] = ['default', 'pill']
const VARIANTS: VButtonVariant[] = ['primary', 'secondary', 'ghost', 'outline', 'destructive', 'inverse', 'icon', 'loading']
const TYPES: VButtonType[] = ['button', 'submit', 'reset']

export function mountVButton(props: VButtonProps) {
  const size: VButtonSize = SIZES.includes(props.size as VButtonSize) ? (props.size as VButtonSize) : 'md'
  const shape: VButtonShape = SHAPES.includes(props.shape as VButtonShape) ? (props.shape as VButtonShape) : 'default'
  const raw = props.variant as string | undefined
  // Back-compat: 'default' e 'subtle' legados mapeiam para primary e ghost.
  const legacy: Record<string, VButtonVariant> = { default: 'primary', subtle: 'ghost' }
  const variant: VButtonVariant =
    (raw && legacy[raw]) ||
    (VARIANTS.includes(raw as VButtonVariant) ? (raw as VButtonVariant) : 'primary')
  const type: VButtonType = TYPES.includes(props.type as VButtonType) ? (props.type as VButtonType) : 'button'
  const loading = Boolean(props.loading || variant === 'loading')
  return {
    size,
    shape,
    variant,
    type,
    loading,
    disabled: Boolean(props.disabled || loading),
  } as const
}
