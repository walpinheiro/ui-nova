/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDateTile from '../VDateTile.vue'
import { parseTileDate } from '../mountVDateTile'

describe('VDateTile', () => {
  it('parses ISO dates as local dates', () => {
    const date = parseTileDate('2026-09-29')
    expect(date?.getDate()).toBe(29)
    expect(date?.getMonth()).toBe(8)
    expect(parseTileDate('nope')).toBeNull()
  })

  it('renders month and day with a machine-readable datetime', () => {
    const wrapper = mount(VDateTile, { props: { date: '2026-09-29' } })
    expect(wrapper.get('[data-test-id="v-date-tile-month"]').text()).toBe('Sep')
    expect(wrapper.get('[data-test-id="v-date-tile-day"]').text()).toBe('29')
    expect(wrapper.attributes('datetime')).toBe('2026-09-29')
  })

  it('accepts explicit month/day overrides', () => {
    const wrapper = mount(VDateTile, { props: { month: 'Out', day: 1, tone: 'danger' } })
    expect(wrapper.text()).toContain('Out')
    expect(wrapper.classes()).toContain('v-date-tile--danger')
  })
})
