import type { VSpinnerColor, VSpinnerProps, VSpinnerSize, VSpinnerVariant } from './VSpinner.types'

const SIZES: VSpinnerSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
const VARIANTS: VSpinnerVariant[] = ['circular', 'dots', 'ring', 'inline', 'lattice']
const COLORS: VSpinnerColor[] = ['default', 'primary']

export function mountVSpinner(props: VSpinnerProps) {
  const size = SIZES.includes(props.size as VSpinnerSize) ? (props.size as VSpinnerSize) : 'md'
  const variant = VARIANTS.includes(props.variant as VSpinnerVariant)
    ? (props.variant as VSpinnerVariant)
    : 'circular'
  const color = COLORS.includes(props.color as VSpinnerColor)
    ? (props.color as VSpinnerColor)
    : 'primary'
  const disabled = Boolean(props.disabled)
  const loading = props.loading ?? true
  const paused = Boolean(props.paused)
  const spinning = loading && !disabled && !paused

  const latticeSize = props.latticeSize === 4 ? 4 : 3
  const latticeCells = latticeSize * latticeSize

  return {
    size,
    variant,
    color,
    disabled,
    loading,
    paused,
    spinning,
    label: props.label ?? 'Loading',
    verb: props.verb ?? props.label ?? 'Loading',
    latticeSize,
    latticeCells,
    resolved: props.resolved ?? null,
    state: disabled ? 'disabled' : paused ? 'idle' : spinning ? 'spinning' : 'idle',
  } as const
}
