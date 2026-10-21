/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VBottomUtilityBar from '../VBottomUtilityBar.vue'

describe('VBottomUtilityBar', () => {
  it('renders as contentinfo footer with stable test id', () => {
    const w = mount(VBottomUtilityBar, {
      slots: { default: '<span data-test-id="content">Saved</span>' },
    })
    const root = w.get('[data-test-id="v-bottom-utility-bar"]')
    expect(root.element.tagName).toBe('FOOTER')
    expect(root.attributes('role')).toBe('contentinfo')
  })

  it('renders default content slot', () => {
    const w = mount(VBottomUtilityBar, {
      slots: { default: '<span data-test-id="content">Draft saved</span>' },
    })
    expect(w.get('[data-test-id="v-bottom-utility-bar-content"]').text()).toContain('Draft saved')
  })

  it('supports status and actions slots', () => {
    const w = mount(VBottomUtilityBar, {
      slots: {
        status: '<span data-test-id="status">3 selected</span>',
        default: '<span>Main content</span>',
        actions: '<button type="button" data-test-id="save">Save</button>',
      },
    })
    expect(w.get('[data-test-id="v-bottom-utility-bar-status"]').text()).toContain('3 selected')
    expect(w.find('[data-test-id="v-bottom-utility-bar-actions"]').exists()).toBe(true)
    expect(w.find('[data-test-id="save"]').exists()).toBe(true)
  })

  it('applies fixed, safe-area and bordered modifiers by default', () => {
    const w = mount(VBottomUtilityBar)
    const root = w.get('[data-test-id="v-bottom-utility-bar"]')
    expect(root.classes()).toContain('v-bottom-utility-bar--fixed')
    expect(root.classes()).toContain('v-bottom-utility-bar--safe-area')
    expect(root.classes()).toContain('v-bottom-utility-bar--bordered')
  })

  it('can disable fixed positioning', () => {
    const w = mount(VBottomUtilityBar, { props: { fixed: false } })
    expect(w.get('[data-test-id="v-bottom-utility-bar"]').classes()).not.toContain('v-bottom-utility-bar--fixed')
  })

  it('supports disabled and loading states', () => {
    const disabled = mount(VBottomUtilityBar, { props: { disabled: true } })
    expect(disabled.get('[data-test-id="v-bottom-utility-bar"]').attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-bottom-utility-bar"]').attributes('data-state')).toBe('disabled')

    const loading = mount(VBottomUtilityBar, { props: { loading: true } })
    expect(loading.get('[data-test-id="v-bottom-utility-bar"]').attributes('aria-busy')).toBe('true')
    expect(loading.find('[data-test-id="v-bottom-utility-bar-loader"]').exists()).toBe(true)
  })

  it('applies size and variant modifiers', () => {
    const w = mount(VBottomUtilityBar, { props: { size: 'lg', variant: 'primary' } })
    const root = w.get('[data-test-id="v-bottom-utility-bar"]')
    expect(root.classes()).toContain('v-bottom-utility-bar--lg')
    expect(root.classes()).toContain('v-bottom-utility-bar--primary')
    expect(root.attributes('data-size')).toBe('lg')
    expect(root.attributes('data-variant')).toBe('primary')
  })

  it('uses custom aria label when provided', () => {
    const w = mount(VBottomUtilityBar, { props: { ariaLabel: 'Editor actions' } })
    expect(w.get('[data-test-id="v-bottom-utility-bar"]').attributes('aria-label')).toBe('Editor actions')
  })

  it('hides status region when slot is absent', () => {
    const w = mount(VBottomUtilityBar, { slots: { default: 'Only content' } })
    expect(w.find('[data-test-id="v-bottom-utility-bar-status"]').exists()).toBe(false)
  })
})
