/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VNotificationItem from '../VNotificationItem.vue'

describe('VNotificationItem', () => {
  it('renders the default anatomy with stable test ids', () => {
    const wrapper = mount(VNotificationItem, {
      props: {
        title: 'Sarah Chen mentioned you',
        preview: '@john take a look at this design',
        time: '2m ago',
        unread: true,
        avatar: 'https://example.com/avatar.jpg',
        avatarAlt: 'Sarah Chen',
      },
    })
    const root = wrapper.get('[data-test-id="v-notification-item"]')

    expect(root.attributes('role')).toBe('listitem')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-state')).toBe('unread')
    expect(wrapper.get('[data-test-id="v-notification-unread-dot"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-notification-avatar"] img').attributes('alt')).toBe('Sarah Chen')
    expect(wrapper.get('[data-test-id="v-notification-title"]').text()).toBe('Sarah Chen mentioned you')
    expect(wrapper.get('[data-test-id="v-notification-preview"]').text()).toContain('design')
    expect(wrapper.get('[data-test-id="v-notification-time"]').text()).toBe('2m ago')
    expect(wrapper.get('[data-test-id="v-notification-menu"]').get('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('maps each variant to its semantic icon when no avatar is provided', () => {
    const variants = ['avatar', 'system', 'success', 'actionable'] as const

    for (const variant of variants) {
      const wrapper = mount(VNotificationItem, {
        props: { variant, title: 'Notification' },
      })
      expect(wrapper.get('[data-test-id="v-notification-item"]').attributes('data-variant')).toBe(variant)
      expect(wrapper.get('[data-test-id="v-notification-avatar"]').get('[data-test-id="v-icon"]').exists()).toBe(true)
    }
  })

  it('supports dismiss, inline actions, and avatar slot', async () => {
    const wrapper = mount(VNotificationItem, {
      props: {
        title: 'Connect Notion',
        dismissible: true,
        actions: [
          { label: 'Set up', key: 'setup', variant: 'primary' },
          { label: 'Decline', key: 'decline', variant: 'ghost' },
        ],
      },
      slots: {
        avatar: '<span data-test-id="custom-avatar">N</span>',
      },
    })

    expect(wrapper.findAll('[data-test-id="custom-avatar"]').length).toBe(1)
    expect(wrapper.get('[data-test-id="v-notification-action-setup"]').text()).toBe('Set up')
    expect(wrapper.get('[data-test-id="v-notification-action-decline"]').text()).toBe('Decline')
    expect(wrapper.get('[data-test-id="v-notification-dismiss"]').get('[data-test-id="v-icon"]').exists()).toBe(true)

    await wrapper.get('[data-test-id="v-notification-action-setup"]').trigger('click')
    expect(wrapper.emitted('action')).toEqual([['setup']])
    expect(wrapper.emitted('click')).toBeUndefined()

    await wrapper.get('[data-test-id="v-notification-dismiss"]').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('emits click and marks unread as read on item activation', async () => {
    const wrapper = mount(VNotificationItem, {
      props: {
        title: 'New comment',
        unread: true,
      },
    })

    await wrapper.get('[data-test-id="v-notification-item"]').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('update:unread')).toEqual([[false]])

    await wrapper.get('[data-test-id="v-notification-item"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('supports sizes and disabled or loading states', () => {
    const sized = mount(VNotificationItem, { props: { size: 'sm', title: 'Compact' } })
    expect(sized.get('[data-test-id="v-notification-item"]').classes()).toContain('v-notification-item--sm')

    const disabled = mount(VNotificationItem, { props: { disabled: true, title: 'Disabled' } })
    expect(disabled.get('[data-test-id="v-notification-item"]').attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-notification-item"]').attributes('data-state')).toBe('disabled')

    const loading = mount(VNotificationItem, { props: { loading: true, title: 'Loading' } })
    expect(loading.get('[data-test-id="v-notification-item"]').attributes('aria-busy')).toBe('true')
    expect(loading.find('.v-notification-item__loader').exists()).toBe(true)
  })
})
