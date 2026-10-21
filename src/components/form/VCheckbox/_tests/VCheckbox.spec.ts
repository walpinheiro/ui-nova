/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VCheckbox from '../VCheckbox.vue'

describe('VCheckbox', () => {
  it('renders and exposes stable test ids', () => {
    const w = mount(VCheckbox, { props: { label: 'Product updates' } })
    expect(w.find('[data-test-id="v-checkbox"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-checkbox-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-checkbox-box"]').exists()).toBe(true)
  })

  it('defaults to md size and unchecked state', () => {
    const w = mount(VCheckbox, { props: { label: 'Option' } })
    const root = w.get('[data-test-id="v-checkbox"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-state')).toBe('unchecked')
  })

  it('renders label associated with input', () => {
    const w = mount(VCheckbox, { props: { label: 'Enable 2FA', id: 'checkbox-2fa' } })
    const label = w.get('[data-test-id="v-checkbox-label"]')
    const input = w.get('[data-test-id="v-checkbox-input"]')
    expect(label.text()).toContain('Enable 2FA')
    expect(input.attributes('id')).toBe('checkbox-2fa')
  })

  it('supports v-model updates', async () => {
    const w = mount(VCheckbox, {
      props: {
        label: 'Updates',
        modelValue: false,
        'onUpdate:modelValue': (v: boolean) => w.setProps({ modelValue: v }),
      },
    })
    const input = w.get('[data-test-id="v-checkbox-input"]')
    await input.setValue(true)
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(w.emitted('change')?.[0]).toEqual([true])
  })

  it('renders checked state with icon', () => {
    const w = mount(VCheckbox, { props: { label: 'Checked', modelValue: true, motion: 'default' } })
    const root = w.get('[data-test-id="v-checkbox"]')
    expect(root.attributes('data-state')).toBe('checked')
    expect(root.classes()).toContain('v-checkbox--checked')
    expect(w.find('[data-test-id="v-checkbox-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders indeterminate state with mixed aria-checked', () => {
    const w = mount(VCheckbox, { props: { label: 'Weekly digest', indeterminate: true, motion: 'default' } })
    const root = w.get('[data-test-id="v-checkbox"]')
    const input = w.get('[data-test-id="v-checkbox-input"]')
    expect(root.attributes('data-state')).toBe('indeterminate')
    expect(root.classes()).toContain('v-checkbox--indeterminate')
    expect(input.attributes('aria-checked')).toBe('mixed')
    expect(w.find('[data-test-id="v-checkbox-icon"]').exists()).toBe(true)
  })

  it('renders description and helper text with aria-describedby', () => {
    const w = mount(VCheckbox, {
      props: {
        id: 'cb-1',
        label: 'Security',
        description: 'Extra protection',
        helperText: 'Only for account security',
      },
    })
    const input = w.get('[data-test-id="v-checkbox-input"]')
    expect(w.get('[data-test-id="v-checkbox-description"]').text()).toBe('Extra protection')
    expect(w.get('[data-test-id="v-checkbox-helper"]').text()).toContain('Only for account security')
    expect(input.attributes('aria-describedby')).toContain('cb-1-description')
    expect(input.attributes('aria-describedby')).toContain('cb-1-helper')
  })

  it('renders error state with aria-invalid', () => {
    const w = mount(VCheckbox, {
      props: { id: 'cb-2', label: 'Terms', errorMessage: 'Required' },
    })
    const root = w.get('[data-test-id="v-checkbox"]')
    const input = w.get('[data-test-id="v-checkbox-input"]')
    expect(root.classes()).toContain('v-checkbox--error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(w.get('[data-test-id="v-checkbox-error"]').text()).toContain('Required')
  })

  it('renders terms link without toggling checkbox', async () => {
    const w = mount(VCheckbox, {
      props: {
        label: 'I agree to the',
        linkLabel: 'Terms of Service',
        linkHref: '#terms',
      },
    })
    const link = w.get('[data-test-id="v-checkbox-terms-link"]')
    expect(link.attributes('href')).toBe('#terms')
    expect(link.text()).toBe('Terms of Service')
    await link.trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies size classes', () => {
    const w = mount(VCheckbox, { props: { label: 'Large', size: 'lg' } })
    expect(w.get('[data-test-id="v-checkbox"]').classes()).toContain('v-checkbox--lg')
    expect(w.get('[data-test-id="v-checkbox"]').attributes('data-size')).toBe('lg')
  })

  it('supports disabled state', () => {
    const w = mount(VCheckbox, { props: { label: 'Disabled', disabled: true, modelValue: true } })
    const root = w.get('[data-test-id="v-checkbox"]')
    const input = w.get('[data-test-id="v-checkbox-input"]')
    expect(root.attributes('data-state')).toBe('disabled')
    expect(root.classes()).toContain('v-checkbox--disabled')
    expect((input.element as HTMLInputElement).disabled).toBe(true)
  })

  it('supports label slot override', () => {
    const w = mount(VCheckbox, {
      slots: { label: '<span data-test-id="custom-label">Custom label</span>' },
    })
    expect(w.find('[data-test-id="custom-label"]').exists()).toBe(true)
  })
})
