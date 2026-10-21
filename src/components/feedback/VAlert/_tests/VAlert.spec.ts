/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VAlert from '../VAlert.vue'

const root = (wrapper: ReturnType<typeof mount>) => wrapper.find('[data-test-id="v-alert"]')

describe('VAlert', () => {
  it('renders semantic alert anatomy with stable test ids and defaults', () => {
    const wrapper = mount(VAlert, {
      props: { title: 'New update available!', description: 'Version 2.4 includes improvements.' },
    })
    const alert = root(wrapper)

    expect(alert.exists()).toBe(true)
    expect(alert.attributes('role')).toBe('alert')
    expect(alert.attributes('data-variant')).toBe('info')
    expect(alert.attributes('data-size')).toBe('md')
    expect(wrapper.find('[data-test-id="v-alert-icon"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-alert-title"]').text()).toContain('New update available!')
    expect(wrapper.get('[data-test-id="v-alert-description"]').text()).toContain('Version 2.4')
    expect(wrapper.find('[data-test-id="v-alert-content"]').exists()).toBe(true)
  })

  it('supports every poster variant', () => {
    for (const variant of ['info', 'success', 'warning', 'danger', 'neutral'] as const) {
      const wrapper = mount(VAlert, { props: { variant } })
      expect(root(wrapper).attributes('data-variant')).toBe(variant)
      expect(wrapper.find('[data-test-id="v-alert-icon"]').exists()).toBe(true)
    }
  })

  it('supports poster sizes and banner layout', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const wrapper = mount(VAlert, { props: { size } })
      expect(root(wrapper).classes()).toContain('v-alert--' + size)
      expect(root(wrapper).attributes('data-size')).toBe(size)
    }

    const banner = mount(VAlert, { props: { layout: 'banner' } })
    expect(root(banner).classes()).toContain('v-alert--banner')
    expect(root(banner).attributes('data-layout')).toBe('banner')
  })

  it('renders named slots and a custom action', () => {
    const wrapper = mount(VAlert, {
      slots: {
        icon: '<span class="custom-icon">!</span>',
        title: 'Slot title',
        description: 'Slot description',
        default: 'Slot message',
        action: '<a href="#review">Review</a>',
      },
    })

    expect(wrapper.get('[data-test-id="v-alert-title"]').text()).toBe('Slot title')
    expect(wrapper.get('[data-test-id="v-alert-description"]').text()).toBe('Slot description')
    expect(wrapper.get('[data-test-id="v-alert-message"]').text()).toBe('Slot message')
    expect(wrapper.get('[data-test-id="v-alert-action"]').text()).toBe('Review')
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('dismisses with the native close button and emits both events', async () => {
    const wrapper = mount(VAlert, {
      props: { title: 'Dismiss me', dismissible: true },
    })
    const close = wrapper.get('[data-test-id="v-alert-close"]')

    expect(close.attributes('type')).toBe('button')
    expect(close.attributes('aria-label')).toBe('Dismiss alert')
    await close.trigger('click')

    expect(wrapper.emitted('dismiss')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(root(wrapper).exists()).toBe(false)
  })

  it('does not dismiss when disabled or loading', async () => {
    for (const props of [{ disabled: true }, { loading: true }] as const) {
      const wrapper = mount(VAlert, { props: { ...props, dismissible: true } })
      const alert = root(wrapper)
      const close = wrapper.get('[data-test-id="v-alert-close"]')

      expect(alert.attributes('aria-disabled')).toBe(props.disabled ? 'true' : undefined)
      expect(alert.attributes('aria-busy')).toBe(props.loading ? 'true' : undefined)
      expect((close.element as HTMLButtonElement).disabled).toBe(true)
      await close.trigger('click')
      expect(wrapper.emitted('dismiss')).toBeUndefined()
    }
  })

  it('renders loading semantics and spinner test id', () => {
    const wrapper = mount(VAlert, { props: { loading: true } })

    expect(wrapper.get('[data-test-id="v-alert-spinner"]').attributes('role')).toBe('status')
    expect(wrapper.get('[data-test-id="v-alert-spinner"]').attributes('aria-live')).toBe('polite')
    expect(wrapper.get('[data-test-id="v-alert"]').attributes('data-state')).toBe('loading')
  })

  it('supports controlled visibility through modelValue', async () => {
    const wrapper = mount(VAlert, { props: { modelValue: false, dismissible: true } })
    expect(root(wrapper).exists()).toBe(false)

    await wrapper.setProps({ modelValue: true })
    expect(root(wrapper).exists()).toBe(true)
  })

  it('maps ariaLabel and custom dismissLabel to the public DOM', () => {
    const wrapper = mount(VAlert, {
      props: { ariaLabel: 'System status', dismissible: true, dismissLabel: 'Close system status' },
    })

    expect(root(wrapper).attributes('aria-label')).toBe('System status')
    expect(wrapper.get('[data-test-id="v-alert-close"]').attributes('aria-label')).toBe('Close system status')
  })
})
