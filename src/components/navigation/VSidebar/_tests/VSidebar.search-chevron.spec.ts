/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSidebar from '../VSidebar.vue'
import type { VSidebarItem } from '../VSidebar.types'

const items: VSidebarItem[] = [
  { value: 'home', label: 'Home' },
  {
    value: 'team',
    label: 'People',
    children: [
      { value: 'members', label: 'Members' },
      {
        value: 'permissions',
        label: 'Permissions',
        children: [
          { value: 'p-read', label: 'Read access' },
          { value: 'p-write', label: 'Write access' },
        ],
      },
      { value: 'roles', label: 'Roles' },
    ],
  },
  { value: 'billing', label: 'Billing' },
]

const base = { items, showFooter: false, activeItem: 'home' }
const id = (v: string) => `[data-test-id="v-sidebar-nav-item-${v}"]`
const search = (w: ReturnType<typeof mount>, q: string) =>
  w.get('[data-test-id="v-sidebar-search-field"]').setValue(q)

describe('VSidebar search: parent match', () => {
  it('shows a matching parent expanded with ALL its descendants', async () => {
    const w = mount(VSidebar, { props: base, attachTo: document.body })
    await search(w, 'perm')
    expect(w.find(id('permissions')).exists()).toBe(true)
    expect(w.find(id('permissions')).attributes('aria-expanded')).toBe('true')
    // non-matching children are still shown
    expect(w.find(id('p-read')).exists()).toBe(true)
    expect(w.find(id('p-write')).exists()).toBe(true)
    // ancestor is kept; unrelated siblings of the match are not
    expect(w.find(id('team')).exists()).toBe(true)
    expect(w.find(id('members')).exists()).toBe(false)
    expect(w.find(id('billing')).exists()).toBe(false)
    w.unmount()
  })

  it('leaf match keeps ancestors shown and expanded', async () => {
    const w = mount(VSidebar, { props: base, attachTo: document.body })
    await search(w, 'access')
    expect(w.find(id('team')).attributes('aria-expanded')).toBe('true')
    expect(w.find(id('permissions')).attributes('aria-expanded')).toBe('true')
    expect(w.find(id('p-read')).exists()).toBe(true)
    expect(w.find(id('p-write')).exists()).toBe(true)
    expect(w.find(id('roles')).exists()).toBe(false)
    w.unmount()
  })

  it('highlights the matched substring with <mark>', async () => {
    const w = mount(VSidebar, { props: base })
    await search(w, 'perm')
    const marks = w.findAll('mark.v-sidebar__mark')
    expect(marks.length).toBeGreaterThan(0)
    expect(marks[0].text().toLowerCase()).toBe('perm')
    expect(w.get(id('permissions')).text()).toBe('Permissions')
  })

  it('renders no marks without a query and "No results" for no match', async () => {
    const w = mount(VSidebar, { props: base })
    expect(w.findAll('mark').length).toBe(0)
    await search(w, 'zzz')
    expect(w.get('[data-test-id="v-sidebar-empty"]').text()).toBe('No results')
  })
})

describe('VSidebar chevron options', () => {
  const nested = { ...base, expandedSections: [] as string[] }
  const groups: VSidebarItem[] = [
    { value: 'g', label: 'Menu', type: 'group', children: [{ value: 'x', label: 'X' }] },
  ]

  it('defaults to the rotating chevron', () => {
    const w = mount(VSidebar, { props: nested })
    expect(w.classes()).not.toContain('v-sidebar--chevron-updown')
    expect(w.classes()).not.toContain('v-sidebar--group-open-up')
    expect(w.find('.v-sidebar__item-chevron--updown').exists()).toBe(false)
  })

  it('chevron="updown" swaps down (closed) and up (open) icons', async () => {
    const w = mount(VSidebar, { props: { ...nested, chevron: 'updown' } })
    expect(w.classes()).toContain('v-sidebar--chevron-updown')
    const closed = w.get(`${id('team')} .v-sidebar__item-chevron`)
    expect(closed.classes()).toContain('v-sidebar__item-chevron--updown')
    const closedHtml = closed.html()
    await w.get(id('team')).trigger('click')
    const openHtml = w.get(`${id('team')} .v-sidebar__item-chevron`).html()
    expect(openHtml).not.toBe(closedHtml)
  })

  it('groupChevronOpen="up" adds the modifier class; default does not', () => {
    const up = mount(VSidebar, { props: { items: groups, groupChevronOpen: 'up', showFooter: false } })
    expect(up.classes()).toContain('v-sidebar--group-open-up')
    const down = mount(VSidebar, { props: { items: groups, showFooter: false } })
    expect(down.classes()).not.toContain('v-sidebar--group-open-up')
  })
})
