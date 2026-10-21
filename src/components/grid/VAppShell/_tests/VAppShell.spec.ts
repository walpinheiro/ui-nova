/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VAppShell from '../VAppShell.vue'

describe('VAppShell', () => {
  it('renders shell landmarks', () => {
    const w = mount(VAppShell)
    expect(w.find('[data-test-id="v-appshell"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-appshell-topbar"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-appshell-sidebar"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-appshell-content"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-appshell-utility"]').exists()).toBe(true)
  })

  it('renders default nav items', () => {
    const w = mount(VAppShell)
    expect(w.find('[data-test-id="v-appshell-nav-dashboard"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-appshell-nav-projects"]').exists()).toBe(true)
  })

  it('uses icons not unicode in topbar and utility', () => {
    const w = mount(VAppShell)
    expect(w.findAll('[data-test-id="v-icon"]').length).toBeGreaterThan(0)
    expect(w.text()).not.toContain('×')
  })

  it('renders quick actions with test ids', () => {
    const w = mount(VAppShell)
    expect(w.find('[data-test-id="v-appshell-quickaction-new-project"]').exists()).toBe(true)
  })

  it('renders slot content in main area', () => {
    const w = mount(VAppShell, {
      slots: { default: '<div data-test-id="page">Page</div>' },
    })
    expect(w.find('[data-test-id="page"]').exists()).toBe(true)
  })
})
