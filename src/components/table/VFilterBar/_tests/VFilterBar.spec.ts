// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VFilterBar from '../VFilterBar.vue'
import { mountVFilterBar } from '../mountVFilterBar'

const chips = [
  { id: 'design', label: 'Design' },
  { id: 'priority', label: 'High Priority' },
  { id: 'owner', label: 'Alex Chen' },
]

const selects = [
  {
    id: 'status',
    label: 'Status',
    value: 'all',
    options: [{ label: 'All', value: 'all' }, { label: 'Active', value: 'active' }],
  },
]

describe('VFilterBar mount helpers', () => {
  it('builds results label and sticky variant', () => {
    expect(mountVFilterBar({ resultsCount: 243, totalCount: 1284 }).resultsLabel).toContain('243 of 1,284')
    expect(mountVFilterBar({ variant: 'sticky' }).sticky).toBe(true)
  })
})

describe('VFilterBar', () => {
  it('renders search, chips and results count', () => {
    const wrapper = mount(VFilterBar, {
      props: {
        chips,
        selects,
        resultsCount: 243,
        totalCount: 1284,
        activeCount: 3,
        variant: 'advanced',
      },
    })
    expect(wrapper.get('[data-test-id="filter-bar"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="filter-bar-search"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="filter-bar-chip--design"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="filter-bar-results-count"]').text()).toContain('243 of 1,284')
    expect(wrapper.find('[data-test-id="filter-bar-active-count"]').exists()).toBe(false)
  })

  it('shows active count in sticky toolbar when chips are hidden', () => {
    const wrapper = mount(VFilterBar, {
      props: { activeCount: 2, variant: 'sticky', sticky: true, resultsCount: 243 },
    })
    expect(wrapper.get('[data-test-id="filter-bar-active-count"]').text()).toContain('2 active')
  })

  it('emits search updates and clears all filters', async () => {
    const wrapper = mount(VFilterBar, { props: { chips, search: 'tasks' } })
    await wrapper.get('[data-test-id="v-searchfield-input"]').setValue('design')
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['design'])

    await wrapper.get('[data-test-id="filter-bar-clear"]').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('update:chips')?.at(-1)).toEqual([[]])
  })

  it('removes chips via removable badge', async () => {
    const wrapper = mount(VFilterBar, { props: { chips, variant: 'chips' } })
    await wrapper.get('[data-test-id="filter-bar-chip--design"]').get('[data-test-id="badge-remove"]').trigger('click')
    expect(wrapper.emitted('chip-remove')?.[0]).toEqual(['design'])
  })
})
