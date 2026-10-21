/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VStepper from '../VStepper.vue'
import { DEFAULT_STEPPER_STEPS } from '../mountVStepper'

describe('VStepper', () => {
  it('renders navigation landmark with stable test id', () => {
    const w = mount(VStepper, { props: { modelValue: 'profile' } })
    const root = w.get('[data-test-id="v-stepper"]')
    expect(root.element.tagName).toBe('NAV')
    expect(root.attributes('role')).toBe('navigation')
  })

  it('renders all default steps', () => {
    const w = mount(VStepper, { props: { modelValue: 'profile' } })
    expect(w.findAll('[data-test-id^="v-stepper-step-"]')).toHaveLength(DEFAULT_STEPPER_STEPS.length)
    expect(w.get('[data-test-id="v-stepper-step-profile"]').attributes('data-state')).toBe('current')
  })

  it('marks completed steps before current value', () => {
    const w = mount(VStepper, { props: { modelValue: 'review' } })
    expect(w.get('[data-test-id="v-stepper-step-account"]').attributes('data-state')).toBe('completed')
    expect(w.get('[data-test-id="v-stepper-step-profile"]').attributes('data-state')).toBe('completed')
    expect(w.get('[data-test-id="v-stepper-step-review"]').attributes('data-state')).toBe('current')
    expect(w.get('[data-test-id="v-stepper-step-confirm"]').attributes('data-state')).toBe('upcoming')
  })

  it('shows check icon on completed steps', () => {
    const w = mount(VStepper, { props: { modelValue: 'review' } })
    const completed = w.get('[data-test-id="v-stepper-marker-account"]')
    expect(completed.find('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(completed.find('.v-stepper__index').exists()).toBe(false)
  })

  it('shows numeric index on upcoming steps', () => {
    const w = mount(VStepper, { props: { modelValue: 'account' } })
    expect(w.get('[data-test-id="v-stepper-marker-profile"]').find('.v-stepper__index').text()).toBe('2')
  })

  it('renders step labels and optional descriptions', () => {
    const w = mount(VStepper, {
      props: {
        modelValue: 'profile',
        steps: [
          { value: 'account', label: 'Account', description: 'Sign in' },
          { value: 'profile', label: 'Profile', description: 'Personal info' },
        ],
      },
    })
    expect(w.findAll('[data-test-id="v-stepper-label"]')[1]?.text()).toBe('Profile')
    expect(w.findAll('[data-test-id="v-stepper-description"]')[1]?.text()).toBe('Personal info')
  })

  it('emits update:modelValue and step-click when marker is clicked', async () => {
    const w = mount(VStepper, { props: { modelValue: 'account' } })
    await w.get('[data-test-id="v-stepper-marker-review"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['review'])
    expect(w.emitted('step-click')?.[0]?.[0]).toMatchObject({ value: 'review', label: 'Review' })
  })

  it('supports disabled and loading states', () => {
    const disabled = mount(VStepper, { props: { disabled: true } })
    expect(disabled.get('[data-test-id="v-stepper"]').attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-stepper"]').attributes('data-state')).toBe('disabled')

    const loading = mount(VStepper, { props: { loading: true } })
    expect(loading.get('[data-test-id="v-stepper"]').attributes('aria-busy')).toBe('true')
    expect(loading.find('[data-test-id="v-stepper-loader"]').exists()).toBe(true)
  })

  it('applies size and variant modifiers', () => {
    const w = mount(VStepper, { props: { size: 'lg', variant: 'primary' } })
    const root = w.get('[data-test-id="v-stepper"]')
    expect(root.classes()).toContain('v-stepper--lg')
    expect(root.classes()).toContain('v-stepper--primary')
    expect(root.attributes('data-size')).toBe('lg')
    expect(root.attributes('data-variant')).toBe('primary')
  })
})
