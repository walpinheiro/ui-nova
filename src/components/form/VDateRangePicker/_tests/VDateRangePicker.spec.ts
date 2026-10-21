/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDateRangePicker from '../VDateRangePicker.vue'

describe('VDateRangePicker', () => {
  it('renders root and field test ids', () => {
    const w = mount(VDateRangePicker)
    expect(w.get('[data-test-id="v-date-range-picker"]').attributes('data-size')).toBe('md')
    expect(w.find('[data-test-id="v-date-range-picker-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-date-range-picker-leading-icon"]').exists()).toBe(true)
  })

  it('shows clear when range has value', () => {
    const w = mount(VDateRangePicker, {
      props: { modelValue: { start: new Date(2024, 3, 1), end: new Date(2024, 3, 30) } },
    })
    expect(w.find('[data-test-id="v-date-range-picker-clear"]').exists()).toBe(true)
  })

  it('emits open-change when toggled', async () => {
    const w = mount(VDateRangePicker)
    await w.get('[data-test-id="v-date-range-picker-chevron"]').trigger('click')
    expect(w.emitted('open-change')?.[0]).toEqual([true])
  })

  it('renders preset buttons in presets variant when open', async () => {
    const w = mount(VDateRangePicker, {
      props: { variant: 'presets' },
      attachTo: document.body,
    })
    await w.get('[data-test-id="v-date-range-picker-chevron"]').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('[data-test-id="v-date-range-picker-preset-30d"]')).toBeTruthy()
    w.unmount()
  })

  it('uses VIcon for chevron', () => {
    const w = mount(VDateRangePicker)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })
})
