import type { VSwipeRowProps } from './VSwipeRow.types'

export function mountVSwipeRow(props: VSwipeRowProps) {
  return {
    actions: props.actions ?? [],
    disabled: Boolean(props.disabled),
  } as const
}
