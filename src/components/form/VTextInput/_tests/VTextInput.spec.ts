/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTextInput from '../VTextInput.vue'

describe('VTextInput', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VTextInput)
    expect(w.find('[data-test-id="v-text-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-text-input-field"]').exists()).toBe(true)
  })

  it('defaults to md size and default variant', () => {
    const w = mount(VTextInput)
    const root = w.get('[data-test-id="v-text-input"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-state')).toBe('default')
  })

  it('renders label associated with input', () => {
    const w = mount(VTextInput, { props: { label: 'Search', id: 'search-input' } })
    const label = w.get('[data-test-id="v-text-input-label"]')
    const input = w.get('[data-test-id="v-text-input-field"]')
    expect(label.text()).toContain('Search')
    expect(label.attributes('for')).toBe('search-input')
    expect(input.attributes('id')).toBe('search-input')
  })

  it('supports v-model updates', async () => {
    const w = mount(VTextInput, { props: { modelValue: 'Hello', 'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }) } })
    const input = w.get('[data-test-id="v-text-input-field"]')
    expect((input.element as HTMLInputElement).value).toBe('Hello')
    await input.setValue('World')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['World'])
  })

  it('renders helper text with aria-describedby', () => {
    const w = mount(VTextInput, { props: { id: 'field-1', helperText: 'Helpful hint' } })
    const input = w.get('[data-test-id="v-text-input-field"]')
    const helper = w.get('[data-test-id="v-text-input-helper"]')
    expect(helper.text()).toBe('Helpful hint')
    expect(input.attributes('aria-describedby')).toContain('field-1-helper')
  })

  it('renders error state with aria-invalid and alert message', () => {
    const w = mount(VTextInput, {
      props: { id: 'field-2', modelValue: 'bad', errorMessage: 'Invalid input' },
    })
    const root = w.get('[data-test-id="v-text-input"]')
    const input = w.get('[data-test-id="v-text-input-field"]')
    const error = w.get('[data-test-id="v-text-input-error"]')
    expect(root.attributes('data-variant')).toBe('error')
    expect(root.attributes('data-state')).toBe('invalid')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toContain('Invalid input')
    expect(input.attributes('aria-describedby')).toContain('field-2-error')
  })

  it('renders success state when successMessage is provided', () => {
    const w = mount(VTextInput, { props: { successMessage: 'Looks good' } })
    expect(w.get('[data-test-id="v-text-input"]').attributes('data-variant')).toBe('success')
    expect(w.get('[data-test-id="v-text-input-success"]').text()).toContain('Looks good')
  })

  it('renders leading icon from prop', () => {
    const w = mount(VTextInput, { props: { leadingIcon: 'search', placeholder: 'Search…' } })
    expect(w.find('[data-test-id="v-text-input-leading-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-text-input"]').attributes('data-variant')).toBe('leading-icon')
  })

  it('renders prefix and suffix blocks', () => {
    const w = mount(VTextInput, { props: { prefix: '$', suffix: 'USD', modelValue: '0.00' } })
    expect(w.get('[data-test-id="v-text-input-prefix"]').text()).toBe('$')
    expect(w.get('[data-test-id="v-text-input-suffix"]').text()).toBe('USD')
    expect(w.get('[data-test-id="v-text-input"]').attributes('data-variant')).toBe('prefix-suffix')
  })

  it('shows clear button when clearable and has value', async () => {
    const w = mount(VTextInput, {
      props: {
        modelValue: 'Product',
        clearable: true,
        label: 'Search',
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
    })
    const clear = w.get('[data-test-id="v-text-input-clear"]')
    expect(clear.attributes('aria-label')).toBe('Clear Search')
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
    await clear.trigger('click')
    expect(w.emitted('clear')).toHaveLength(1)
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('applies size classes', () => {
    const w = mount(VTextInput, { props: { size: 'lg' } })
    expect(w.get('[data-test-id="v-text-input"]').classes()).toContain('v-text-input--lg')
    expect(w.get('[data-test-id="v-text-input"]').attributes('data-size')).toBe('lg')
  })

  it('supports disabled and readonly states', () => {
    const disabled = mount(VTextInput, { props: { disabled: true } })
    expect(disabled.get('[data-test-id="v-text-input"]').attributes('data-state')).toBe('disabled')
    expect((disabled.get('[data-test-id="v-text-input-field"]').element as HTMLInputElement).disabled).toBe(true)

    const readonly = mount(VTextInput, { props: { readonly: true } })
    expect((readonly.get('[data-test-id="v-text-input-field"]').element as HTMLInputElement).readOnly).toBe(true)
    expect(readonly.get('[data-test-id="v-text-input"]').classes()).toContain('v-text-input--readonly')
  })

  it('passes native input attributes', () => {
    const w = mount(VTextInput, {
      props: {
        name: 'email',
        autocomplete: 'email',
        type: 'email',
        placeholder: 'you@example.com',
        required: true,
      },
    })
    const input = w.get('[data-test-id="v-text-input-field"]')
    expect(input.attributes('name')).toBe('email')
    expect(input.attributes('autocomplete')).toBe('email')
    expect(input.attributes('type')).toBe('email')
    expect(input.attributes('placeholder')).toBe('you@example.com')
    expect(input.attributes('aria-required')).toBe('true')
  })

  it('supports leading-icon slot override', () => {
    const w = mount(VTextInput, {
      props: { leadingIcon: 'search' },
      slots: { 'leading-icon': '<span data-test-id="custom-leading">icon</span>' },
    })
    expect(w.find('[data-test-id="custom-leading"]').exists()).toBe(true)
  })
})
