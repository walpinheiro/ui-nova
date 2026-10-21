import type { IconifyIcon } from '@iconify/types'
import chevronLeftIcon from '@iconify-icons/keyline-icons/chevron-left'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import type { PaginationRangeItem, VPaginationProps } from './VPagination.types'

export const PAGINATION_UI_ICONS = {
  chevronLeft: chevronLeftIcon,
  chevronRight: chevronRightIcon,
} as const satisfies Record<string, IconifyIcon>

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

export function range(start: number, end: number): number[] {
  const out: number[] = []
  for (let i = start; i <= end; i += 1) out.push(i)
  return out
}

export function buildPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
  boundaryCount = 1,
): PaginationRangeItem[] {
  if (totalPages <= 0) return []

  const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2
  if (totalPages <= totalNumbers) {
    return range(1, totalPages).map((page) => ({ kind: 'page', page }))
  }

  const leftSibling = Math.max(currentPage - siblingCount, boundaryCount + 1)
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - boundaryCount)
  const showLeftEllipsis = leftSibling > boundaryCount + 1
  const showRightEllipsis = rightSibling < totalPages - boundaryCount

  const items: PaginationRangeItem[] = []

  for (let i = 1; i <= boundaryCount; i += 1) {
    items.push({ kind: 'page', page: i })
  }

  if (showLeftEllipsis) {
    items.push({ kind: 'ellipsis', id: 'start' })
  } else {
    for (let i = boundaryCount + 1; i < leftSibling; i += 1) {
      items.push({ kind: 'page', page: i })
    }
  }

  for (let i = leftSibling; i <= rightSibling; i += 1) {
    items.push({ kind: 'page', page: i })
  }

  if (showRightEllipsis) {
    items.push({ kind: 'ellipsis', id: 'end' })
  } else {
    for (let i = rightSibling + 1; i <= totalPages - boundaryCount; i += 1) {
      items.push({ kind: 'page', page: i })
    }
  }

  for (let i = totalPages - boundaryCount + 1; i <= totalPages; i += 1) {
    if (i > boundaryCount) items.push({ kind: 'page', page: i })
  }

  return items
}

export function formatResultCount(currentPage: number, pageSize: number, total: number): string {
  if (total <= 0) return 'Showing 0 of 0 results'
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, total)
  return `Showing ${start}–${end} of ${total} results`
}

export function mountVPagination(props: VPaginationProps) {
  const pageSize = props.pageSize ?? 10
  const total = props.total ?? 0
  const pageCount = props.pageCount ?? (total > 0 ? Math.ceil(total / pageSize) : 1)
  const currentPage = Math.min(Math.max(props.modelValue ?? 1, 1), Math.max(pageCount, 1))
  const boundaryCount = props.boundaryCount ?? 1
  const siblingCount =
    props.siblingCount ?? (props.variant === 'ellipsis' ? 1 : 2)
  const pageSizeOptions = props.pageSizeOptions ?? [...DEFAULT_PAGE_SIZE_OPTIONS]

  return {
    size: props.size ?? 'md',
    variant: props.variant ?? 'default',
    disabled: Boolean(props.disabled),
    loading: Boolean(props.loading),
    interactionDisabled: Boolean(props.disabled || props.loading),
    pageSize,
    total,
    pageCount,
    currentPage,
    boundaryCount,
    siblingCount,
    pageSizeOptions,
    showPageSize: Boolean(props.showPageSize),
    showResultCount: props.showResultCount ?? (props.total !== undefined && props.total > 0),
    prevLabel: props.prevLabel ?? 'Prev',
    nextLabel: props.nextLabel ?? 'Next',
    pageSizeLabel: props.pageSizeLabel ?? 'Items per page',
    pageSizeDropdownItems: pageSizeOptions.map((option) => ({
      value: String(option),
      label: String(option),
      selected: option === pageSize,
    })),
    items:
      props.variant === 'compact'
        ? []
        : buildPaginationRange(currentPage, pageCount, siblingCount, boundaryCount),
    resultCount: formatResultCount(currentPage, pageSize, total),
    isFirstPage: currentPage <= 1,
    isLastPage: currentPage >= pageCount,
  } as const
}
