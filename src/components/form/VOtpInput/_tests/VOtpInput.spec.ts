/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VOtpInput from '../VOtpInput.vue'

describe('VOtpInput', () => {
  it('renders and exposes stable test ids', () => {
    const w = mount(VOtpInput)
    expect(w.find('[data-test-id="v-otp-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-otp-hidden-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-otp-slot-0"]').exists()).toBe(true)
  })

  it('defaults to 6 digits and md size', () => {
    const w = mount(VOtpInput)
    const root = w.get('[data-test-id="v-otp-input"]')
    expect(root.attributes('data-length')).toBe('6')
    expect(root.classes()).toContain('v-otp-input--md')
  })

  it('renders filled slots from modelValue', () => {
    const w = mount(VOtpInput, { props: { modelValue: '240186', length: 6 } })
    expect(w.get('[data-test-id="v-otp-slot-0"]').text()).toBe('2')
    expect(w.get('[data-test-id="v-otp-slot-5"]').attributes('data-filled')).toBe('true')
  })

  it('supports v-model updates via hidden input', async () => {
    const w = mount(VOtpInput, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
    })
    const input = w.get('[data-test-id="v-otp-hidden-input"]')
    await input.setValue('1234')
    const updates = w.emitted('update:modelValue') ?? []
    expect(updates[updates.length - 1]).toEqual(['1234'])
  })

  it('emits complete when autoSubmit is enabled', async () => {
    const w = mount(VOtpInput, {
      props: {
        autoSubmit: true,
        length: 4,
        modelValue: '',
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
    })
    const input = w.get('[data-test-id="v-otp-hidden-input"]')
    await input.setValue('1234')
    const complete = w.emitted('complete') ?? []
    expect(complete[complete.length - 1]).toEqual(['1234'])
    expect(w.get('[data-test-id="v-otp-input"]').attributes('data-variant')).toBe('auto-submit')
  })

  it('masks digits when masked is true', () => {
    const w = mount(VOtpInput, { props: { masked: true, modelValue: '123', length: 4 } })
    expect(w.get('[data-test-id="v-otp-slot-0"]').text()).toBe('•')
    expect(w.get('[data-test-id="v-otp-input"]').attributes('data-variant')).toBe('masked')
  })

  it('renders error state with alert message', () => {
    const w = mount(VOtpInput, { props: { modelValue: '123', errorMessage: 'Invalid code' } })
    const root = w.get('[data-test-id="v-otp-input"]')
    const error = w.get('[data-test-id="v-otp-error"]')
    expect(root.attributes('data-state')).toBe('error')
    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toContain('Invalid code')
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders success state', () => {
    const w = mount(VOtpInput, { props: { modelValue: '123456', success: true } })
    expect(w.get('[data-test-id="v-otp-input"]').attributes('data-state')).toBe('success')
    expect(w.find('[data-test-id="v-otp-success"]').exists()).toBe(true)
  })

  it('supports disabled state', () => {
    const w = mount(VOtpInput, { props: { disabled: true, modelValue: '123' } })
    expect(w.get('[data-test-id="v-otp-input"]').attributes('data-state')).toBe('disabled')
    expect((w.get('[data-test-id="v-otp-hidden-input"]').element as HTMLInputElement).disabled).toBe(true)
  })

  it('exposes hidden input accessibility attributes', () => {
    const w = mount(VOtpInput, { props: { ariaLabel: 'Verification code', helperText: 'Enter the code from your email' } })
    const input = w.get('[data-test-id="v-otp-hidden-input"]')
    expect(input.attributes('inputmode')).toBe('numeric')
    expect(input.attributes('autocomplete')).toBe('one-time-code')
    expect(input.attributes('aria-label')).toBe('Verification code')
  })

  it('shows resend countdown when configured', () => {
    const w = mount(VOtpInput, { props: { resendCooldown: 23, resendLabel: 'Resend code' } })
    expect(w.find('[data-test-id="v-otp-resend"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-otp-resend-countdown"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-otp-input"]').attributes('data-variant')).toBe('resend')
  })
})
