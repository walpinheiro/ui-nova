/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VInspectorPanel from '../VInspectorPanel.vue'

describe('VInspectorPanel', () => {
  it('renders complementary landmark with stable test id', () => {
    const w = mount(VInspectorPanel)
    const root = w.get('[data-test-id="v-inspector-panel"]')
    expect(root.attributes('role')).toBe('complementary')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-size')).toBe('default')
    expect(root.attributes('data-open')).toBe('true')
  })

  it('renders header, tabs and default sections', () => {
    const w = mount(VInspectorPanel)
    expect(w.find('[data-test-id="v-inspector-panel-header"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-inspector-panel-title"]').text()).toBe('Inspector')
    expect(w.find('[data-test-id="v-inspector-panel-tabs"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-inspector-panel-tab-properties"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-inspector-panel-tab-styles"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-inspector-panel-tab-interactions"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-inspector-panel-section-general"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-inspector-panel-section-general"]').attributes('data-expanded')).toBe('true')
  })

  it('applies size and variant data attributes', () => {
    const w = mount(VInspectorPanel, { props: { size: 'wide', variant: 'minimal' } })
    const root = w.get('[data-test-id="v-inspector-panel"]')
    expect(root.attributes('data-size')).toBe('wide')
    expect(root.attributes('data-variant')).toBe('minimal')
    expect(root.classes()).toContain('v-inspector-panel--size-wide')
    expect(root.classes()).toContain('v-inspector-panel--variant-minimal')
    expect(w.find('[data-test-id="v-inspector-panel-tab-meta"]').exists()).toBe(false)
  })

  it('tabs variant exposes meta tab and floating hides tabs', () => {
    const tabs = mount(VInspectorPanel, { props: { variant: 'tabs' } })
    expect(tabs.find('[data-test-id="v-inspector-panel-tab-meta"]').exists()).toBe(true)
    const floating = mount(VInspectorPanel, { props: { variant: 'floating' } })
    expect(floating.find('[data-test-id="v-inspector-panel-tabs"]').exists()).toBe(false)
    expect(floating.find('[data-test-id="v-inspector-panel-actions"]').exists()).toBe(true)
  })

  it('supports header slot and section slots', () => {
    const w = mount(VInspectorPanel, {
      slots: {
        header: '<h2>Custom header</h2>',
        general: '<p data-test-id="custom-general">General fields</p>',
      },
    })
    expect(w.find('[data-test-id="v-inspector-panel-title"]').exists()).toBe(false)
    expect(w.text()).toContain('Custom header')
    expect(w.find('[data-test-id="custom-general"]').exists()).toBe(true)
  })

  it('emits tab-change when selecting a tab', async () => {
    const w = mount(VInspectorPanel)
    await w.get('[data-test-id="v-inspector-panel-tab-styles"]').trigger('click')
    expect(w.emitted('tab-change')).toEqual([['styles']])
    expect(w.emitted('update:activeTab')).toEqual([['styles']])
    expect(w.find('[data-test-id="v-inspector-panel-section-general"]').exists()).toBe(false)
    expect(w.find('[data-test-id="v-inspector-panel-section-appearance"]').exists()).toBe(true)
  })

  it('toggles section expansion', async () => {
    const w = mount(VInspectorPanel)
    const layout = w.get('[data-test-id="v-inspector-panel-section-layout"]')
    expect(layout.attributes('data-expanded')).toBe('false')
    await layout.get('button').trigger('click')
    expect(layout.attributes('data-expanded')).toBe('true')
    expect(w.emitted('section-toggle')).toEqual([['layout', true]])
  })

  it('closes via close button and emits open-change', async () => {
    const w = mount(VInspectorPanel)
    await w.get('[data-test-id="v-inspector-panel-close"]').trigger('click')
    expect(w.emitted('update:open')).toEqual([[false]])
    expect(w.emitted('open-change')).toEqual([[false]])
    expect(w.emitted('close')).toHaveLength(1)
  })

  it('closes on Escape when dismissible', async () => {
    const w = mount(VInspectorPanel)
    await w.get('[data-test-id="v-inspector-panel"]').trigger('keydown', { key: 'Escape' })
    expect(w.emitted('update:open')).toEqual([[false]])
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  it('supports disabled and loading ARIA', () => {
    const disabled = mount(VInspectorPanel, { props: { disabled: true } })
    expect(disabled.get('[data-test-id="v-inspector-panel"]').attributes('aria-disabled')).toBe('true')
    expect(disabled.get('[data-test-id="v-inspector-panel"]').attributes('data-state')).toBe('disabled')

    const loading = mount(VInspectorPanel, { props: { loading: true } })
    expect(loading.get('[data-test-id="v-inspector-panel"]').attributes('aria-busy')).toBe('true')
    expect(loading.find('[data-test-id="v-inspector-panel-skeleton"]').exists()).toBe(true)
    expect(loading.find('[data-test-id="v-inspector-panel-content"]').exists()).toBe(false)
  })

  it('exposes custom aria label', () => {
    const w = mount(VInspectorPanel, { props: { ariaLabel: 'Inspector panel' } })
    expect(w.get('[data-test-id="v-inspector-panel"]').attributes('aria-label')).toBe('Inspector panel')
  })

  it('respects open=false', () => {
    const w = mount(VInspectorPanel, { props: { open: false } })
    expect(w.get('[data-test-id="v-inspector-panel"]').attributes('data-open')).toBe('false')
    expect(w.get('[data-test-id="v-inspector-panel"]').classes()).toContain('v-inspector-panel--closed')
  })
})
