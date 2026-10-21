/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSidebar from '../VSidebar.vue'
import { DEFAULT_SIDEBAR_ITEMS } from '../mountVSidebar'

describe('VSidebar', () => {
  it('keeps heading and position visible on the floating chip', async () => {
    const w = mount(VSidebar, {
      props: {
        variant: 'floating',
        collapsed: true,
        heading: 'Canvas',
        position: 'Alex Chen · Workspace',
        showSearch: false,
      },
    })
    expect(w.get('[data-test-id="v-sidebar-heading"]').text()).toBe('Canvas')
    expect(w.get('[data-test-id="v-sidebar-position"]').text()).toBe('Alex Chen · Workspace')
    await w.get('[data-test-id="v-sidebar-brand"]').trigger('click')
    expect(w.emitted('update:collapsed')?.[0]).toEqual([false])
  })

  it('stays open when locked', async () => {
    const w = mount(VSidebar, { props: { locked: true, collapsed: true } })
    expect(w.get('[data-test-id="v-sidebar"]').attributes('data-collapsed')).toBe('false')
    expect(w.get('[data-test-id="v-sidebar"]').attributes('data-locked')).toBe('true')
    await w.get('[data-test-id="v-sidebar-collapse-toggle"]').trigger('click')
    expect(w.emitted('update:collapsed')).toBeUndefined()
  })

  it('docks the floating sidebar from the lock control', async () => {
    const w = mount(VSidebar, {
      props: { variant: 'floating', collapsed: false, heading: 'Canvas', position: 'Workspace' },
    })
    const lock = w.get('[data-test-id="v-sidebar-lock"]')
    expect(lock.attributes('aria-pressed')).toBe('false')
    await lock.trigger('click')
    expect(w.emitted('update:locked')?.[0]).toEqual([true])
    expect(w.get('[data-test-id="v-sidebar"]').attributes('data-locked')).toBe('true')
    await w.get('[data-test-id="v-sidebar-collapse-toggle"]').trigger('click')
    expect(w.emitted('update:collapsed')).toBeUndefined()
    expect(w.get('[data-test-id="v-sidebar-heading"]').text()).toBe('Canvas')
  })

  it('renders and exposes stable test id', () => {
    const w = mount(VSidebar)
    expect(w.find('[data-test-id="v-sidebar"]').exists()).toBe(true)
  })

  it('defaults to md size with poster brand and nav', () => {
    const w = mount(VSidebar)
    const root = w.get('[data-test-id="v-sidebar"]')
    expect(root.classes()).toContain('v-sidebar--md')
    expect(root.attributes('data-size')).toBe('md')
    expect(w.get('[data-test-id="v-sidebar-brand"]').text()).toContain('VueUI Nova')
    expect(w.find('[data-test-id="v-sidebar-nav-item-dashboard"]').exists()).toBe(true)
  })

  it('renders native aside with brand, search, nav and user area', () => {
    const w = mount(VSidebar)
    expect(w.element.tagName).toBe('ASIDE')
    expect(w.find('[data-test-id="v-sidebar-brand"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-sidebar-search"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-sidebar-nav"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-sidebar-user-area"]').exists()).toBe(true)
  })

  it('supports all 3 sizes', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mount(VSidebar, { props: { size } })
      expect(w.get('[data-test-id="v-sidebar"]').classes()).toContain(`v-sidebar--${size}`)
    }
  })

  it('marks dashboard active by default and team section expanded', () => {
    const w = mount(VSidebar)
    expect(w.get('[data-test-id="v-sidebar-nav-item-dashboard"]').attributes('aria-current')).toBe('page')
    expect(w.find('[data-test-id="v-sidebar-nested-child-overview"]').exists()).toBe(true)
  })

  it('emits update:collapsed when collapse toggle is clicked', async () => {
    const w = mount(VSidebar)
    await w.get('[data-test-id="v-sidebar-collapse-toggle"]').trigger('click')
    expect(w.emitted('update:collapsed')?.[0]).toEqual([true])
    expect(w.get('[data-test-id="v-sidebar"]').attributes('data-collapsed')).toBe('true')
  })

  it('emits select and update:activeItem when nav item is clicked', async () => {
    const w = mount(VSidebar)
    await w.get('[data-test-id="v-sidebar-nav-item-analytics"]').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['analytics'])
    expect(w.emitted('update:activeItem')?.[0]).toEqual(['analytics'])
  })

  it('toggles nested section and emits section-toggle', async () => {
    const w = mount(VSidebar, { props: { expandedSections: ['team'] } })
    await w.get('[data-test-id="v-sidebar-nav-item-team"]').trigger('click')
    expect(w.emitted('section-toggle')?.[0]).toEqual(['team', false])
    expect(w.find('[data-test-id="v-sidebar-nested-child-overview"]').exists()).toBe(false)
  })

  it('supports custom items and footer slot', () => {
    const w = mount(VSidebar, {
      props: { items: [{ value: 'home', label: 'Home', icon: 'home' }] },
      slots: { footer: '<div data-test-id="slot-footer">Footer</div>' },
    })
    expect(w.find('[data-test-id="v-sidebar-nav-item-home"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-footer"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-sidebar-user-avatar"]').exists()).toBe(false)
  })

  it('supports disabled state', () => {
    const w = mount(VSidebar, { props: { disabled: true } })
    expect(w.get('[data-test-id="v-sidebar"]').attributes('aria-disabled')).toBe('true')
    expect(w.get('[data-test-id="v-sidebar"]').classes()).toContain('v-sidebar--disabled')
  })

  it('hides labels and nested children when collapsed', async () => {
    const w = mount(VSidebar, { props: { collapsed: true } })
    expect(w.get('[data-test-id="v-sidebar"]').classes()).toContain('v-sidebar--collapsed')
    expect(w.find('.v-sidebar__brand-name').exists()).toBe(false)
    expect(w.find('[data-test-id="v-sidebar-nested-child-overview"]').exists()).toBe(false)
  })

  it('emits search when typing in search input', async () => {
    const w = mount(VSidebar)
    await w.get('[data-test-id="v-sidebar-search-field"]').setValue('dash')
    expect(w.emitted('search')?.[0]).toEqual(['dash'])
  })

  it('renders a card menu with section headings and soft items', () => {
    const w = mount(VSidebar, {
      props: {
        variant: 'card',
        showBrand: false,
        showSearch: false,
        showFooter: false,
        activeItem: 'home',
        items: [
          { value: 'home', label: 'Home', icon: 'home' },
          { value: 'find', label: 'Find & Manage', type: 'heading' },
          { value: 'people', label: 'People database', icon: 'users' },
        ],
      },
    })
    const root = w.get('[data-test-id="v-sidebar"]')
    expect(root.attributes('data-variant')).toBe('card')
    expect(root.classes()).toContain('v-sidebar--card')
    expect(w.find('[data-test-id="v-sidebar-brand"]').exists()).toBe(false)
    expect(w.find('[data-test-id="v-sidebar-user-area"]').exists()).toBe(false)
    expect(w.get('[data-test-id="v-sidebar-heading-find"]').text()).toContain('Find & Manage')
    expect(w.get('[data-test-id="v-sidebar-nav-item-home"]').classes()).toContain('v-nav-item--soft')
    expect(w.get('[data-test-id="v-sidebar-nav-item-home"]').classes()).toContain('v-nav-item--active')
  })

  it('uses a raised item on the workspace rail', () => {
    const w = mount(VSidebar, {
      props: {
        variant: 'workspace',
        activeItem: 'templates',
        items: [{ value: 'templates', label: 'Templates', icon: 'templates' }],
      },
    })
    expect(w.get('[data-test-id="v-sidebar"]').classes()).toContain('v-sidebar--workspace')
    expect(w.get('[data-test-id="v-sidebar-nav-item-templates"]').classes()).toContain('v-nav-item--raised')
  })

  it('uses default poster items when items prop is omitted', () => {
    const w = mount(VSidebar)
    for (const item of DEFAULT_SIDEBAR_ITEMS) {
      expect(w.find(`[data-test-id="v-sidebar-nav-item-${item.value}"]`).exists()).toBe(true)
    }
  })
})

