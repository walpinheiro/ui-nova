/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VColorPicker from '../VColorPicker.vue'

describe('VColorPicker', () => {
  it('renders root test id and defaults', () => {
    const w = mount(VColorPicker)
    const root = w.get('[data-test-id="v-color-picker"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('popover')
  })

  it('renders trigger swatch', () => {
    const w = mount(VColorPicker, { props: { modelValue: '#6366F1' } })
    expect(w.find('[data-test-id="v-color-picker-trigger"]').exists()).toBe(true)
  })

  it('emits update on inline swatch click', async () => {
    const w = mount(VColorPicker, {
      props: {
        variant: 'preset',
        presets: ['#6366F1', '#EC4899'],
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
    })
    const swatches = w.findAll('[data-test-id^="v-color-picker-preset-"]')
    await swatches[1]?.trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['#EC4899'])
  })

  it('uses VIcon for check and chevron', () => {
    const w = mount(VColorPicker, { props: { selected: true } })
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('supports disabled state', () => {
    const w = mount(VColorPicker, { props: { disabled: true } })
    expect(w.get('[data-test-id="v-color-picker"]').attributes('data-state')).toBe('disabled')
  })
})
