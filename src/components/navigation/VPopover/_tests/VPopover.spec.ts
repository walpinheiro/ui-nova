/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VPopover from '../VPopover.vue'

const mountPopover = (options: Parameters<typeof mount>[1] = {}) =>
  mount(VPopover, {
    global: {
      stubs: {
        teleport: false,
        Transition: { template: '<slot />' },
      },
    },
    ...options,
  })

describe('VPopover', () => {
  it('renders trigger and exposes stable test ids', () => {
    const w = mountPopover({
      slots: {
        trigger: '<button type="button">Open</button>',
        default: '<p>Popover body</p>',
      },
    })
    expect(w.find('[data-test-id="v-popover"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-popover-trigger"]').exists()).toBe(true)
    expect(w.text()).toContain('Open')
  })

  it('defaults to md size, bottom placement and click trigger', () => {
    const w = mountPopover()
    const root = w.get('[data-test-id="v-popover"]')
    expect(root.classes()).toContain('v-popover--md')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-placement')).toBe('bottom')
    expect(root.attributes('data-trigger')).toBe('click')
    expect(root.attributes('data-state')).toBe('closed')
  })

  it('renders open panel when open prop is true', async () => {
    const w = mountPopover({
      attachTo: document.body,
      props: { open: true, title: 'Quick tip' },
      slots: { default: '<p>Popover body</p>' },
    })
    await nextTick()
    const container = document.querySelector('[data-test-id="v-popover-container"]')
    expect(container).toBeTruthy()
    expect(container?.textContent).toContain('Popover body')
    w.unmount()
  })

  it('opens on trigger click and renders dialog container in body', async () => {
    const w = mountPopover({
      attachTo: document.body,
      slots: {
        trigger: '<button type="button">Open</button>',
        default: '<p>Popover body</p>',
      },
    })
    await w.get('[data-test-id="v-popover-trigger"]').trigger('click')
    await nextTick()
    const container = document.querySelector('[data-test-id="v-popover-container"]')
    expect(container).toBeTruthy()
    expect(container?.getAttribute('role')).toBe('dialog')
    expect(container?.textContent).toContain('Popover body')
    expect(w.get('[data-test-id="v-popover-trigger"]').attributes('aria-expanded')).toBe('true')
    w.unmount()
  })

  it('closes on escape and emits open-change', async () => {
    const w = mountPopover({
      attachTo: document.body,
      slots: { trigger: '<button type="button">Open</button>', default: 'Body' },
    })
    await w.get('[data-test-id="v-popover-trigger"]').trigger('click')
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.querySelector('[data-test-id="v-popover-container"]')).toBeNull()
    const openChanges = w.emitted('open-change') as boolean[][] | undefined
    expect(openChanges?.[openChanges.length - 1]).toEqual([false])
    expect(w.emitted('close')?.[0]).toEqual(['escape'])
    w.unmount()
  })

  it('supports title, close button and aria-labelledby', async () => {
    const w = mountPopover({
      attachTo: document.body,
      props: { title: 'Quick tip', closable: true },
      slots: { trigger: '<button type="button">Open</button>', default: 'Body' },
    })
    await w.get('[data-test-id="v-popover-trigger"]').trigger('click')
    await nextTick()
    const title = document.querySelector('[data-test-id="v-popover-title"]')
    const container = document.querySelector('[data-test-id="v-popover-container"]')
    expect(title?.textContent).toBe('Quick tip')
    expect(document.querySelector('[data-test-id="v-popover-close"]')).toBeTruthy()
    expect(container?.getAttribute('aria-labelledby')).toBe(title?.id)
    w.unmount()
  })

  it('supports disabled state', () => {
    const w = mountPopover({ props: { disabled: true } })
    const root = w.get('[data-test-id="v-popover"]')
    expect(root.attributes('data-state')).toBe('disabled')
    expect(w.get('[data-test-id="v-popover-trigger"]').attributes('aria-disabled')).toBe('true')
  })

  it('supports sizes sm and lg', () => {
    const sm = mountPopover({ props: { size: 'sm' } })
    expect(sm.get('[data-test-id="v-popover"]').classes()).toContain('v-popover--sm')
    const lg = mountPopover({ props: { size: 'lg' } })
    expect(lg.get('[data-test-id="v-popover"]').classes()).toContain('v-popover--lg')
  })

  it('renders arrow when showArrow is true', async () => {
    const w = mountPopover({
      attachTo: document.body,
      props: { showArrow: true },
      slots: { trigger: '<button type="button">Open</button>', default: 'Body' },
    })
    await w.get('[data-test-id="v-popover-trigger"]').trigger('click')
    await nextTick()
    expect(document.querySelector('[data-test-id="v-popover-arrow"]')).toBeTruthy()
    w.unmount()
  })

  it('renders footer actions slot', async () => {
    const w = mountPopover({
      attachTo: document.body,
      slots: {
        trigger: '<button type="button">Open</button>',
        default: 'Body',
        actions: '<button type="button" data-test-id="action-confirm">Confirm</button>',
      },
    })
    await w.get('[data-test-id="v-popover-trigger"]').trigger('click')
    await nextTick()
    expect(document.querySelector('[data-test-id="v-popover-actions"]')).toBeTruthy()
    expect(document.querySelector('[data-test-id="action-confirm"]')).toBeTruthy()
    w.unmount()
  })
})
