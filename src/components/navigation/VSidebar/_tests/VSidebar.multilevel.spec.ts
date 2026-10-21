/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VSidebar from '../VSidebar.vue'
import type { VSidebarItem } from '../VSidebar.types'

const items: VSidebarItem[] = [
  { value: 'home', label: 'Home' },
  {
    value: 'a',
    label: 'Alpha',
    children: [
      { value: 'h-sub', label: 'Category', type: 'heading' },
      { value: 'a1', label: 'Alpha one' },
      {
        value: 'a-sub',
        label: 'Alpha sub',
        children: [{ value: 'deep', label: 'Deep leaf' }],
      },
    ],
  },
  { value: 'b', label: 'Beta', children: [{ value: 'b1', label: 'Beta one' }] },
  {
    value: 'g',
    label: 'Workspace',
    type: 'group',
    children: [
      { value: 'g1', label: 'Group item' },
      { value: 'c', label: 'Gamma', children: [{ value: 'c1', label: 'Gamma one' }] },
    ],
  },
  {
    value: 'fixed',
    label: 'Fixed',
    type: 'group',
    collapsible: false,
    children: [{ value: 'f1', label: 'Fixed item' }],
  },
]

const base = { showBrand: false, showFooter: false, items }
const nested = (value: string) => `[data-test-id="v-sidebar-nested-child-${value}"]`
const item = (value: string) => `[data-test-id="v-sidebar-nav-item-${value}"]`

