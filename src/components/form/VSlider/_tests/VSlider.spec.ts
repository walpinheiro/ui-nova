/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSlider from '../VSlider.vue'

describe('VSlider', () => {
  it('renders and exposes stable test ids', () => {
    const w = mount(VSlider)
    expect(w.find('[data-test-id="v-slider"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-slider-track"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-slider-fill"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-slider-thumb"]').exists()).toBe(true)
  })

  it('defaults to md size and single variant', () => {
    const w = mount(VSlider)
    const root = w.get('[data-test-id="v-slider"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('single')
    expect(root.attributes('data-orientation')).toBe('horizontal')
  })

  it('shows formatted value label', () => {
    const w = mount(VSlider, { props: { modelValue: 40 } })
    expect(w.get('[data-test-id="v-slider-value"]').text()).toBe('40')
  })

  it('supports v-model updates via keyboard', async () => {
    const w = mount(VSlider, {
      props: {
        modelValue: 40,
        'onUpdate:modelValue': (v: number | [number, number]) => {
          if (typeof v === 'number') w.setProps({ modelValue: v })
        },
      },
    })
    const thumb = w.get('[data-test-id="v-slider-thumb"]')
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    const updates = w.emitted('update:modelValue') ?? []
    expect(updates[updates.length - 1]).toEqual([41])
    expect(w.emitted('change')?.length).toBeGreaterThan(0)
  })

  it('supports range slider with two thumbs', () => {
    const w = mount(VSlider, { props: { range: true, modelValue: [20, 80] } })
    expect(w.find('[data-test-id="v-slider-thumb-min"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-slider-thumb-max"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-slider-value"]').text()).toBe('20 – 80')
    expect(w.get('[data-test-id="v-slider"]').attributes('data-variant')).toBe('range')
  })

  it('renders marks when provided', () => {
    const w = mount(VSlider, { props: { modelValue: 50, marks: [0, 25, 50, 75, 100] } })
    expect(w.find('[data-test-id="v-slider-mark-50"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-slider"]').attributes('data-variant')).toBe('marks')
  })

  it('supports vertical orientation', () => {
    const w = mount(VSlider, { props: { orientation: 'vertical', modelValue: 75 } })
    const root = w.get('[data-test-id="v-slider"]')
    expect(root.attributes('data-orientation')).toBe('vertical')
    expect(root.attributes('data-variant')).toBe('vertical')
    expect(root.classes()).toContain('v-slider--vertical')
  })

  it('applies disabled state', () => {
    const w = mount(VSlider, { props: { disabled: true, modelValue: 30 } })
    const root = w.get('[data-test-id="v-slider"]')
    expect(root.attributes('data-state')).toBe('disabled')
    expect(root.attributes('data-variant')).toBe('disabled')
    expect(root.classes()).toContain('v-slider--disabled')
  })

  it('exposes slider aria attributes on thumb', () => {
    const w = mount(VSlider, { props: { modelValue: 50, ariaLabel: 'Brightness' } })
    const thumb = w.get('[data-test-id="v-slider-thumb"]')
    expect(thumb.attributes('role')).toBe('slider')
    expect(thumb.attributes('aria-valuenow')).toBe('50')
    expect(thumb.attributes('aria-label')).toBe('Brightness')
    expect(thumb.attributes('aria-orientation')).toBe('horizontal')
  })

  it('supports Home and End keyboard shortcuts', async () => {
    const w = mount(VSlider, {
      props: {
        modelValue: 40,
        min: 0,
        max: 100,
        'onUpdate:modelValue': (v: number | [number, number]) => {
          if (typeof v === 'number') w.setProps({ modelValue: v })
        },
      },
    })
    const thumb = w.get('[data-test-id="v-slider-thumb"]')
    await thumb.trigger('keydown', { key: 'Home' })
    let updates = w.emitted('update:modelValue') ?? []
    expect(updates[updates.length - 1]).toEqual([0])
    await thumb.trigger('keydown', { key: 'End' })
    updates = w.emitted('update:modelValue') ?? []
    expect(updates[updates.length - 1]).toEqual([100])
  })

  it('applies size classes', () => {
    const w = mount(VSlider, { props: { size: 'lg' } })
    expect(w.get('[data-test-id="v-slider"]').classes()).toContain('v-slider--lg')
    expect(w.get('[data-test-id="v-slider"]').attributes('data-size')).toBe('lg')
  })
})
