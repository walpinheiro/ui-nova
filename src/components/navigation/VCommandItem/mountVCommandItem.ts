import { resolveCommandIcon } from '../VCommandPalette/mountVCommandPalette'
import type { VCommandItemProps, VCommandItemSize } from './VCommandItem.types'

const SIZES: VCommandItemSize[] = ['sm', 'md', 'lg']

export function mountVCommandItem(props: VCommandItemProps) {
  const size: VCommandItemSize = SIZES.includes(props.size as VCommandItemSize)
    ? (props.size as VCommandItemSize)
    : 'md'

  return {
    size,
    variant: props.variant ?? 'default',
    id: props.id,
    label: props.label ?? '',
    shortcut: props.shortcut,
    showShortcut: Boolean(props.shortcut),
    iconData: resolveCommandIcon(props.icon),
    selected: Boolean(props.selected),
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    testId: props.dataTestId ?? (props.selected ? 'v-command-item-selected' : 'v-command-item'),
    domId: props.domId ?? (props.id ? `command-item-${props.id}` : undefined),
  } as const
}

export { resolveCommandIcon }
