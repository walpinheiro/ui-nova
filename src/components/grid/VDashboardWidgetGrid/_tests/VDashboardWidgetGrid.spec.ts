/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDashboardWidgetGrid from '../VDashboardWidgetGrid.vue'
import VDashboardWidget from '../VDashboardWidget.vue'

describe('VDashboardWidgetGrid', () => {
  it('renders grid root with cols and row height', () => {
    const w = mount(VDashboardWidgetGrid, { props: { cols: 12, rowHeight: 128 } })
    const root = w.get('[data-test-id="v-dashboard-widget-grid"]')
    expect(root.attributes('data-cols')).toBe('12')
    expect(root.attributes('data-row-height')).toBe('128')
    expect(root.attributes('role')).toBe('grid')
  })

  it('shows edit layout control', () => {
    const w = mount(VDashboardWidgetGrid)
    expect(w.find('[data-test-id="v-dashboard-widget-grid-edit-layout"]').exists()).toBe(true)
  })
})

describe('VDashboardWidget', () => {
  it('renders widget with placement attrs', () => {
    const w = mount(VDashboardWidgetGrid, {
      slots: {
        default: `
          <VDashboardWidget id="total-revenue" title="Total revenue" :x="0" :y="0" :w="3" :h="2">
            Content
          </VDashboardWidget>
        `,
      },
      global: { components: { VDashboardWidget } },
    })
    expect(w.find('[data-test-id="v-dashboard-widget-total-revenue"]').exists()).toBe(true)
  })

  it('shows lock icon when locked', () => {
    const w = mount(VDashboardWidgetGrid, {
      props: { editMode: true },
      slots: {
        default: '<VDashboardWidget id="x" title="X" locked />',
      },
      global: { components: { VDashboardWidget } },
    })
    expect(w.find('[data-test-id="v-dashboard-widget-lock"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })
})
