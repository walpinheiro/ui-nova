/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VButton from '../VButton.vue'

describe('VButton', () => {
  it('renders and exposes stable test id', () => {
    const w = mount(VButton)
    expect(w.find('[data-test-id="v-button"]').exists()).toBe(true)
  })

  it('renders default slot content inside label', () => {
    const w = mount(VButton, { slots: { default: 'Click me' } })
    expect(w.get('[data-test-id="v-button-label"]').text()).toContain('Click me')
  })

  it('defaults to primary variant (poster Default = solid blue)', () => {
    const w = mount(VButton)
    const root = w.get('[data-test-id="v-button"]')
    expect(root.classes()).toContain('v-button--primary')
    expect(root.attributes('data-variant')).toBe('primary')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('type')).toBe('button')
  })

  it('allows native submit/reset behavior when explicitly requested', () => {
    expect(mount(VButton, { props: { type: 'submit' } }).get('button').attributes('type')).toBe('submit')
    expect(mount(VButton, { props: { type: 'reset' } }).get('button').attributes('type')).toBe('reset')
    expect(mount(VButton, { props: { type: 'invalid' as never } }).get('button').attributes('type')).toBe('button')
  })

  it('applies size and variant classes', () => {
    const w = mount(VButton, { props: { size: 'lg', variant: 'outline' } })
    const root = w.get('[data-test-id="v-button"]')
    expect(root.classes()).toContain('v-button--lg')
    expect(root.classes()).toContain('v-button--outline')
  })

  it('supports all 7 poster variants', () => {
    for (const variant of ['primary', 'secondary', 'ghost', 'outline', 'destructive', 'icon', 'loading'] as const) {
      const w = mount(VButton, { props: { variant } })
      expect(w.get('[data-test-id="v-button"]').classes()).toContain(`v-button--${variant}`)
    }
    const loadingVariant = mount(VButton, { props: { variant: 'loading' } })
    expect(loadingVariant.get('[data-test-id="v-button"]').attributes('aria-busy')).toBe('true')
    expect((loadingVariant.get('button').element as HTMLButtonElement).disabled).toBe(true)
  })

  it('maps legacy default/subtle variants (back-compat)', () => {
    const d = mount(VButton, { props: { variant: 'default' as never } })
    expect(d.get('[data-test-id="v-button"]').attributes('data-variant')).toBe('primary')
    const s = mount(VButton, { props: { variant: 'subtle' as never } })
    expect(s.get('[data-test-id="v-button"]').attributes('data-variant')).toBe('ghost')
  })

  it('renders icon slot with stable test id', () => {
    const w = mount(VButton, { slots: { icon: '<span>i</span>' } })
    expect(w.find('[data-test-id="v-button-icon"]').exists()).toBe(true)
  })

  it('keeps icon buttons icon-only and exposes a status spinner while loading', () => {
    const icon = mount(VButton, { props: { variant: 'icon', ariaLabel: 'Favorite' }, slots: { default: '♥' } })
    expect(icon.find('[data-test-id="v-button-icon"]').text()).toBe('♥')
    expect(icon.find('[data-test-id="v-button-label"]').exists()).toBe(false)

    const loading = mount(VButton, { props: { loading: true } })
    expect(loading.get('[data-test-id="v-button-spinner"]').attributes('role')).toBe('status')
    expect(loading.get('[data-test-id="v-button-spinner"]').attributes('aria-live')).toBe('polite')
  })

  it('supports disabled state', () => {
    const w = mount(VButton, { props: { disabled: true } })
    const root = w.get('[data-test-id="v-button"]')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect((root.element as HTMLButtonElement).disabled).toBe(true)
    expect(root.attributes('data-state')).toBe('disabled')
  })

  it('supports loading state with spinner and aria-busy', () => {
    const w = mount(VButton, { props: { loading: true } })
    const root = w.get('[data-test-id="v-button"]')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(w.find('[data-test-id="v-button-spinner"]').exists()).toBe(true)
    expect((root.element as HTMLButtonElement).disabled).toBe(true)
    expect(root.attributes('data-state')).toBe('loading')
  })

  it('renders the pill shape without changing the variant', () => {
    const w = mount(VButton, { props: { shape: 'pill', variant: 'outline' } })
    const root = w.get('[data-test-id="v-button"]')
    expect(root.classes()).toContain('v-button--pill')
    expect(root.classes()).toContain('v-button--outline')
    expect(root.attributes('data-shape')).toBe('pill')
    expect(root.attributes('data-variant')).toBe('outline')
  })

  it('exposes ARIA label from ariaLabel', () => {
    const w = mount(VButton, { props: { ariaLabel: 'Save document' } })
    expect(w.get('[data-test-id="v-button"]').attributes('aria-label')).toBe('Save document')
  })
})

describe('VButton inverse variant and content gap', () => {
  it('supports the inverse variant', () => {
    const w = mount(VButton, { props: { variant: 'inverse' } })
    const root = w.get('[data-test-id="v-button"]')
    expect(root.classes()).toContain('v-button--inverse')
    expect(root.attributes('data-variant')).toBe('inverse')
  })

  it('renders icon + text slot content inside the label wrapper', () => {
    const w = mount(VButton, { slots: { default: '<svg class="i"></svg>Ask AI' } })
    const label = w.get('[data-test-id="v-button-label"]')
    expect(label.find('svg.i').exists()).toBe(true)
    expect(label.text()).toContain('Ask AI')
  })
})
