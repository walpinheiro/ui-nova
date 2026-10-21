/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VAgentChip from '../VAgentChip.vue'
import { mountVAgentChip } from '../mountVAgentChip'

const root = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-test-id="v-agent-chip"]')

describe('mountVAgentChip', () => {
  it('normalizes status and defaults', () => {
    expect(mountVAgentChip({}).status).toBe('pending')
    expect(mountVAgentChip({}).label).toBe('Running tool')
    expect(mountVAgentChip({ status: 'invalid' as never }).status).toBe('pending')
  })
})

describe('VAgentChip', () => {
  it('renders pending state with label and duration', () => {
    const wrapper = mount(VAgentChip, { props: { label: 'search_docs', status: 'pending' } })
    expect(root(wrapper).attributes('data-status')).toBe('pending')
    expect(root(wrapper).attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[data-test-id="v-agent-chip-label"]').text()).toContain('search_docs')
    expect(wrapper.get('[data-test-id="v-agent-chip-duration"]').text()).toMatch(/^\d+ms$/)
    expect(wrapper.find('.v-agent-chip__fill').exists()).toBe(true)
  })

  it('renders success state with icon and fixed duration', () => {
    const wrapper = mount(VAgentChip, {
      props: { label: 'search_docs', status: 'success', durationMs: 1500 },
    })
    expect(root(wrapper).attributes('data-status')).toBe('success')
    expect(wrapper.get('[data-test-id="v-agent-chip-success-icon"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-agent-chip-duration"]').text()).toBe('1500ms')
    expect(wrapper.find('.v-agent-chip__fill').exists()).toBe(false)
  })

  it('renders error state with retry action', async () => {
    const wrapper = mount(VAgentChip, {
      props: { label: 'fetch_metrics', status: 'error', durationMs: 900 },
    })
    expect(root(wrapper).attributes('data-status')).toBe('error')
    expect(wrapper.get('[data-test-id="v-agent-chip-error-icon"]').exists()).toBe(true)
    await wrapper.get('[data-test-id="v-agent-chip-retry"]').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('supports custom slot label', () => {
    const wrapper = mount(VAgentChip, {
      props: { status: 'success', durationMs: 100 },
      slots: { default: 'custom_tool' },
    })
    expect(wrapper.get('[data-test-id="v-agent-chip-label"]').text()).toBe('custom_tool')
  })

  it('clears timer on unmount', () => {
    vi.spyOn(globalThis, 'clearInterval')
    const wrapper = mount(VAgentChip, { props: { status: 'pending' } })
    wrapper.unmount()
    expect(clearInterval).toHaveBeenCalled()
  })
})
