/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTimeRange from '../VTimeRange.vue'
import { formatDuration, rangeMinutes } from '../mountVTimeRange'

describe('VTimeRange helpers', () => {
  it('computes durations, wrapping past midnight', () => {
    expect(rangeMinutes('12:00', '12:30')).toBe(30)
    expect(rangeMinutes('23:30', '00:15')).toBe(45)
    expect(rangeMinutes('bad', '12:00')).toBeNull()
    expect(formatDuration(30)).toBe('30min')
    expect(formatDuration(90)).toBe('1h 30min')
    expect(formatDuration(120)).toBe('2h')
  })
})

describe('VTimeRange', () => {
  it('shows the duration and emits v-model updates', async () => {
    const wrapper = mount(VTimeRange, { props: { start: '12:00', end: '12:30' } })
    expect(wrapper.get('[data-test-id="v-time-range-duration"]').text()).toBe('30min')
    const end = wrapper.get('[data-test-id="v-time-range-end"]')
    await end.setValue('13:00')
    expect(wrapper.emitted('update:end')?.[0]).toEqual(['13:00'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual({ start: '12:00', end: '13:00', minutes: 60 })
  })

  it('emits close', async () => {
    const wrapper = mount(VTimeRange)
    await wrapper.get('[data-test-id="v-time-range-close"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
