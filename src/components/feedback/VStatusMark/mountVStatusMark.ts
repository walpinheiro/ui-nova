import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleIcon from '@iconify-icons/keyline-icons/circle'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VStatusMarkProps, VStatusMarkSize, VStatusMarkState } from './VStatusMark.types'

const SIZES: VStatusMarkSize[] = ['sm', 'md', 'lg']
const STATES: VStatusMarkState[] = ['idle', 'running', 'success', 'error']

const STATE_ICONS: Record<VStatusMarkState, IconifyIcon> = {
  idle: circleIcon,
  running: circleIcon,
  success: checkIcon,
  error: xIcon,
}

export function mountVStatusMark(props: VStatusMarkProps) {
  const size = SIZES.includes(props.size as VStatusMarkSize) ? (props.size as VStatusMarkSize) : 'md'
  const state = STATES.includes(props.state as VStatusMarkState) ? (props.state as VStatusMarkState) : 'idle'

  return {
    size,
    state,
    label: props.label ?? state,
    iconData: STATE_ICONS[state],
    spinning: state === 'running',
  } as const
}
