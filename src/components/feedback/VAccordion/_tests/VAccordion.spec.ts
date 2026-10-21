/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import VAccordion from '../VAccordion.vue'
import VAccordionItem from '../VAccordionItem.vue'

function mountAccordion(props: Record<string, unknown> = {}) {
  return mount(VAccordion, {
    props,
    slots: {
      default: () => [
        h(VAccordionItem, { id: 'first', title: 'First', value: 'first' }, { default: () => h('p', 'First content') }),
        h(VAccordionItem, { id: 'second', title: 'Second', value: 'second' }, { default: () => h('p', 'Second content') }),
      ],
    },
  })
}

describe('VAccordion', () => {
  it('renders a stable root test id and normalized defaults', () => {
    const wrapper = mountAccordion()
    const root = wrapper.get('[data-test-id="v-accordion"]')
    expect(wrapper.find('[data-test-id="v-accordion"]').exists()).toBe(true)
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('default')
  })

  it('supports all poster variants and sizes', () => {
    for (const variant of ['default', 'divided', 'bordered', 'leading-icon'] as const) {
      expect(mountAccordion({ variant }).get('[data-test-id="v-accordion"]').classes()).toContain(`v-accordion--${variant}`)
    }
    for (const size of ['sm', 'md', 'lg'] as const) {
      expect(mountAccordion({ size }).get('[data-test-id="v-accordion"]').classes()).toContain(`v-accordion--${size}`)
    }
  })

  it('exposes native accordion trigger and panel semantics', () => {
    const wrapper = mountAccordion()
    const trigger = wrapper.get('[data-test-id="accordion-trigger-first"]')
    const panel = wrapper.get('[data-test-id="accordion-panel-first"]')
    expect(trigger.element.tagName).toBe('BUTTON')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('role')).toBe('region')
    expect(panel.attributes('aria-labelledby')).toBe(trigger.attributes('id'))
    expect(wrapper.get('[data-test-id="accordion-item-first"]').attributes('data-state')).toBe('collapsed')
  })

  it('toggles one item in single mode and emits semantic events', async () => {
    const wrapper = mountAccordion()
    await wrapper.get('[data-test-id="accordion-trigger-first"]').trigger('click')
    expect(wrapper.get('[data-test-id="accordion-trigger-first"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-test-id="accordion-panel-first"]').attributes('aria-hidden')).toBe('false')
    expect(wrapper.emitted('update:modelValue')).toEqual([['first']])
    expect(wrapper.emitted('open-change')).toEqual([['first']])

    await wrapper.get('[data-test-id="accordion-trigger-second"]').trigger('click')
    expect(wrapper.get('[data-test-id="accordion-trigger-first"]').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('[data-test-id="accordion-trigger-second"]').attributes('aria-expanded')).toBe('true')
  })

  it('keeps multiple sections open when multiple is enabled', async () => {
    const wrapper = mountAccordion({ multiple: true })
    await wrapper.get('[data-test-id="accordion-trigger-first"]').trigger('click')
    await wrapper.get('[data-test-id="accordion-trigger-second"]').trigger('click')
    expect(wrapper.get('[data-test-id="accordion-trigger-first"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-test-id="accordion-trigger-second"]').attributes('aria-expanded')).toBe('true')
    const updates = wrapper.emitted('update:modelValue') ?? []
    expect(updates[updates.length - 1]).toEqual([['first', 'second']])
  })

  it('honors a controlled initial model value', () => {
    const wrapper = mountAccordion({ modelValue: 'second' })
    expect(wrapper.get('[data-test-id="accordion-trigger-second"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-test-id="accordion-panel-second"]').attributes('aria-hidden')).toBe('false')
  })

  it('supports leading icon and title slots', () => {
    const wrapper = mount(VAccordion, {
      props: { variant: 'leading-icon' },
      slots: {
        default: () => h(VAccordionItem, { id: 'settings', title: 'Settings' }, {
          icon: () => h('span', { 'data-test-id': 'custom-icon' }, '⚙'),
          title: () => h('strong', 'Custom title'),
        }),
      },
    })
    expect(wrapper.find('[data-test-id="custom-icon"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="accordion-title"]').text()).toBe('Custom title')
  })

  it('keeps an expanded item open when a body action is clicked', async () => {
    const wrapper = mount(VAccordion, {
      props: { modelValue: 'actions' },
      slots: {
        default: () => h(VAccordionItem, { id: 'actions', title: 'Actions' }, {
          default: () => h('button', { 'data-test-id': 'body-action' }, 'Learn more'),
        }),
      },
    })
    await wrapper.get('[data-test-id="body-action"]').trigger('click')
    expect(wrapper.get('[data-test-id="accordion-trigger-actions"]').attributes('aria-expanded')).toBe('true')
  })

  it('moves focus with arrow keys between triggers', async () => {
    const wrapper = mount(VAccordion, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(VAccordionItem, { id: 'first', title: 'First', value: 'first' }),
          h(VAccordionItem, { id: 'second', title: 'Second', value: 'second' }),
        ],
      },
    })
    const first = wrapper.get('[data-test-id="accordion-trigger-first"]')
    const second = wrapper.get('[data-test-id="accordion-trigger-second"]')
    await first.trigger('focus')
    await first.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(second.element)
    wrapper.unmount()
  })
})
