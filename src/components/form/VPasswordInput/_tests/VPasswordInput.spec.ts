/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VPasswordInput from '../VPasswordInput.vue'
import { evaluatePasswordStrength } from '../mountVPasswordInput'

describe('VPasswordInput', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VPasswordInput)
    expect(w.find('[data-test-id="v-password-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-password-input-field"]').exists()).toBe(true)
  })

  it('defaults to md size and show-hide variant', () => {
    const w = mount(VPasswordInput)
    const root = w.get('[data-test-id="v-password-input"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('show-hide')
  })

  it('uses password input type by default', () => {
    const w = mount(VPasswordInput)
    expect(w.get('[data-test-id="v-password-input-field"]').attributes('type')).toBe('password')
  })

  it('supports v-model updates', async () => {
    const w = mount(VPasswordInput, {
      props: { modelValue: 'secret', 'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }) },
    })
    const input = w.get('[data-test-id="v-password-input-field"]')
    await input.setValue('VueNova2024')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['VueNova2024'])
  })

  it('toggles visibility with aria-pressed', async () => {
    const w = mount(VPasswordInput)
    const toggle = w.get('[data-test-id="v-password-input-toggle"]')
    expect(toggle.attributes('aria-pressed')).toBe('false')
    expect(toggle.attributes('aria-label')).toBe('Show password')
    await toggle.trigger('click')
    expect(w.get('[data-test-id="v-password-input-field"]').attributes('type')).toBe('text')
    expect(w.get('[data-test-id="v-password-input-toggle"]').attributes('aria-pressed')).toBe('true')
    expect(w.emitted('toggle-visibility')?.[0]).toEqual([true])
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders strength meter when enabled', () => {
    const w = mount(VPasswordInput, { props: { modelValue: 'VueNova2024!', showStrength: true } })
    const meter = w.get('[data-test-id="v-password-input-meter"]')
    expect(meter.attributes('data-strength')).toBe('strong')
    expect(w.get('[data-test-id="v-password-input-meter-label"]').text()).toContain('Great password!')
  })

  it('renders requirements list when enabled', () => {
    const w = mount(VPasswordInput, { props: { modelValue: 'Vue1!', requirements: true, id: 'pw-1' } })
    expect(w.find('[data-test-id="v-password-input-requirements"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-password-input-requirement-length"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-password-input-field"]').attributes('aria-describedby')).toContain('pw-1-requirements')
  })

  it('renders error state with aria-invalid', () => {
    const w = mount(VPasswordInput, {
      props: { id: 'pw-2', modelValue: '123', errorMessage: 'Password is too weak' },
    })
    const root = w.get('[data-test-id="v-password-input"]')
    const input = w.get('[data-test-id="v-password-input-field"]')
    const error = w.get('[data-test-id="v-password-input-error"]')
    expect(root.attributes('data-variant')).toBe('error')
    expect(root.attributes('data-state')).toBe('invalid')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toContain('Password is too weak')
  })

  it('renders helper text', () => {
    const w = mount(VPasswordInput, { props: { helperText: 'Use at least 8 characters.' } })
    expect(w.get('[data-test-id="v-password-input-helper"]').text()).toBe('Use at least 8 characters.')
  })

  it('supports disabled state', () => {
    const w = mount(VPasswordInput, { props: { disabled: true } })
    expect(w.get('[data-test-id="v-password-input"]').attributes('data-state')).toBe('disabled')
    expect((w.get('[data-test-id="v-password-input-field"]').element as HTMLInputElement).disabled).toBe(true)
  })

  it('applies size classes', () => {
    const w = mount(VPasswordInput, { props: { size: 'sm' } })
    expect(w.get('[data-test-id="v-password-input"]').classes()).toContain('v-password-input--sm')
  })

  it('evaluates password strength helper', () => {
    expect(evaluatePasswordStrength('abc')).toBe('weak')
    expect(evaluatePasswordStrength('Abcdef1!')).toBe('strong')
  })
})
