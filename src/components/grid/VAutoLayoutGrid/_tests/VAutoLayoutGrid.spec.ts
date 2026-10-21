/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VAutoLayoutGrid from '../VAutoLayoutGrid.vue'
import VAutoLayoutGridItem from '../VAutoLayoutGridItem.vue'

describe('VAutoLayoutGrid', () => {
  it('renders root with behavior and size data attrs', () => {
    const w = mount(VAutoLayoutGrid, { props: { behavior: 'auto-fill', size: 'compact' } })
    const root = w.get('[data-test-id="v-auto-layout-grid"]')
    expect(root.attributes('data-behavior')).toBe('auto-fill')
    expect(root.attributes('data-size')).toBe('compact')
  })

  it('applies min item width style', () => {
    const w = mount(VAutoLayoutGrid, { props: { minItemWidth: 320 } })
    expect(w.get('[data-test-id="v-auto-layout-grid"]').attributes('style')).toContain('320px')
  })
})

describe('VAutoLayoutGridItem', () => {
  it('renders selected badge with icon', () => {
    const w = mount(VAutoLayoutGridItem, { props: { id: 'design-system', selected: true } })
    expect(w.find('[data-test-id="v-auto-layout-grid-selection-badge"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('marks disabled state', () => {
    const w = mount(VAutoLayoutGridItem, { props: { disabled: true } })
    expect(w.get('[data-test-id="v-auto-layout-grid-item"]').attributes('data-disabled')).toBe('true')
  })
})
