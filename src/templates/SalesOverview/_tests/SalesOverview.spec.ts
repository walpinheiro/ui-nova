/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SalesOverview from '../SalesOverview.vue'
import { DAYS, GROSS, NAV_ITEMS, PROFIT, dayTitle } from '../data'

describe('SalesOverview', () => {
  it('renders the workspace shell, filters and breadcrumb', () => {
    const w = mount(SalesOverview, { attachTo: document.body })
    expect(w.text()).toContain('sparkpixel.studio')
    expect(w.text()).toContain('Dashboard')
    expect(w.text()).toContain('Company')
    expect(w.text()).toContain('All tags')
    expect(w.find('[data-test-id="theme-toggle"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders the three headline cards and sub-panels', () => {
    const w = mount(SalesOverview)
    const text = w.text()
    for (const label of ['Recent sales', 'Upcoming appointments', 'Appointment activity', 'Schedule', 'Lead Pipeline', 'Upcoming']) {
      expect(text.toLowerCase()).toContain(label.toLowerCase())
    }
    expect(text).toContain('$3.2M')
    expect(text).toContain('$850K')
  })

  it('pins the THU tooltip with date, margin and delta, and switches Gross/Profit', async () => {
    const w = mount(SalesOverview)
    const tip = w.find('[data-test-id="chart-tooltip"]')
    expect(tip.text()).toContain(dayTitle(3))
    expect(tip.text()).toContain('Margin')
    expect(tip.text()).toContain('+43.4%')
    expect(w.text()).toContain('$85,500')
    await w.find('[data-test-id="v-segmented-control-segment-gross"]').trigger('click')
    expect(w.text()).toContain('$142,500')
    expect(w.find('[data-test-id="chart-tooltip"]').text()).toContain('Gross')
  })

  it('has data consistent with the labels', () => {
    expect(DAYS).toHaveLength(7)
    expect(PROFIT).toHaveLength(7)
    expect(GROSS.every((g, i) => g > PROFIT[i])).toBe(true)
    expect(NAV_ITEMS.filter((i) => i.type === 'group').map((g) => g.label)).toEqual(['Pipeline', 'Reports', 'Workspace', 'Settings'])
  })
})
