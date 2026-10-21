/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VCard from '../VCard.vue'

describe('VCard', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VCard)
    expect(w.find('[data-test-id="v-card"]').exists()).toBe(true)
  })

  it('defaults to elevated variant and md size', () => {
    const w = mount(VCard)
    const root = w.get('[data-test-id="v-card"]')
    expect(root.classes()).toContain('v-card--elevated')
    expect(root.classes()).toContain('v-card--md')
    expect(root.attributes('data-variant')).toBe('elevated')
    expect(root.attributes('data-size')).toBe('md')
  })

  it('supports all 4 variants and 3 sizes', () => {
    for (const variant of ['elevated', 'outlined', 'filled', 'interactive'] as const) {
      const w = mount(VCard, { props: { variant } })
      expect(w.get('[data-test-id="v-card"]').classes()).toContain(`v-card--${variant}`)
    }
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mount(VCard, { props: { size } })
      expect(w.get('[data-test-id="v-card"]').classes()).toContain(`v-card--${size}`)
    }
  })

  it('supports title, description and badge', () => {
    const w = mount(VCard, { props: { title: 'Alpine Pro', description: 'Brighter ideas.', badge: 'Product' } })
    expect(w.get('[data-test-id="v-card-title"]').text()).toBe('Alpine Pro')
    expect(w.get('[data-test-id="v-card-description"]').text()).toBe('Brighter ideas.')
    expect(w.get('[data-test-id="v-card-badge"]').text()).toContain('Product')
    const tag = w.get('[data-test-id="v-card-badge"]').get('[data-test-id="v-tag"]')
    expect(tag.classes()).toContain('v-tag--overlay')
    expect(tag.element.tagName).toBe('SPAN')
  })

  it('renders slots: media, badge, title, description, avatar-group, actions', () => {
    const w = mount(VCard, {
      slots: {
        media: '<img data-test-id="slot-media" alt="x" />',
        badge: '<span data-test-id="slot-badge">B</span>',
        'avatar-group': '<span data-test-id="slot-avatars">A</span>',
        actions: '<button data-test-id="slot-actions">Go</button>',
      },
    })
    expect(w.find('[data-test-id="slot-media"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-badge"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-avatars"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-actions"]').exists()).toBe(true)
  })

  it('renders composition slots without changing click behavior', () => {
    const w = mount(VCard, {
      props: { title: 'Export' },
      slots: {
        icon: '<span data-test-id="slot-icon">I</span>',
        'header-trailing': '<span data-test-id="slot-trailing">Ready</span>',
        caption: '<span data-test-id="slot-caption">Locked</span>',
        'media-overlay': '<span data-test-id="slot-overlay">Name</span>',
        media: '<img data-test-id="slot-media-overlay-img" alt="x" />',
      },
    })
    expect(w.find('[data-test-id="slot-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-trailing"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-caption"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-overlay"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-card-heading"]').exists()).toBe(true)
  })

  it('exposes controlled selected appearance without becoming actionable', async () => {
    const w = mount(VCard, { props: { title: 'PDF', selected: true } })
    const root = w.get('[data-test-id="v-card"]')
    expect(root.classes()).toContain('v-card--selected')
    expect(root.attributes('data-selected')).toBe('true')
    expect(root.attributes('data-state')).toBe('selected')
    expect(root.attributes('aria-selected')).toBe('true')
    expect(w.find('[data-test-id="v-card-selected-check"]').exists()).toBe(true)
    expect(root.attributes('role')).toBeUndefined()
    await root.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })

  it('places media according to mediaPlacement', () => {
    const w = mount(VCard, {
      props: { mediaPlacement: 'end', title: 'Quote' },
      slots: { media: '<img alt="portrait" />' },
    })
    const root = w.get('[data-test-id="v-card"]')
    expect(root.classes()).toContain('v-card--media-end')
    expect(root.attributes('data-media-placement')).toBe('end')
  })

  it('emits click on Enter/Space for actionable cards', async () => {
    const w = mount(VCard, { props: { variant: 'interactive', interactive: true } })
    const root = w.get('[data-test-id="v-card"]')
    expect(root.attributes('tabindex')).toBe('0')
    expect(root.attributes('role')).toBe('button')
    await root.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('click')).toBeTruthy()
    await root.trigger('keydown', { key: ' ' })
    expect(w.emitted('click')?.length).toBe(2)
  })

  it('applies actionable behavior when the interactive prop is used with another variant', () => {
    const w = mount(VCard, { props: { variant: 'elevated', interactive: true } })
    const root = w.get('[data-test-id="v-card"]')
    expect(root.classes()).toContain('v-card--actionable')
    expect(root.classes()).toContain('v-card--elevated')
    expect(root.attributes('tabindex')).toBe('0')
    expect(root.attributes('role')).toBe('button')
  })

  it('interactive variant is actionable without the interactive prop', () => {
    const w = mount(VCard, { props: { variant: 'interactive' } })
    const root = w.get('[data-test-id="v-card"]')
    expect(root.classes()).toContain('v-card--interactive')
    expect(root.classes()).toContain('v-card--actionable')
    expect(root.attributes('tabindex')).toBe('0')
  })

  it('does not emit click on non-actionable cards', async () => {
    const w = mount(VCard, { props: { title: 'Static card' } })
    await w.get('[data-test-id="v-card"]').trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })

  it('non-interactive card is not focusable', () => {
    const w = mount(VCard)
    expect(w.get('[data-test-id="v-card"]').attributes('tabindex')).toBeUndefined()
  })

  it('supports loading state with skeleton and aria-busy', () => {
    const w = mount(VCard, { props: { loading: true } })
    const root = w.get('[data-test-id="v-card"]')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(root.attributes('data-state')).toBe('loading')
    expect(w.find('[data-test-id="v-card-skeleton"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-card-skeleton-title"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-card-skeleton-description"]').exists()).toBe(true)
  })

  it('exposes ARIA label from ariaLabel or title', () => {
    const w = mount(VCard, { props: { title: 'Alpine Pro' } })
    expect(w.get('[data-test-id="v-card"]').attributes('aria-label')).toBe('Alpine Pro')
    const labelled = mount(VCard, { props: { ariaLabel: 'Custom label' } })
    expect(labelled.get('[data-test-id="v-card"]').attributes('aria-label')).toBe('Custom label')
  })
})
