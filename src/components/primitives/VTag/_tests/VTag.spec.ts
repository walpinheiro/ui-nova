/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTag from '../VTag.vue'
import { mountVTag } from '../mountVTag'

describe('VTag mount helpers', () => {
  it('defaults to an interactive action tag', () => {
    expect(mountVTag({}).interactive).toBe(true)
    expect(mountVTag({}).variant).toBe('default')
    expect(mountVTag({}).size).toBe('md')
    expect(mountVTag({ variant: 'soft' }).variant).toBe('soft')
  })

  it('does not nest a button when the tag is removable', () => {
    expect(mountVTag({ removable: true }).interactive).toBe(false)
    expect(mountVTag({ removable: true, interactive: true }).interactive).toBe(true)
    expect(mountVTag({ interactive: false }).interactive).toBe(false)
    expect(mountVTag({ interactive: null }).interactive).toBe(true)
  })
})

describe('VTag', () => {
  it('renders an action button with stable test ids', () => {
    const w = mount(VTag, { slots: { default: 'Add Goals' } })
    const root = w.get('[data-test-id="v-tag"]')
    expect(root.element.tagName).toBe('BUTTON')
    expect(root.classes()).toContain('v-tag--interactive')
    expect(w.get('[data-test-id="v-tag-label"]').text()).toBe('Add Goals')
  })

  it('renders a static overlay tag without becoming a button', () => {
    const w = mount(VTag, {
      props: { variant: 'overlay', interactive: false },
      slots: { default: 'Product' },
    })
    const root = w.get('[data-test-id="v-tag"]')
    expect(root.element.tagName).toBe('SPAN')
    expect(root.classes()).toContain('v-tag--overlay')
    expect(root.attributes('type')).toBeUndefined()
  })

  it('emits click on interactive tags and not when disabled', async () => {
    const w = mount(VTag, { slots: { default: 'Filter' } })
    await w.get('[data-test-id="v-tag"]').trigger('click')
    expect(w.emitted('click')).toBeTruthy()

    const disabled = mount(VTag, { props: { disabled: true }, slots: { default: 'Filter' } })
    await disabled.get('[data-test-id="v-tag"]').trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()
  })

  it('emits remove from the dismiss button', async () => {
    const w = mount(VTag, { props: { removable: true, variant: 'soft' }, slots: { default: 'Design' } })
    expect(w.get('[data-test-id="v-tag"]').element.tagName).toBe('SPAN')
    expect(w.get('[data-test-id="v-tag"]').classes()).toContain('v-tag--soft')
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
    await w.get('[data-test-id="v-tag-remove"]').trigger('click')
    expect(w.emitted('remove')).toBeTruthy()
  })
})
