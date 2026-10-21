export type VSectionSize = 'sm' | 'md' | 'lg'
export type VSectionVariant = 'default' | 'elevated' | 'bordered' | 'borderless' | 'tinted'
export type VSectionHeadingLevel = '2' | '3'

export interface VSectionProps {
  title?: string
  description?: string
  icon?: string
  headingLevel?: VSectionHeadingLevel
  size?: VSectionSize
  variant?: VSectionVariant
  ariaLabel?: string
}
