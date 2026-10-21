import type { IconifyIcon } from '@iconify/types'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import type { VAccordionProps, VAccordionSize, VAccordionVariant } from './VAccordion.types'

export const V_ACCORDION_CHEVRON_DOWN: IconifyIcon = chevronDownIcon
export const V_ACCORDION_CHEVRON_RIGHT: IconifyIcon = chevronRightIcon

const SIZES: VAccordionSize[] = ['sm', 'md', 'lg']
const VARIANTS: VAccordionVariant[] = ['default', 'divided', 'bordered', 'leading-icon']

export function mountVAccordion(props: VAccordionProps) {
  const size = SIZES.includes(props.size as VAccordionSize) ? (props.size as VAccordionSize) : 'md'
  const rawVariant = props.variant as string | undefined
  const legacyVariant: Record<string, VAccordionVariant> = {
    primary: 'default',
    subtle: 'divided',
  }
  const variant =
    legacyVariant[rawVariant ?? ''] ??
    (VARIANTS.includes(rawVariant as VAccordionVariant) ? (rawVariant as VAccordionVariant) : 'default')

  return {
    size,
    variant,
    multiple: Boolean(props.multiple),
  } as const
}
