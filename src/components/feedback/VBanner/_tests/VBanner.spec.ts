/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import VBanner from '../VBanner.vue'

describe('VBanner', () => {
  it('renders the default info anatomy with stable test ids', () => {
    const wrapper = mount(VBanner, {
      props: {
        title: 'New version available',
        description: 'A new version of VueUI Nova is available.',
      },
    })
    const root = wrapper.get('[data-test-id="v-banner"]')

    expect(root.attributes('role')).toBe('status')
    expect(root.attributes('aria-live')).toBe('polite')
    expect(root.attributes('data-variant')).toBe('info')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-state')).toBe('default')
    expect(wrapper.get('[data-test-id="v-banner-icon"]').get('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-banner-title"]').text()).toContain('New version available')
    expect(wrapper.get('[data-test-id="v-banner-description"]').text()).toContain('available')
  })

  it('maps each variant to its semantic role and icon', () => {
    const expected = {
      info: 'status',
      success: 'status',
      warning: 'alert',
      error: 'alert',
      neutral: 'status',
    } as const

    for (const [variant, role] of Object.entries(expected)) {
      const wrapper = mount(VBanner, { props: { variant: variant as keyof typeof expected } })
      expect(wrapper.get('[data-test-id="v-banner"]').attributes('role')).toBe(role)
      expect(wrapper.get('[data-test-id="v-banner-icon"]').get('[data-test-id="v-icon"]').exists()).toBe(true)
    }
  })

  it('supports sizes, title/description slots, icon and action slots', () => {
    const wrapper = mount(VBanner, {
      props: { size: 'lg', title: 'Ignored by title slot', description: 'Ignored by description slot' },
      slots: {
        icon: '<span data-test-id="custom-icon">!</span>',
        title: '<strong data-test-id="custom-title">Custom title</strong>',
        description: '<span data-test-id="custom-description">Custom description</span>',
        action: '<button data-test-id="custom-action">View</button>',
      },
    })
    const root = wrapper.get('[data-test-id="v-banner"]')

    expect(root.classes()).toContain('v-banner--lg')
    expect(wrapper.findAll('[data-test-id="custom-icon"]').length).toBe(1)
    expect(wrapper.get('[data-test-id="custom-title"]').text()).toBe('Custom title')
    expect(wrapper.get('[data-test-id="custom-description"]').text()).toBe('Custom description')
    expect(wrapper.findAll('[data-test-id="custom-action"]').length).toBe(1)
  })

  it('dismisses with click, emits close and update:modelValue, and exposes a placeholder', async () => {
    const wrapper = mount(VBanner, { props: { closable: true, title: 'Dismiss me' } })
    await wrapper.get('[data-test-id="v-banner-dismiss"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    const placeholder = wrapper.get('[data-test-id="v-banner-dismissed-placeholder"]')
    expect(placeholder.text()).toBe('Banner dismissed')
    expect(placeholder.attributes('data-state')).toBe('dismissed')
  })

  it('dismisses with Escape and can opt out of Escape dismissal', async () => {
    const closable = mount(VBanner, { props: { closable: true } })
    await closable.get('[data-test-id="v-banner"]').trigger('keydown', { key: 'Escape' })
    expect(closable.emitted('close')).toHaveLength(1)

    const persistent = mount(VBanner, { props: { closable: true, closeOnEscape: false } })
    await persistent.get('[data-test-id="v-banner"]').trigger('keydown', { key: 'Escape' })
    expect(persistent.emitted('close')).toBeUndefined()
    expect(persistent.findAll('[data-test-id="v-banner-dismiss"]').length).toBe(1)
  })

  it('keeps dismiss unavailable while disabled or loading', async () => {
    const disabled = mount(VBanner, { props: { closable: true, disabled: true } })
    const disabledRoot = disabled.get('[data-test-id="v-banner"]')
    expect(disabledRoot.attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-banner-dismiss"]').attributes('disabled')).toBeDefined()
    await disabled.get('[data-test-id="v-banner-dismiss"]').trigger('click')
    expect(disabled.emitted('close')).toBeUndefined()

    const loading = mount(VBanner, { props: { closable: true, loading: true } })
    const loadingRoot = loading.get('[data-test-id="v-banner"]')
    expect(loadingRoot.attributes('aria-busy')).toBe('true')
    expect(loadingRoot.attributes('data-state')).toBe('loading')
    expect(loading.get('[data-test-id="v-banner-loader"]').attributes('role')).toBe('status')
    expect(loading.get('[data-test-id="v-banner-dismiss"]').attributes('disabled')).toBeDefined()
  })

  it('supports controlled visibility and custom dismiss labels', async () => {
    const wrapper = mount(VBanner, { props: { modelValue: false, dismissLabel: 'Close update' } })
    expect(wrapper.findAll('[data-test-id="v-banner-dismissed-placeholder"]').length).toBe(1)

    await wrapper.setProps({ modelValue: true, closable: true })
    expect(wrapper.get('[data-test-id="v-banner-dismiss"]').attributes('aria-label')).toBe('Close update')
  })

  it('moves focus to the next focusable element after dismiss', async () => {
    const after = document.createElement('button')
    after.textContent = 'Next'
    const wrapper = mount(VBanner, { props: { closable: true }, attachTo: document.body })
    document.body.appendChild(after)

    await wrapper.get('[data-test-id="v-banner-dismiss"]').trigger('click')
    await nextTick()

    expect(document.activeElement).toBe(after)
    wrapper.unmount()
    after.remove()
  })
})
