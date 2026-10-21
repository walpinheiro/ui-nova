/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VNotificationCenter from '../VNotificationCenter.vue'

const sampleNotifications = [
  {
    id: '1',
    title: 'Design file shared with you',
    preview: 'Sarah shared "Landing Page v2.fig" with you.',
    time: '2m ago',
    unread: true,
    group: 'today',
    tab: 'mentions' as const,
  },
  {
    id: '2',
    title: 'Build completed',
    preview: 'Deploy preview is ready for review.',
    time: '5h ago',
    unread: false,
    group: 'yesterday',
    tab: 'updates' as const,
  },
]

describe('VNotificationCenter', () => {
  it('renders trigger, badge, and aria-live region', () => {
    const wrapper = mount(VNotificationCenter, {
      props: { notifications: sampleNotifications },
      attachTo: document.body,
    })

    const root = wrapper.get('[data-test-id="v-notification-center"]')
    const trigger = wrapper.get('[data-test-id="v-notification-center-trigger"]')

    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-size')).toBe('md')
    expect(trigger.attributes('data-unread-count')).toBe('1')
    expect(wrapper.get('[data-test-id="v-notification-center-badge"]').text()).toBe('1')
    expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toContain('1 unread notification')
    expect(trigger.get('[data-test-id="v-icon"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('opens the panel, lists items, and exposes header actions', async () => {
    const wrapper = mount(VNotificationCenter, {
      props: {
        modelValue: true,
        notifications: sampleNotifications,
        variant: 'grouped',
      },
      attachTo: document.body,
    })

    expect(wrapper.get('[data-test-id="v-notification-center-header"]').text()).toContain('Notifications')
    expect(wrapper.get('[data-test-id="v-notification-center-mark-all"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-notification-center-tab-all"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-notification-center-tab-unread"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-notification-center-item-1"]').exists()).toBe(true)
    expect(wrapper.get('[role="list"]').exists()).toBe(true)

    await wrapper.get('[data-test-id="v-notification-center-mark-all"]').trigger('click')
    expect(wrapper.emitted('mark-all-read')).toHaveLength(1)

    wrapper.unmount()
  })

  it('filters unread tab and search query', async () => {
    const wrapper = mount(VNotificationCenter, {
      props: {
        modelValue: true,
        notifications: sampleNotifications,
        activeTab: 'unread',
        variant: 'grouped',
      },
      attachTo: document.body,
    })

    expect(document.body.querySelectorAll('[data-test-id^="v-notification-center-item-"]').length).toBe(1)

    await wrapper.setProps({ activeTab: 'all', searchQuery: 'build' })
    expect(document.body.querySelectorAll('[data-test-id^="v-notification-center-item-"]').length).toBe(1)
    expect(document.body.querySelector('[data-test-id="v-notification-center-item-2"] [data-test-id="v-notification-title"]')?.textContent).toContain('Build completed')

    wrapper.unmount()
  })

  it('shows empty and loading states', () => {
    const empty = mount(VNotificationCenter, {
      props: { modelValue: true, notifications: [], variant: 'feed' },
      attachTo: document.body,
    })
    expect(empty.get('[data-test-id="v-notification-center-empty"]').exists()).toBe(true)
    expect(empty.get('[data-test-id="v-notification-center"]').attributes('data-state')).toBe('empty')
    empty.unmount()

    const loading = mount(VNotificationCenter, {
      props: { modelValue: true, loading: true, notifications: sampleNotifications, variant: 'feed' },
      attachTo: document.body,
    })
    expect(loading.get('[data-test-id="v-notification-center-loading"]').exists()).toBe(true)
    expect(loading.get('[data-test-id="v-notification-center"]').attributes('data-state')).toBe('loading')
    loading.unmount()
  })

  it('toggles open state from trigger and emits item-click and view-all', async () => {
    const wrapper = mount(VNotificationCenter, {
      props: { notifications: sampleNotifications, variant: 'compact' },
      attachTo: document.body,
    })

    await wrapper.get('[data-test-id="v-notification-center-trigger"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])

    await wrapper.setProps({ modelValue: true })
    await wrapper.get('[data-test-id="v-notification-center-item-1"]').trigger('click')
    expect(wrapper.emitted('item-click')).toEqual([['1']])

    await wrapper.get('[data-test-id="v-notification-center-view-all"]').trigger('click')
    expect(wrapper.emitted('view-all')).toHaveLength(1)

    wrapper.unmount()
  })
})