describe('VSidebar icons rail', () => {
  const items = [
    { value: 'portfolio', label: 'Portfolio', icon: 'pie-chart' },
    { value: 'prefs', label: 'Preferences', icon: 'sliders' },
    { value: 'out', label: 'Sign out', icon: 'log-out' },
    { value: 'steth', label: 'Care', icon: 'stethoscope' },
  ]

  it('gives each item a title/aria-label tooltip and resolves new icon aliases', () => {
    const w = mount(VSidebar, { props: { variant: 'icons', showSearch: false, showFooter: false, items } })
    const item = w.get('[data-sidebar-key="portfolio"]')
    expect(item.attributes('title')).toBe('Portfolio')
    expect(item.attributes('aria-label')).toBe('Portfolio')
    for (const key of ['portfolio', 'prefs', 'out']) {
      expect(w.get(`[data-sidebar-key="${key}"] svg`).exists()).toBe(true)
    }
  })

  it('does not run the island animation on mount, only when re-expanding', async () => {
    const w = mount(VSidebar, { props: { variant: 'icons', collapsed: false, showSearch: false, showFooter: false, items } })
    const nav = () => w.get('[data-test-id="v-sidebar-nav"]')
    expect(nav().classes()).not.toContain('v-sidebar__nav--island-enter')
    await w.setProps({ collapsed: true })
    expect(nav().classes()).not.toContain('v-sidebar__nav--island-enter')
    await w.setProps({ collapsed: false })
    expect(nav().classes()).toContain('v-sidebar__nav--island-enter')
    await nav().trigger('animationend')
    expect(nav().classes()).not.toContain('v-sidebar__nav--island-enter')
  })

  it('showCollapseToggle hides the toggle (default keeps it)', () => {
    const on = mount(VSidebar, { props: { variant: 'icons', items } })
    expect(on.find('[data-test-id="v-sidebar-collapse-toggle"]').exists()).toBe(true)
    const off = mount(VSidebar, { props: { variant: 'icons', items, showCollapseToggle: false } })
    expect(off.find('[data-test-id="v-sidebar-collapse-toggle"]').exists()).toBe(false)
  })
})

