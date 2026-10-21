/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VTopBar from '../VTopBar.vue'

describe('VTopBar', () => {
  it('renders as application banner with stable test id', () => {
    const w = mount(VTopBar, { props: { title: 'Dashboard' } })
    const root = w.get('[data-test-id="v-top-bar"]')
    expect(root.element.tagName).toBe('HEADER')
    expect(root.attributes('role')).toBe('banner')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-size')).toBe('md')
  })

  it('renders title in content area by default', () => {
    const w = mount(VTopBar, { props: { title: 'Projects' } })
    expect(w.get('[data-test-id="v-top-bar-title"]').text()).toBe('Projects')
  })

  it('supports leading and actions slots', () => {
    const w = mount(VTopBar, {
      slots: {
        leading: '<span data-test-id="brand">Acme</span>',
        default: '<nav data-test-id="nav">Nav</nav>',
        actions: '<button type="button" data-test-id="profile">Profile</button>',
      },
    })
    expect(w.find('[data-test-id="v-top-bar-leading"]').exists()).toBe(true)
    expect(w.find('[data-test-id="brand"]').exists()).toBe(true)
    expect(w.find('[data-test-id="nav"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-top-bar-actions"]').exists()).toBe(true)
    expect(w.find('[data-test-id="profile"]').exists()).toBe(true)
  })

  it('supports disabled and loading states', () => {
    const disabled = mount(VTopBar, { props: { disabled: true, title: 'App' } })
    expect(disabled.get('[data-test-id="v-top-bar"]').attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-top-bar"]').attributes('data-state')).toBe('disabled')

    const loading = mount(VTopBar, { props: { loading: true, title: 'App' } })
    expect(loading.get('[data-test-id="v-top-bar"]').attributes('aria-busy')).toBe('true')
    expect(loading.get('[data-test-id="v-top-bar-loader"]').exists()).toBe(true)
    expect(loading.get('[data-test-id="v-top-bar"]').attributes('data-state')).toBe('loading')
  })

  it('applies bordered, sticky and variant modifiers', () => {
    const w = mount(VTopBar, {
      props: {
        title: 'App',
        bordered: false,
        sticky: true,
        variant: 'primary',
        size: 'lg',
      },
    })
    const root = w.get('[data-test-id="v-top-bar"]')
    expect(root.classes()).not.toContain('v-top-bar--bordered')
    expect(root.classes()).toContain('v-top-bar--sticky')
    expect(root.classes()).toContain('v-top-bar--primary')
    expect(root.classes()).toContain('v-top-bar--lg')
  })

  it('renders app navigation pills and emits the selected item', async () => {
    const w = mount(VTopBar, {
      props: {
        variant: 'app',
        activeItem: 'traces',
        items: [
          { value: 'overview', label: 'Overview' },
          { value: 'traces', label: 'Traces' },
        ],
      },
    })
    expect(w.get('[data-test-id="v-top-bar"]').classes()).toContain('v-top-bar--app')
    expect(w.get('[data-test-id="v-top-bar-nav-item-traces"]').attributes('aria-current')).toBe('page')
    await w.get('[data-test-id="v-top-bar-nav-item-overview"]').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['overview'])
    expect(w.emitted('update:activeItem')?.[0]).toEqual(['overview'])
    expect(w.get('[data-test-id="v-top-bar-nav-item-overview"]').attributes('aria-current')).toBe('page')
  })

  it('nav is a scroll container and scrolls the active item into view on mount', () => {
    const proto = HTMLElement.prototype as any
    const rect = vi.spyOn(proto, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return (this.tagName === 'BUTTON' ? { left: 500, right: 580 } : { left: 0, right: 200 }) as DOMRect
    })
    let scrolled = 0
    const spy4 = vi.spyOn(proto, 'scrollLeft', 'set').mockImplementation((v: number) => { scrolled = v })
    const w = mount(VTopBar, {
      attachTo: document.body,
      props: { variant: 'app', activeItem: 'b', items: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] },
    })
    const nav = w.get('[data-test-id="v-top-bar-nav"]')
    expect(nav.classes()).toContain('v-top-bar__nav')
    expect(scrolled).toBeGreaterThan(0)
    spy4.mockRestore(); rect.mockRestore()
    w.unmount()
  })
})
