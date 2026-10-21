/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VTooltip from '../VTooltip.vue'

const mountTooltip = (options: Parameters<typeof mount>[1] = {}) => {
  const { props, global, ...rest } = options
  return mount(VTooltip, {
    ...rest,
    props: { motion: 'none', ...props },
    global: {
      stubs: {
        teleport: false,
        Transition: { template: '<slot />' },
      },
      ...global,
    },
  })
}

describe('VTooltip', () => {
  it('renders and exposes stable test id', () => {
    const w = mountTooltip({
      props: { content: 'Helpful hint' },
      slots: { default: '<button type="button">Hover me</button>' },
    })
    expect(w.get('[data-test-id="v-tooltip"]').exists()).toBe(true)
    expect(w.get('[data-test-id="tooltip-trigger"]').exists()).toBe(true)
    expect(w.text()).toContain('Hover me')
  })

  it('supports disabled state', () => {
    const w = mountTooltip({
      props: { disabled: true, content: 'Hidden' },
      slots: { default: '<button type="button">Trigger</button>' },
    })
    expect(w.get('[data-test-id="tooltip-trigger"]').attributes('aria-disabled')).toBe('true')
    expect(w.get('[data-test-id="v-tooltip"]').attributes('data-state')).toBe('disabled')
  })

  it('defaults to md size, top placement and default variant', () => {
    const w = mountTooltip()
    const root = w.get('[data-test-id="v-tooltip"]')
    expect(root.classes()).toContain('v-tooltip--md')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-placement')).toBe('top')
    expect(root.attributes('data-variant')).toBe('default')
  })

  it('shows tooltip on hover with teleported container', async () => {
    const w = mountTooltip({
      attachTo: document.body,
      props: { content: 'Tooltip text' },
      slots: { default: '<button type="button">Hover me</button>' },
    })
    await w.get('[data-test-id="tooltip-trigger"]').trigger('mouseenter')
    await nextTick()
    const container = document.querySelector('[data-test-id="tooltip-default"]')
    expect(container).toBeTruthy()
    expect(container?.getAttribute('role')).toBe('tooltip')
    expect(container?.textContent).toContain('Tooltip text')
    expect(w.get('[data-test-id="tooltip-trigger"]').attributes('aria-describedby')).toBeTruthy()
    w.unmount()
  })

  it('shows tooltip on focus for keyboard users', async () => {
    const w = mountTooltip({
      attachTo: document.body,
      props: { content: 'Focus me' },
      slots: { default: '<button type="button">Focus</button>' },
    })
    await w.get('[data-test-id="tooltip-trigger"]').trigger('focusin')
    await nextTick()
    expect(document.querySelector('[data-test-id="tooltip-content"]')).toBeTruthy()
    w.unmount()
  })

  it('hides tooltip on escape', async () => {
    const w = mountTooltip({
      attachTo: document.body,
      props: { content: 'Dismiss me' },
      slots: { default: '<button type="button">Trigger</button>' },
    })
    await w.get('[data-test-id="tooltip-trigger"]').trigger('mouseenter')
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.querySelector('[data-test-id="tooltip-default"]')).toBeNull()
    w.unmount()
  })

  it('supports poster variants and icon slot anatomy', async () => {
    for (const variant of ['with-icon', 'success', 'error', 'brand', 'light'] as const) {
      const w = mountTooltip({
        attachTo: document.body,
        props: { variant, content: `${variant} hint` },
        slots: { default: '<button type="button">?</button>' },
      })
      await w.get('[data-test-id="tooltip-trigger"]').trigger('mouseenter')
      await nextTick()
      const testId = variant === 'with-icon' ? 'tooltip-with-icon' : `tooltip-${variant}`
      expect(document.querySelector(`[data-test-id="${testId}"]`)).toBeTruthy()
      if (variant !== 'light') {
        expect(document.querySelector('[data-test-id="v-icon"]')).toBeTruthy()
      }
      w.unmount()
    }
  })

  it('renders arrow and rich content slot', async () => {
    const w = mountTooltip({
      attachTo: document.body,
      props: { showArrow: true, placement: 'bottom' },
      slots: {
        default: '<button type="button">?</button>',
        content: '<span data-test-id="rich-content">Keyboard shortcut</span>',
      },
    })
    await w.get('[data-test-id="tooltip-trigger"]').trigger('mouseenter')
    await nextTick()
    expect(document.querySelector('[data-test-id="tooltip-arrow"]')).toBeTruthy()
    expect(document.querySelector('[data-test-id="rich-content"]')).toBeTruthy()
    w.unmount()
  })

  it('supports sizes sm through xl', () => {
    for (const size of ['sm', 'md', 'lg', 'xl'] as const) {
      const w = mountTooltip({ props: { size } })
      expect(w.get('[data-test-id="v-tooltip"]').classes()).toContain(`v-tooltip--${size}`)
    }
  })

  it('does not show tooltip when disabled', async () => {
    const w = mountTooltip({
      attachTo: document.body,
      props: { disabled: true, content: 'Hidden' },
      slots: { default: '<button type="button">Trigger</button>' },
    })
    await w.get('[data-test-id="tooltip-trigger"]').trigger('mouseenter')
    await nextTick()
    expect(document.querySelector('[data-test-id="tooltip-default"]')).toBeNull()
    w.unmount()
  })

  it('schedules delayed hide after mouse leave', async () => {
    vi.useFakeTimers()
    const w = mountTooltip({
      attachTo: document.body,
      props: { content: 'Delayed hide', hideDelay: 500 },
      slots: { default: '<button type="button">Trigger</button>' },
    })
    await w.get('[data-test-id="tooltip-trigger"]').trigger('mouseenter')
    await nextTick()
    expect(document.querySelector('[data-test-id="tooltip-default"]')).toBeTruthy()
    await w.get('[data-test-id="tooltip-trigger"]').trigger('mouseleave')
    vi.advanceTimersByTime(499)
    await nextTick()
    expect(document.querySelector('[data-test-id="tooltip-default"]')).toBeTruthy()
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(document.querySelector('[data-test-id="tooltip-default"]')).toBeNull()
    vi.useRealTimers()
    w.unmount()
  })
})
