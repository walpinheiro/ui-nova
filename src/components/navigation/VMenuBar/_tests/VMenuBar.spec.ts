/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'
import VMenuBar from '../VMenuBar.vue'
import { DEFAULT_MENU_BAR_ITEMS } from '../mountVMenuBar'
import type { VMenuBarProps } from '../VMenuBar.types'

const mountedWrappers: Array<ReturnType<typeof mount>> = []

function mountMenuBar(props: VMenuBarProps = {}, options = {}) {
  const w = mount(VMenuBar, {
    props: {
      items: DEFAULT_MENU_BAR_ITEMS,
      ...props,
    },
    attachTo: document.body,
    ...options,
  })
  mountedWrappers.push(w)
  return w
}

function panelInBody() {
  return document.body.querySelector('[data-test-id="menu-bar-panel"]')
}

afterEach(() => {
  while (mountedWrappers.length) mountedWrappers.pop()?.unmount()
})

describe('VMenuBar', () => {
  it('renders and exposes stable test id', () => {
    const w = mountMenuBar()
    expect(w.get('[data-test-id="v-menu-bar"]').exists()).toBe(true)
  })

  it('renders default menu triggers', () => {
    const w = mountMenuBar()
    expect(w.get('[data-test-id="menu-bar-trigger-file"]').text()).toContain('File')
    expect(w.get('[data-test-id="menu-bar-trigger-edit"]').text()).toContain('Edit')
    expect(w.get('[data-test-id="menu-bar-trigger-view"]').text()).toContain('View')
  })

  it('supports disabled state', () => {
    const w = mountMenuBar({ disabled: true })
    expect(w.get('[data-test-id="v-menu-bar"]').attributes('aria-disabled')).toBe('true')
  })

  it('supports loading state', () => {
    const w = mountMenuBar({ loading: true })
    expect(w.get('[data-test-id="v-menu-bar"]').attributes('aria-busy')).toBe('true')
    expect(w.find('[data-test-id="menu-bar-loader"]').exists()).toBe(true)
  })

  it('opens menu panel on trigger click', async () => {
    const w = mountMenuBar()
    await w.get('[data-test-id="menu-bar-trigger-file"]').element.click()
    expect(panelInBody()).toBeTruthy()
    expect(w.get('[data-test-id="menu-bar-trigger-file"]').attributes('aria-expanded')).toBe('true')
    expect(document.body.querySelector('[data-test-id="menu-bar-item-save"]')).toBeTruthy()
  })

  it('closes previous menu when opening another', async () => {
    const w = mountMenuBar()
    await w.get('[data-test-id="menu-bar-trigger-file"]').element.click()
    expect(document.body.querySelector('[data-test-id="menu-bar-item-save"]')).toBeTruthy()
    await w.get('[data-test-id="menu-bar-trigger-edit"]').element.click()
    expect(document.body.querySelector('[data-test-id="menu-bar-item-undo"]')).toBeTruthy()
    expect(document.body.querySelector('[data-test-id="menu-bar-item-save"]')).toBeFalsy()
  })

  it('emits select and closes on item click', async () => {
    const w = mountMenuBar()
    await w.get('[data-test-id="menu-bar-trigger-file"]').element.click()
    await (document.body.querySelector('[data-test-id="menu-bar-item-save"]') as HTMLElement).click()
    expect(w.emitted('select')).toEqual([['save']])
    expect(w.emitted('open-change')).toContainEqual([null])
    expect(panelInBody()).toBeFalsy()
  })

  it('renders shortcuts right-aligned', async () => {
    const w = mountMenuBar()
    await w.get('[data-test-id="menu-bar-trigger-file"]').element.click()
    const shortcuts = document.body.querySelectorAll('[data-test-id="menu-bar-shortcut"]')
    expect(shortcuts.length).toBeGreaterThan(0)
    expect(shortcuts[0]?.textContent).toContain('⌘')
  })

  it('renders separator markers', async () => {
    const w = mountMenuBar()
    await w.get('[data-test-id="menu-bar-trigger-file"]').element.click()
    expect(document.body.querySelector('[data-test-id="menu-bar-separator"]')).toBeTruthy()
  })

  it('opens with Enter/Space on trigger', async () => {
    const w = mountMenuBar()
    const file = w.get('[data-test-id="menu-bar-trigger-file"]')
    await file.trigger('keydown', { key: 'Enter' })
    expect(panelInBody()).toBeTruthy()
    await file.element.click()
    await file.trigger('keydown', { key: ' ' })
    expect(panelInBody()).toBeTruthy()
  })

  it('closes with Escape and resets aria-expanded', async () => {
    const w = mountMenuBar()
    const file = w.get('[data-test-id="menu-bar-trigger-file"]')
    await file.element.click()
    await file.trigger('keydown', { key: 'Escape' })
    expect(panelInBody()).toBeFalsy()
    expect(file.attributes('aria-expanded')).toBe('false')
  })

  it('navigates triggers with ArrowRight/ArrowLeft', async () => {
    const w = mountMenuBar()
    const file = w.get('[data-test-id="menu-bar-trigger-file"]')
    await file.trigger('focus')
    await file.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement?.getAttribute('data-test-id')).toBe('menu-bar-trigger-edit')
    await w.get('[data-test-id="menu-bar-trigger-edit"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement?.getAttribute('data-test-id')).toBe('menu-bar-trigger-file')
  })

  it('supports all sizes and variants', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mountMenuBar({ size })
      expect(w.get('[data-test-id="v-menu-bar"]').classes()).toContain(`v-menu-bar--${size}`)
    }
    for (const variant of ['default', 'subtle', 'primary'] as const) {
      const w = mountMenuBar({ variant })
      expect(w.get('[data-test-id="v-menu-bar"]').classes()).toContain(`v-menu-bar--${variant}`)
    }
  })

  it('opens submenu on parent item with children', async () => {
    const w = mountMenuBar({
      items: [
        {
          value: 'share',
          label: 'Share',
          children: [
            {
              value: 'nested',
              label: 'Nested',
              children: [{ value: 'child', label: 'Child item' }],
            },
          ],
        },
      ],
    })
    await w.get('[data-test-id="menu-bar-trigger-share"]').element.click()
    const nested = new DOMWrapper(document.body.querySelector('[data-test-id="menu-bar-item-nested"]')!)
    await nested.trigger('click')
    expect(document.body.querySelector('[data-test-id="menu-bar-submenu"]')).toBeTruthy()
    expect(document.body.querySelector('[data-test-id="menu-bar-item-child"]')).toBeTruthy()
  })
})
