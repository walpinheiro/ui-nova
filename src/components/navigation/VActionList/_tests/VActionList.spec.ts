/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VActionList from '../VActionList.vue'

const sections = [
  {
    id: 'env',
    label: 'Environment',
    items: [
      { value: 'changes', label: 'Changes' },
      { value: 'servers', label: 'Local Servers', hint: '0', trailing: 'chevron' as const },
      { value: 'off', label: 'Disabled', disabled: true },
    ],
  },
  { id: 'repo', label: 'Repository', items: [{ value: 'gh', label: 'acme/app', href: 'https://example.com' }] },
]

describe('VActionList', () => {
  it('renders sections, hints and inferred trailing affordances', () => {
    const wrapper = mount(VActionList, { props: { sections } })
    expect(wrapper.findAll('[data-test-id="v-action-list-section"]')).toHaveLength(2)
    expect(wrapper.get('[data-value="servers"]').text()).toContain('0')
    const link = wrapper.get('[data-value="gh"]')
    expect(link.element.tagName).toBe('A')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.find('.v-action-list__trailing').exists()).toBe(true)
  })

  it('emits select for enabled items only', async () => {
    const wrapper = mount(VActionList, { props: { sections } })
    await wrapper.get('[data-value="changes"]').trigger('click')
    await wrapper.get('[data-value="off"]').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ value: 'changes' })
  })

  it('renders trailing and section content slots', () => {
    const wrapper = mount(VActionList, {
      props: { sections },
      slots: { 'trailing-changes': '<b class="diff">+1</b>', 'section-repo': '<p class="recap">Recap</p>' },
    })
    expect(wrapper.find('.diff').exists()).toBe(true)
    expect(wrapper.find('.recap').exists()).toBe(true)
  })
})
