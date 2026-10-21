export type VBannerSize = 'sm' | 'md' | 'lg'
export type VBannerVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral'

export interface VBannerProps {
  /** Controls visibility when the banner is used with v-model. */
  modelValue?: boolean
  title?: string
  description?: string
  variant?: VBannerVariant
  size?: VBannerSize
  closable?: boolean
  closeOnEscape?: boolean
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  dismissLabel?: string
  dismissedText?: string
}
