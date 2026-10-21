import type { IconifyIcon } from '@iconify/types'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronUpIcon from '@iconify-icons/keyline-icons/chevron-up'
import chevronsUpDownIcon from '@iconify-icons/keyline-icons/chevrons-up-down'
import menuIcon from '@iconify-icons/keyline-icons/menu'
import type { VSortDirection } from '../VTable.types'
import type { VSortableHeaderProps } from './VSortableHeader.types'

export const V_SORTABLE_HEADER_ICONS = {
  asc: chevronUpIcon,
  desc: chevronDownIcon,
  unsorted: chevronsUpDownIcon,
  leading: menuIcon,
} satisfies Record<string, IconifyIcon>

export function nextSortDirection(current: VSortDirection): VSortDirection {
  if (current === null) return 'asc'
  if (current === 'asc') return 'desc'
  return null
}

export function mountVSortableHeader(props: VSortableHeaderProps) {
  const size = props.size ?? 'md'
  const direction = props.direction ?? null
  const stateModifier =
    props.disabled ? 'disabled' : direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'unsorted'

  return {
    size,
    direction,
    stateModifier,
    disabled: Boolean(props.disabled),
    showPriority: Boolean(props.sortPriority && props.sortPriority > 1),
    priority: props.sortPriority,
    indicatorIcon:
      direction === 'asc'
        ? V_SORTABLE_HEADER_ICONS.asc
        : direction === 'desc'
          ? V_SORTABLE_HEADER_ICONS.desc
          : V_SORTABLE_HEADER_ICONS.unsorted,
    testId: props.dataTestId ?? `table-header-sort--${props.columnKey ?? 'column'}`,
    ariaSort: direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none',
  } as const
}
