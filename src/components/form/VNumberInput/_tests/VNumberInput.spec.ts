/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VNumberInput from '../VNumberInput.vue'
import { clampNumber, parseNumberInput } from '../mountVNumberInput'

describe('VNumberInput', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VNumberInput)
    expect(w.find('[data-test-id="v-number-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-number-input-field"]').exists()).toBe(true)
  })

  it('defaults to md size and stepper variant', () => {
    const w = mount(VNumberInput, { props: { modelValue: 42 } })
    const root = w.get('[data-test-id="v-number-input"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('default')
  })

  it('renders prefix and suffix', () => {
    const w = mount(VNumberInput, { props: { modelValue: 99, prefix: '$', suffix: '%' } })
    expect(w.get('[data-test-id="v-number-input-prefix"]').text()).toBe('$')
    expect(w.get('[data-test-id="v-number-input-suffix"]').text()).toBe('%')
  })

  it('supports v-model updates from typing', async () => {
    const w = mount(VNumberInput, {
      props: { modelValue: 10, 'onUpdate:modelValue': (v: number | null) => w.setProps({ modelValue: v }) },
    })
    const input = w.get('[data-test-id="v-number-input-field"]')
    await input.setValue('25')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([25])
  })

  it('increments value via stepper button', async () => {
    const w = mount(VNumberInput, {
      props: { modelValue: 42, step: 1, 'onUpdate:modelValue': (v: number | null) => w.setProps({ modelValue: v }) },
    })
    await w.get('[data-test-id="v-number-input-increment"]').trigger('pointerdown')
    await w.get('[data-test-id="v-number-input-increment"]').trigger('pointerup')
    expect(w.emitted('increment')).toHaveLength(1)
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([43])
  })

  it('decrements value via stepper button', async () => {
    const w = mount(VNumberInput, {
      props: { modelValue: 42, step: 1, 'onUpdate:modelValue': (v: number | null) => w.setProps({ modelValue: v }) },
    })
    await w.get('[data-test-id="v-number-input-decrement"]').trigger('pointerdown')
    await w.get('[data-test-id="v-number-input-decrement"]').trigger('pointerup')
    expect(w.emitted('decrement')).toHaveLength(1)
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([41])
  })

  it('respects min and max on increment', async () => {
    const w = mount(VNumberInput, {
      props: {
        modelValue: 10,
        min: 0,
        max: 10,
        'onUpdate:modelValue': (v: number | null) => w.setProps({ modelValue: v }),
      },
    })
    expect(w.get('[data-test-id="v-number-input-increment"]').attributes('disabled')).toBeDefined()
    await w.get('[data-test-id="v-number-input-decrement"]').trigger('pointerdown')
    await w.get('[data-test-id="v-number-input-decrement"]').trigger('pointerup')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([9])
  })

  it('supports ArrowUp and ArrowDown keyboard', async () => {
    const w = mount(VNumberInput, {
      props: { modelValue: 5, 'onUpdate:modelValue': (v: number | null) => w.setProps({ modelValue: v }) },
    })
    const input = w.get('[data-test-id="v-number-input-field"]')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([6])
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([5])
  })

  it('exposes spinbutton semantics', () => {
    const w = mount(VNumberInput, { props: { modelValue: 42, min: 0, max: 100 } })
    const input = w.get('[data-test-id="v-number-input-field"]')
    expect(input.attributes('role')).toBe('spinbutton')
    expect(input.attributes('aria-valuemin')).toBe('0')
    expect(input.attributes('aria-valuemax')).toBe('100')
    expect(input.attributes('aria-valuenow')).toBe('42')
  })

  it('renders error state with aria-invalid', () => {
    const w = mount(VNumberInput, {
      props: { id: 'num-1', modelValue: -1, min: 0, errorMessage: 'Must be ≥ 0' },
    })
    const root = w.get('[data-test-id="v-number-input"]')
    const input = w.get('[data-test-id="v-number-input-field"]')
    const error = w.get('[data-test-id="v-number-input-error"]')
    expect(root.attributes('data-variant')).toBe('error')
    expect(root.attributes('data-state')).toBe('invalid')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toContain('Must be ≥ 0')
  })

  it('supports disabled state', () => {
    const w = mount(VNumberInput, { props: { modelValue: 42, disabled: true } })
    expect(w.get('[data-test-id="v-number-input"]').attributes('data-state')).toBe('disabled')
    expect((w.get('[data-test-id="v-number-input-field"]').element as HTMLInputElement).disabled).toBe(true)
  })

  it('parses and clamps numbers in mount helpers', () => {
    expect(parseNumberInput('42')).toBe(42)
    expect(parseNumberInput('')).toBe(null)
    expect(clampNumber(15, 0, 10)).toBe(10)
  })
})
