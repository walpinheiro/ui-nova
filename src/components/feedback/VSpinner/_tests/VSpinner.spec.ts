import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSpinner from '../VSpinner.vue'
describe('VSpinner', () => {
  it('renders and exposes stable test id', () => { const w = mount(VSpinner); expect(w.get('[data-test-id="v-spinner"]').exists()).toBe(true) })
  it('supports disabled state', () => { const w = mount(VSpinner, { props: { disabled: true } }); expect(w.get('[data-test-id="v-spinner"]').attributes('aria-disabled')).toBe('true') })
  it('applies color class and data attribute', () => {
    const w = mount(VSpinner, { props: { color: 'default' } })
    const root = w.get('[data-test-id="v-spinner"]')
    expect(root.classes()).toContain('v-spinner--color-default')
    expect(root.attributes('data-color')).toBe('default')
  })
  it('falls back to circular variant for invalid style values', () => {
    const w = mount(VSpinner, { props: { variant: 'primary' as never } })
    expect(w.get('[data-test-id="v-spinner"]').attributes('data-variant')).toBe('circular')
  })
})
