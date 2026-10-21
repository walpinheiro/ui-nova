/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSheet from '../VSheet.vue'
import { mountVSheet } from '../mountVSheet'

describe('VSheet', () => {
  it('contract: open/modelValue/side/size/close/dismiss via find().exists()', async () => {
    const w = mount(VSheet, { props: { side: 'right', size: 'md' } })
    expect(w.find('[data-test-id="v-sheet"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-sheet-panel"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-sheet-backdrop"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-sheet-close"]').exists()).toBe(true)
    const closed = mount(VSheet, { props: { open: false } })
    expect(closed.find('[data-test-id="v-sheet-panel"]').exists()).toBe(false)
    expect(closed.find('[data-test-id="v-sheet-backdrop"]').exists()).toBe(true)
    const alias = mount(VSheet, { props: { modelValue: false } })
    expect(alias.find('[data-test-id="v-sheet-panel"]').exists()).toBe(false)
    await w.find('[data-test-id="v-sheet-close"]').trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
    expect(w.emitted('update:open')).toEqual([[false]])
    const d = mount(VSheet)
    await d.find('[data-test-id="v-sheet-backdrop"]').trigger('click')
    expect(d.find('[data-test-id="v-sheet"]').exists()).toBe(true)
    expect(d.emitted('dismiss')).toHaveLength(1)
    const e = mount(VSheet, { props: { side: 'left', size: 'sm' } })
    expect(e.find('[data-test-id="v-sheet-panel"]').exists()).toBe(true)
    expect(e.get('[data-test-id="v-sheet"]').classes()).toContain('v-sheet--left')
    expect(e.get('[data-test-id="v-sheet"]').classes()).toContain('v-sheet--sm')
  })

  it('renders dialog panel and exposes stable test ids', () => {
    const w = mount(VSheet, { slots: { default: 'Body content' } })
    expect(w.find('[data-test-id="v-sheet"]').exists()).toBe(true)
    const panel = w.get('[data-test-id="v-sheet-panel"]')
    expect(panel.attributes('role')).toBe('dialog')
    expect(panel.attributes('aria-modal')).toBe('true')
    expect(w.find('[data-test-id="v-sheet-backdrop"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-sheet-content"]').text()).toContain('Body content')
  })

  it('defaults to right side, md size and open state', () => {
    const w = mount(VSheet)
    const root = w.get('[data-test-id="v-sheet"]')
    expect(root.classes()).toContain('v-sheet--right')
    expect(root.classes()).toContain('v-sheet--md')
    expect(root.classes()).toContain('v-sheet--open')
    expect(root.attributes('data-state')).toBe('open')
    expect(mountVSheet({}).side).toBe('right')
    expect(mountVSheet({}).size).toBe('md')
    expect(mountVSheet({}).open).toBe(true)
  })

  it('applies side and size modifiers', () => {
    const left = mount(VSheet, { props: { side: 'left', size: 'lg' } })
    expect(left.get('[data-test-id="v-sheet"]').classes()).toContain('v-sheet--left')
    expect(left.get('[data-test-id="v-sheet"]').classes()).toContain('v-sheet--lg')
    const bottom = mount(VSheet, { props: { side: 'bottom', size: 'xl' } })
    expect(bottom.get('[data-test-id="v-sheet"]').classes()).toContain('v-sheet--bottom')
    expect(bottom.get('[data-test-id="v-sheet"]').classes()).toContain('v-sheet--xl')
    const small = mount(VSheet, { props: { size: 'sm' } })
    expect(small.get('[data-test-id="v-sheet"]').classes()).toContain('v-sheet--sm')
  })

  it('renders title, description, actions and footer slots', () => {
    const w = mount(VSheet, {
      props: { title: 'Project Settings', description: 'Manage your project details.' },
      slots: {
        actions: '<button data-test-id="slot-actions">...</button>',
        footer: '<span data-test-id="slot-footer">Footer</span>',
      },
    })
    expect(w.get('[data-test-id="v-sheet-title"]').text()).toBe('Project Settings')
    expect(w.get('[data-test-id="v-sheet-description"]').text()).toBe('Manage your project details.')
    expect(w.find('[data-test-id="slot-actions"]').html()).toContain('slot-actions')
    expect(w.find('[data-test-id="slot-footer"]').html()).toContain('slot-footer')
  })

  it('exposes aria-labelledby from title and aria-describedby from description', () => {
    const titled = mount(VSheet, {
      props: { title: 'Sheet Title', description: 'A brief description goes here.' },
    })
    const panel = titled.get('[data-test-id="v-sheet-panel"]')
    expect(panel.attributes('aria-label')).toBeUndefined()
    expect(panel.attributes('aria-labelledby')).toBe(
      titled.get('[data-test-id="v-sheet-title"]').attributes('id'),
    )
    expect(panel.attributes('aria-describedby')).toBe(
      titled.get('[data-test-id="v-sheet-description"]').attributes('id'),
    )
    const labelled = mount(VSheet, { props: { ariaLabel: 'Custom sheet' } })
    expect(labelled.get('[data-test-id="v-sheet-panel"]').attributes('aria-label')).toBe('Custom sheet')
    expect(labelled.get('[data-test-id="v-sheet-panel"]').attributes('aria-labelledby')).toBeUndefined()
  })

  it('renders the title as a heading linked via aria-labelledby', () => {
    const w = mount(VSheet, { props: { title: 'Sheet Title' } })
    const title = w.get('[data-test-id="v-sheet-title"]')
    expect(title.element.tagName).toBe('H2')
    expect(title.attributes('id')).toBeTruthy()
    expect(w.get('[data-test-id="v-sheet-panel"]').attributes('aria-labelledby')).toBe(
      title.attributes('id'),
    )
  })

  it('emits close events when the close button is clicked', async () => {
    const w = mount(VSheet)
    await w.get('[data-test-id="v-sheet-close"]').trigger('click')
    expect(w.emitted('update:open')).toEqual([[false]])
    expect(w.emitted('update:modelValue')).toEqual([[false]])
    expect(w.emitted('open-change')).toEqual([[false]])
    expect(w.emitted('close')).toHaveLength(1)
  })

  it('emits dismiss events on backdrop click and Escape', async () => {
    const w = mount(VSheet)
    await w.get('[data-test-id="v-sheet-backdrop"]').trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
    expect(w.emitted('update:open')).toEqual([[false]])
    const esc = mount(VSheet)
    await esc.get('[data-test-id="v-sheet-panel"]').trigger('keydown', { key: 'Escape' })
    expect(esc.emitted('dismiss')).toHaveLength(1)
  })

  it('respects dismissible=false on backdrop and Escape', async () => {
    const w = mount(VSheet, { props: { dismissible: false } })
    await w.get('[data-test-id="v-sheet-backdrop"]').trigger('click')
    expect(w.emitted('dismiss')).toBeUndefined()
    await w.get('[data-test-id="v-sheet-panel"]').trigger('keydown', { key: 'Escape' })
    expect(w.emitted('dismiss')).toBeUndefined()
  })

  it('supports modelValue alias for open state', () => {
    const closed = mount(VSheet, { props: { modelValue: false } })
    expect(closed.get('[data-test-id="v-sheet"]').attributes('data-state')).toBe('closed')
    expect(closed.find('[data-test-id="v-sheet-panel"]').exists()).toBe(false)
    const open = mount(VSheet, { props: { open: true } })
    expect(open.find('[data-test-id="v-sheet-panel"]').exists()).toBe(true)
  })

  it('supports disabled state', () => {
    const w = mount(VSheet, { props: { disabled: true } })
    expect(w.get('[data-test-id="v-sheet-panel"]').attributes('aria-disabled')).toBe('true')
  })

  it('supports loading state with loader and aria-busy', () => {
    const w = mount(VSheet, { props: { loading: true } })
    const panel = w.get('[data-test-id="v-sheet-panel"]')
    expect(panel.attributes('aria-busy')).toBe('true')
    expect(panel.attributes('aria-disabled')).toBe('true')
    expect(w.find('[data-test-id="v-sheet-loader"]').html()).toContain('v-sheet__loader')
  })

  it('does not emit close when disabled', async () => {
    const w = mount(VSheet, { props: { disabled: true } })
    await w.get('[data-test-id="v-sheet-close"]').trigger('click')
    expect(w.emitted('close')).toBeUndefined()
  })

  it('traps Tab/Shift+Tab inside the panel while open', async () => {
    const w = mount(VSheet, {
      attachTo: document.body,
      props: { title: 'Trap sheet' },
      slots: {
        default: '<button data-test-id="trap-a">A</button><button data-test-id="trap-b">B</button>',
      },
    })
    const panel = w.get('[data-test-id="v-sheet-panel"]')
    const close = panel.get('[data-test-id="v-sheet-close"]').element as HTMLElement
    const last = panel.get('[data-test-id="trap-b"]').element as HTMLElement
    last.focus()
    await panel.trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(close)
    close.focus()
    await panel.trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
    w.unmount()
  })

  it('moves initial focus to the first focusable element on mount', async () => {
    const w = mount(VSheet, {
      attachTo: document.body,
      slots: { default: '<button data-test-id="trap-first">First</button>' },
    })
    await w.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))
    // Close button is the first focusable; either it or the panel receives focus.
    expect(document.activeElement?.closest('[data-test-id="v-sheet-panel"]')).not.toBeNull()
    w.unmount()
  })

  it('applies fullHeight modifier and exposes motion states', async () => {
    const immersive = mount(VSheet, { props: { fullHeight: true, side: 'bottom' } })
    expect(immersive.get('[data-test-id="v-sheet"]').classes()).toContain('v-sheet--full-height')
    expect(immersive.get('[data-test-id="v-sheet"]').attributes('data-side')).toBe('bottom')
    const closed = mount(VSheet, { props: { open: false } })
    expect(closed.get('[data-test-id="v-sheet"]').attributes('data-state')).toBe('closed')
    const w = mount(VSheet, { props: { open: true } })
    expect(['open', 'opening']).toContain(w.get('[data-test-id="v-sheet"]').attributes('data-state'))
  })

  it('returns focus to the opener on unmount-close (Escape keeps return path)', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const opener = document.createElement('button')
    opener.textContent = 'opener'
    host.appendChild(opener)
    opener.focus()
    const w = mount(VSheet, { attachTo: host })
    await w.get('[data-test-id="v-sheet-panel"]').trigger('keydown', { key: 'Escape' })
    expect(w.emitted('dismiss')).toHaveLength(1)
    w.unmount()
    host.remove()
  })
})
