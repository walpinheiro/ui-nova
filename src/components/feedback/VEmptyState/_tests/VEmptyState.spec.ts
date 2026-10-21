/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VEmptyState from '../VEmptyState.vue'

describe('VEmptyState', () => {
  it('renders the default anatomy with stable test ids', () => {
    const wrapper = mount(VEmptyState, {
      props: {
        title: 'No projects yet',
        description: 'Get started by creating your first project.',
        action: { label: 'Create project', icon: 'plus' },
      },
    })
    const root = wrapper.get('[data-test-id="v-empty-state"]')

    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-state')).toBe('default')
    expect(wrapper.get('[data-test-id="v-empty-state-illustration"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-empty-state-icon"]').get('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-empty-state-title"]').text()).toBe('No projects yet')
    expect(wrapper.get('[data-test-id="v-empty-state-description"]').text()).toContain('first project')
    expect(wrapper.get('[data-test-id="v-empty-state-action"]').text()).toContain('Create project')
  })

  it('maps each variant to its semantic icon', () => {
    const variants = ['results', 'files', 'notifications', 'create'] as const

    for (const variant of variants) {
      const wrapper = mount(VEmptyState, { props: { variant } })
      expect(wrapper.get('[data-test-id="v-empty-state"]').attributes('data-variant')).toBe(variant)
      expect(wrapper.get('[data-test-id="v-empty-state-icon"]').get('[data-test-id="v-icon"]').exists()).toBe(true)
    }
  })

  it('supports sizes, illustration slots, and action slot', () => {
    const wrapper = mount(VEmptyState, {
      props: { size: 'lg', title: 'Ignored', description: 'Ignored' },
      slots: {
        illustration: '<div data-test-id="custom-illustration">Art</div>',
        title: '<strong data-test-id="custom-title">Custom title</strong>',
        description: '<span data-test-id="custom-description">Custom description</span>',
        action: '<button data-test-id="custom-action">Go</button>',
      },
    })

    expect(wrapper.get('[data-test-id="v-empty-state"]').classes()).toContain('v-empty-state--lg')
    expect(wrapper.findAll('[data-test-id="custom-illustration"]').length).toBe(1)
    expect(wrapper.get('[data-test-id="custom-title"]').text()).toBe('Custom title')
    expect(wrapper.get('[data-test-id="custom-description"]').text()).toBe('Custom description')
    expect(wrapper.findAll('[data-test-id="custom-action"]').length).toBe(1)
  })

  it('emits action and supports compact and no-illustration states', async () => {
    const wrapper = mount(VEmptyState, {
      props: {
        compact: true,
        showIllustration: false,
        action: { label: 'Create project', icon: 'plus' },
      },
    })
    const root = wrapper.get('[data-test-id="v-empty-state"]')

    expect(root.attributes('data-state')).toBe('compact')
    expect(root.classes()).toContain('v-empty-state--no-illustration')

    await wrapper.get('[data-test-id="v-empty-state-action"]').trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('supports disabled and loading states', () => {
    const disabled = mount(VEmptyState, {
      props: { disabled: true, action: { label: 'Create project' } },
    })
    expect(disabled.get('[data-test-id="v-empty-state"]').attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-empty-state-action"]').attributes('disabled')).toBeDefined()

    const loading = mount(VEmptyState, { props: { loading: true } })
    const loadingRoot = loading.get('[data-test-id="v-empty-state"]')
    expect(loadingRoot.attributes('aria-busy')).toBe('true')
    expect(loadingRoot.attributes('data-state')).toBe('loading')
    expect(loading.find('.v-empty-state__loader').exists()).toBe(true)
  })
})
