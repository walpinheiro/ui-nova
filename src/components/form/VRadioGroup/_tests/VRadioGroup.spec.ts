/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VRadioGroup from '../VRadioGroup.vue'

const options = [
  { value: 'email', label: 'Email', description: 'Via email' },
  { value: 'push', label: 'Push', description: 'On device' },
  { value: 'sms', label: 'SMS', description: 'Text alerts' },
]

describe('VRadioGroup', () => {
  it('renders and exposes stable test ids', () => {
    const w = mount(VRadioGroup, { props: { label: 'Method', options } })
    expect(w.find('[data-test-id="v-radiogroup"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-radiogroup-legend"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-radiogroup-options"]').exists()).toBe(true)
  })

  it('defaults to md size and vertical layout', () => {
    const w = mount(VRadioGroup, { props: { label: 'Method', options } })
    const root = w.get('[data-test-id="v-radiogroup"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-layout')).toBe('vertical')
    expect(root.classes()).toContain('v-radiogroup--vertical')
  })

  it('renders legend and option labels', () => {
    const w = mount(VRadioGroup, { props: { label: 'Choose a plan', options } })
    expect(w.get('[data-test-id="v-radiogroup-legend"]').text()).toBe('Choose a plan')
    expect(w.get('[data-test-id="v-radiogroup-label-email"]').text()).toBe('Email')
    expect(w.get('[data-test-id="v-radiogroup-description-email"]').text()).toBe('Via email')
  })

  it('renders native radio inputs sharing the same name', () => {
    const w = mount(VRadioGroup, { props: { name: 'notify', options, modelValue: 'email' } })
    const inputs = w.findAll('[data-test-id^="v-radiogroup-input-"]')
    expect(inputs).toHaveLength(3)
    inputs.forEach((input) => {
      expect(input.attributes('name')).toBe('notify')
      expect(input.attributes('type')).toBe('radio')
    })
    expect((inputs[0].element as HTMLInputElement).checked).toBe(true)
  })

  it('supports v-model updates', async () => {
    const w = mount(VRadioGroup, {
      props: {
        options,
        modelValue: 'email',
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
    })
    const push = w.get('[data-test-id="v-radiogroup-input-push"]')
    await push.setValue()
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['push'])
    expect(w.emitted('change')?.[0]).toEqual(['push'])
  })

  it('marks selected option with selected class', () => {
    const w = mount(VRadioGroup, { props: { options, modelValue: 'push' } })
    const selected = w.get('[data-test-id="v-radiogroup-option-push"]')
    expect(selected.classes()).toContain('v-radiogroup__option--selected')
  })

  it('renders error state with aria-invalid', () => {
    const w = mount(VRadioGroup, {
      props: { label: 'Plan', options, errorMessage: 'Required' },
    })
    const root = w.get('[data-test-id="v-radiogroup"]')
    expect(root.attributes('data-state')).toBe('invalid')
    expect(root.classes()).toContain('v-radiogroup--error')
    expect(root.attributes('aria-invalid')).toBe('true')
    expect(w.get('[data-test-id="v-radiogroup-error"]').text()).toContain('Required')
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('supports horizontal layout class', () => {
    const w = mount(VRadioGroup, { props: { options, layout: 'horizontal' } })
    expect(w.get('[data-test-id="v-radiogroup"]').classes()).toContain('v-radiogroup--horizontal')
    expect(w.get('[data-test-id="v-radiogroup"]').attributes('data-layout')).toBe('horizontal')
  })

  it('supports card layout class', () => {
    const w = mount(VRadioGroup, { props: { options, layout: 'card' } })
    expect(w.get('[data-test-id="v-radiogroup"]').classes()).toContain('v-radiogroup--card')
  })

  it('applies size classes', () => {
    const w = mount(VRadioGroup, { props: { options, size: 'lg' } })
    expect(w.get('[data-test-id="v-radiogroup"]').classes()).toContain('v-radiogroup--lg')
    expect(w.get('[data-test-id="v-radiogroup"]').attributes('data-size')).toBe('lg')
  })

  it('supports disabled group', () => {
    const w = mount(VRadioGroup, { props: { options, disabled: true, modelValue: 'email' } })
    const root = w.get('[data-test-id="v-radiogroup"]')
    expect(root.attributes('data-state')).toBe('disabled')
    expect(root.classes()).toContain('v-radiogroup--disabled')
    w.findAll('[data-test-id^="v-radiogroup-input-"]').forEach((input) => {
      expect((input.element as HTMLInputElement).disabled).toBe(true)
    })
  })

  it('supports per-option disabled state', () => {
    const w = mount(VRadioGroup, {
      props: {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      },
    })
    expect(w.get('[data-test-id="v-radiogroup-option-b"]').classes()).toContain('v-radiogroup__option--disabled')
    expect((w.get('[data-test-id="v-radiogroup-input-b"]').element as HTMLInputElement).disabled).toBe(true)
  })

  it('associates option description via aria-describedby', () => {
    const w = mount(VRadioGroup, { props: { id: 'rg-1', options, modelValue: 'email' } })
    const input = w.get('[data-test-id="v-radiogroup-input-email"]')
    expect(input.attributes('aria-describedby')).toBe('rg-1-description-email')
  })
})
