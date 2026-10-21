/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTextarea from '../VTextarea.vue'

describe('VTextarea', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VTextarea)
    expect(w.find('[data-test-id="v-textarea"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-textarea-input"]').exists()).toBe(true)
  })

  it('defaults to md size and default variant', () => {
    const w = mount(VTextarea)
    const root = w.get('[data-test-id="v-textarea"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-state')).toBe('default')
  })

  it('renders label associated with textarea', () => {
    const w = mount(VTextarea, { props: { label: 'Notes', id: 'notes-field' } })
    const label = w.get('[data-test-id="v-textarea-label"]')
    const input = w.get('[data-test-id="v-textarea-input"]')
    expect(label.text()).toContain('Notes')
    expect(label.attributes('for')).toBe('notes-field')
    expect(input.attributes('id')).toBe('notes-field')
  })

  it('supports v-model updates', async () => {
    const w = mount(VTextarea, {
      props: { modelValue: 'Hello', 'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }) },
    })
    const input = w.get('[data-test-id="v-textarea-input"]')
    expect((input.element as HTMLTextAreaElement).value).toBe('Hello')
    await input.setValue('World')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['World'])
  })

  it('renders helper text with aria-describedby', () => {
    const w = mount(VTextarea, { props: { id: 'field-1', helperText: 'Helpful hint' } })
    const input = w.get('[data-test-id="v-textarea-input"]')
    const helper = w.get('[data-test-id="v-textarea-helper"]')
    expect(helper.text()).toBe('Helpful hint')
    expect(input.attributes('aria-describedby')).toContain('field-1-helper')
  })

  it('renders error state with aria-invalid and alert message', () => {
    const w = mount(VTextarea, {
      props: { id: 'field-2', modelValue: 'bad', errorMessage: 'This field is required.' },
    })
    const root = w.get('[data-test-id="v-textarea"]')
    const input = w.get('[data-test-id="v-textarea-input"]')
    const error = w.get('[data-test-id="v-textarea-error"]')
    expect(root.attributes('data-variant')).toBe('error')
    expect(root.attributes('data-state')).toBe('invalid')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toContain('This field is required.')
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders character counter', () => {
    const w = mount(VTextarea, { props: { modelValue: 'Hi', counter: 500, id: 'counter-field' } })
    const counter = w.get('[data-test-id="v-textarea-counter"]')
    expect(counter.text()).toBe('2 / 500')
    expect(w.get('[data-test-id="v-textarea-input"]').attributes('aria-describedby')).toContain('counter-field-counter')
  })

  it('marks counter over limit as invalid state', () => {
    const w = mount(VTextarea, { props: { modelValue: '123456', counter: 5 } })
    expect(w.get('[data-test-id="v-textarea"]').attributes('data-state')).toBe('invalid')
    expect(w.get('[data-test-id="v-textarea-counter"]').classes()).toContain('v-textarea__counter--over')
  })

  it('applies size classes', () => {
    const w = mount(VTextarea, { props: { size: 'lg' } })
    expect(w.get('[data-test-id="v-textarea"]').classes()).toContain('v-textarea--lg')
    expect(w.get('[data-test-id="v-textarea"]').attributes('data-size')).toBe('lg')
  })

  it('supports disabled and readonly states', () => {
    const disabled = mount(VTextarea, { props: { disabled: true } })
    expect(disabled.get('[data-test-id="v-textarea"]').attributes('data-state')).toBe('disabled')
    expect((disabled.get('[data-test-id="v-textarea-input"]').element as HTMLTextAreaElement).disabled).toBe(true)

    const readonly = mount(VTextarea, { props: { readonly: true } })
    expect((readonly.get('[data-test-id="v-textarea-input"]').element as HTMLTextAreaElement).readOnly).toBe(true)
    expect(readonly.get('[data-test-id="v-textarea"]').classes()).toContain('v-textarea--readonly')
  })

  it('enables auto-resize class when prop is set', () => {
    const w = mount(VTextarea, { props: { autoResize: true } })
    expect(w.get('[data-test-id="v-textarea"]').classes()).toContain('v-textarea--auto-resize')
    expect(w.get('[data-test-id="v-textarea"]').attributes('data-variant')).toBe('auto-resize')
  })

  it('passes required attribute', () => {
    const w = mount(VTextarea, { props: { required: true } })
    const input = w.get('[data-test-id="v-textarea-input"]')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-required')).toBe('true')
  })
})
