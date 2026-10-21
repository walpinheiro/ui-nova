/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VCommandPalette from '../VCommandPalette.vue'
import { DEFAULT_COMMAND_GROUPS, filterCommandGroups, mountVCommandPalette } from '../mountVCommandPalette'

describe('VCommandPalette', () => {
  it('renders closed trigger with stable anatomy test ids', () => {
    const wrapper = mount(VCommandPalette, { props: { modelValue: false } })
    expect(wrapper.get('[data-test-id="command-palette"]').attributes('data-state')).toBe('closed')
    expect(wrapper.get('[data-test-id="command-palette-trigger"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="command-palette-input"]').exists()).toBe(false)
  })

  it('renders an open palette with dialog semantics and grouped results', () => {
    const wrapper = mount(VCommandPalette, { props: { modelValue: true } })
    expect(wrapper.get('[data-test-id="command-palette"]').attributes('data-state')).toBe('open')
    expect(wrapper.get('[data-test-id="command-palette-backdrop"]').exists()).toBe(true)
    const panel = wrapper.get('[data-test-id="command-palette-size-default"]')
    expect(panel.attributes('role')).toBe('dialog')
    expect(panel.attributes('aria-modal')).toBe('true')
    expect(panel.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-test-id="command-palette-input"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="command-palette-group-recent"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="command-palette-result-selected"]').text()).toContain('Open settings')
    expect(wrapper.get('#command-palette-result-open-settings').exists()).toBe(true)
  })

  it('normalizes poster sizes, variants and keeps legacy values compatible', () => {
    expect(mountVCommandPalette({ size: 'lg', variant: 'settings-palette' }).size).toBe('lg')
    expect(mountVCommandPalette({ size: 'sm', variant: 'quick-actions' }).variant).toBe('quick-actions')
    expect(mountVCommandPalette({ size: 'md', variant: 'default' as never }).variant).toBe('global-search')
    expect(mountVCommandPalette({ size: 'md', variant: 'primary' as never }).variant).toBe('quick-actions')

    const wrapper = mount(VCommandPalette, { props: { modelValue: true, size: 'lg', variant: 'file-switcher' } })
    expect(wrapper.get('[data-test-id="command-palette-size-wide"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="command-palette"]').attributes('data-variant')).toBe('file-switcher')
  })

  it('filters results by query and shows empty state', async () => {
    const wrapper = mount(VCommandPalette, {
      props: { modelValue: true, query: 'zzzz-no-match' },
    })
    expect(wrapper.get('[data-test-id="command-palette-state-empty"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('No results found')
    expect(wrapper.text()).toContain('Try a different search term.')
  })

  it('emits select and close events when a result is clicked', async () => {
    const wrapper = mount(VCommandPalette, { props: { modelValue: true } })
    await wrapper.get('[data-test-id="command-palette-result-view-docs"]').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'view-docs', label: 'View documentation' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('supports keyboard navigation and Escape dismiss', async () => {
    const wrapper = mount(VCommandPalette, { props: { modelValue: true } })
    const panel = wrapper.get('[data-test-id="command-palette-size-default"]')
    await panel.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.get('[data-test-id="command-palette-result-selected"]').text()).toContain('View documentation')
    await panel.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'view-docs' })
    const dismiss = mount(VCommandPalette, { props: { modelValue: true } })
    await dismiss.get('[data-test-id="command-palette-size-default"]').trigger('keydown', { key: 'Escape' })
    expect(dismiss.emitted('dismiss')).toHaveLength(1)
  })

  it('respects dismissible=false and disabled/loading guards', async () => {
    const notDismissible = mount(VCommandPalette, { props: { modelValue: true, dismissible: false } })
    await notDismissible.get('[data-test-id="command-palette-backdrop"]').trigger('click')
    await notDismissible.get('[data-test-id="command-palette-size-default"]').trigger('keydown', { key: 'Escape' })
    expect(notDismissible.emitted('dismiss')).toBeUndefined()

    const disabled = mount(VCommandPalette, { props: { modelValue: true, disabled: true } })
    expect(disabled.get('[data-test-id="command-palette-size-default"]').attributes('aria-disabled')).toBe('true')

    const loading = mount(VCommandPalette, { props: { modelValue: true, loading: true } })
    expect(loading.get('[data-test-id="command-palette-state-loading"]').exists()).toBe(true)
    expect(loading.get('[data-test-id="command-palette-size-default"]').attributes('aria-busy')).toBe('true')
  })

  it('mount helpers filter grouped commands deterministically', () => {
    expect(filterCommandGroups(DEFAULT_COMMAND_GROUPS, 'settings')).toHaveLength(1)
    expect(filterCommandGroups(DEFAULT_COMMAND_GROUPS, 'settings')[0].items[0].id).toBe('open-settings')
  })
})
