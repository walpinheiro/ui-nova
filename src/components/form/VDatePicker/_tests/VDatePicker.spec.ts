/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDatePicker from '../VDatePicker.vue'

describe('VDatePicker', () => {
  it('renders input field test ids', () => {
    const w = mount(VDatePicker)
    expect(w.find('[data-test-id="datepicker-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="datepicker-trigger"]').exists()).toBe(true)
  })

  it('shows leading icon for with-icon variant', () => {
    const w = mount(VDatePicker, { props: { variant: 'with-icon' } })
    expect(w.find('[data-test-id="datepicker-leading-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('opens calendar on trigger click', async () => {
    const w = mount(VDatePicker)
    await w.get('[data-test-id="datepicker-trigger"]').trigger('click')
    expect(w.emitted('open-change')?.[0]).toEqual([true])
  })

  it('shows clear button when value exists', () => {
    const w = mount(VDatePicker, { props: { modelValue: new Date(2026, 0, 17), clearable: true } })
    expect(w.find('[data-test-id="datepicker-clear-button"]').exists()).toBe(true)
  })

  it('emits cleared value', async () => {
    const w = mount(VDatePicker, {
      props: {
        modelValue: new Date(2026, 0, 17),
        'onUpdate:modelValue': (v: Date | null) => w.setProps({ modelValue: v }),
      },
    })
    await w.get('[data-test-id="datepicker-clear-button"]').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })
})
