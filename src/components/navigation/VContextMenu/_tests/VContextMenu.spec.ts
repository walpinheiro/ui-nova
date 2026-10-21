/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VContextMenu from '../VContextMenu.vue'
import type { VContextMenuProps } from '../VContextMenu.types'

const items = [
  { value: 'view', label: 'View details', icon: 'eye' },
  { value: 'rename', label: 'Rename', icon: 'edit', selected: true },
  { value: 'divider', label: '', divider: true },
  { value: 'delete', label: 'Delete', icon: 'trash', destructive: true },
]

const mountedWrappers: Array<ReturnType<typeof mount>> = []

function mountContextMenu(props: VContextMenuProps = {}, options = {}) {
  const w = mount(VContextMenu, {
    props,
    slots: {
      default: '<div data-test-id="context-target">Right-click here</div>',
    },
    attachTo: document.body,
    ...options,
  })
  mountedWrappers.push(w)
  return w
}

function menuInBody() {
  return document.body.querySelector('[data-test-id="context-menu"]')
}

afterEach(() => {
  while (mountedWrappers.length) mountedWrappers.pop()?.unmount()
})

describe('VContextMenu', () => {
  it('renders and exposes stable test id', () => {
    const w = mountContextMenu()
    expect(w.get('[data-test-id="v-context-menu"]').exists()).toBe(true)
  })

  it('supports disabled state', () => {
    const w = mountContextMenu({ disabled: true })
    expect(w.get('[data-test-id="v-context-menu"]').attributes('aria-disabled')).toBe('true')
  })

  it('defaults to md size', () => {
    const w = mountContextMenu()
    expect(w.get('[data-test-id="v-context-menu"]').attributes('data-size')).toBe('md')
    expect(w.get('[data-test-id="v-context-menu"]').classes()).toContain('v-context-menu--md')
  })

  it('opens menu on contextmenu at cursor position', async () => {
    const w = mountContextMenu({ items })
    const target = w.get('[data-test-id="context-target"]')
    await target.trigger('contextmenu', { clientX: 100, clientY: 120 })
    expect(menuInBody()).toBeTruthy()
    expect(w.emitted('update:modelValue')).toContainEqual([true])
    expect(w.emitted('update:x')).toContainEqual([100])
    expect(w.emitted('update:y')).toContainEqual([120])
  })

  it('does not open when disabled', async () => {
    const w = mountContextMenu({ items, disabled: true })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 50, clientY: 50 })
    expect(menuInBody()).toBeFalsy()
  })

  it('emits select and closes on item click', async () => {
    const w = mountContextMenu({ items })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 80, clientY: 80 })
    await (document.body.querySelector('[data-test-id="context-menu-item-view"]') as HTMLElement).click()
    expect(w.emitted('select')).toEqual([['view']])
    expect(w.emitted('open-change')).toContainEqual([false])
    expect(menuInBody()).toBeFalsy()
  })

  it('closes on outside click', async () => {
    const w = mountContextMenu({ items })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 80, clientY: 80 })
    await nextTick()
    await flushPromises()
    expect(menuInBody()).toBeTruthy()
    const outside = document.createElement('div')
    document.body.appendChild(outside)
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(menuInBody()).toBeFalsy()
    outside.remove()
  })

  it('closes with Escape', async () => {
    const w = mountContextMenu({ items })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 80, clientY: 80 })
    await nextTick()
    await flushPromises()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(menuInBody()).toBeFalsy()
  })

  it('supports keyboard navigation with ArrowDown and Enter', async () => {
    const w = mountContextMenu({ items })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 80, clientY: 80 })
    await nextTick()
    await flushPromises()
    const first = new DOMWrapper(document.body.querySelector('[data-test-id="context-menu-item-view"]')!)
    await first.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const rename = document.body.querySelector('[data-item-value="rename"]') as HTMLElement
    expect(document.activeElement).toBe(rename)
    await rename.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(w.emitted('select')).toEqual([['rename']])
  })

  it('supports typeahead focus by label prefix', async () => {
    const w = mountContextMenu({ items })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 80, clientY: 80 })
    await nextTick()
    await flushPromises()
    const first = new DOMWrapper(document.body.querySelector('[data-test-id="context-menu-item-view"]')!)
    await first.trigger('keydown', { key: 'd' })
    await nextTick()
    const deleteItem = document.body.querySelector('[data-item-value="delete"]') as HTMLElement
    expect(document.activeElement).toBe(deleteItem)
  })

  it('opens submenu on parent item with children', async () => {
    const w = mountContextMenu({
      items: [
        {
          value: 'share',
          label: 'Share',
          icon: 'share',
          children: [{ value: 'copy-link', label: 'Copy link', icon: 'link' }],
        },
      ],
    })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 80, clientY: 80 })
    const share = new DOMWrapper(document.body.querySelector('[data-test-id="context-menu-item-share"]')!)
    await share.trigger('click')
    expect(document.body.querySelector('[data-test-id="context-menu-submenu"]')).toBeTruthy()
    expect(document.body.querySelector('[data-test-id="context-menu-item-copy-link"]')).toBeTruthy()
    expect(share.attributes('aria-expanded')).toBe('true')
  })

  it('renders separator and destructive item markers', async () => {
    const w = mountContextMenu({ items })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 80, clientY: 80 })
    expect(document.body.querySelector('[data-test-id="context-menu-separator"]')).toBeTruthy()
    expect(document.body.querySelector('[data-test-id="context-menu-item-destructive"]')).toBeTruthy()
    expect(document.body.querySelector('[data-test-id="context-menu-item-selected"]')).toBeTruthy()
  })

  it('supports loading state', () => {
    const w = mountContextMenu({ loading: true })
    expect(w.get('[data-test-id="v-context-menu"]').attributes('aria-busy')).toBe('true')
    expect(w.find('[data-test-id="context-menu-loader"]').exists()).toBe(true)
  })

  it('supports all 3 sizes', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mountContextMenu({ size })
      expect(w.get('[data-test-id="v-context-menu"]').classes()).toContain(`v-context-menu--${size}`)
    }
  })

  it('respects modelValue for programmatic open state', async () => {
    const w = mountContextMenu({ items, modelValue: true, x: 64, y: 96 })
    expect(menuInBody()).toBeTruthy()
    await w.setProps({ modelValue: false })
    expect(menuInBody()).toBeFalsy()
  })

  it('teleports menu to body with menu role and menuitems', async () => {
    const w = mountContextMenu({ items })
    await w.get('[data-test-id="context-target"]').trigger('contextmenu', { clientX: 80, clientY: 80 })
    const menu = menuInBody()
    expect(menu).toBeTruthy()
    expect(menu?.getAttribute('role')).toBe('menu')
    expect(document.body.querySelectorAll('[role="menuitem"]').length).toBe(3)
  })

  it('exposes ARIA label on menu when provided', async () => {
    const w = mountContextMenu({ items, ariaLabel: 'Actions menu', modelValue: true, x: 10, y: 10 })
    expect(menuInBody()?.getAttribute('aria-label')).toBe('Actions menu')
  })
})
