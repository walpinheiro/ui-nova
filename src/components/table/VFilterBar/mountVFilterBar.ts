import type { IconifyIcon } from '@iconify/types'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import refreshIcon from '@iconify-icons/keyline-icons/refresh-cw'
import searchIcon from '@iconify-icons/keyline-icons/search'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VFilterBarProps } from './VFilterBar.types'

export const V_FILTER_BAR_ICONS = {
  search: searchIcon,
  calendar: calendarIcon,
  refresh: refreshIcon,
  remove: xIcon,
} satisfies Record<string, IconifyIcon>

export function mountVFilterBar(props: VFilterBarProps) {
  const size = props.size ?? 'md'
  const variant = props.variant ?? 'basic'
  const chips = props.chips ?? []
  const selects = props.selects ?? []

  return {
    size,
    variant,
    chips,
    selects,
    sticky: Boolean(props.sticky || variant === 'sticky'),
    loading: Boolean(props.loading),
    disabled: Boolean(props.disabled),
    searchShortcut: Boolean(props.searchShortcut),
    hasChips: chips.length > 0,
    resultsLabel:
      props.totalCount !== undefined
        ? `Showing ${(props.resultsCount ?? 0).toLocaleString('en-US')} of ${props.totalCount.toLocaleString('en-US')} results`
        : `Showing ${(props.resultsCount ?? 0).toLocaleString('en-US')} results`,
    activeCount: props.activeCount ?? chips.length,
    testId: props.dataTestId ?? 'filter-bar',
  } as const
}