describe('VSidebar multi-level', () => {
  it('renders a third level and exposes the depth variable', () => {
    const w = mount(VSidebar, { props: { ...base, expandedSections: ['a', 'a-sub'] } })
    expect(w.find(nested('a1')).exists()).toBe(true)
    const deep = w.get(nested('deep'))
    expect(deep.attributes('style')).toContain('--v-sidebar-depth: 2')
    expect(w.get('[data-test-id="v-sidebar-heading-h-sub"]').text()).toBe('Category')
  })

  it('wires aria-expanded, aria-controls and aria-current', () => {
    const w = mount(VSidebar, { props: { ...base, activeItem: 'deep', expandedSections: ['a', 'a-sub'] } })
    const alpha = w.get(item('a'))
    expect(alpha.attributes('aria-expanded')).toBe('true')
    const controls = alpha.attributes('aria-controls')
    expect(controls).toBeTruthy()
    expect(w.find(`[id="${controls}"]`).exists()).toBe(true)
    expect(w.get(item('b')).attributes('aria-expanded')).toBe('false')
    expect(w.get(item('deep')).attributes('aria-current')).toBe('page')
    expect(w.get('.v-sidebar__list').attributes('role')).toBe('list')
  })

  it('accordion closes open siblings (and their descendants) at the same level', async () => {
    const w = mount(VSidebar, { props: { ...base, expandedSections: ['a', 'a-sub'] } })
    expect(w.find(nested('deep')).exists()).toBe(true)
    await w.get(item('b')).trigger('click')
    expect(w.find(nested('b1')).exists()).toBe(true)
    expect(w.find(nested('a1')).exists()).toBe(false)
    expect(w.find(nested('deep')).exists()).toBe(false)
    expect(w.emitted('section-toggle')?.[0]).toEqual(['b', true])
    const last = w.emitted('update:expandedSections')?.at(-1)?.[0] as string[]
    expect(last).toEqual(['b'])
  })

  it('keeps siblings open when accordion is disabled', async () => {
    const w = mount(VSidebar, { props: { ...base, accordion: false, expandedSections: ['a'] } })
    await w.get(item('b')).trigger('click')
    expect(w.find(nested('b1')).exists()).toBe(true)
    expect(w.find(nested('a1')).exists()).toBe(true)
  })

  it('does not apply accordion between groups unless accordionGroups is set', async () => {
    const two: VSidebarItem[] = [
      { value: 'g1', label: 'One', type: 'group', children: [{ value: 'x', label: 'X' }] },
      { value: 'g2', label: 'Two', type: 'group', defaultOpen: false, children: [{ value: 'y', label: 'Y' }] },
    ]
    const w = mount(VSidebar, { props: { ...base, items: two } })
    expect(w.find(item('x')).exists()).toBe(true)
    await w.get('[data-test-id="v-sidebar-group-header-g2"]').trigger('click')
    expect(w.find(item('x')).exists()).toBe(true)
    expect(w.find(item('y')).exists()).toBe(true)

    const strict = mount(VSidebar, { props: { ...base, items: two, accordionGroups: true } })
    await strict.get('[data-test-id="v-sidebar-group-header-g2"]').trigger('click')
    expect(strict.find(item('x')).exists()).toBe(false)
    expect(strict.find(item('y')).exists()).toBe(true)
  })

  it('auto-expands the ancestors of the active item on mount and when it changes', async () => {
    const w = mount(VSidebar, { props: { ...base, activeItem: 'deep', expandedSections: [] } })
    await nextTick()
    expect(w.find(nested('deep')).exists()).toBe(true)
    expect(w.get(item('a')).element.closest('li')?.classList.contains('v-sidebar__item--contains-active')).toBe(true)

    await w.setProps({ activeItem: 'b1' })
    await nextTick()
    expect(w.find(nested('b1')).exists()).toBe(true)
    // accordion: opening Beta's chain closes the previous sibling chain
    expect(w.find(nested('deep')).exists()).toBe(false)
  })

  it('filters by label, keeps ancestors of matches and auto-expands them', async () => {
    const w = mount(VSidebar, { props: { ...base, expandedSections: [] } })
    await w.get('[data-test-id="v-sidebar-search-field"]').setValue('DEEP')
    expect(w.emitted('search')?.at(-1)).toEqual(['DEEP'])
    expect(w.find(item('a')).exists()).toBe(true)
    expect(w.find(item('a-sub')).exists()).toBe(true)
    expect(w.find(item('deep')).exists()).toBe(true)
    expect(w.find(item('home')).exists()).toBe(false)
    expect(w.find(item('b')).exists()).toBe(false)
    // groups without matches disappear
    expect(w.find('[data-test-id="v-sidebar-group-g"]').exists()).toBe(false)
    expect(w.find('[data-test-id="v-sidebar-group-fixed"]').exists()).toBe(false)
  })

  it('shows "No results" and can clear the query', async () => {
    const w = mount(VSidebar, { props: base })
    await w.get('[data-test-id="v-sidebar-search-field"]').setValue('zzz')
    expect(w.get('[data-test-id="v-sidebar-empty"]').text()).toBe('No results')
    await w.get('[data-test-id="v-sidebar-search-clear"]').trigger('click')
    expect(w.find('[data-test-id="v-sidebar-empty"]').exists()).toBe(false)
    expect(w.find(item('home')).exists()).toBe(true)
  })

  it('does not filter when filterOnSearch is false but still emits search', async () => {
    const w = mount(VSidebar, { props: { ...base, filterOnSearch: false } })
    await w.get('[data-test-id="v-sidebar-search-field"]').setValue('zzz')
    expect(w.emitted('search')?.[0]).toEqual(['zzz'])
    expect(w.find(item('home')).exists()).toBe(true)
  })

  it('renders the search shortcut hint', () => {
    const w = mount(VSidebar, { props: { ...base, searchShortcut: '/' } })
    expect(w.get('[data-test-id="v-sidebar-search-shortcut"]').text()).toBe('/')
  })

  it('collapses and expands groups; non-collapsible groups have no toggle', async () => {
    const w = mount(VSidebar, { props: base })
    const header = w.get('[data-test-id="v-sidebar-group-header-g"]')
    expect(header.attributes('aria-expanded')).toBe('true')
    expect(w.find(item('g1')).exists()).toBe(true)
    await header.trigger('click')
    expect(w.find(item('g1')).exists()).toBe(false)
    expect(header.attributes('aria-expanded')).toBe('false')
    await header.trigger('click')
    expect(w.find(item('g1')).exists()).toBe(true)
    expect(w.find('[data-test-id="v-sidebar-group-header-fixed"]').exists()).toBe(false)
    expect(w.find(item('f1')).exists()).toBe(true)
  })

  it('opens with ArrowRight, moves into the first child, and closes / goes to parent with ArrowLeft', async () => {
    const w = mount(VSidebar, { props: { ...base, expandedSections: [] }, attachTo: document.body })
    const alpha = w.get(item('a'))
    alpha.element.focus()
    await alpha.trigger('keydown', { key: 'ArrowRight' })
    expect(w.find(nested('a1')).exists()).toBe(true)

    await alpha.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(document.activeElement).toBe(w.get(item('a1')).element)

    await w.get(item('a1')).trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(document.activeElement).toBe(alpha.element)

    await alpha.trigger('keydown', { key: 'ArrowLeft' })
    expect(w.find(nested('a1')).exists()).toBe(false)
    w.unmount()
  })

  it('moves focus with ArrowDown / ArrowUp / Home / End over visible items and skips headings', async () => {
    const w = mount(VSidebar, { props: { ...base, expandedSections: ['a'] }, attachTo: document.body })
    const alpha = w.get(item('a'))
    alpha.element.focus()
    await alpha.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    // heading "Category" is skipped
    expect(document.activeElement).toBe(w.get(item('a1')).element)
    await w.get(item('a1')).trigger('keydown', { key: 'End' })
    await nextTick()
    expect(document.activeElement).toBe(w.get(item('f1')).element)
    await w.get(item('f1')).trigger('keydown', { key: 'Home' })
    await nextTick()
    expect(document.activeElement).toBe(w.get(item('home')).element)
    w.unmount()
  })

  it('selects with Enter exactly once', async () => {
    const w = mount(VSidebar, { props: base })
    await w.get(item('home')).trigger('keydown', { key: 'Enter' })
    expect(w.emitted('select')).toEqual([['home']])
  })

  it('renders tag, colored icon, primary badge and trailing slot', () => {
    const w = mount(VSidebar, {
      props: {
        ...base,
        items: [
          { value: 'soon', label: 'Soon item', tag: 'Soon', disabled: true },
          { value: 'proj', label: 'Project', iconColor: 'rebeccapurple' },
          { value: 'inbox', label: 'Inbox', badge: 10, badgeTone: 'primary' },
        ],
      },
      slots: { 'item-trailing': '<span class="trail">{{ params.item.value }}</span>' },
    })
    expect(w.get('[data-test-id="v-nav-item-tag"]').text()).toBe('Soon')
    expect(w.get('.v-nav-item__icon--swatch').attributes('style')).toContain('rebeccapurple')
    expect(w.get('.v-nav-item__badge--primary').text()).toBe('10')
    expect(w.findAll('.trail').map((n) => n.text())).toEqual(['soon', 'proj', 'inbox'])
  })

  it('renders header, before-nav and after-nav slots', () => {
    const w = mount(VSidebar, {
      props: base,
      slots: {
        header: '<span data-test-id="slot-header">WS</span>',
        'before-nav': '<span data-test-id="slot-before">B</span>',
        'after-nav': '<span data-test-id="slot-after">A</span>',
      },
    })
    expect(w.find('[data-test-id="slot-header"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-before"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-sidebar-after-nav"]').element.nextElementSibling).toBeNull()
  })

  it('collapsed rail: icon-only items with title; clicking a parent expands the sidebar and opens it', async () => {
    const w = mount(VSidebar, {
      props: {
        ...base,
        collapsed: true,
        items: [
          { value: 'home', label: 'Home', icon: 'home' },
          { value: 'team', label: 'Team', icon: 'team', children: [{ value: 'm', label: 'Members' }] },
        ],
      },
    })
    expect(w.get(item('home')).attributes('title')).toBe('Home')
    expect(w.find(nested('m')).exists()).toBe(false)
    await w.get(item('team')).trigger('click')
    expect(w.emitted('update:collapsed')?.[0]).toEqual([false])
    expect(w.get('[data-test-id="v-sidebar"]').attributes('data-collapsed')).toBe('false')
    expect(w.find(nested('m')).exists()).toBe(true)
  })

  it('collapsed rail renders groups as a divider', () => {
    const w = mount(VSidebar, { props: { ...base, collapsed: true } })
    expect(w.findAll('.v-sidebar__divider').length).toBe(2)
    expect(w.find('[data-test-id="v-sidebar-group-header-g"]').exists()).toBe(false)
    expect(w.find(item('g1')).exists()).toBe(true)
  })

  it('exposes scroll state attributes on the nav', () => {
    const w = mount(VSidebar, { props: base })
    const nav = w.get('[data-test-id="v-sidebar-nav"]')
    expect(nav.attributes('data-scroll-top')).toBe('true')
    expect(nav.attributes('data-scroll-bottom')).toBe('true')
  })
})
