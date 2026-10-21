/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InvestmentDashboard from '../InvestmentDashboard.vue'
import { HOLDINGS, KPIS, LEGEND, PORTFOLIO_SERIES } from '../data'

describe('InvestmentDashboard', () => {
  it('renders the page title, user and the five KPI cards', () => {
    const w = mount(InvestmentDashboard, { attachTo: document.body })
    const text = w.text()
    expect(w.find('h1').text()).toBe('Investment')
    expect(text).toContain('Tom Anderson')
    expect(text).toContain('tom@gmail.com')
    for (const k of KPIS) {
      expect(text).toContain(k.label)
      expect(text).toContain(k.value)
    }
    expect(KPIS).toHaveLength(5)
    expect(w.find('[data-test-id="theme-toggle"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders the performance legend, holdings table and side cards', () => {
    const w = mount(InvestmentDashboard)
    const text = w.text()
    for (const l of LEGEND) expect(text).toContain(l.value)
    const rows = w.findAll('tbody tr')
    expect(rows).toHaveLength(HOLDINGS.length)
    expect(rows[0].text()).toContain('MATIC')
    expect(w.findAll('thead th').map((h) => h.text())).toEqual(['Asset', 'Price', 'Weight', 'P/L'])
    for (const t of ['Allocation', 'Top Movers', 'Market Intelligence', 'MACRO · AMERICAS']) expect(text).toContain(t)
  })

  it('pins the August tooltip at rest', () => {
    const w = mount(InvestmentDashboard)
    const tip = w.find('[data-test-id="chart-tooltip"]')
    expect(tip.text()).toContain('Aug 30, 10:08 PM')
    expect(tip.text()).toContain(`+${PORTFOLIO_SERIES[7]}%`)
  })

  it('switches tabs to reveal only the relevant sections', async () => {
    const w = mount(InvestmentDashboard)
    await w.find('[data-test-id="v-tabs-tab-holdings"]').trigger('click')
    expect(w.text()).toContain('Holdings')
    expect(w.text()).not.toContain('Top Movers')
    expect(w.text()).not.toContain('Performance Vs Benchmarks')
    await w.find('[data-test-id="v-tabs-tab-market"]').trigger('click')
    expect(w.text()).toContain('Top Movers')
    expect(w.text()).not.toContain('Total Portfolio Value')
  })
})
