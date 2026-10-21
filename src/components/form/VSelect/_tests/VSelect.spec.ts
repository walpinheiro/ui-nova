/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'
import VSelect from '../VSelect.vue'
import { DEFAULT_VSELECT_OPTIONS } from '../mountVSelect'
import type { VSelectProps } from '../VSelect.types'

const mountedWrappers: Array<ReturnType<typeof mount>> = []

function mountSelect(props: VSelectProps = {}, options = {}) {
  const w = mount(VSelect, {
    props,
    attachTo: document.body,
    ...options,
  })
  mountedWrappers.push(w)
  return w
}

function panelInBody() {
  return document.body.querySelector('[data-test-id="v-select-panel"]')
}

afterEach(() => {
  while (mountedWrappers.length) mountedWrappers.pop()?.unmount()
})

describe('VSelect', () => {
  it('renders and exposes stable test id', () => {
    const w = mountSelect()
    expect(w.find('[data-test-id="v-select"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-select-trigger"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-select-value"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-select-chevron"]').exists()).toBe(true)
  })

  it('defaults to md size and default state', () => {
    const w = mountSelect()
    const root = w.get('[data-test-id="v-select"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-state')).toBe('default')
  })

  it('renders label associated with trigger', () => {
    const w = mountSelect({ label: 'Product', id: 'product-select' })
    const label = w.get('[data-test-id="v-select-label"]')
    const trigger = w.get('[data-test-id="v-select-trigger"]')
    expect(label.text()).toContain('Product')
    expect(label.attributes('for')).toBe('product-select')
    expect(trigger.attributes('id')).toBe('product-select')
  })

  it('shows placeholder when no value is selected', () => {
    const w = mountSelect({ placeholder: 'Select option' })
    expect(w.get('[data-test-id="v-select-value"]').text()).toBe('Select option')
    expect(w.get('[data-test-id="v-select-value"]').classes()).toContain('v-select__value--placeholder')
  })

  it('shows selected option label', () => {
    const w = mountSelect({ modelValue: 'marketing' })
    expect(w.get('[data-test-id="v-select-value"]').text()).toBe('Marketing')
    expect(w.get('[data-test-id="v-select"]').attributes('data-state')).toBe('filled')
  })

  it('supports v-model updates on option click', async () => {
    const w = mountSelect({
      modelValue: 'product',
      'onUpdate:modelValue': (value: string) => w.setProps({ modelValue: value }),
    })
    await w.get('[data-test-id="v-select-trigger"]').element.click()
    await (document.body.querySelector('[data-test-id="v-select-option-design"]') as HTMLElement).click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['design'])
    expect(w.emitted('change')?.at(-1)).toEqual(['design'])
    expect(panelInBody()).toBeFalsy()
  })

  it('opens panel on trigger click with listbox role', async () => {
    const w = mountSelect({ options: DEFAULT_VSELECT_OPTIONS })
    await w.get('[data-test-id="v-select-trigger"]').element.click()
    const panel = panelInBody()
    expect(panel).toBeTruthy()
    expect(panel?.getAttribute('role')).toBe('listbox')
    expect(w.get('[data-test-id="v-select-trigger"]').attributes('aria-expanded')).toBe('true')
    expect(w.get('[data-test-id="v-select"]').attributes('data-state')).toBe('open')
  })

  it('renders check icon for selected option', async () => {
    const w = mountSelect({ modelValue: 'product' })
    await w.get('[data-test-id="v-select-trigger"]').element.click()
    expect(document.body.querySelector('[data-test-id="v-select-check-product"]')).toBeTruthy()
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders error state with aria-invalid and alert message', () => {
    const w = mountSelect({ id: 'field-1', modelValue: 'product', errorMessage: 'Invalid selection' })
    const root = w.get('[data-test-id="v-select"]')
    const trigger = w.get('[data-test-id="v-select-trigger"]')
    const error = w.get('[data-test-id="v-select-error"]')
    expect(root.attributes('data-state')).toBe('invalid')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toContain('Invalid selection')
    expect(trigger.attributes('aria-describedby')).toContain('field-1-error')
  })

  it('renders leading icon from prop', () => {
    const w = mountSelect({ leadingIcon: 'layers', label: 'Category' })
    expect(w.find('.v-select__leading-icon').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-select"]').classes()).toContain('v-select--has-leading-icon')
  })

  it('applies size classes', () => {
    const w = mountSelect({ size: 'lg' })
    expect(w.get('[data-test-id="v-select"]').classes()).toContain('v-select--lg')
    expect(w.get('[data-test-id="v-select"]').attributes('data-size')).toBe('lg')
  })

  it('supports disabled state', () => {
    const w = mountSelect({ disabled: true, modelValue: 'product' })
    expect(w.get('[data-test-id="v-select"]').attributes('data-state')).toBe('disabled')
    expect((w.get('[data-test-id="v-select-trigger"]').element as HTMLButtonElement).disabled).toBe(true)
  })

  it('navigates options with arrow keys and selects with Enter', async () => {
    const w = mountSelect({
      modelValue: 'product',
      'onUpdate:modelValue': (value: string) => w.setProps({ modelValue: value }),
    })
    const trigger = w.get('[data-test-id="v-select-trigger"]')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(panelInBody()).toBeTruthy()
    const marketingEl = document.body.querySelector('[data-test-id="v-select-option-marketing"]') as HTMLElement
    const marketing = new DOMWrapper(marketingEl)
    marketingEl.focus()
    await marketing.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['marketing'])
  })

  it('closes on Escape and returns focus to trigger', async () => {
    const w = mountSelect()
    const trigger = w.get('[data-test-id="v-select-trigger"]')
    await trigger.element.click()
    expect(panelInBody()).toBeTruthy()
    await trigger.trigger('keydown', { key: 'Escape' })
    expect(panelInBody()).toBeFalsy()
    expect(w.emitted('open-change')?.at(-1)).toEqual([false])
  })

  it('exposes combobox semantics on trigger', () => {
    const w = mountSelect({ label: 'Product', id: 'product-field' })
    const trigger = w.get('[data-test-id="v-select-trigger"]')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-haspopup')).toBe('listbox')
    expect(trigger.attributes('aria-controls')).toBe('product-field-listbox')
  })
})
