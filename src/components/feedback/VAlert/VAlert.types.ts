export type VAlertSize = 'sm' | 'md' | 'lg'
export type VAlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral'
export type VAlertLayout = 'inline' | 'banner'

export interface VAlertProps {
  /** Controls visibility when supplied. Without it, the alert is internally dismissible. */
  modelValue?: boolean
  title?: string
  description?: string
  disabled?: boolean
  loading?: boolean
  dismissible?: boolean
  size?: VAlertSize
  variant?: VAlertVariant
  /** @deprecated VAlert always fills its container. For a page-wide message use `VBanner`. */
  layout?: VAlertLayout
  ariaLabel?: string
  dismissLabel?: string
}

export type VAlertEmit = {
  (event: 'dismiss'): void
  (event: 'update:modelValue', value: boolean): void
}