describe('VSidebar group extras', () => {
  const items = [
    { value: 'g1', label: 'Workspace', type: 'group' as const, children: [{ value: 'a', label: 'A' }] },
    { value: 'g2', label: 'Projects', type: 'group' as const, children: [{ value: 'b', label: 'B' }] },
  ]
  const root = (w: ReturnType<typeof mount>) => w.get('[data-test-id="v-sidebar"]')

  it('groupChevron="start" adds the modifier; default is end', () => {
    expect(root(mount(VSidebar, { props: { items } })).classes()).not.toContain('v-sidebar--chevron-start')
    expect(root(mount(VSidebar, { props: { items, groupChevron: 'start' } })).classes()).toContain('v-sidebar--chevron-start')
  })

  it('group-actions slot renders per group and does not toggle the group', async () => {
    const w = mount(VSidebar, {
      props: { items },
      slots: { 'group-actions': `<template #group-actions="{ group }"><button type="button" class="act" :aria-label="'Add ' + group.label">+</button></template>` },
    })
    const acts = w.findAll('.act')
    expect(acts).toHaveLength(2)
    expect(acts[0].attributes('aria-label')).toBe('Add Workspace')
    const header = w.get('[data-test-id="v-sidebar-group-header-g1"]')
    expect(header.attributes('aria-expanded')).toBe('true')
    await acts[0].trigger('click')
    expect(header.attributes('aria-expanded')).toBe('true')
    expect(w.emitted('section-toggle')).toBeUndefined()
    await header.trigger('click')
    expect(header.attributes('aria-expanded')).toBe('false')
  })

  it('no actions container without the slot', () => {
    const w = mount(VSidebar, { props: { items } })
    expect(w.find('.v-sidebar__group-actions').exists()).toBe(false)
  })

  it('groupDividers adds the modifier', () => {
    expect(root(mount(VSidebar, { props: { items } })).classes()).not.toContain('v-sidebar--group-dividers')
    expect(root(mount(VSidebar, { props: { items, groupDividers: true } })).classes()).toContain('v-sidebar--group-dividers')
  })

  it('width prop sets --v-sidebar-width (number -> px, string as-is)', () => {
    const w1 = mount(VSidebar, { props: { items, width: 216 } })
    expect(root(w1).attributes('style')).toContain('--v-sidebar-width: 216px')
    expect(root(w1).classes()).toContain('v-sidebar--has-width')
    const w2 = mount(VSidebar, { props: { items, width: '15rem' } })
    expect(root(w2).attributes('style')).toContain('--v-sidebar-width: 15rem')
    const w3 = mount(VSidebar, { props: { items } })
    expect(root(w3).attributes('style') ?? '').not.toContain('--v-sidebar-width')
  })
})
