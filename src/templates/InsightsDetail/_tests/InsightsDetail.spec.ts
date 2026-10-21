/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InsightsDetail from '../InsightsDetail.vue'

describe('InsightsDetail', () => {
  it('renders key landmarks', () => {
    const wrapper = mount(InsightsDetail)
    expect(wrapper.find('h1').text()).toBe('Delegation loop')
    expect(wrapper.find('aside[aria-label="Workspace"]').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    expect(wrapper.text()).toContain('Open fix builder')
    expect(wrapper.findAll('.play li')).toHaveLength(4)
  })

  it('toggles data-theme on <html>', async () => {
    const wrapper = mount(InsightsDetail, { attachTo: document.body })
    // Collapsed rail: single icon toggle.
    document.documentElement.dataset.theme = 'light'
    await wrapper.find('button[aria-label="Switch to dark theme"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    await wrapper.find('button[aria-label="Switch to light theme"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
    wrapper.unmount()
  })
})
