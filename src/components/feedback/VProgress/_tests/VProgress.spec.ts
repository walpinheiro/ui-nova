// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VProgress from '../VProgress.vue'
import { mountVProgress } from '../mountVProgress'

const root = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-test-id="progress-container"]')

describe('VProgress mount helpers', () => {
  it('normalizes size, variant, and clamps determinate values', () => {
    expect(mountVProgress({ size: 'lg', variant: 'circular', value: 150 }).value).toBe(100)
    expect(mountVProgress({ value: -12 }).value).toBe(0)
    expect(mountVProgress({}).variant).toBe('linear')
    expect(mountVProgress({}).size).toBe('md')
  })

  it('resolves semantic states and labels', () => {
    expect(mountVProgress({ state: 'success' }).value).toBe(100)
    expect(mountVProgress({ state: 'success' }).labelText).toBe('100%')
    expect(mountVProgress({ state: 'indeterminate', label: true }).labelText).toBeUndefined()
    expect(mountVProgress({ value: 72, label: 'Uploading…' }).labelText).toBe('Uploading…')
    expect(mountVProgress({ value: 72, label: false }).showLabel).toBe(false)
  })

  it('selects anatomy test ids for indeterminate value', () => {
    expect(mountVProgress({ state: 'determinate' }).valueTestId).toBe('progress-value')
    expect(mountVProgress({ state: 'indeterminate' }).valueTestId).toBe('progress-indeterminate')
  })

  it('resolves circular dimensions per size', () => {
    expect(mountVProgress({ variant: 'circular', size: 'sm' }).circularSize).toBe(48)
    expect(mountVProgress({ variant: 'circular', size: 'md' }).circularSize).toBe(64)
    expect(mountVProgress({ variant: 'circular', size: 'lg' }).circularSize).toBe(80)
  })
})

describe('VProgress', () => {
  it('renders linear progress with stable anatomy ids', () => {
    const wrapper = mount(VProgress, { props: { value: 72 } })
    expect(root(wrapper).classes()).toEqual(expect.arrayContaining(['v-progress--linear', 'v-progress--md', 'v-progress--determinate']))
    expect(wrapper.get('[data-test-id="progress-track"]').attributes('role')).toBe('progressbar')
    expect(wrapper.get('[data-test-id="progress-value"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="progress-label"]').text()).toBe('72%')
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    const wrapper = mount(VProgress, { props: { size } })
    expect(root(wrapper).classes()).toContain(`v-progress--${size}`)
  })

  it('exposes aria value attributes when determinate', () => {
    const wrapper = mount(VProgress, { props: { value: 42, ariaLabel: 'File upload' } })
    const track = wrapper.get('[data-test-id="progress-track"]')
    expect(track.attributes('aria-valuemin')).toBe('0')
    expect(track.attributes('aria-valuemax')).toBe('100')
    expect(track.attributes('aria-valuenow')).toBe('42')
    expect(track.attributes('aria-label')).toBe('File upload')
  })

  it('omits aria-valuenow for indeterminate state', () => {
    const wrapper = mount(VProgress, { props: { state: 'indeterminate' } })
    const track = wrapper.get('[data-test-id="progress-track"]')
    expect(track.attributes('aria-valuenow')).toBeUndefined()
    expect(track.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[data-test-id="progress-indeterminate"]').exists()).toBe(true)
  })

  it('renders circular variant with ring anatomy', () => {
    const wrapper = mount(VProgress, { props: { variant: 'circular', value: 72 } })
    expect(root(wrapper).classes()).toContain('v-progress--circular')
    expect(wrapper.get('[data-test-id="progress-circular"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="progress-track"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="progress-label"]').text()).toBe('72%')
  })

  it('renders success and error states with keyline icons', () => {
    const success = mount(VProgress, { props: { state: 'success' } })
    expect(success.get('[data-test-id="progress-complete-icon"]').find('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(success.get('[data-test-id="progress-track"]').attributes('aria-valuenow')).toBe('100')

    const error = mount(VProgress, { props: { state: 'error', value: 72 } })
    expect(error.get('[data-test-id="progress-error-icon"]').find('[data-test-id="v-icon"]').exists()).toBe(true)
    expect(root(error).classes()).toContain('v-progress--error')
  })

  it('supports custom anatomy ids for hero examples', () => {
    const wrapper = mount(VProgress, { props: { dataTestId: 'progress-upload' } })
    expect(wrapper.get('[data-test-id="progress-upload"]').exists()).toBe(true)
  })
})
