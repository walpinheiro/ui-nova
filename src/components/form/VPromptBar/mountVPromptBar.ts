import type { IconifyIcon } from '@iconify/types'
import arrowUpIcon from '@iconify-icons/keyline-icons/arrow-up'
import paperclipIcon from '@iconify-icons/keyline-icons/paperclip'
import squareIcon from '@iconify-icons/keyline-icons/square'
import micIcon from '@iconify-icons/keyline-icons/mic'
import type { VPromptBarProps } from './VPromptBar.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

export const V_PROMPT_BAR_SEND_ICON: IconifyIcon = arrowUpIcon
export const V_PROMPT_BAR_STOP_ICON: IconifyIcon = squareIcon
export const V_PROMPT_BAR_ATTACH_ICON: IconifyIcon = paperclipIcon
export const V_PROMPT_BAR_VOICE_ICON: IconifyIcon = micIcon

export function mountVPromptBar(props: VPromptBarProps) {
  return {
    modelValue: props.modelValue ?? '',
    busy: Boolean(props.busy),
    placeholder: props.placeholder ?? 'Ask anything…',
    motion: props.motion ?? V_MOTION_DEFAULT,
    disabled: Boolean(props.disabled),
    sendLabel: props.sendLabel ?? 'Send prompt',
    stopLabel: props.stopLabel ?? 'Stop generation',
    attachLabel: props.attachLabel ?? 'Attach file',
    sendIcon: V_PROMPT_BAR_SEND_ICON,
    stopIcon: V_PROMPT_BAR_STOP_ICON,
    attachIcon: V_PROMPT_BAR_ATTACH_ICON,
  } as const
}
