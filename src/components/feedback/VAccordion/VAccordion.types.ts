import type { ComputedRef, Ref } from 'vue'

export type VAccordionSize = 'sm' | 'md' | 'lg'
export type VAccordionVariant = 'default' | 'divided' | 'bordered' | 'leading-icon'
export type VAccordionValue = string | number
export type VAccordionModelValue = VAccordionValue | VAccordionValue[] | null

export interface VAccordionProps {
  modelValue?: VAccordionModelValue
  multiple?: boolean
  size?: VAccordionSize
  variant?: VAccordionVariant
  ariaLabel?: string
}

export interface VAccordionItemProps {
  /** Stable DOM/test slug. It also becomes the value when `value` is omitted. */
  id?: string
  value?: VAccordionValue
  title?: string
  ariaLabel?: string
}

export interface VAccordionConfig {
  size: VAccordionSize
  variant: VAccordionVariant
  multiple: boolean
}

export interface VAccordionItemRegistration {
  value: ComputedRef<VAccordionValue>
  triggerRef: Ref<HTMLButtonElement | null>
}
