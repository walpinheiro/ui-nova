/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDrawer from '../VDrawer.vue'
import { mountVDrawer } from '../mountVDrawer'

describe('VDrawer', () => {
  it('renders an open drawer with stable anatomy test ids', () => {
    const wrapper = mount(VDrawer, {
      props: { modelValue: true, title: 'Drawer title' },
      slots: { default: '<p>Body</p>', footer: '<button>Save</button>' },
    })

    expect(wrapper.get('[data-test-id="v-drawer"]').attributes('data-state')).toBe('open')
    expect(wrapper.find('[data-test-id="drawer-overlay"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="drawer-container"]').attributes('role')).toBe('dialog')
    expect(wrapper.get('[data-test-id="drawer-container"]').attributes('aria-modal')).toBe('true')
    expect(wrapper.get('[data-test-id="drawer-title"]').text()).toBe('Drawer title')
    expect(wrapper.get('[data-test-id="drawer-content"]').text()).toContain('Body')
    expect(wrapper.find('[data-test-id="drawer-footer"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="drawer-close-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="drawer-divider"]').exists()).toBe(true)
  })

  it('supports controlled modelValue and open alias visibility', () => {
    const model = mount(VDrawer, { props: { modelValue: false } })
    expect(model.get('[data-test-id="v-drawer"]').attributes('data-state')).toBe('closed')
    expect(model.find('[data-test-id="drawer-container"]').exists()).toBe(false)

    const alias = mount(VDrawer, { props: { open: false } })
    expect(alias.find('[data-test-id="drawer-container"]').exists()).toBe(false)
  })

  it('normalizes placement and size aliases from the design poster', () => {
    expect(mountVDrawer({ placement: 'left', size: 'lg' }).placement).toBe('left')
    expect(mountVDrawer({ side: 'bottom', width: 'sm' }).placement).toBe('bottom')
    expect(mountVDrawer({ side: 'bottom', width: 'sm' }).size).toBe('sm')

    const wrapper = mount(VDrawer, { props: { placement: 'left', size: 'lg' } })
    const root = wrapper.get('[data-test-id="v-drawer"]')
    expect(root.attributes('data-placement')).toBe('left')
    expect(root.attributes('data-size')).toBe('lg')
    expect(root.classes()).toContain('v-drawer--left')
    expect(root.classes()).toContain('v-drawer--lg')
  })

  it('links title to the dialog with accessible semantics', () => {
    const wrapper = mount(VDrawer, { props: { modelValue: true, title: 'Accessible drawer' } })
    const panel = wrapper.get('[data-test-id="drawer-container"]')
    expect(panel.attributes('aria-labelledby')).toBe(wrapper.get('[data-test-id="drawer-title"]').attributes('id'))

    const labelled = mount(VDrawer, { props: { modelValue: true, ariaLabel: 'Custom drawer' } })
    expect(labelled.get('[data-test-id="drawer-container"]').attributes('aria-label')).toBe('Custom drawer')
    expect(labelled.get('[data-test-id="drawer-container"]').attributes('aria-labelledby')).toBeUndefined()
  })

  it('renders optional tabs slot and close icon', () => {
    const wrapper = mount(VDrawer, {
      props: { modelValue: true, title: 'Project details' },
      slots: {
        tabs: '<nav data-test-id="drawer-tab-overview">Overview</nav>',
      },
    })
    expect(wrapper.find('[data-test-id="drawer-tabs"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="drawer-tab-overview"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('emits close events from the close button and dismiss events from Escape/backdrop', async () => {
    const close = mount(VDrawer, { props: { modelValue: true } })
    await close.get('[data-test-id="drawer-close-button"]').trigger('click')
    expect(close.emitted('update:modelValue')).toEqual([[false]])
    expect(close.emitted('update:open')).toEqual([[false]])
    expect(close.emitted('open-change')).toEqual([[false]])
    expect(close.emitted('close')).toHaveLength(1)

    const dismiss = mount(VDrawer, { props: { modelValue: true } })
    await dismiss.get('[data-test-id="drawer-overlay"]').trigger('click')
    expect(dismiss.emitted('dismiss')).toHaveLength(1)

    const escape = mount(VDrawer, { props: { modelValue: true } })
    await escape.get('[data-test-id="drawer-container"]').trigger('keydown', { key: 'Escape' })
    expect(escape.emitted('dismiss')).toHaveLength(1)
  })

  it('respects dismissible=false and disabled/loading close guards', async () => {
    const notDismissible = mount(VDrawer, { props: { modelValue: true, dismissible: false } })
    await notDismissible.get('[data-test-id="drawer-overlay"]').trigger('click')
    await notDismissible.get('[data-test-id="drawer-container"]').trigger('keydown', { key: 'Escape' })
    expect(notDismissible.emitted('dismiss')).toBeUndefined()

    const disabled = mount(VDrawer, { props: { modelValue: true, disabled: true } })
    expect(disabled.get('[data-test-id="drawer-container"]').attributes('aria-disabled')).toBe('true')
    await disabled.get('[data-test-id="drawer-close-button"]').trigger('click')
    expect(disabled.emitted('close')).toBeUndefined()

    const loading = mount(VDrawer, { props: { modelValue: true, loading: true } })
    const loadingPanel = loading.get('[data-test-id="drawer-container"]')
    expect(loadingPanel.attributes('aria-busy')).toBe('true')
    expect(loadingPanel.attributes('aria-disabled')).toBe('true')
    expect(loading.find('[data-test-id="v-sheet-loader"]').exists()).toBe(true)
  })

  it('traps Tab and Shift+Tab inside the drawer', async () => {
    const wrapper = mount(VDrawer, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Trap drawer' },
      slots: {
        default: '<button data-test-id="drawer-action-last">Confirm</button>',
      },
    })
    const panel = wrapper.get('[data-test-id="drawer-container"]')
    const close = wrapper.get('[data-test-id="drawer-close-button"]').element as HTMLElement
    const last = wrapper.get('[data-test-id="drawer-action-last"]').element as HTMLElement

    last.focus()
    await panel.trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(close)
    close.focus()
    await panel.trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
    wrapper.unmount()
  })

  it('returns focus to the opener after the controlled drawer closes', async () => {
    const host = document.createElement('div')
    const opener = document.createElement('button')
    host.appendChild(opener)
    document.body.appendChild(host)
    opener.focus()
    const wrapper = mount(VDrawer, { attachTo: host, props: { modelValue: true } })
    await wrapper.setProps({ modelValue: false })
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(opener)
    wrapper.unmount()
    host.remove()
  })
})
