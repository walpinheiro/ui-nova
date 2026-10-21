import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronUpIcon from '@iconify-icons/keyline-icons/chevron-up'
import type { VColorPickerProps, VColorPickerSize, VColorPickerVariant } from './VColorPicker.types'

export const V_COLOR_PICKER_CHECK_ICON: IconifyIcon = checkIcon
export const V_COLOR_PICKER_CHEVRON_DOWN_ICON: IconifyIcon = chevronDownIcon
export const V_COLOR_PICKER_CHEVRON_UP_ICON: IconifyIcon = chevronUpIcon

export const V_COLOR_PICKER_DEFAULT_PRESETS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#22C55E', '#94A3B8']

const SIZES: VColorPickerSize[] = ['sm', 'md', 'lg']
const VARIANTS: VColorPickerVariant[] = ['popover', 'inline', 'hex', 'opacity', 'preset']

export function mountVColorPicker(props: VColorPickerProps) {
  const size: VColorPickerSize = SIZES.includes(props.size as VColorPickerSize) ? (props.size as VColorPickerSize) : 'md'
  const variant: VColorPickerVariant = VARIANTS.includes(props.variant as VColorPickerVariant)
    ? (props.variant as VColorPickerVariant)
    : 'popover'
  const disabled = Boolean(props.disabled)
  const showAlpha = props.showAlpha !== false && (variant === 'opacity' || props.showAlpha === true)
  const presets = props.presets?.length ? props.presets : V_COLOR_PICKER_DEFAULT_PRESETS
  const inlineSwatches = props.inlineSwatches?.length ? props.inlineSwatches : presets.slice(0, 4)

  return {
    size,
    variant,
    disabled,
    label: props.label,
    showAlpha,
    presets,
    inlineSwatches,
    checkIcon: V_COLOR_PICKER_CHECK_ICON,
    chevronDownIcon: V_COLOR_PICKER_CHEVRON_DOWN_ICON,
    chevronUpIcon: V_COLOR_PICKER_CHEVRON_UP_ICON,
  } as const
}
