import { computed, ref, watch } from 'vue'
import type { VPaginationProps } from './VPagination.types'
import { mountVPagination } from './mountVPagination'

type VPaginationEmit = {
  (event: 'update:modelValue', page: number): void
  (event: 'update:page', page: number): void
  (event: 'update:pageSize', size: number): void
}

export function useVPagination(props: VPaginationProps, emit?: VPaginationEmit) {
  const config = computed(() => mountVPagination(props))
  const innerPage = ref(config.value.currentPage)
  const innerPageSize = ref(config.value.pageSize)

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== undefined) innerPage.value = value
    },
  )

  watch(
    () => mountVPagination({ ...props, modelValue: innerPage.value, pageSize: innerPageSize.value }).pageCount,
    (pageCount) => {
      if (innerPage.value > pageCount) innerPage.value = Math.max(pageCount, 1)
    },
  )

  watch(
    () => props.pageSize,
    (value) => {
      if (value !== undefined) innerPageSize.value = value
    },
  )

  const currentPage = computed(() => innerPage.value)
  const pageSize = computed(() => props.pageSize ?? innerPageSize.value)

  const vmConfig = computed(() =>
    mountVPagination({
      ...props,
      modelValue: currentPage.value,
      pageSize: pageSize.value,
    }),
  )

  const hasMeta = computed(
    () => vmConfig.value.showPageSize || vmConfig.value.showResultCount,
  )

  const pageSizeDropdownSize = computed(() => {
    if (vmConfig.value.size === 'lg') return 'md'
    return 'sm'
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-pagination',
      `v-pagination--${vmConfig.value.size}`,
      `v-pagination--${vmConfig.value.variant}`,
      {
        'v-pagination--loading': vmConfig.value.loading,
        'v-pagination--disabled': vmConfig.value.disabled,
        'v-pagination--with-meta': hasMeta.value,
      },
    ],
    'aria-label': props.ariaLabel ?? 'Pagination',
    'aria-disabled': vmConfig.value.interactionDisabled || undefined,
    'aria-busy': vmConfig.value.loading || undefined,
    'data-test-id': 'v-pagination',
    'data-state': vmConfig.value.loading
      ? 'loading'
      : vmConfig.value.disabled
        ? 'disabled'
        : 'default',
  }))

  const goToPage = (page: number) => {
    if (vmConfig.value.interactionDisabled) return
    const next = Math.min(Math.max(page, 1), vmConfig.value.pageCount)
    if (next === currentPage.value) return
    innerPage.value = next
    emit?.('update:modelValue', next)
    emit?.('update:page', next)
  }

  const goPrev = () => {
    if (vmConfig.value.isFirstPage) return
    goToPage(currentPage.value - 1)
  }

  const goNext = () => {
    if (vmConfig.value.isLastPage) return
    goToPage(currentPage.value + 1)
  }

  const setPageSize = (value: number) => {
    if (vmConfig.value.interactionDisabled) return
    if (!Number.isFinite(value) || value <= 0) return
    innerPageSize.value = value
    emit?.('update:pageSize', value)
    goToPage(1)
  }

  const onPageSizeSelect = (value: string) => {
    setPageSize(Number(value))
  }

  const onKeydown = (event: KeyboardEvent, page?: number) => {
    if (vmConfig.value.interactionDisabled) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'Enter' && page !== undefined) {
      event.preventDefault()
      goToPage(page)
    }
  }

  return {
    config: vmConfig,
    hasMeta,
    pageSizeDropdownSize,
    rootAttrs,
    goToPage,
    goPrev,
    goNext,
    onPageSizeSelect,
    onKeydown,
  }
}
