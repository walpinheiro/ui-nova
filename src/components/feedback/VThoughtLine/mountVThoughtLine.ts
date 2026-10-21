import type { IconifyIcon } from '@iconify/types'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import type { VThoughtLineProps } from './VThoughtLine.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

export const V_THOUGHT_LINE_GLYPH_ICON: IconifyIcon = sparklesIcon
export const V_THOUGHT_LINE_CHEVRON_ICON: IconifyIcon = chevronDownIcon

export function mountVThoughtLine(props: VThoughtLineProps) {
  const steps = props.steps ?? []
  const duration = props.duration ?? 0

  return {
    label: props.label ?? 'Thinking',
    steps,
    duration,
    motion: props.motion ?? V_MOTION_DEFAULT,
    defaultExpanded: props.defaultExpanded ?? false,
    glyphIcon: V_THOUGHT_LINE_GLYPH_ICON,
    chevronIcon: V_THOUGHT_LINE_CHEVRON_ICON,
    isComplete: duration > 0,
  } as const
}
