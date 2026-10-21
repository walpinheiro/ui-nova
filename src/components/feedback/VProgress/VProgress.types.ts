export type VProgressSize = 'sm' | 'md' | 'lg'

export type VProgressVariant = 'linear' | 'circular'

export type VProgressState = 'determinate' | 'indeterminate' | 'success' | 'error'

export interface VProgressProps {
  /** Linear bar or circular ring display. */
  variant?: VProgressVariant
  /** Visual density of the track and indicator. */
  size?: VProgressSize
  /** Completion percentage from 0 to 100. */
  value?: number
  /** Visual and semantic progress state. */
  state?: VProgressState
  /** Visible label text, auto percentage, or hidden when `false`. */
  label?: string | boolean
  /** Accessible name override for the progressbar. */
  ariaLabel?: string
  /** Root anatomy test id override. */
  dataTestId?: string
}
