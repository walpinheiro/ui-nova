import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import refreshCwIcon from '@iconify-icons/keyline-icons/refresh-cw'
import type { VAgentChipProps, VAgentChipStatus } from './VAgentChip.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const STATUSES: VAgentChipStatus[] = ['pending', 'success', 'error']

export const V_AGENT_CHIP_SUCCESS_ICON: IconifyIcon = checkIcon
export const V_AGENT_CHIP_ERROR_ICON: IconifyIcon = circleAlertIcon
export const V_AGENT_CHIP_RETRY_ICON: IconifyIcon = refreshCwIcon

export function mountVAgentChip(props: VAgentChipProps) {
  const status: VAgentChipStatus = STATUSES.includes(props.status as VAgentChipStatus)
    ? (props.status as VAgentChipStatus)
    : 'pending'

  return {
    status,
    label: props.label ?? 'Running tool',
    durationMs: props.durationMs ?? 0,
    motion: props.motion ?? V_MOTION_DEFAULT,
    retryLabel: props.retryLabel ?? 'Retry',
    successIcon: V_AGENT_CHIP_SUCCESS_ICON,
    errorIcon: V_AGENT_CHIP_ERROR_ICON,
    retryIcon: V_AGENT_CHIP_RETRY_ICON,
  } as const
}
