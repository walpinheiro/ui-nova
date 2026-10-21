/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VThoughtLine from '../VThoughtLine.vue'
import { mountVThoughtLine } from '../mountVThoughtLine'

const mountThoughtLine = (options: Parameters<typeof mount>[1] = {}) =>
  mount(VThoughtLine, {
    global: {
      stubs: {
        Transition: { template: '<slot />' },
      },
    },
    ...options,
  })

const root = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-test-id="v-thought-line"]')

describe('mountVThoughtLine', () => {
  it('marks complete when duration is provided', () => {
    expect(mountVThoughtLine({ duration: 0 }).isComplete).toBe(false)
    expect(mountVThoughtLine({ duration: 1200 }).isComplete).toBe(true)
  })
})

describe('VThoughtLine', () => {
  it('renders thinking state with timer', () => {
    const wrapper = mountThoughtLine({
      props: {
        label: 'Reasoning',
        steps: [{ label: 'Scanning docs' }],
      },
    })
    expect(root(wrapper).attributes('data-state')).toBe('thinking')
    expect(wrapper.get('[data-test-id="v-thought-line-label"]').text()).toBe('Reasoning')
    expect(wrapper.get('[data-test-id="v-thought-line-timer"]').text()).toMatch(/^\d+(\.\d)?s$/)
    expect(wrapper.find('[data-test-id="v-thought-line-trace"]').exists()).toBe(false)
  })

  it('renders complete summary label', () => {
    const wrapper = mountThoughtLine({
      props: {
        label: 'Reasoning',
        duration: 3600,
        steps: [{ label: 'Scanning docs' }],
      },
    })
    expect(root(wrapper).attributes('data-state')).toBe('complete')
    expect(wrapper.get('[data-test-id="v-thought-line-label"]').text()).toBe('Thought for 3.6s')
    expect(wrapper.find('[data-test-id="v-thought-line-timer"]').exists()).toBe(false)
  })

  it('expands and collapses trace on header click', async () => {
    const wrapper = mountThoughtLine({
      props: {
        steps: [
          { id: 'a', label: 'Step A' },
          { id: 'b', label: 'Step B' },
        ],
      },
    })

    expect(wrapper.find('[data-test-id="v-thought-line-trace"]').exists()).toBe(false)
    await wrapper.get('[data-test-id="v-thought-line-header"]').trigger('click')
    expect(wrapper.find('[data-test-id="v-thought-line-trace"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-thought-line-step-0"]').text()).toBe('Step A')
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([true])

    await wrapper.get('[data-test-id="v-thought-line-header"]').trigger('click')
    expect(wrapper.emitted('update:expanded')?.[1]).toEqual([false])
  })

  it('starts expanded when defaultExpanded is true', () => {
    const wrapper = mountThoughtLine({
      props: {
        defaultExpanded: true,
        steps: [{ label: 'Only step' }],
      },
    })
    expect(wrapper.get('[data-test-id="v-thought-line-header"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[data-test-id="v-thought-line-trace"]').exists()).toBe(true)
  })

  it('clears timer on unmount while thinking', () => {
    vi.spyOn(globalThis, 'clearInterval')
    const wrapper = mountThoughtLine({ props: { label: 'Reasoning' } })
    wrapper.unmount()
    expect(clearInterval).toHaveBeenCalled()
  })
})
