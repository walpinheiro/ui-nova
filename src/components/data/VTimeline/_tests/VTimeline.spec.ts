/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTimeline from '../VTimeline.vue'
import { mountVTimeline } from '../mountVTimeline'

const steps = [
  { id: 1, title: 'Replaced', time: 'Sep 18' },
  { id: 2, title: 'Carrier review', state: 'current' as const, time: 'By Oct 13' },
  { id: 3, title: 'Payment', state: 'upcoming' as const },
]

describe('mountVTimeline', () => {
  it('defaults state to complete and marks the last item', () => {
    const { items } = mountVTimeline({ items: steps })
    expect(items[0].state).toBe('complete')
    expect(items[2].last).toBe(true)
  })

  it('groups consecutive feed items by group', () => {
    const { sections } = mountVTimeline({
      variant: 'feed',
      items: [
        { id: 1, title: 'a', group: 'Today' },
        { id: 2, title: 'b', group: 'Today' },
        { id: 3, title: 'c', group: 'Earlier' },
      ],
    })
    expect(sections.map((section) => [section.label, section.items.length])).toEqual([
      ['Today', 2],
      ['Earlier', 1],
    ])
  })
})

describe('VTimeline', () => {
  it('renders steps with aria-current on the current item', () => {
    const wrapper = mount(VTimeline, { props: { items: steps } })
    const rendered = wrapper.findAll('[data-test-id="v-timeline-item"]')
    expect(rendered).toHaveLength(3)
    expect(rendered[1].attributes('aria-current')).toBe('step')
    expect(rendered[2].attributes('data-state')).toBe('upcoming')
  })

  it('renders feed group headings', () => {
    const wrapper = mount(VTimeline, {
      props: { variant: 'feed', items: [{ id: 1, title: 'Done', group: 'Today', avatar: { initials: 'AM' } }] },
    })
    expect(wrapper.get('[data-test-id="v-timeline-group"]').text()).toBe('Today')
  })
})
