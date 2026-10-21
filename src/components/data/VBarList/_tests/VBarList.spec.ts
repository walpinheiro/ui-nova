/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VBarList from '../VBarList.vue'
import { mountVBarList } from '../mountVBarList'

const items = [
  { label: 'Missing documentation', value: 38 },
  { label: 'Incorrect part number', value: 21 },
  { label: 'Other', value: 11 },
]

describe('mountVBarList', () => {
  it('scales against the largest value and emphasizes it', () => {
    const { rows } = mountVBarList({ items, unit: '%' })
    expect(rows[0].percent).toBe(100)
    expect(rows[1].percent).toBeCloseTo(55.3, 1)
    expect(rows.map((row) => row.strong)).toEqual([true, false, false])
    expect(rows[2].text).toBe('11%')
  })

  it('honours an explicit max and emphasis modes', () => {
    expect(mountVBarList({ items, max: 76 }).rows[0].percent).toBe(50)
    expect(mountVBarList({ items, emphasis: 'none' }).rows.some((row) => row.strong)).toBe(false)
    expect(mountVBarList({ items, emphasis: 'all' }).rows.every((row) => row.strong)).toBe(true)
  })
})

describe('VBarList', () => {
  it('renders one meter per item', () => {
    const wrapper = mount(VBarList, { props: { items, unit: '%' } })
    const meters = wrapper.findAll('[role="meter"]')
    expect(meters).toHaveLength(3)
    expect(meters[0].attributes('aria-valuetext')).toBe('38%')
    expect(wrapper.findAll('[data-test-id="v-bar-list-value"]')[1].text()).toBe('21%')
  })
})
