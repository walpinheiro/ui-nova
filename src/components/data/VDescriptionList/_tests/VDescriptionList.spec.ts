/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDescriptionList from '../VDescriptionList.vue'

describe('VDescriptionList', () => {
  it('renders dt/dd pairs, hints and a total row', () => {
    const wrapper = mount(VDescriptionList, {
      props: {
        items: [
          { label: 'Labor', hint: '4.5 h at $88', value: '$396' },
          { label: 'Freight', value: '$53' },
        ],
        total: { label: 'Claimed', value: '$1,840' },
      },
    })
    expect(wrapper.findAll('dt').map((node) => node.text())).toEqual(['Labor', 'Freight', 'Claimed'])
    expect(wrapper.get('.v-description-list__hint').text()).toBe('4.5 h at $88')
    expect(wrapper.get('[data-test-id="v-description-list-total"]').text()).toContain('$1,840')
  })

  it('supports per-key value slots', () => {
    const wrapper = mount(VDescriptionList, {
      props: { items: [{ key: 'status', label: 'Status', value: 'ok' }] },
      slots: { 'value-status': '<strong>Custom</strong>' },
    })
    expect(wrapper.get('.v-description-list__value').html()).toContain('<strong>Custom</strong>')
  })
})
