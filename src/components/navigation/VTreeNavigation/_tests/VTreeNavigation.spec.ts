/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTreeNavigation from '../VTreeNavigation.vue'
import { HERO_TREE_ITEMS, VARIANT_TREE_ITEMS } from '../mountVTreeNavigation'

describe('VTreeNavigation', () => {
  it('renders tree role and stable test id', () => {
    const w = mount(VTreeNavigation)
    const root = w.get('[data-test-id="tree-navigation"]')
    expect(root.exists()).toBe(true)
    expect(root.attributes('role')).toBe('tree')
  })

  it('defaults to file variant, md size and hero tree', () => {
    const w = mount(VTreeNavigation)
    const root = w.get('[data-test-id="tree-navigation"]')
    expect(root.classes()).toContain('v-tree-navigation--file')
    expect(root.classes()).toContain('v-tree-navigation--md')
    expect(w.get('[data-test-id="tree-node--workspace"]').exists()).toBe(true)
    expect(w.get('[data-test-id="tree-node--vueui-nova"]').exists()).toBe(true)
  })

  it('renders count badges when showCounts is true', () => {
    const w = mount(VTreeNavigation, { props: { showCounts: true } })
    expect(w.get('[data-test-id="tree-node--workspace"]').text()).toContain('12')
  })

  it('hides count badges when showCounts is false', () => {
    const w = mount(VTreeNavigation, { props: { showCounts: false } })
    expect(w.find('[data-test-id="tree-node-count"]').exists()).toBe(false)
  })

  it('supports all 4 variants and 3 sizes', () => {
    for (const variant of ['file', 'settings', 'documentation', 'simple'] as const) {
      const w = mount(VTreeNavigation, { props: { variant, items: VARIANT_TREE_ITEMS[variant] } })
      expect(w.get('[data-test-id="tree-navigation"]').classes()).toContain(`v-tree-navigation--${variant}`)
    }
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mount(VTreeNavigation, { props: { size } })
      expect(w.get('[data-test-id="tree-navigation"]').classes()).toContain(`v-tree-navigation--${size}`)
    }
  })

  it('maps legacy default/primary/subtle variants', () => {
    const primary = mount(VTreeNavigation, { props: { variant: 'primary' as never, items: VARIANT_TREE_ITEMS.settings } })
    expect(primary.get('[data-test-id="tree-navigation"]').attributes('data-variant')).toBe('settings')
    const subtle = mount(VTreeNavigation, { props: { variant: 'subtle' as never, items: VARIANT_TREE_ITEMS.simple } })
    expect(subtle.get('[data-test-id="tree-navigation"]').attributes('data-variant')).toBe('simple')
  })

  it('respects active selection with aria-selected', () => {
    const w = mount(VTreeNavigation, { props: { active: 'vueui-nova' } })
    expect(w.get('[data-test-id="tree-node--vueui-nova"]').attributes('aria-selected')).toBe('true')
    expect(w.get('[data-test-id="tree-node--workspace"]').attributes('aria-selected')).toBe('false')
  })

  it('emits update:active and select on node click', async () => {
    const w = mount(VTreeNavigation, { props: { items: VARIANT_TREE_ITEMS.simple, showCounts: false } })
    await w.get('[data-test-id="tree-node--about"]').trigger('click')
    expect(w.emitted('update:active')).toEqual([['about']])
    expect(w.emitted('select')).toEqual([['about']])
  })

  it('emits update:expandedKeys when toggle is clicked', async () => {
    const w = mount(VTreeNavigation, {
      props: { items: VARIANT_TREE_ITEMS.file, expandedKeys: [], showCounts: false },
    })
    const toggle = w.get('[data-test-id="tree-node-toggle--documents"]')
    await toggle.trigger('click')
    expect(w.emitted('update:expandedKeys')).toEqual([[['documents']]])
  })

  it('supports multiple selection', async () => {
    const w = mount(VTreeNavigation, {
      props: { multiple: true, items: VARIANT_TREE_ITEMS.simple, active: ['home'], showCounts: false },
    })
    await w.get('[data-test-id="tree-node--about"]').trigger('click')
    expect(w.emitted('update:active')).toEqual([[['home', 'about']]])
  })

  it('exposes aria-expanded on branch nodes', () => {
    const w = mount(VTreeNavigation, { props: { expandedKeys: ['workspace', 'projects'] } })
    expect(w.get('[data-test-id="tree-node--workspace"]').attributes('aria-expanded')).toBe('true')
    expect(w.get('[data-test-id="tree-node--trash"]').attributes('aria-expanded')).toBeUndefined()
  })

  it('navigates with ArrowDown/ArrowUp and selects with Enter', async () => {
    const w = mount(VTreeNavigation, {
      props: { items: VARIANT_TREE_ITEMS.simple, active: 'home', showCounts: false },
    })
    const home = w.get('[data-test-id="tree-node--home"]')
    await home.trigger('keydown', { key: 'ArrowDown' })
    await w.get('[data-test-id="tree-node--about"]').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:active')).toContainEqual(['about'])
  })

  it('supports disabled state on root', () => {
    const w = mount(VTreeNavigation, { props: { disabled: true } })
    expect(w.get('[data-test-id="tree-navigation"]').attributes('aria-disabled')).toBe('true')
  })

  it('supports loading state with loader and aria-busy', () => {
    const w = mount(VTreeNavigation, { props: { loading: true } })
    const root = w.get('[data-test-id="tree-navigation"]')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(w.find('[data-test-id="tree-navigation-loader"]').exists()).toBe(true)
  })

  it('uses custom items prop', () => {
    const w = mount(VTreeNavigation, {
      props: {
        items: [{ key: 'custom', label: 'Custom node' }],
        showCounts: false,
      },
    })
    expect(w.get('[data-test-id="tree-node--custom"]').text()).toContain('Custom node')
  })

  it('shows empty state when items are empty', () => {
    const w = mount(VTreeNavigation, { props: { items: [] } })
    expect(w.find('[data-test-id="tree-navigation-empty"]').exists()).toBe(true)
  })
})
