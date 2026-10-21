/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VFileUpload from '../VFileUpload.vue'

describe('VFileUpload', () => {
  it('renders dropzone by default', () => {
    const w = mount(VFileUpload)
    expect(w.get('[data-test-id="file-upload"]').attributes('data-variant')).toBe('dropzone')
    expect(w.find('[data-test-id="file-upload-dropzone"]').exists()).toBe(true)
  })

  it('renders button trigger variant', () => {
    const w = mount(VFileUpload, { props: { variant: 'button' } })
    expect(w.find('[data-test-id="file-upload-button-trigger"]').exists()).toBe(true)
  })

  it('renders hidden native input', () => {
    const w = mount(VFileUpload)
    expect(w.find('[data-test-id="file-upload-input"]').exists()).toBe(true)
  })

  it('uses VIcon in dropzone', () => {
    const w = mount(VFileUpload)
    expect(w.find('[data-test-id="file-upload-icon"] [data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('supports disabled state', () => {
    const w = mount(VFileUpload, { props: { disabled: true } })
    expect(w.get('[data-test-id="file-upload"]').attributes('data-state')).toBe('disabled')
  })
})
