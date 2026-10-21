import type { IconifyIcon } from '@iconify/types'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VTagProps, VTagSize, VTagVariant } from './VTag.types'

const SIZES: VTagSize[] = ['sm', 'md']
const VARIANTS: VTagVariant[] = ['default', 'outline', 'overlay', 'soft']

export const V_TAG_PLUS_ICON: IconifyIcon = plusIcon
export const V_TAG_REMOVE_ICON: IconifyIcon = xIcon

export function mountVTag(props: VTagProps) {
  const size: VTagSize = SIZES.includes(props.size as VTagSize) ? (props.size as VTagSize) : 'md'
  const variant: VTagVariant = VARIANTS.includes(props.variant as VTagVariant)
    ? (props.variant as VTagVariant)
    : 'default'
  const removable = Boolean(props.removable)
  const disabled = Boolean(props.disabled)
  const interactive = props.interactive == null ? !removable : Boolean(props.interactive)

  return {
    size,
    variant,
    removable,
    disabled,
    interactive,
    removeIcon: V_TAG_REMOVE_ICON,
    plusIcon: V_TAG_PLUS_ICON,
    testId: props.dataTestId ?? 'v-tag',
    removeTestId: props.removeTestId ?? 'v-tag-remove',
  } as const
}
