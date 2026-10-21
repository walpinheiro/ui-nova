/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VBreadcrumb from '../VBreadcrumb.vue'
import {
  DEFAULT_BREADCRUMB_ITEMS,
  ICON_BREADCRUMB_ITEMS,
  buildVBreadcrumbSegments,
  resolveVBreadcrumbItems,
} from '../mountVBreadcrumb'

describe('VBreadcrumb mount helpers', () => {
  it('marks the last item without href as current', () => {
    const resolved = resolveVBreadcrumbItems(DEFAULT_BREADCRUMB_ITEMS, 'default', false)
    expect(resolved[resolved.length - 1]?.isCurrent).toBe(true)
    expect(resolved[resolved.length - 1]?.href).toBeUndefined()
    expect(resolved[0]?.showHomeIcon).toBe(true)
  })

  it('collapses middle items for overflow variant', () => {
    const resolved = resolveVBreadcrumbItems(DEFAULT_BREADCRUMB_ITEMS, 'overflow', false)
    const segments = buildVBreadcrumbSegments(resolved, 'overflow', 4)
    expect(segments).toHaveLength(4)
    expect(segments[0]?.type).toBe('item')
    expect(segments[1]?.type).toBe('overflow')
    expect(segments[2]?.type).toBe('item')
    expect(segments[3]?.type).toBe('item')
  })
})

describe('VBreadcrumb', () => {
  it('renders semantic nav with stable test id', () => {
    const w = mount(VBreadcrumb)
    const root = w.get('[data-test-id="v-breadcrumb"]')
    expect(root.element.tagName).toBe('NAV')
    expect(root.attributes('aria-label')).toBe('Breadcrumb')
    expect(w.find('[data-test-id="v-breadcrumb-list"]').exists()).toBe(true)
  })

  it('defaults to default variant and md size', () => {
    const w = mount(VBreadcrumb)
    const root = w.get('[data-test-id="v-breadcrumb"]')
    expect(root.classes()).toContain('v-breadcrumb--default')
    expect(root.classes()).toContain('v-breadcrumb--md')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-size')).toBe('md')
  })

  it('renders default trail with home icon and current page', () => {
    const w = mount(VBreadcrumb)
    expect(w.find('[data-test-id="v-breadcrumb-home-icon"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-breadcrumb-current"]').text()).toContain('Assets')
    expect(w.get('[data-test-id="v-breadcrumb-current"]').attributes('aria-current')).toBe('page')
    expect(w.findAll('[data-test-id="v-breadcrumb-link"]')).toHaveLength(3)
    expect(w.findAll('[data-test-id="v-breadcrumb-separator"]')).toHaveLength(3)
  })

  it('supports compact, icons and overflow variants', () => {
    const compact = mount(VBreadcrumb, { props: { variant: 'compact' } })
    expect(compact.find('[data-test-id="v-breadcrumb-home-icon"]').exists()).toBe(false)

    const icons = mount(VBreadcrumb, { props: { variant: 'icons', items: ICON_BREADCRUMB_ITEMS } })
    expect(icons.findAll('.v-breadcrumb__icon').length).toBeGreaterThan(0)

    const overflow = mount(VBreadcrumb, { props: { variant: 'overflow' } })
    expect(overflow.find('[data-test-id="v-breadcrumb-overflow"]').exists()).toBe(true)
  })

  it('supports all sizes and legacy variant aliases', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mount(VBreadcrumb, { props: { size } })
      expect(w.get('[data-test-id="v-breadcrumb"]').classes()).toContain(`v-breadcrumb--${size}`)
    }
    const primary = mount(VBreadcrumb, { props: { variant: 'primary' as never } })
    expect(primary.get('[data-test-id="v-breadcrumb"]').attributes('data-variant')).toBe('default')
    const subtle = mount(VBreadcrumb, { props: { variant: 'subtle' as never } })
    expect(subtle.get('[data-test-id="v-breadcrumb"]').attributes('data-variant')).toBe('compact')
  })

  it('supports custom separator slot', () => {
    const w = mount(VBreadcrumb, {
      slots: { separator: '<span data-test-id="slot-separator">/</span>' },
    })
    expect(w.find('[data-test-id="slot-separator"]').exists()).toBe(true)
  })

  it('opens overflow menu and emits navigate', async () => {
    const w = mount(VBreadcrumb, { props: { variant: 'overflow' } })
    expect(w.find('[data-test-id="v-breadcrumb-overflow-menu"]').exists()).toBe(false)
    await w.get('[data-test-id="v-breadcrumb-overflow"]').trigger('click')
    expect(w.find('[data-test-id="v-breadcrumb-overflow-menu"]').exists()).toBe(true)
    await w.get('[data-test-id="v-breadcrumb-overflow-item-1"]').trigger('click')
    expect(w.emitted('navigate')?.[0]?.[0]).toMatchObject({ index: 1, item: { label: 'Projects' } })
  })

  it('supports disabled items', () => {
    const w = mount(VBreadcrumb, {
      props: {
        items: [
          { label: 'Home', to: '/' },
          { label: 'Projects', to: '/projects', disabled: true },
          { label: 'Assets' },
        ],
      },
    })
    expect(w.get('[data-test-id="v-breadcrumb-item-1"] [data-test-id="v-breadcrumb-link"]').attributes('aria-disabled')).toBe('true')
  })

  it('does not emit navigate for current page', async () => {
    const w = mount(VBreadcrumb)
    await w.get('[data-test-id="v-breadcrumb-current"]').trigger('click')
    expect(w.emitted('navigate')).toBeUndefined()
  })
})
