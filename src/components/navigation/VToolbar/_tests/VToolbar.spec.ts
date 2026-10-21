/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VToolbar from '../VToolbar.vue'
import VToolbarButton from '../VToolbarButton.vue'
import VToolbarGroup from '../VToolbarGroup.vue'
import VToolbarDivider from '../VToolbarDivider.vue'
import VToolbarSpacer from '../VToolbarSpacer.vue'

const overflowMenu = [
  { value: 'share', label: 'Share' },
  { value: 'download', label: 'Download' },
]

describe('VToolbar', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VToolbar)
    expect(w.find('[data-test-id="v-toolbar"]').exists()).toBe(true)
  })

  it('defaults to default variant and md size with toolbar role', () => {
    const w = mount(VToolbar)
    const root = w.get('[data-test-id="v-toolbar"]')
    expect(root.classes()).toContain('v-toolbar--default')
    expect(root.classes()).toContain('v-toolbar--md')
    expect(root.attributes('role')).toBe('toolbar')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-size')).toBe('md')
  })

  it('supports all 4 variants and 3 sizes', () => {
    for (const variant of ['default', 'compact', 'floating', 'editor'] as const) {
      const w = mount(VToolbar, { props: { variant } })
      expect(w.get('[data-test-id="v-toolbar"]').classes()).toContain(`v-toolbar--${variant}`)
    }
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mount(VToolbar, { props: { size } })
      expect(w.get('[data-test-id="v-toolbar"]').classes()).toContain(`v-toolbar--${size}`)
    }
  })

  it('supports the segmented canvas toolbar', () => {
    const w = mount(VToolbar, { props: { variant: 'segmented' } })
    const root = w.get('[data-test-id="v-toolbar"]')
    expect(root.classes()).toContain('v-toolbar--segmented')
    expect(root.attributes('data-variant')).toBe('segmented')
  })

  it('maps legacy primary/subtle variants', () => {
    const primary = mount(VToolbar, { props: { variant: 'primary' as never } })
    expect(primary.get('[data-test-id="v-toolbar"]').attributes('data-variant')).toBe('floating')
    const subtle = mount(VToolbar, { props: { variant: 'subtle' as never } })
    expect(subtle.get('[data-test-id="v-toolbar"]').attributes('data-variant')).toBe('compact')
  })

  it('supports disabled and loading states', () => {
    const disabled = mount(VToolbar, { props: { disabled: true } })
    expect(disabled.get('[data-test-id="v-toolbar"]').attributes('aria-disabled')).toBe('true')
    const loading = mount(VToolbar, { props: { loading: true } })
    const root = loading.get('[data-test-id="v-toolbar"]')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.classes()).toContain('v-toolbar--loading')
    expect(loading.find('[data-test-id="v-toolbar-loader"]').exists()).toBe(true)
  })

  it('exposes ARIA label from ariaLabel', () => {
    const w = mount(VToolbar, { props: { ariaLabel: 'Document actions' } })
    expect(w.get('[data-test-id="v-toolbar"]').attributes('aria-label')).toBe('Document actions')
  })

  it('renders compound anatomy with group, divider, spacer and buttons', () => {
    const w = mount(VToolbar, {
      slots: {
        default: `
          <div data-test-id="v-toolbar-group" role="group"></div>
          <span data-test-id="v-toolbar-divider" role="separator"></span>
          <span data-test-id="v-toolbar-spacer"></span>
          <button data-test-id="v-toolbar-button-save">Save</button>
        `,
      },
    })
    expect(w.find('[data-test-id="v-toolbar-group"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-toolbar-divider"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-toolbar-spacer"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-toolbar-button-save"]').exists()).toBe(true)
  })
})

describe('VToolbarButton', () => {
  it('renders icon-only and primary action test ids', () => {
    const icon = mount(VToolbarButton, { props: { icon: 'undo', ariaLabel: 'Undo' } })
    expect(icon.get('[data-test-id="v-toolbar-button-undo"]').exists()).toBe(true)
    const primary = mount(VToolbarButton, { props: { variant: 'primary', icon: 'save', label: 'Save' } })
    expect(primary.get('[data-test-id="v-toolbar-primary-action"]').exists()).toBe(true)
  })

  it('emits click for default button', async () => {
    const w = mount(VToolbarButton, { props: { icon: 'undo', ariaLabel: 'Undo' } })
    await w.get('button').trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
  })

  it('opens overflow menu and emits select', async () => {
    const w = mount(VToolbarButton, {
      props: { icon: 'more-h', ariaLabel: 'More', menu: overflowMenu },
    })
    await w.get('[data-test-id="v-toolbar-overflow-trigger"]').trigger('click')
    expect(w.find('[data-test-id="v-toolbar-overflow-menu"]').exists()).toBe(true)
    await w.get('[data-test-id="v-toolbar-overflow-item-share"]').trigger('click')
    expect(w.emitted('select')).toEqual([['share']])
  })

  it('supports toggle active state with aria-pressed', () => {
    const w = mount(VToolbarButton, {
      props: { icon: 'bold', variant: 'toggle', active: true, ariaLabel: 'Bold' },
    })
    expect(w.get('button').attributes('aria-pressed')).toBe('true')
    expect(w.get('button').classes()).toContain('v-toolbar__button--active')
  })
})

describe('VToolbar subcomponents', () => {
  it('renders group divider and spacer test ids', () => {
    expect(mount(VToolbarGroup).find('[data-test-id="v-toolbar-group"]').exists()).toBe(true)
    expect(mount(VToolbarDivider).find('[data-test-id="v-toolbar-divider"]').exists()).toBe(true)
    expect(mount(VToolbarSpacer).find('[data-test-id="v-toolbar-spacer"]').exists()).toBe(true)
  })
})
