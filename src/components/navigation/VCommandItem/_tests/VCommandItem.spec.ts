/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VCommandItem from '../VCommandItem.vue'

describe('VCommandItem', () => {
  it('renders as option button with stable test id', () => {
    const w = mount(VCommandItem, {
      props: { id: 'settings', label: 'Open settings', icon: 'settings' },
    })
    const root = w.get('[data-test-id="v-command-item"]')
    expect(root.element.tagName).toBe('BUTTON')
    expect(root.attributes('role')).toBe('option')
  })

  it('renders label, icon and shortcut', () => {
    const w = mount(VCommandItem, {
      props: {
        label: 'Open settings',
        icon: 'settings',
        shortcut: '⌘,',
      },
    })
    expect(w.get('[data-test-id="v-command-item-label"]').text()).toBe('Open settings')
    expect(w.find('[data-test-id="v-command-item-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-command-item-shortcut"]').text()).toBe('⌘,')
  })

  it('applies selected state', () => {
    const w = mount(VCommandItem, {
      props: { label: 'Selected command', selected: true },
    })
    const root = w.get('[data-test-id="v-command-item-selected"]')
    expect(root.classes()).toContain('v-command-item--selected')
    expect(root.attributes('aria-selected')).toBe('true')
    expect(root.attributes('data-state')).toBe('selected')
  })

  it('supports disabled and loading states', () => {
    const disabled = mount(VCommandItem, { props: { label: 'Disabled', disabled: true } })
    expect(disabled.get('[data-test-id="v-command-item"]').attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-command-item"]').attributes('data-state')).toBe('disabled')

    const loading = mount(VCommandItem, { props: { label: 'Loading', loading: true } })
    expect(loading.get('[data-test-id="v-command-item"]').attributes('aria-busy')).toBe('true')
    expect(loading.find('[data-test-id="v-command-item-loader"]').exists()).toBe(true)
  })

  it('emits click and select on interaction', async () => {
    const w = mount(VCommandItem, {
      props: { id: 'docs', label: 'View documentation' },
    })
    await w.get('[data-test-id="v-command-item"]').trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
    expect(w.emitted('select')?.[0]).toEqual([{ id: 'docs', label: 'View documentation' }])
  })

  it('does not emit when disabled', async () => {
    const w = mount(VCommandItem, { props: { label: 'Disabled', disabled: true } })
    await w.get('[data-test-id="v-command-item"]').trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })

  it('applies size and variant modifiers', () => {
    const w = mount(VCommandItem, {
      props: { label: 'Command', size: 'lg', variant: 'primary' },
    })
    const root = w.get('[data-test-id="v-command-item"]')
    expect(root.classes()).toContain('v-command-item--lg')
    expect(root.classes()).toContain('v-command-item--primary')
    expect(root.attributes('data-size')).toBe('lg')
    expect(root.attributes('data-variant')).toBe('primary')
  })

  it('sets option id when prop id is provided', () => {
    const w = mount(VCommandItem, { props: { id: 'home', label: 'Go home' } })
    expect(w.get('[data-test-id="v-command-item"]').attributes('id')).toBe('command-item-home')
  })

  it('supports icon slot override', () => {
    const w = mount(VCommandItem, {
      props: { label: 'Custom icon' },
      slots: { icon: '<span data-test-id="custom-icon">*</span>' },
    })
    expect(w.find('[data-test-id="custom-icon"]').exists()).toBe(true)
  })
})
