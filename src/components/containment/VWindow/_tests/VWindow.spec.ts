/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VWindow from '../VWindow.vue'

describe('VWindow', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VWindow)
    expect(w.find('[data-test-id="v-window"]').exists()).toBe(true)
  })

  it('renders titlebar anatomy: icon, title, actions, content', () => {
    const w = mount(VWindow, { props: { title: 'Sample Window' } })
    expect(w.find('[data-test-id="v-window-titlebar"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-window-app-icon"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-window-title"]').text()).toBe('Sample Window')
    expect(w.find('[data-test-id="v-window-actions"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-window-content"]').exists()).toBe(true)
  })

  it('renders window actions: minimize, maximize, close', () => {
    const w = mount(VWindow)
    expect(w.find('[data-test-id="v-window-minimize"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-window-maximize"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-window-close"]').exists()).toBe(true)
  })

  it('emits minimize, maximize, close actions', async () => {
    const w = mount(VWindow)
    await w.get('[data-test-id="v-window-minimize"]').trigger('click')
    await w.get('[data-test-id="v-window-maximize"]').trigger('click')
    expect(w.emitted('minimize')).toBeTruthy()
    expect(w.emitted('maximize')).toBeTruthy()
    await w.get('[data-test-id="v-window-close"]').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
    expect(w.emitted('update:modelValue')).toEqual([[false]])
  })

  it('applies size modifiers sm/md/lg', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mount(VWindow, { props: { size } })
      expect(w.get('[data-test-id="v-window"]').classes()).toContain(`v-window--${size}`)
    }
  })

  it('applies variant modifiers default/minimal/borderless/modal', () => {
    for (const variant of ['default', 'minimal', 'borderless', 'modal'] as const) {
      const w = mount(VWindow, { props: { variant } })
      expect(w.get('[data-test-id="v-window"]').classes()).toContain(`v-window--${variant}`)
    }
  })

  it('uses dialog role with aria-modal for modal variant, region otherwise', () => {
    const modal = mount(VWindow, { props: { variant: 'modal' } })
    expect(modal.get('[data-test-id="v-window"]').attributes('role')).toBe('dialog')
    expect(modal.get('[data-test-id="v-window"]').attributes('aria-modal')).toBe('true')
    const plain = mount(VWindow)
    expect(plain.get('[data-test-id="v-window"]').attributes('role')).toBe('region')
  })

  it('reflects active state via modifier class and data attribute', () => {
    const active = mount(VWindow, { props: { active: true } })
    expect(active.get('[data-test-id="v-window"]').classes()).toContain('v-window--active')
    expect(active.get('[data-test-id="v-window"]').attributes('data-active')).toBe('true')
    const inactive = mount(VWindow, { props: { active: false } })
    expect(inactive.get('[data-test-id="v-window"]').classes()).toContain('v-window--inactive')
    expect(inactive.get('[data-test-id="v-window"]').attributes('data-active')).toBe('false')
  })

  it('uses neither active nor inactive modifier by default (normal state)', () => {
    const w = mount(VWindow)
    const root = w.get('[data-test-id="v-window"]')
    expect(root.classes()).not.toContain('v-window--active')
    expect(root.classes()).not.toContain('v-window--inactive')
    expect(root.attributes('data-active')).toBeUndefined()
  })

  it('supports loading state with busy flag and loader', () => {
    const w = mount(VWindow, { props: { loading: true } })
    const root = w.get('[data-test-id="v-window"]')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.attributes('data-state')).toBe('loading')
    expect(w.find('[data-test-id="v-window-loader"]').exists()).toBe(true)
  })

  it('supports disabled state via aria-disabled and data-state', () => {
    const w = mount(VWindow, { props: { disabled: true } })
    const root = w.get('[data-test-id="v-window"]')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.attributes('data-state')).toBe('disabled')
  })

  it('closes on Escape key', async () => {
    const w = mount(VWindow)
    await w.get('[data-test-id="v-window"]').trigger('keydown', { key: 'Escape' })
    expect(w.emitted('close')).toBeTruthy()
  })

  it('renders default slot content', () => {
    const w = mount(VWindow, { slots: { default: 'Body content' } })
    expect(w.get('[data-test-id="v-window-content"]').text()).toContain('Body content')
  })

  it('renders title and icon slots', () => {
    const w = mount(VWindow, {
      slots: { title: 'Custom title', icon: '<span data-test-id="custom-icon">I</span>' },
    })
    expect(w.get('[data-test-id="v-window-title"]').text()).toBe('Custom title')
    expect(w.find('[data-test-id="custom-icon"]').exists()).toBe(true)
  })

  it('renders resize handle only when resizable and emits resize', async () => {
    const plain = mount(VWindow)
    expect(plain.find('[data-test-id="v-window-resize-handle"]').exists()).toBe(false)
    expect(plain.find('[data-test-id="v-window-resize"]').exists()).toBe(false)
    const w = mount(VWindow, { props: { resizable: true } })
    expect(w.find('[data-test-id="v-window-resize-handle"]').exists()).toBe(true)
    await w.get('[data-test-id="v-window-resize-handle"]').trigger('click')
    expect(w.emitted('resize')).toBeTruthy()
  })

  it('renders traffic lights semaforo on default variant (spec §2/§8)', () => {
    const w = mount(VWindow)
    expect(w.find('[data-test-id="v-window-traffic-lights"]').exists()).toBe(true)
    const minimal = mount(VWindow, { props: { variant: 'minimal' } })
    expect(minimal.find('[data-test-id="v-window-traffic-lights"]').exists()).toBe(false)
  })

  it('minimal variant hides icon, minimize and sidebar (spec §3)', () => {
    const w = mount(VWindow, { props: { variant: 'minimal' } })
    expect(w.find('[data-test-id="v-window-app-icon"]').exists()).toBe(false)
    expect(w.find('[data-test-id="v-window-minimize"]').exists()).toBe(false)
    expect(w.find('[data-test-id="v-window-maximize"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-window-close"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-window-sidebar"]').exists()).toBe(false)
  })

  it('renders sidebar with 5 nav items (spec §2 hero)', () => {
    const w = mount(VWindow)
    expect(w.find('[data-test-id="v-window-sidebar"]').exists()).toBe(true)
    for (const item of ['overview', 'notes', 'tasks', 'assets', 'settings']) {
      expect(w.find(`[data-test-id="v-window-nav-${item}"]`).exists()).toBe(true)
    }
  })

  it('renders backdrop only for open modal variant', () => {
    const plain = mount(VWindow)
    expect(plain.find('[data-test-id="v-window-backdrop"]').exists()).toBe(false)
    const modal = mount(VWindow, { props: { variant: 'modal', open: true } })
    expect(modal.find('[data-test-id="v-window-backdrop"]').exists()).toBe(true)
  })

  it('normalizes width/height props (number→px) into :style (spec :width="960" :height="640")', () => {
    const w = mount(VWindow, { props: { width: 960, height: 640 } })
    const style = w.get('[data-test-id="v-window"]').attributes('style') ?? ''
    expect(style).toContain('width: 960px')
    expect(style).toContain('height: 640px')
  })

  it('exposes ARIA label from ariaLabel or title', () => {
    const w = mount(VWindow, { props: { title: 'Sample Window' } })
    expect(w.get('[data-test-id="v-window"]').attributes('aria-label')).toBe('Sample Window')
    const labelled = mount(VWindow, { props: { ariaLabel: 'Custom label' } })
    expect(labelled.get('[data-test-id="v-window"]').attributes('aria-label')).toBe('Custom label')
  })

  it('is focusable when enabled', () => {
    const w = mount(VWindow)
    expect(w.get('[data-test-id="v-window"]').attributes('tabindex')).toBe('0')
  })

  it('resizes with arrow keys when resizable', async () => {
    const w = mount(VWindow, { props: { resizable: true, width: 960, height: 640 } })
    const root = w.get('[data-test-id="v-window"]')
    await root.trigger('keydown', { key: 'ArrowRight' })
    await root.trigger('keydown', { key: 'ArrowDown' })
    const style = root.attributes('style') ?? ''
    expect(style).toContain('width: 976px')
    expect(style).toContain('height: 656px')
    expect(w.emitted('resize')?.length).toBeGreaterThanOrEqual(2)
  })
})
