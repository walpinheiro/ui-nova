/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VIcon from '../VIcon.vue'

const sampleIcon = {
  width: 24,
  height: 24,
  body: '<path d="M3 3h18v18H3z" />',
}

describe('VIcon', () => {
  it('renders svg with stable test id when icon is provided', () => {
    const wrapper = mount(VIcon, { props: { icon: sampleIcon, size: 'sm' } })
    const svg = wrapper.get('[data-test-id="v-icon"]')
    expect(svg.classes()).toContain('v-icon--sm')
    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
  })

  it('renders nothing without icon', () => {
    const wrapper = mount(VIcon)
    expect(wrapper.find('[data-test-id="v-icon"]').exists()).toBe(false)
  })
})
