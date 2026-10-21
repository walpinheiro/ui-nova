export type VTagSize = 'sm' | 'md'
export type VTagVariant = 'default' | 'outline' | 'overlay' | 'soft'

export interface VTagProps {
  size?: VTagSize
  variant?: VTagVariant
  /** Action tag: native button. Omit for auto — true unless `removable`. */
  interactive?: boolean | null
  selected?: boolean
  disabled?: boolean
  removable?: boolean
  leaving?: boolean
  ariaLabel?: string
  removeLabel?: string
  dataTestId?: string
  removeTestId?: string
}

export interface VTagEmits {
  click: [event: MouseEvent]
  remove: [event: MouseEvent]
}
