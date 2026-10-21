/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VStatCard from '../VStatCard.vue'
import { inferTrend, mountVStatCard } from '../mountVStatCard'

describe('mountVStatCard', () => {
  it('infers the trend from the delta sign', () => {
    expect(inferTrend('14.8%')).toBe('up')
    expect(inferTrend('-3')).toBe('down')
    expect(inferTrend('−2.1%')).toBe('down')
    expect(inferTrend('0%')).toBe('neutral')
    expect(inferTrend(undefined)).toBe('neutral')
  })

  it('normalizes invalid size/variant and strips the sign', () => {
    const config = mountVStatCard({ size: 'xl' as never, variant: 'x' as never, delta: '+12%' })
    expect(config.size).toBe('md')
    expect(config.variant).toBe('outlined')
    expect(config.deltaText).toBe('12%')
  })
})

describe('VStatCard', () => {
  it('renders label, value, delta and secondary stats', () => {
    const wrapper = mount(VStatCard, {
      props: {
        label: 'Recovered this month',
        value: '$84,620',
        delta: '14.8%',
        deltaCaption: 'vs $73,710',
        stats: [{ label: 'Pending', value: '$31.2K', caption: '22 claims', color: 'blue' }],
      },
    })
    expect(wrapper.get('[data-test-id="v-stat-card-label"]').text()).toBe('Recovered this month')
    expect(wrapper.get('[data-test-id="v-stat-card-value"]').text()).toBe('$84,620')
    expect(wrapper.get('[data-test-id="v-stat-card-delta"]').attributes('data-trend')).toBe('up')
    expect(wrapper.get('[data-test-id="v-stat-card-stats"]').text()).toContain('22 claims')
  })

  it('shows a skeleton while loading', () => {
    const wrapper = mount(VStatCard, { props: { label: 'Runs', value: 10, loading: true } })
    expect(wrapper.find('[data-test-id="v-stat-card-value"]').exists()).toBe(false)
    expect(wrapper.get('[data-test-id="v-stat-card"]').attributes('aria-busy')).toBe('true')
  })
})
