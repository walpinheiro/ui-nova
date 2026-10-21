/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CareOpsSchedule from '../CareOpsSchedule.vue'
import { caregivers, openShifts } from '../scheduleData'

vi.stubGlobal('matchMedia', (q: string) => ({
  matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {},
  addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false, onchange: null,
}))

describe('CareOpsSchedule', () => {
  it('renders sidebar, header and timeline', () => {
    const wrapper = mount(CareOpsSchedule)
    expect(wrapper.text()).toContain('CareOps')
    expect(wrapper.text()).toContain('Juniper Home Health')
    expect(wrapper.find('h1').text()).toBe('Schedule')
    const total = caregivers.concat(openShifts).reduce((n, r) => n + r.visits.length, 0)
    expect(wrapper.findAll('.tl__pill')).toHaveLength(total)
    expect(wrapper.findAll('.tl__row')).toHaveLength(caregivers.length + 1)
  })

  it('positions pills by start/end time', () => {
    const wrapper = mount(CareOpsSchedule)
    const first = wrapper.find('.tl__pill')
    expect(first.attributes('style')).toContain('left')
    expect(first.attributes('aria-label')).toContain('open shift')
  })
})
