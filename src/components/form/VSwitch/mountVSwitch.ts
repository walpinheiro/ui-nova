import type { IconifyIcon } from '@iconify/types'
import moonIcon from '@iconify-icons/keyline-icons/moon'
import sunIcon from '@iconify-icons/keyline-icons/sun'
import type { VSwitchProps, VSwitchSize } from './VSwitch.types'

export const V_SWITCH_ON_ICON: IconifyIcon = sunIcon
export const V_SWITCH_OFF_ICON: IconifyIcon = moonIcon

const SIZES: VSwitchSize[] = ['sm', 'md', 'lg']

export function mountVSwitch(props: VSwitchProps) {
  const size: VSwitchSize = SIZES.includes(props.size as VSwitchSize) ? (props.size as VSwitchSize) : 'md'
  const disabled = Boolean(props.disabled)
  const checked = Boolean(props.modelValue)
  const showIcon = props.showIcon !== false

  return {
    size,
    disabled,
    checked,
    showIcon,
    onIcon: V_SWITCH_ON_ICON,
    offIcon: V_SWITCH_OFF_ICON,
  } as const
}
