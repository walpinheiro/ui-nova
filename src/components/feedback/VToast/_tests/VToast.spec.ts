/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VToast from '../VToast.vue'
import { useVToastQueue } from '../useVToast'

const root = (wrapper: ReturnType<typeof mount>) => wrapper.find('[data-test-id="v-toast"]')

const mountToast = (options: Parameters<typeof mount>[1] = {}) =>
  mount(VToast, {
    global: {
      stubs: {
        Transition: { template: '<slot />' },
      },
    },
    ...options,
  })

describe('VToast', () => {
  it('renders and exposes stable test id', () => {
    const w = mountToast({ props: { message: 'Project saved successfully.' } })
    expect(w.get('[data-test-id="v-toast"]').exists()).toBe(true)
    expect(w.get('[data-test-id="toast-container"]').exists()).toBe(true)
    expect(w.get('[data-test-id="toast-message"]').text()).toContain('Project saved successfully.')
  })

  it('supports disabled state', () => {
    const w = mountToast({ props: { disabled: true, message: 'Disabled toast' } })
    expect(root(w).attributes('aria-disabled')).toBe('true')
    expect(root(w).attributes('data-state')).toBe('disabled')
  })

  it('defaults to md size and info variant with anatomy', () => {
    const w = mountToast({ props: { message: 'New updates are available.' } })
    const toast = root(w)
    expect(toast.classes()).toContain('v-toast--md')
    expect(toast.attributes('data-size')).toBe('md')
    expect(toast.attributes('data-variant')).toBe('info')
    expect(toast.attributes('role')).toBe('status')
    expect(toast.attributes('aria-live')).toBe('polite')
    expect(w.find('[data-test-id="toast-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="toast-close-button"]').exists()).toBe(true)
    expect(w.find('[data-test-id="toast-progress-bar"]').exists()).toBe(true)
  })

  it('supports every poster severity variant', () => {
    for (const variant of ['success', 'info', 'warning', 'error'] as const) {
      const w = mountToast({ props: { variant, message: `${variant} message` } })
      expect(root(w).attributes('data-variant')).toBe(variant)
      expect(w.get('[data-test-id="toast-container"]').attributes('data-variant')).toBe(variant)
      expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
    }
  })

  it('supports poster sizes', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mountToast({ props: { size, message: 'Saved successfully.' } })
      expect(root(w).classes()).toContain(`v-toast--${size}`)
      expect(root(w).attributes('data-size')).toBe(size)
    }
  })

  it('renders loading state with spinner test id', () => {
    const w = mountToast({ props: { loading: true, message: 'Saving changes…' } })
    expect(root(w).attributes('data-state')).toBe('loading')
    expect(root(w).attributes('aria-busy')).toBe('true')
    expect(w.get('[data-test-id="toast-container"]').attributes('data-variant')).toBe('loading')
    expect(w.find('.v-toast__spinner').exists()).toBe(true)
  })

  it('dismisses via close button and emits events', async () => {
    vi.useFakeTimers()
    const w = mountToast({ props: { message: 'Dismiss me', duration: 0 } })
    await w.get('[data-test-id="toast-close-button"]').trigger('click')
    vi.advanceTimersByTime(120)
    await nextTick()
    expect(w.emitted('close')).toHaveLength(1)
    expect(w.emitted('update:modelValue')).toEqual([[false]])
    vi.useRealTimers()
  })

  it('dismisses on escape key', async () => {
    vi.useFakeTimers()
    const w = mountToast({ props: { message: 'Dismiss on Esc', duration: 0 } })
    await root(w).trigger('keydown', { key: 'Escape' })
    vi.advanceTimersByTime(120)
    await nextTick()
    expect(w.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('pauses auto-dismiss timer on hover', async () => {
    vi.useFakeTimers()
    const w = mountToast({ props: { message: 'Pause on hover', duration: 1000 } })
    await root(w).trigger('mouseenter')
    expect(root(w).attributes('data-state')).toBe('paused')
    vi.advanceTimersByTime(1500)
    await nextTick()
    expect(root(w).exists()).toBe(true)
    await root(w).trigger('mouseleave')
    vi.advanceTimersByTime(1000)
    await nextTick()
    vi.advanceTimersByTime(120)
    await nextTick()
    expect(w.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers()
    const w = mountToast({ props: { message: 'Auto dismiss', duration: 3000 } })
    vi.advanceTimersByTime(3000)
    await nextTick()
    vi.advanceTimersByTime(120)
    await nextTick()
    expect(w.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('supports controlled visibility through modelValue', async () => {
    const w = mountToast({ props: { modelValue: false, message: 'Hidden' } })
    expect(root(w).exists()).toBe(false)
    await w.setProps({ modelValue: true })
    expect(root(w).exists()).toBe(true)
  })

  it('maps ariaLabel and custom dismissLabel to the public DOM', () => {
    const w = mountToast({
      props: {
        ariaLabel: 'Upload status',
        dismissLabel: 'Close upload status',
        message: 'Failed to upload file.',
      },
    })
    expect(root(w).attributes('aria-label')).toBe('Upload status')
    expect(w.get('[data-test-id="toast-close-button"]').attributes('aria-label')).toBe('Close upload status')
  })
})

describe('useVToastQueue', () => {
  it('pushes and removes stacked toast items', () => {
    const queue = useVToastQueue()
    const first = queue.push({ message: 'First toast', variant: 'success' })
    const second = queue.push({ message: 'Second toast', variant: 'warning' })
    expect(queue.items.value).toHaveLength(2)
    expect(queue.items.value[0].message).toBe('First toast')
    expect(queue.items.value[1].id).toBe(second)
    queue.remove(first)
    expect(queue.items.value).toHaveLength(1)
    expect(queue.items.value[0].id).toBe(second)
    queue.clear()
    expect(queue.items.value).toHaveLength(0)
  })
})
