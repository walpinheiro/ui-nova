/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSegmentedControl from '../VSegmentedControl.vue'

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

describe('VSegmentedControl', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VSegmentedControl)
    expect(w.find('[data-test-id="v-segmented-control"]').exists()).toBe(true)
  })

  it('exposes radiogroup role with radio segments and sliding indicator', () => {
    const w = mount(VSegmentedControl, { props: { options } })
    expect(w.get('[data-test-id="v-segmented-control"]').attributes('role')).toBe('radiogroup')
    expect(w.findAll('[role="radio"]').length).toBe(3)
    expect(w.find('[data-test-id="v-segmented-control-indicator"]').exists()).toBe(true)
  })

  it('selects first enabled option by default with aria-checked and roving tabindex', () => {
    const w = mount(VSegmentedControl, { props: { options } })
    const segments = w.findAll('[role="radio"]')
    expect(segments[0].attributes('aria-checked')).toBe('true')
    expect(segments[0].attributes('tabindex')).toBe('0')
    expect(segments[1].attributes('aria-checked')).toBe('false')
    expect(segments[1].attributes('tabindex')).toBe('-1')
  })

  it('respects modelValue selection', () => {
    const w = mount(VSegmentedControl, { props: { options, modelValue: 'week' } })
    expect(w.get('[data-test-id="v-segmented-control-segment-week"]').attributes('aria-checked')).toBe('true')
  })

  it('emits update:modelValue on segment click', async () => {
    const w = mount(VSegmentedControl, { props: { options } })
    await w.get('[data-test-id="v-segmented-control-segment-week"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['week']])
  })

  it('navigates with ArrowRight/ArrowLeft/Home/End', async () => {
    const w = mount(VSegmentedControl, { props: { options, modelValue: 'day' } })
    await w.get('[data-test-id="v-segmented-control-segment-day"]').trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')).toEqual([['week']])
    await w.get('[data-test-id="v-segmented-control-segment-week"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(w.emitted('update:modelValue')).toEqual([['week'], ['day']])
    await w.get('[data-test-id="v-segmented-control-segment-day"]').trigger('keydown', { key: 'End' })
    expect(w.emitted('update:modelValue')).toEqual([['week'], ['day'], ['month']])
    await w.get('[data-test-id="v-segmented-control-segment-month"]').trigger('keydown', { key: 'Home' })
    expect(w.emitted('update:modelValue')).toEqual([['week'], ['day'], ['month'], ['day']])
  })

  it('skips disabled segment on keyboard navigation', async () => {
    const w = mount(VSegmentedControl, {
      props: {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
          { value: 'c', label: 'C' },
        ],
        modelValue: 'a',
      },
    })
    await w.get('[data-test-id="v-segmented-control-segment-a"]').trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')).toEqual([['c']])
  })

  it('does not emit when disabled segment clicked', async () => {
    const w = mount(VSegmentedControl, {
      props: {
        options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B', disabled: true }],
      },
    })
    await w.get('[data-test-id="v-segmented-control-segment-b"]').trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders icon and label for icon+text options', () => {
    const w = mount(VSegmentedControl, {
      props: {
        options: [{ value: 'list', icon: 'list', label: 'List' }],
      },
    })
    expect(w.find('[data-test-id="v-segmented-control-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-segmented-control-label"]').text()).toBe('List')
  })

  it('renders icon-only segment with aria-label fallback', () => {
    const w = mount(VSegmentedControl, {
      props: {
        options: [{ value: 'list', icon: 'list', ariaLabel: 'List view' }],
      },
    })
    const segment = w.get('[data-test-id="v-segmented-control-segment-list"]')
    expect(segment.find('[data-test-id="v-segmented-control-label"]').exists()).toBe(false)
    expect(segment.attributes('aria-label')).toBe('List view')
  })

  it('applies size and variant classes', () => {
    const w = mount(VSegmentedControl, { props: { size: 'lg', variant: 'pill' } })
    const root = w.get('[data-test-id="v-segmented-control"]')
    expect(root.classes()).toContain('v-segmented-control--lg')
    expect(root.classes()).toContain('v-segmented-control--pill')
    expect(root.attributes('data-variant')).toBe('pill')
    expect(root.attributes('data-size')).toBe('lg')
  })

  it('maps legacy primary/subtle variants to default', () => {
    const primary = mount(VSegmentedControl, { props: { variant: 'primary' as never } })
    expect(primary.get('[data-test-id="v-segmented-control"]').attributes('data-variant')).toBe('default')
    const subtle = mount(VSegmentedControl, { props: { variant: 'subtle' as never } })
    expect(subtle.get('[data-test-id="v-segmented-control"]').attributes('data-variant')).toBe('default')
  })

  it('supports disabled state on root', () => {
    const w = mount(VSegmentedControl, { props: { disabled: true } })
    expect(w.get('[data-test-id="v-segmented-control"]').attributes('aria-disabled')).toBe('true')
  })

  it('exposes ARIA label from ariaLabel', () => {
    const w = mount(VSegmentedControl, { props: { ariaLabel: 'Select view mode' } })
    expect(w.get('[data-test-id="v-segmented-control"]').attributes('aria-label')).toBe('Select view mode')
  })
})
