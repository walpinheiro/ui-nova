/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTabs from '../VTabs.vue'

const items = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
]

describe('VTabs', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VTabs)
    expect(w.find('[data-test-id="v-tabs"]').exists()).toBe(true)
  })

  it('exposes tablist role with tabs and tabpanel', () => {
    const w = mount(VTabs, { props: { items } })
    expect(w.get('[data-test-id="v-tabs-list"]').attributes('role')).toBe('tablist')
    expect(w.findAll('[role="tab"]').length).toBe(3)
    expect(w.find('[data-test-id="v-tabs-panel-one"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-tabs-panel-one"]').attributes('role')).toBe('tabpanel')
  })

  it('selects first tab by default with aria-selected and roving tabindex', () => {
    const w = mount(VTabs, { props: { items } })
    const tabs = w.findAll('[role="tab"]')
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(tabs[0].attributes('tabindex')).toBe('0')
    expect(tabs[1].attributes('aria-selected')).toBe('false')
    expect(tabs[1].attributes('tabindex')).toBe('-1')
  })

  it('respects modelValue selection', () => {
    const w = mount(VTabs, { props: { items, modelValue: 'two' } })
    expect(w.get('[data-test-id="v-tabs-tab-two"]').attributes('aria-selected')).toBe('true')
  })

  it('emits update:modelValue on tab click', async () => {
    const w = mount(VTabs, { props: { items } })
    await w.get('[data-test-id="v-tabs-tab-two"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['two']])
  })

  it('navigates with ArrowRight/ArrowLeft/Home/End', async () => {
    const w = mount(VTabs, { props: { items, modelValue: 'one' } })
    const first = w.get('[data-test-id="v-tabs-tab-one"]')
    await first.trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')).toEqual([['two']])
    await w.get('[data-test-id="v-tabs-tab-two"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(w.emitted('update:modelValue')).toEqual([['two'], ['one']])
    await w.get('[data-test-id="v-tabs-tab-one"]').trigger('keydown', { key: 'End' })
    expect(w.emitted('update:modelValue')).toEqual([['two'], ['one'], ['three']])
    await w.get('[data-test-id="v-tabs-tab-three"]').trigger('keydown', { key: 'Home' })
    expect(w.emitted('update:modelValue')).toEqual([['two'], ['one'], ['three'], ['one']])
  })

  it('skips disabled tab on keyboard navigation', async () => {
    const w = mount(VTabs, {
      props: {
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
          { value: 'c', label: 'C' },
        ],
        modelValue: 'a',
      },
    })
    await w.get('[data-test-id="v-tabs-tab-a"]').trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')).toEqual([['c']])
  })

  it('does not emit when disabled tab clicked', async () => {
    const w = mount(VTabs, {
      props: {
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      },
    })
    await w.get('[data-test-id="v-tabs-tab-b"]').trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies size and variant data attributes', () => {
    const w = mount(VTabs, { props: { size: 'lg', variant: 'pill' } })
    const root = w.get('[data-test-id="v-tabs"]')
    expect(root.classes()).toContain('v-tabs--lg')
    expect(root.classes()).toContain('v-tabs--pill')
    expect(root.attributes('data-variant')).toBe('pill')
    expect(root.attributes('data-size')).toBe('lg')
  })

  it('maps legacy variants to design variants', () => {
    const w = mount(VTabs, { props: { variant: 'primary' } })
    expect(w.get('[data-test-id="v-tabs"]').attributes('data-variant')).toBe('pill')
    const subtle = mount(VTabs, { props: { variant: 'subtle' } })
    expect(subtle.get('[data-test-id="v-tabs"]').attributes('data-variant')).toBe('underline')
  })

  it('renders icon variant with VIcon', () => {
    const w = mount(VTabs, {
      props: {
        variant: 'icon',
        items: [{ value: 'home', label: 'Home', icon: 'home' }],
      },
    })
    expect(w.find('.v-tabs__icon[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders sliding indicator', () => {
    const w = mount(VTabs, { props: { items } })
    expect(w.find('[data-test-id="v-tabs-indicator"]').exists()).toBe(true)
  })

  it('supports disabled state on root', () => {
    const w = mount(VTabs, { props: { disabled: true, items } })
    expect(w.get('[data-test-id="v-tabs-tab-one"]').attributes('aria-disabled')).toBe('true')
  })

  it('exposes ARIA label on tablist', () => {
    const w = mount(VTabs, { props: { ariaLabel: 'Settings tabs' } })
    expect(w.get('[data-test-id="v-tabs-list"]').attributes('aria-label')).toBe('Settings tabs')
  })

  it('renders default slot content in panel', () => {
    const w = mount(VTabs, { slots: { default: 'Panel body' } })
    expect(w.get('[data-test-id="v-tabs-panel-overview"]').text()).toContain('Panel body')
  })
})

describe('VTabs panels and actions', () => {
  it('omits tabpanel and aria-controls when panels is false', () => {
    const w = mount(VTabs, { props: { items, panels: false } })
    expect(w.find('[role="tabpanel"]').exists()).toBe(false)
    expect(w.get('[role="tab"]').attributes('aria-controls')).toBeUndefined()
  })

  it('keeps the tabpanel by default', () => {
    const w = mount(VTabs, { props: { items } })
    expect(w.find('[role="tabpanel"]').exists()).toBe(true)
    expect(w.get('[role="tab"]').attributes('aria-controls')).toBe('v-tabs-panel-one')
  })

  it('renders the #actions slot in the tab bar', () => {
    const w = mount(VTabs, { props: { items }, slots: { actions: '<button class="act">Add</button>' } })
    expect(w.get('.v-tabs__bar [data-test-id="v-tabs-actions"] .act').text()).toBe('Add')
    expect(mount(VTabs, { props: { items } }).find('[data-test-id="v-tabs-actions"]').exists()).toBe(false)
  })
})
