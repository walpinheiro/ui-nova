/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VCardGrid from '../VCardGrid.vue'

describe('VCardGrid', () => {
  it('renders with stable test id', () => {
    const w = mount(VCardGrid)
    expect(w.find('[data-test-id="v-cardgrid"]').exists()).toBe(true)
  })

  it('defaults to 3 columns and gap 6', () => {
    const w = mount(VCardGrid)
    const root = w.get('[data-test-id="v-cardgrid"]')
    expect(root.attributes('data-cols')).toBe('3')
    expect(root.attributes('style')).toContain('grid-template-columns')
  })

  it('accepts custom cols and gap', () => {
    const w = mount(VCardGrid, { props: { cols: 4, gap: 4 } })
    expect(w.get('[data-test-id="v-cardgrid"]').attributes('data-cols')).toBe('4')
  })

  it('uses auto-fill columns when minCardWidth is set', () => {
    const w = mount(VCardGrid, { props: { minCardWidth: 240 } })
    const root = w.get('[data-test-id="v-cardgrid"]')
    expect(root.attributes('data-cols')).toBe('auto')
    expect(root.attributes('style')).toContain('auto-fill')
    expect(root.attributes('style')).toContain('240px')
  })

  it('renders slot content', () => {
    const w = mount(VCardGrid, {
      slots: { default: '<div data-test-id="grid-child">Card</div>' },
    })
    expect(w.find('[data-test-id="grid-child"]').exists()).toBe(true)
  })

  it('exposes list role and aria-label', () => {
    const w = mount(VCardGrid, { props: { ariaLabel: 'Products' } })
    const root = w.get('[data-test-id="v-cardgrid"]')
    expect(root.attributes('role')).toBe('list')
    expect(root.attributes('aria-label')).toBe('Products')
  })
})
