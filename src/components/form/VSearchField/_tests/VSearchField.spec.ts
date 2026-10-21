/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSearchField from '../VSearchField.vue'

const suggestions = [
  { value: 'vue', label: 'vue', category: 'Search suggestion' },
  { value: 'Vue components', label: 'Vue components', category: 'Documentation' },
]

describe('VSearchField', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VSearchField)
    expect(w.find('[data-test-id="v-searchfield"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-searchfield-input"]').exists()).toBe(true)
  })

  it('defaults to md size and standard variant', () => {
    const w = mount(VSearchField)
    const root = w.get('[data-test-id="v-searchfield"]')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-variant')).toBe('standard')
  })

  it('renders search icon by default', () => {
    const w = mount(VSearchField)
    expect(w.find('[data-test-id="v-searchfield-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('is clearable by default when value is present', async () => {
    const w = mount(VSearchField, {
      props: {
        modelValue: 'Vue',
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
    })
    const clear = w.get('[data-test-id="v-searchfield-clear"]')
    expect(clear.attributes('aria-label')).toBe('Clear search')
    await clear.trigger('click')
    expect(w.emitted('clear')).toHaveLength(1)
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('renders shortcut pill when variant is shortcut', () => {
    const w = mount(VSearchField, { props: { variant: 'shortcut', shortcut: true } })
    expect(w.find('[data-test-id="v-searchfield-shortcut"]').exists()).toBe(true)
    expect(w.get('[data-test-id="v-searchfield-shortcut"]').text()).toContain('⌘K')
  })

  it('uses command variant data attribute', () => {
    const w = mount(VSearchField, { props: { variant: 'command', shortcut: true } })
    expect(w.get('[data-test-id="v-searchfield"]').attributes('data-variant')).toBe('command')
  })

  it('shows loading spinner instead of search icon', () => {
    const w = mount(VSearchField, { props: { loading: true } })
    expect(w.find('[data-test-id="v-searchfield-loading"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-searchfield-icon"]').exists()).toBe(false)
  })

  it('opens suggestions panel on focus', async () => {
    const w = mount(VSearchField, { props: { modelValue: 'vue', suggestions } })
    await w.get('[data-test-id="v-searchfield-input"]').trigger('focus')
    expect(w.find('[data-test-id="v-searchfield-panel"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-searchfield-option-0"]').exists()).toBe(true)
  })

  it('sets combobox aria attributes when panel is open', async () => {
    const w = mount(VSearchField, { props: { modelValue: 'vue', suggestions, id: 'search-1' } })
    const input = w.get('[data-test-id="v-searchfield-input"]')
    await input.trigger('focus')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(input.attributes('aria-controls')).toContain('search-1-listbox')
  })

  it('selects suggestion on click', async () => {
    const w = mount(VSearchField, {
      props: {
        modelValue: 'vue',
        suggestions,
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
    })
    await w.get('[data-test-id="v-searchfield-input"]').trigger('focus')
    await w.get('[data-test-id="v-searchfield-option-1"]').trigger('click')
    expect(w.emitted('select')?.[0]?.[0]).toEqual(suggestions[1])
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['Vue components'])
  })

  it('emits search on Enter without open suggestion', async () => {
    const w = mount(VSearchField, { props: { modelValue: 'query' } })
    await w.get('[data-test-id="v-searchfield-input"]').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('search')?.[0]).toEqual(['query'])
  })

  it('supports disabled state', () => {
    const w = mount(VSearchField, { props: { disabled: true } })
    expect(w.get('[data-test-id="v-searchfield"]').attributes('data-state')).toBe('disabled')
    expect((w.get('[data-test-id="v-searchfield-input"]').element as HTMLInputElement).disabled).toBe(true)
  })

  it('applies size classes', () => {
    const w = mount(VSearchField, { props: { size: 'lg' } })
    expect(w.get('[data-test-id="v-searchfield"]').classes()).toContain('v-searchfield--lg')
  })
})
