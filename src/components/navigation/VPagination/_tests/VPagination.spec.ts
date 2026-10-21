/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDropdownMenu from '../../VDropdownMenu/VDropdownMenu.vue'
import VPagination from '../VPagination.vue'
import { buildPaginationRange, formatResultCount, mountVPagination } from '../mountVPagination'

describe('mountVPagination', () => {
  it('builds default page range with ellipsis at end', () => {
    const range = buildPaginationRange(3, 24, 2, 1)
    expect(range.map((item) => (item.kind === 'page' ? item.page : '…'))).toEqual([
      1, 2, 3, 4, 5, '…', 24,
    ])
  })

  it('builds ellipsis range around current page', () => {
    const range = buildPaginationRange(9, 24, 1, 1)
    expect(range.map((item) => (item.kind === 'page' ? item.page : '…'))).toEqual([
      1, '…', 8, 9, 10, '…', 24,
    ])
  })

  it('formats result count text', () => {
    expect(formatResultCount(3, 10, 240)).toBe('Showing 21–30 of 240 results')
  })
})

describe('VPagination', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VPagination, { props: { modelValue: 3, total: 240, pageSize: 10 } })
    expect(w.get('[data-test-id="v-pagination"]').exists()).toBe(true)
  })

  it('exposes nav semantics with aria-label', () => {
    const w = mount(VPagination, { props: { modelValue: 3, total: 240, pageSize: 10 } })
    const nav = w.get('[data-test-id="v-pagination"]')
    expect(nav.element.tagName).toBe('NAV')
    expect(nav.attributes('aria-label')).toBe('Pagination')
  })

  it('renders prev/next and numbered pages', () => {
    const w = mount(VPagination, { props: { modelValue: 3, total: 240, pageSize: 10 } })
    expect(w.get('[data-test-id="v-pagination-prev"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-pagination-next"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-pagination-page-3"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-pagination-ellipsis"]').exists()).toBe(true)
  })

  it('marks active page with aria-current', () => {
    const w = mount(VPagination, { props: { modelValue: 3, total: 240, pageSize: 10 } })
    expect(w.get('[data-test-id="v-pagination-page-3"]').attributes('aria-current')).toBe('page')
    expect(w.get('[data-test-id="v-pagination-page-2"]').attributes('aria-current')).toBeUndefined()
  })

  it('disables prev on first page and next on last page', () => {
    const first = mount(VPagination, { props: { modelValue: 1, total: 240, pageSize: 10 } })
    expect(first.get('[data-test-id="v-pagination-prev"]').attributes('disabled')).toBeDefined()
    expect(first.get('[data-test-id="v-pagination-next"]').attributes('disabled')).toBeUndefined()

    const last = mount(VPagination, { props: { modelValue: 24, total: 240, pageSize: 10 } })
    expect(last.get('[data-test-id="v-pagination-next"]').attributes('disabled')).toBeDefined()
    expect(last.get('[data-test-id="v-pagination-prev"]').attributes('disabled')).toBeUndefined()
  })

  it('emits update:modelValue and update:page on page click', async () => {
    const w = mount(VPagination, { props: { modelValue: 3, total: 240, pageSize: 10 } })
    await w.get('[data-test-id="v-pagination-page-4"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[4]])
    expect(w.emitted('update:page')).toEqual([[4]])
    expect(w.get('[data-test-id="v-pagination-page-4"]').attributes('aria-current')).toBe('page')
    expect(w.get('[data-test-id="v-pagination-page-3"]').attributes('aria-current')).toBeUndefined()
  })

  it('navigates with prev/next buttons', async () => {
    const w = mount(VPagination, { props: { total: 240, pageSize: 10 } })
    await w.get('[data-test-id="v-pagination-next"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[2]])
    await w.get('[data-test-id="v-pagination-prev"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[2], [1]])
  })

  it('renders compact variant without page buttons', () => {
    const w = mount(VPagination, {
      props: { modelValue: 3, total: 240, pageSize: 10, variant: 'compact' },
    })
    expect(w.find('[data-test-id^="v-pagination-page-"]').exists()).toBe(false)
    expect(w.get('[data-test-id="v-pagination-prev"]').text()).toContain('Prev')
    expect(w.get('[data-test-id="v-pagination-next"]').text()).toContain('Next')
  })

  it('renders page size dropdown and result count inline', () => {
    const w = mount(VPagination, {
      props: {
        modelValue: 3,
        total: 240,
        pageSize: 10,
        showPageSize: true,
        showResultCount: true,
      },
    })
    expect(w.get('[data-test-id="v-pagination-page-size"]').exists()).toBe(true)
    expect(w.findComponent(VDropdownMenu).exists()).toBe(true)
    expect(w.get('[data-test-id="v-pagination-result-count"]').text()).toBe(
      'Showing 21–30 of 240 results',
    )
    expect(w.get('.v-pagination__toolbar--with-meta').exists()).toBe(true)
  })

  it('emits update:pageSize and resets to page 1', async () => {
    const w = mount(VPagination, {
      props: {
        modelValue: 3,
        total: 240,
        pageSize: 10,
        showPageSize: true,
      },
    })
    await w.findComponent(VDropdownMenu).vm.$emit('update:value', '20')
    expect(w.emitted('update:pageSize')).toEqual([[20]])
    expect(w.emitted('update:modelValue')).toEqual([[1]])
  })

  it('applies size classes', () => {
    const w = mount(VPagination, {
      props: { modelValue: 3, total: 240, pageSize: 10, size: 'lg', variant: 'ellipsis' },
    })
    const root = w.get('[data-test-id="v-pagination"]')
    expect(root.classes()).toContain('v-pagination--lg')
    expect(root.classes()).toContain('v-pagination--ellipsis')
  })

  it('supports disabled state', () => {
    const w = mount(VPagination, {
      props: { modelValue: 3, total: 240, pageSize: 10, disabled: true },
    })
    const root = w.get('[data-test-id="v-pagination"]')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.attributes('data-state')).toBe('disabled')
    expect(root.classes()).toContain('v-pagination--disabled')
  })

  it('supports loading state with loader overlay and aria-busy', () => {
    const w = mount(VPagination, {
      props: { modelValue: 3, total: 240, pageSize: 10, loading: true },
    })
    const root = w.get('[data-test-id="v-pagination"]')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.attributes('data-state')).toBe('loading')
    expect(root.classes()).toContain('v-pagination--loading')
    expect(root.classes()).not.toContain('v-pagination--disabled')
    expect(w.get('[data-test-id="v-pagination-loader"]').exists()).toBe(true)
    expect(w.get('.v-pagination__controls--loading').exists()).toBe(true)
  })

  it('exposes custom aria label', () => {
    const w = mount(VPagination, {
      props: { modelValue: 3, total: 240, pageSize: 10, ariaLabel: 'Table pagination' },
    })
    expect(w.get('[data-test-id="v-pagination"]').attributes('aria-label')).toBe('Table pagination')
  })

  it('does not emit when disabled page clicked', async () => {
    const w = mount(VPagination, {
      props: { modelValue: 3, total: 240, pageSize: 10, disabled: true },
    })
    await w.get('[data-test-id="v-pagination-page-4"]').trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('mountVPagination computes page count from total', () => {
    const config = mountVPagination({ modelValue: 3, total: 240, pageSize: 10 })
    expect(config.pageCount).toBe(24)
    expect(config.currentPage).toBe(3)
  })
})
