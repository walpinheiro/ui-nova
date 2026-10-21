// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import VAvatar from '../VAvatar.vue'
import VGroupAvatar from '../VGroupAvatar.vue'
import { mountVAvatar } from '../mountVAvatar'

const root = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-test-id="avatar"]')

describe('VAvatar mount helpers', () => {
  it('maps sizes and status test ids', () => {
    expect(mountVAvatar({ size: 'md' }).sizeTestId).toBe('avatar-size-md')
    expect(mountVAvatar({ status: 'online' }).statusTestId).toBe('avatar-status-online')
    expect(mountVAvatar({ badge: 'pro' }).badgeIcon?.body).toBeTruthy()
  })
})

describe('VAvatar', () => {
  it('renders image avatar with status', () => {
    const wrapper = mount(VAvatar, {
      props: {
        src: 'https://example.com/jane.jpg',
        alt: 'Jane Doe',
        status: 'online',
        size: 'md',
      },
    })
    expect(root(wrapper).classes()).toContain('v-avatar--md')
    expect(wrapper.get('[data-test-id="avatar-image"]').attributes('alt')).toBe('Jane Doe')
    expect(wrapper.get('[data-test-id="avatar-status-online"]').classes()).toContain('v-avatar__status--online')
  })

  it('renders initials fallback', () => {
    const wrapper = mount(VAvatar, { props: { initials: 'JD', alt: 'Jane Doe' } })
    expect(wrapper.get('[data-test-id="avatar-initials"]').text()).toBe('JD')
  })

  it('renders icon fallback and loading state', () => {
    const icon = mount(VAvatar, { props: { alt: 'User' } })
    expect(icon.get('[data-test-id="avatar-icon"]').find('[data-test-id="v-icon"]').exists()).toBe(true)

    const loading = mount(VAvatar, { props: { loading: true } })
    expect(loading.get('[data-test-id="avatar-state-loading"]').exists()).toBe(true)
  })

  it('supports selectable interaction', async () => {
    const wrapper = mount(VAvatar, { props: { selectable: true, alt: 'Jane Doe' } })
    expect(root(wrapper).element.tagName).toBe('BUTTON')
    await root(wrapper).trigger('click')
    await flushPromises()
    expect(wrapper.emitted('update:selected')).toEqual([[true]])
    expect(root(wrapper).classes()).toContain('v-avatar--selected')
  })

  it('renders badge and square shape', () => {
    const wrapper = mount(VAvatar, {
      props: { src: 'https://example.com/a.jpg', badge: 'pro', shape: 'square' },
    })
    expect(wrapper.get('[data-test-id="avatar-badge"]').find('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(root(wrapper).attributes('data-shape')).toBe('square')
  })
})

describe('VGroupAvatar', () => {
  it('renders stacked members and overflow pill', () => {
    const wrapper = mount(VGroupAvatar, {
      props: {
        members: [
          { initials: 'A' },
          { initials: 'B' },
          { initials: 'C' },
          { initials: 'D' },
          { initials: 'E' },
        ],
        max: 2,
      },
    })
    expect(wrapper.get('[data-test-id="avatar-group"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="avatar-group-overflow"]').text()).toBe('+3')
  })
})
