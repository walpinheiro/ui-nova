/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTagInput from '../VTagInput.vue'
import { mountVTagInput } from '../mountVTagInput'

describe('VTagInput', () => {
  it('maps field size onto VTag size', () => {
    expect(mountVTagInput({ size: 'sm' }).tagSize).toBe('sm')
    expect(mountVTagInput({ size: 'md' }).tagSize).toBe('md')
    expect(mountVTagInput({ size: 'lg' }).tagSize).toBe('md')
  })
  it('renders and exposes stable test ids', () => {
    const w = mount(VTagInput)
    expect(w.find('[data-test-id="v-tag-input"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-tag-input-field"]').exists()).toBe(true)
  })

  it('defaults to md size and default variant', () => {
    const w = mount(VTagInput)
    const root = w.get('[data-test-id="v-tag-input"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-state')).toBe('empty')
  })

  it('renders existing tags', () => {
    const w = mount(VTagInput, { props: { modelValue: ['Design', 'UI'] } })
    const tags = w.findAll('[data-test-id="v-tag"]')
    expect(tags).toHaveLength(2)
    expect(tags[0].text()).toContain('Design')
    expect(tags[0].classes()).toContain('v-tag--soft')
    expect(w.find('.v-badge').exists()).toBe(false)
  })

  it('adds tag on Enter', async () => {
    const w = mount(VTagInput, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': (v: string[]) => w.setProps({ modelValue: v }),
      },
    })
    const input = w.get('[data-test-id="v-tag-input-field"]')
    await input.setValue('Vue')
    await input.trigger('keydown', { key: 'Enter' })
    const updates = w.emitted('update:modelValue') ?? []
    expect(updates[updates.length - 1]).toEqual([['Vue']])
    expect(w.emitted('add')?.[0]).toEqual(['Vue'])
  })

  it('removes tag via remove button', async () => {
    const w = mount(VTagInput, {
      props: {
        modelValue: ['Design'],
        'onUpdate:modelValue': (v: string[]) => w.setProps({ modelValue: v }),
      },
    })
    const remove = w.get('[data-test-id="v-tag-remove"]')
    expect(remove.attributes('aria-label')).toBe('Remove Design')
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
    await remove.trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(w.emitted('remove')?.[0]).toEqual(['Design'])
  })

  it('shows suggestions while typing', async () => {
    const w = mount(VTagInput, {
      props: {
        suggestions: ['vue', 'vue3', 'vue-router'],
      },
    })
    const input = w.get('[data-test-id="v-tag-input-field"]')
    await input.trigger('focus')
    await input.setValue('vue')
    expect(w.find('[data-test-id="v-tag-suggestions"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-tag-input"]').attributes('data-variant')).toBe('suggestions')
  })

  it('supports readonly mode without input or remove buttons', () => {
    const w = mount(VTagInput, { props: { modelValue: ['Vue', 'Components'], readonly: true } })
    expect(w.find('[data-test-id="v-tag-input-field"]').exists()).toBe(false)
    expect(w.find('[data-test-id="v-tag-remove"]').exists()).toBe(false)
    expect(w.get('[data-test-id="v-tag-input"]').attributes('data-variant')).toBe('readonly')
  })

  it('supports disabled state', () => {
    const w = mount(VTagInput, { props: { disabled: true, modelValue: ['Tag'] } })
    const root = w.get('[data-test-id="v-tag-input"]')
    expect(root.attributes('data-state')).toBe('disabled')
    expect((w.get('[data-test-id="v-tag-input-field"]').element as HTMLInputElement).disabled).toBe(true)
  })

  it('uses combobox semantics on input', () => {
    const w = mount(VTagInput, { props: { suggestions: ['component'] } })
    const input = w.get('[data-test-id="v-tag-input-field"]')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-autocomplete')).toBe('list')
  })

  it('removes last tag on Backspace when field is empty', async () => {
    const w = mount(VTagInput, {
      props: {
        modelValue: ['Design', 'Vue'],
        'onUpdate:modelValue': (v: string[]) => w.setProps({ modelValue: v }),
      },
    })
    const input = w.get('[data-test-id="v-tag-input-field"]')
    await input.trigger('keydown', { key: 'Backspace' })
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(w.emitted('remove')?.[0]).toEqual(['Vue'])
  })

  it('applies size classes', () => {
    const w = mount(VTagInput, { props: { size: 'lg' } })
    expect(w.get('[data-test-id="v-tag-input"]').classes()).toContain('v-tag-input--lg')
  })
})
