/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VNavItem from '../VNavItem.vue'

describe('VNavItem', () => {
  it('renders as button with stable test id', () => {
    const w = mount(VNavItem, { props: { label: 'Dashboard', icon: 'home' } })
    const root = w.get('[data-test-id="v-nav-item"]')
    expect(root.element.tagName).toBe('BUTTON')
    expect(root.attributes('type')).toBe('button')
  })

  it('renders label and icon', () => {
    const w = mount(VNavItem, { props: { label: 'Projects', icon: 'projects' } })
    expect(w.get('[data-test-id="v-nav-item-label"]').text()).toBe('Projects')
    expect(w.find('[data-test-id="v-nav-item-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders as anchor when href is provided', () => {
    const w = mount(VNavItem, {
      props: { label: 'Settings', href: '/settings' },
    })
    const root = w.get('[data-test-id="v-nav-item"]')
    expect(root.element.tagName).toBe('A')
    expect(root.attributes('href')).toBe('/settings')
  })

  it('applies active state with aria-current', () => {
    const w = mount(VNavItem, { props: { label: 'Dashboard', active: true } })
    const root = w.get('[data-test-id="v-nav-item"]')
    expect(root.classes()).toContain('v-nav-item--active')
    expect(root.attributes('aria-current')).toBe('page')
    expect(root.attributes('data-active')).toBe('true')
  })

  it('renders optional badge', () => {
    const w = mount(VNavItem, { props: { label: 'Inbox', badge: 5 } })
    expect(w.get('[data-test-id="v-nav-item-badge"]').text()).toBe('5')
  })

  it('supports collapsed mode hiding label and badge', () => {
    const w = mount(VNavItem, {
      props: { label: 'Dashboard', icon: 'home', badge: 2, collapsed: true, ariaLabel: 'Dashboard' },
    })
    expect(w.find('[data-test-id="v-nav-item-label"]').exists()).toBe(false)
    expect(w.find('[data-test-id="v-nav-item-badge"]').exists()).toBe(false)
    expect(w.find('[data-test-id="v-nav-item-icon"]').exists()).toBe(true)
  })

  it('supports disabled and loading states', () => {
    const disabled = mount(VNavItem, { props: { label: 'Team', disabled: true } })
    expect(disabled.get('[data-test-id="v-nav-item"]').attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-nav-item"]').attributes('data-state')).toBe('disabled')

    const loading = mount(VNavItem, { props: { label: 'Team', loading: true } })
    expect(loading.get('[data-test-id="v-nav-item"]').attributes('aria-busy')).toBe('true')
    expect(loading.find('[data-test-id="v-nav-item-loader"]').exists()).toBe(true)
    expect(loading.get('[data-test-id="v-nav-item"]').attributes('data-state')).toBe('loading')
  })

  it('emits click and select on interaction', async () => {
    const w = mount(VNavItem, { props: { label: 'Analytics', value: 'analytics' } })
    await w.get('[data-test-id="v-nav-item"]').trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
    expect(w.emitted('select')?.[0]).toEqual([{ value: 'analytics', href: undefined }])
  })

  it('applies size and variant modifiers', () => {
    const w = mount(VNavItem, {
      props: { label: 'Design', size: 'lg', variant: 'primary' },
    })
    const root = w.get('[data-test-id="v-nav-item"]')
    expect(root.classes()).toContain('v-nav-item--lg')
    expect(root.classes()).toContain('v-nav-item--primary')
    expect(root.attributes('data-size')).toBe('lg')
    expect(root.attributes('data-variant')).toBe('primary')
  })
})
