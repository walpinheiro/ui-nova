// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSkeleton from '../VSkeleton.vue'

const root = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-test-id="v-skeleton"]')

describe('VSkeleton', () => {
  it('renders and exposes stable test id', () => {
    const wrapper = mount(VSkeleton)
    expect(root(wrapper).exists()).toBe(true)
  })

  it('supports disabled state', () => {
    const wrapper = mount(VSkeleton, { props: { disabled: true } })
    expect(root(wrapper).attributes('aria-disabled')).toBe('true')
  })

  it('exposes aria-busy when animated', () => {
    const animated = mount(VSkeleton, { props: { animated: true } })
    expect(root(animated).attributes('aria-busy')).toBe('true')

    const staticSkeleton = mount(VSkeleton, { props: { animated: false } })
    expect(root(staticSkeleton).attributes('aria-busy')).toBeUndefined()
  })

  it('pauses shimmer while keeping shapes visible', () => {
    const wrapper = mount(VSkeleton, { props: { paused: true } })
    expect(root(wrapper).attributes('data-state')).toBe('paused')
    expect(wrapper.find('[data-test-id="v-skeleton-shimmer"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-test-id="v-skeleton-shape"]').length).toBeGreaterThan(0)
  })

  it('supports text variant with configurable lines', () => {
    const wrapper = mount(VSkeleton, { props: { variant: 'text', lines: 4 } })
    expect(root(wrapper).attributes('data-variant')).toBe('text')
    expect(wrapper.findAll('[data-test-id="v-skeleton-shape"]')).toHaveLength(4)
  })

  it('supports avatar variant', () => {
    const wrapper = mount(VSkeleton, { props: { variant: 'avatar', size: 'lg' } })
    expect(root(wrapper).attributes('data-variant')).toBe('avatar')
    expect(root(wrapper).attributes('data-size')).toBe('lg')
    expect(wrapper.findAll('[data-test-id="v-skeleton-shape"]')).toHaveLength(1)
  })

  it('supports card variant', () => {
    const wrapper = mount(VSkeleton, { props: { variant: 'card' } })
    expect(root(wrapper).attributes('data-variant')).toBe('card')
    expect(wrapper.findAll('[data-test-id="v-skeleton-shape"]')).toHaveLength(4)
  })

  it('supports table-row variant', () => {
    const wrapper = mount(VSkeleton, { props: { variant: 'table-row' } })
    expect(root(wrapper).attributes('data-variant')).toBe('table-row')
    expect(wrapper.findAll('[data-test-id="v-skeleton-shape"]')).toHaveLength(5)
  })

  it('supports chart variant', () => {
    const wrapper = mount(VSkeleton, { props: { variant: 'chart' } })
    expect(root(wrapper).attributes('data-variant')).toBe('chart')
    expect(wrapper.findAll('[data-test-id="v-skeleton-shape"]')).toHaveLength(5)
  })
})
