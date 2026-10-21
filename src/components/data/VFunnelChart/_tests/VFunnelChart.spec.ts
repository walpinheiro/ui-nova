/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VFunnelChart from '../VFunnelChart.vue'
import { conversionRate, mountVFunnelChart } from '../mountVFunnelChart'

const stages = [
  { label: 'Detected', value: 182.4, display: '$182.4K' },
  { label: 'Prepared', value: 96.3 },
  { label: 'Paid', value: 51.3 },
]

describe('mountVFunnelChart', () => {
  it('computes stage-to-stage conversion', () => {
    expect(conversionRate(182.4, 96.3)).toBe(53)
    expect(conversionRate(0, 10)).toBeNull()
    const { columns } = mountVFunnelChart({ stages })
    expect(columns.map((column) => column.conversion)).toEqual([53, 53, null])
    expect(columns[0].percent).toBe(100)
  })
})

describe('VFunnelChart', () => {
  it('renders stages and conversion chips between them', () => {
    const wrapper = mount(VFunnelChart, { props: { stages } })
    expect(wrapper.findAll('[data-test-id="v-funnel-chart-stage"]')).toHaveLength(3)
    expect(wrapper.findAll('[data-test-id="v-funnel-chart-conversion"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('$182.4K')
  })

  it('hides conversions on demand', () => {
    const wrapper = mount(VFunnelChart, { props: { stages, showConversion: false } })
    expect(wrapper.find('[data-test-id="v-funnel-chart-conversion"]').exists()).toBe(false)
  })
})
