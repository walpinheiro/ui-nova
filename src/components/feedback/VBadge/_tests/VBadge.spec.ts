// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VBadge from '../VBadge.vue'
import { mountVBadge } from '../mountVBadge'

const root = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-test-id="badge"]')

describe('VBadge mount helpers', () => {
  it('normalizes legacy variants and infers count/dot variants', () => {
    expect(mountVBadge({ variant: 'default' }).variant).toBe('neutral')
    expect(mountVBadge({ variant: 'subtle' }).variant).toBe('neutral')
    expect(mountVBadge({ count: 12 }).variant).toBe('count')
    expect(mountVBadge({ dot: true }).variant).toBe('dot')
  })

  it('resolves keyline icons for warning and named poster icons', () => {
    expect(mountVBadge({ variant: 'warning' }).iconData?.body).toBeTruthy()
    expect(mountVBadge({ icon: 'crown' }).iconData?.body).toBeTruthy()
    expect(mountVBadge({ variant: 'neutral' }).iconData).toBeUndefined()
  })

  it('provides poster fallback labels and live status semantics', () => {
    expect(mountVBadge({ count: 12 }).fallbackLabel).toBe('Count')
    expect(mountVBadge({ dot: true }).fallbackLabel).toBe('Online')
    expect(mountVBadge({ count: 12 }).live).toBe(true)
    expect(mountVBadge({ variant: 'success' }).live).toBe(false)
  })
})

describe('VBadge', () => {
  it('renders the neutral medium badge with stable anatomy ids', () => {
    const wrapper = mount(VBadge, { slots: { default: 'New' } })
    expect(root(wrapper).element.tagName).toBe('SPAN')
    expect(root(wrapper).classes()).toEqual(expect.arrayContaining(['v-badge--md', 'v-badge--neutral']))
    expect(wrapper.get('[data-test-id="badge-label"]').text()).toBe('New')
    expect(wrapper.find('[data-test-id="badge-count"]').exists()).toBe(false)
  })

  it.each(['xs', 'sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    const wrapper = mount(VBadge, { props: { size } })
    expect(root(wrapper).classes()).toContain(`v-badge--${size}`)
  })

  it.each(['success', 'warning', 'danger', 'outlined', 'primary', 'purple'] as const)('supports the %s variant', (variant) => {
    const wrapper = mount(VBadge, { props: { variant } })
    expect(root(wrapper).classes()).toContain(`v-badge--${variant}`)
  })

  it('normalizes the poster count example and announces it as status', () => {
    const wrapper = mount(VBadge, { props: { count: 12 } })
    expect(root(wrapper).classes()).toContain('v-badge--count')
    expect(root(wrapper).attributes('role')).toBe('status')
    expect(wrapper.get('[data-test-id="badge-label"]').text()).toBe('Count')
    expect(wrapper.get('[data-test-id="badge-count"]').text()).toBe('12')
  })

  it('renders a leading dot before the label', () => {
    const wrapper = mount(VBadge, { props: { dot: true }, slots: { default: 'Online' } })
    expect(root(wrapper).classes()).toContain('v-badge--dot')
    expect(wrapper.get('[data-test-id="badge-dot"]').element.nextElementSibling?.textContent).toBe('Online')
  })

  it('renders warning and named icons through VIcon keyline SVGs', () => {
    const warning = mount(VBadge, { props: { variant: 'warning' }, slots: { default: 'Warning' } })
    expect(warning.get('[data-test-id="badge-icon"]').find('[data-test-id="v-icon"]').exists()).toBe(true)

    const crown = mount(VBadge, { props: { variant: 'primary', icon: 'crown' }, slots: { default: 'Pro' } })
    expect(crown.get('[data-test-id="badge-icon"]').find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('uses a native button only when interactive and toggles selection', async () => {
    const wrapper = mount(VBadge, { props: { interactive: true }, slots: { default: 'New' } })
    const badge = root(wrapper)
    expect(badge.element.tagName).toBe('BUTTON')
    expect(badge.attributes('type')).toBe('button')
    expect(badge.attributes('aria-pressed')).toBe('false')

    await badge.trigger('keydown', { key: 'Enter' })
    await badge.trigger('click')
    expect(badge.attributes('aria-pressed')).toBe('true')
    expect(badge.classes()).toContain('v-badge--selected')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('update:selected')).toEqual([[true]])

    await badge.trigger('click')
    expect(badge.attributes('aria-pressed')).toBe('false')
    expect(badge.classes()).not.toContain('v-badge--selected')
  })

  it('supports controlled selection and accessible labels', () => {
    const wrapper = mount(VBadge, { props: { interactive: true, selected: true, ariaLabel: 'Current status' } })
    expect(root(wrapper).attributes('aria-pressed')).toBe('true')
    expect(root(wrapper).attributes('aria-label')).toBe('Current status')
  })

  it('supports disabled and loading semantics', () => {
    const disabled = mount(VBadge, { props: { interactive: true, disabled: true } })
    expect(root(disabled).attributes('aria-disabled')).toBe('true')
    expect(root(disabled).attributes('disabled')).toBeDefined()

    const loading = mount(VBadge, { props: { interactive: true, loading: true } })
    expect(root(loading).attributes('aria-busy')).toBe('true')
    expect(root(loading).attributes('aria-disabled')).toBe('true')
    expect(loading.get('[data-test-id="badge-loader"]').element).toBeTruthy()
  })

  it('supports custom anatomy ids for hero examples', () => {
    const wrapper = mount(VBadge, { props: { dataTestId: 'badge-status-pro' } })
    expect(wrapper.get('[data-test-id="badge-status-pro"]').element).toBeTruthy()
  })

  it('renders a removable tag with dismiss button and pill styling', async () => {
    const wrapper = mount(VBadge, {
      props: { removable: true, removeLabel: 'Remove Design', size: 'sm' },
      slots: { default: 'Design' },
    })
    const badge = root(wrapper)
    expect(badge.element.tagName).toBe('SPAN')
    expect(badge.classes()).toEqual(expect.arrayContaining(['v-badge--removable', 'v-badge--sm', 'v-badge--neutral']))
    expect(wrapper.get('[data-test-id="badge-remove"]').attributes('aria-label')).toBe('Remove Design')
    await wrapper.get('[data-test-id="badge-remove"]').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('ignores interactive mode when removable and applies leaving animation class', () => {
    const wrapper = mount(VBadge, { props: { removable: true, interactive: true, leaving: true }, slots: { default: 'Tag' } })
    expect(root(wrapper).element.tagName).toBe('SPAN')
    expect(root(wrapper).classes()).toContain('v-badge--leaving')
    expect(root(wrapper).classes()).not.toContain('v-badge--interactive')
  })
})

describe('VBadge dot tone', () => {
  it('keeps the dot on the badge variant class so CSS can tone it', () => {
    const wrapper = mount(VBadge, { props: { dot: true, variant: 'danger' }, slots: { default: 'Failed' } })
    expect(wrapper.classes()).toContain('v-badge--danger')
    expect(wrapper.get('[data-test-id="badge-dot"]').attributes('style')).toBeUndefined()
  })

  it('applies dotColor override to the dot', () => {
    const wrapper = mount(VBadge, { props: { dot: true, dotColor: '#8b5cf6' }, slots: { default: 'Custom' } })
    expect((wrapper.get('[data-test-id="badge-dot"]').element as HTMLElement).style.background).toContain('rgb(139, 92, 246)')
  })
})
