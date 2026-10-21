/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSwitch from '../VSwitch.vue'

describe('VSwitch', () => {
  it('renders and exposes stable test ids', () => {
    const w = mount(VSwitch)
    expect(w.find('[data-test-id="v-switch"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-switch-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-switch-track"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-switch-thumb"]').exists()).toBe(true)
  })

  it('defaults to md size and off state', () => {
    const w = mount(VSwitch)
    const root = w.get('[data-test-id="v-switch"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-state')).toBe('off')
  })

  it('uses role switch on native input', () => {
    const w = mount(VSwitch)
    const input = w.get('[data-test-id="v-switch-input"]')
    expect(input.attributes('role')).toBe('switch')
    expect(input.attributes('type')).toBe('checkbox')
  })

  it('supports v-model updates', async () => {
    const w = mount(VSwitch, {
      props: {
        modelValue: false,
        'onUpdate:modelValue': (v: boolean) => w.setProps({ modelValue: v }),
      },
    })
    const input = w.get('[data-test-id="v-switch-input"]')
    await input.setValue(true)
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(w.emitted('change')?.[0]).toEqual([true])
  })

  it('renders on state with aria-checked', () => {
    const w = mount(VSwitch, { props: { modelValue: true } })
    const root = w.get('[data-test-id="v-switch"]')
    const input = w.get('[data-test-id="v-switch-input"]')
    expect(root.attributes('data-state')).toBe('on')
    expect(root.classes()).toContain('v-switch--on')
    expect(input.attributes('aria-checked')).toBe('true')
  })

  it('renders label and description', () => {
    const w = mount(VSwitch, {
      props: {
        id: 'sw-1',
        label: 'Dark mode',
        description: 'Comfortable viewing',
      },
    })
    const input = w.get('[data-test-id="v-switch-input"]')
    expect(w.get('[data-test-id="v-switch-label"]').text()).toBe('Dark mode')
    expect(w.get('[data-test-id="v-switch-description"]').text()).toBe('Comfortable viewing')
    expect(input.attributes('aria-describedby')).toBe('sw-1-description')
  })

  it('renders icon when showIcon and checked', () => {
    const w = mount(VSwitch, { props: { modelValue: true, showIcon: true } })
    expect(w.find('[data-test-id="v-switch-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('hides icon when showIcon is false', () => {
    const w = mount(VSwitch, { props: { modelValue: true, showIcon: false } })
    expect(w.find('[data-test-id="v-switch-icon"]').exists()).toBe(false)
  })

  it('toggles on Enter key', async () => {
    const w = mount(VSwitch, {
      props: {
        modelValue: false,
        'onUpdate:modelValue': (v: boolean) => w.setProps({ modelValue: v }),
      },
    })
    const input = w.get('[data-test-id="v-switch-input"]')
    await input.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('applies size classes', () => {
    const w = mount(VSwitch, { props: { size: 'lg' } })
    expect(w.get('[data-test-id="v-switch"]').classes()).toContain('v-switch--lg')
    expect(w.get('[data-test-id="v-switch"]').attributes('data-size')).toBe('lg')
  })

  it('supports disabled state', () => {
    const w = mount(VSwitch, { props: { disabled: true, modelValue: true } })
    const root = w.get('[data-test-id="v-switch"]')
    const input = w.get('[data-test-id="v-switch-input"]')
    expect(root.attributes('data-state')).toBe('disabled')
    expect(root.classes()).toContain('v-switch--disabled')
    expect((input.element as HTMLInputElement).disabled).toBe(true)
  })

  it('uses aria-label when unlabeled', () => {
    const w = mount(VSwitch, { props: { ariaLabel: 'Notifications' } })
    expect(w.get('[data-test-id="v-switch-input"]').attributes('aria-label')).toBe('Notifications')
  })

  it('supports label slot override', () => {
    const w = mount(VSwitch, {
      slots: { label: '<span data-test-id="custom-label">Custom</span>' },
    })
    expect(w.find('[data-test-id="custom-label"]').exists()).toBe(true)
  })
})
