/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSection from '../VSection.vue'

describe('VSection', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VSection)
    expect(w.find('[data-test-id="v-section"]').exists()).toBe(true)
  })

  it('defaults to default variant and md size', () => {
    const w = mount(VSection)
    const root = w.get('[data-test-id="v-section"]')
    expect(root.classes()).toContain('v-section--default')
    expect(root.classes()).toContain('v-section--md')
    expect(root.attributes('data-variant')).toBe('default')
    expect(root.attributes('data-size')).toBe('md')
  })

  it('renders native section element with content wrapper', () => {
    const w = mount(VSection)
    expect(w.element.tagName).toBe('SECTION')
    expect(w.find('[data-test-id="v-section-content"]').exists()).toBe(true)
  })

  it('supports all 5 variants and 3 sizes', () => {
    for (const variant of ['default', 'elevated', 'bordered', 'borderless', 'tinted'] as const) {
      const w = mount(VSection, { props: { variant } })
      expect(w.get('[data-test-id="v-section"]').classes()).toContain(`v-section--${variant}`)
    }
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mount(VSection, { props: { size } })
      expect(w.get('[data-test-id="v-section"]').classes()).toContain(`v-section--${size}`)
    }
  })

  it('maps legacy primary/subtle variants', () => {
    const primary = mount(VSection, { props: { variant: 'primary' as never } })
    expect(primary.get('[data-test-id="v-section"]').attributes('data-variant')).toBe('tinted')
    const subtle = mount(VSection, { props: { variant: 'subtle' as never } })
    expect(subtle.get('[data-test-id="v-section"]').attributes('data-variant')).toBe('borderless')
  })

  it('supports title, description and icon prop', () => {
    const w = mount(VSection, {
      props: { title: 'Personal Information', description: 'Manage your details.', icon: 'user' },
    })
    expect(w.get('[data-test-id="v-section-heading"]').text()).toBe('Personal Information')
    expect(w.get('[data-test-id="v-section-description"]').text()).toBe('Manage your details.')
    expect(w.get('[data-test-id="v-section-icon"] [data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('renders slots: default, header, actions, footer, icon, title, description', () => {
    const w = mount(VSection, {
      slots: {
        default: 'Body content',
        header: '<span data-test-id="slot-header">H</span>',
        actions: '<button data-test-id="slot-actions">Edit</button>',
        footer: '<span data-test-id="slot-footer">Footer note</span>',
        icon: '<span data-test-id="slot-icon">I</span>',
        title: '<span data-test-id="slot-title">Custom title</span>',
        description: '<span data-test-id="slot-description">Custom desc</span>',
      },
    })
    expect(w.get('[data-test-id="v-section-content"]').text()).toContain('Body content')
    expect(w.find('[data-test-id="slot-header"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-actions"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-footer"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-title"]').exists()).toBe(true)
    expect(w.find('[data-test-id="slot-description"]').exists()).toBe(true)
  })

  it('uses semantic heading with aria-labelledby when title is present', () => {
    const w = mount(VSection, { props: { title: 'Project Settings' } })
    const root = w.get('[data-test-id="v-section"]')
    const heading = w.get('[data-test-id="v-section-heading"]')
    expect(heading.element.tagName).toBe('H2')
    expect(root.attributes('aria-labelledby')).toBe(heading.attributes('id'))
  })

  it('exposes ARIA label from ariaLabel when no title', () => {
    const w = mount(VSection, { props: { ariaLabel: 'Content section' } })
    expect(w.get('[data-test-id="v-section"]').attributes('aria-label')).toBe('Content section')
  })
})
