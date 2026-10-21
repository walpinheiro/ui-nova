/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LineChart from '../LineChart.vue'
import { areaPath, bandPositions, linearPath, monotonePath, nearestIndex, stepAreaPath } from '../chartMath'

describe('chartMath', () => {
  const pts = [
    { x: 0, y: 10 },
    { x: 50, y: 40 },
    { x: 100, y: 20 },
  ]

  it('builds linear and monotone paths', () => {
    expect(linearPath(pts)).toBe('M0 10 L50 40 L100 20')
    const d = monotonePath(pts)
    expect(d.startsWith('M0 10 C')).toBe(true)
    expect((d.match(/C/g) ?? []).length).toBe(2)
    expect(d.endsWith('100 20')).toBe(true)
  })

  it('closes areas down to the baseline', () => {
    expect(areaPath(pts, 100, false)).toBe('M0 10 L50 40 L100 20 L100 100 L0 100 Z')
  })

  it('spreads bands evenly and finds the nearest index', () => {
    const xs = bandPositions(5, 0, 400)
    expect(xs).toEqual([0, 100, 200, 300, 400])
    expect(nearestIndex(130, xs)).toBe(1)
    expect(nearestIndex(260, xs)).toBe(3)
    expect(nearestIndex(-50, xs)).toBe(0)
    expect(nearestIndex(999, xs)).toBe(4)
  })

  it('creates a closed stepped area', () => {
    const d = stepAreaPath([1, 2], 0, 100, 50, (v) => 50 - v * 10)
    expect(d.startsWith('M0 50')).toBe(true)
    expect(d.endsWith('Z')).toBe(true)
  })
})

describe('LineChart', () => {
  const props = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    yMin: 0,
    yMax: 10,
    series: [
      { id: 'a', label: 'Portfolio', data: [1, 4, 3, 8], color: 'green', area: true },
      { id: 'b', label: 'Bench', data: [2, 2, 3, 3], color: 'grey', dashed: true },
    ],
  }

  it('renders one path per series plus gridlines', () => {
    const w = mount(LineChart, { props })
    expect(w.findAll('path[data-series]').length).toBe(2)
    expect(w.findAll('.chart-line__grid line').length).toBe(5)
    expect(w.find('[data-series="b"]').classes()).toContain('chart-line__path--dashed')
  })

  it('shows no tooltip until pointed, then follows the nearest index', async () => {
    const w = mount(LineChart, { props, attachTo: document.body })
    expect(w.find('[data-test-id="chart-tooltip"]').exists()).toBe(false)
    const el = w.element as HTMLElement
    el.getBoundingClientRect = () => ({ left: 0, top: 0, right: 640, bottom: 260, width: 640, height: 260, x: 0, y: 0, toJSON: () => ({}) })
    await w.trigger('pointermove', { clientX: 640 })
    const tip = w.find('[data-test-id="chart-tooltip"]')
    expect(tip.exists()).toBe(true)
    expect(tip.text()).toContain('Apr')
    expect(w.emitted('hover')?.[0]).toEqual([3])
    await w.trigger('pointerleave')
    expect(w.find('[data-test-id="chart-tooltip"]').exists()).toBe(false)
    w.unmount()
  })

  it('supports keyboard navigation and a pinned rest index', async () => {
    const w = mount(LineChart, { props: { ...props, restIndex: 1 } })
    expect(w.find('[data-test-id="chart-tooltip"]').text()).toContain('Feb')
    await w.trigger('keydown', { key: 'ArrowRight' })
    expect(w.find('[data-test-id="chart-tooltip"]').text()).toContain('Mar')
    await w.trigger('keydown', { key: 'Escape' })
    expect(w.find('[data-test-id="chart-tooltip"]').text()).toContain('Feb')
  })
})
