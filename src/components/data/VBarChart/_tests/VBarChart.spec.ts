/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VBarChart from '../VBarChart.vue'
import { mountVBarChart } from '../mountVBarChart'

const data = [
  { label: 'Jul', value: 40 },
  { label: 'Aug', value: 60 },
  { label: 'Sep', value: 80, display: '$84.6K' },
]

describe('mountVBarChart', () => {
  it('defaults the active bar to the last one', () => {
    const config = mountVBarChart({ data })
    expect(config.active).toBe(2)
    expect(config.bars[2].valueVisible).toBe(true)
    expect(config.bars[0].valueVisible).toBe(false)
    expect(config.bars[2].percent).toBe(100)
  })

  it('supports showing every value or none', () => {
    expect(mountVBarChart({ data, showValue: 'all' }).bars.every((bar) => bar.valueVisible)).toBe(true)
    expect(mountVBarChart({ data, active: -1 }).bars.some((bar) => bar.active)).toBe(false)
  })
})

describe('VBarChart', () => {
  it('emits update:active when an interactive bar is clicked', async () => {
    const wrapper = mount(VBarChart, { props: { data, interactive: true } })
    await wrapper.findAll('button.v-bar-chart__bar')[0].trigger('click')
    expect(wrapper.emitted('update:active')?.[0]).toEqual([0])
    expect(wrapper.emitted('select')?.[0]?.[1]).toBe(0)
  })

  it('is a single labelled image when static', () => {
    const wrapper = mount(VBarChart, { props: { data } })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.get('[data-test-id="v-bar-chart"]').attributes('aria-label')).toContain('Sep: $84.6K')
  })
})
