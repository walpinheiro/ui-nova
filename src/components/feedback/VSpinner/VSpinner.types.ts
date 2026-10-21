export type VSpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type VSpinnerVariant = 'circular' | 'dots' | 'ring' | 'inline' | 'lattice'
export type VSpinnerColor = 'default' | 'primary'

export interface VSpinnerProps {
  /** Visual style of the indicator. */
  variant?: VSpinnerVariant
  /** Indicator color treatment. */
  color?: VSpinnerColor
  /** Diameter of the spinner. */
  size?: VSpinnerSize
  /** Accessible loading text announced to assistive technology. */
  label?: string
  /** Optional override for the accessible name. */
  ariaLabel?: string
  /** Freezes animation and marks the control unavailable. */
  disabled?: boolean
  /** Exposes a busy state for async contexts. */
  loading?: boolean
  /** Pauses animation while keeping the indicator visible. */
  paused?: boolean
  /** Lattice Loader: grid dimension (3 or 4). */
  latticeSize?: 3 | 4
  /** Lattice Loader: status verb beside the grid. */
  verb?: string
  /** Lattice Loader: resolved state. */
  resolved?: 'success' | 'error' | null
}
