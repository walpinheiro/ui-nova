/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VPanel from '../VPanel.vue'

const mountPanel = (options = {}) =>
  mount(VPanel, {
    global: { stubs: { Transition: false } },
    ...options,
  })

describe('VPanel', () => {
  it('renders and exposes stable test id', () => {
    const w = mountPanel()
    expect(w.find('[data-test-id="v-panel"]').exists()).toBe(true)
  })

  it('renders native section element with content wrapper', () => {
    const w = mountPanel()
    expect(w.get('[data-test-id="v-panel"]').element.tagName).toBe('SECTION')
    expect(w.find('[data-test-id="v-panel-content"]').exists()).toBe(true)
  })

  it('applies size and variant classes', () => {
    const w = mountPanel({ props: { size: 'lg', variant: 'elevated' } })
    const root = w.get('[data-test-id="v-panel"]')
    expect(root.classes()).toContain('v-panel--lg')
    expect(root.classes()).toContain('v-panel--elevated')
  })

  it('supports title and description props with semantic heading', () => {
    const w = mountPanel({ props: { title: 'Project Overview', description: 'Key info' } })
    expect(w.get('[data-test-id="v-panel-title"]').text()).toBe('Project Overview')
    expect(w.get('[data-test-id="v-panel-description"]').text()).toBe('Key info')
    expect(w.get('[data-test-id="v-panel-title"]').element.tagName).toBe('H3')
  })

  it('renders VIcon from icon prop', () => {
    const w = mountPanel({ props: { title: 'Panel', icon: 'folder' } })
    expect(w.get('[data-test-id="v-panel-icon"] [data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders slots: default, header, actions, footer, icon', () => {
    const w = mountPanel({
      slots: {
        default: 'Body content',
        header: '<span data-test-id="slot-header">H</span>',
        actions: '<button data-test-id="slot-actions">A</button>',
        footer: '<span data-test-id="slot-footer">F</span>',
        icon: '<span data-test-id="slot-icon">I</span>',
      },
    })
    expect(w.get('[data-test-id="v-panel-content"]').text()).toContain('Body content')
    expect(w.find('[data-test-id="slot-header"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-actions"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-footer"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-icon"]').exists()).toBe(true)
  })

  it('exposes ARIA label from ariaLabel or title', () => {
    const w = mountPanel({ props: { title: 'Panel Title' } })
    expect(w.get('[data-test-id="v-panel"]').attributes('aria-labelledby')).toBeTruthy()
    const labelled = mountPanel({ props: { ariaLabel: 'Custom label' } })
    expect(labelled.get('[data-test-id="v-panel"]').attributes('aria-label')).toBe('Custom label')
  })

  it('is focusable only when interactive', () => {
    const interactive = mountPanel({ props: { interactive: true } })
    expect(interactive.get('[data-test-id="v-panel"]').attributes('tabindex')).toBe('0')
    expect(interactive.get('[data-test-id="v-panel"]').classes()).toContain('v-panel--interactive')
    const plain = mountPanel()
    expect(plain.get('[data-test-id="v-panel"]').attributes('tabindex')).toBeUndefined()
  })

  it('supports open/modelValue visibility', async () => {
    const closed = mountPanel({ props: { open: false, title: 'Hidden' } })
    expect(closed.find('[data-test-id="v-panel"]').exists()).toBe(false)
    const alias = mountPanel({ props: { modelValue: false, title: 'Hidden' } })
    expect(alias.find('[data-test-id="v-panel"]').exists()).toBe(false)
  })
})
