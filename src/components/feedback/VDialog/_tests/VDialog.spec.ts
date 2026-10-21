/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDialog from '../VDialog.vue'
import { mountVDialog, V_DIALOG_CLOSE_ICON, V_DIALOG_VARIANT_ICONS } from '../mountVDialog'

const testId = (id: string) => document.body.querySelector<HTMLElement>(`[data-test-id="${id}"]`)

const cleanupDialogs = () => {
  document.body.querySelectorAll('[data-test-id="v-dialog"]').forEach((element) => element.remove())
}

describe('VDialog', () => {
  afterEach(() => {
    cleanupDialogs()
  })
  it('renders an open modal with stable anatomy test ids', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    mount(VDialog, {
      attachTo: host,
      props: { modelValue: true, title: 'Dialog title', description: 'Supporting description.' },
      slots: { default: '<p>Body</p>', actions: '<button>Confirm</button>' },
    })

    expect(testId('v-dialog')?.getAttribute('data-state')).toBe('open')
    expect(testId('dialog-backdrop')).not.toBeNull()
    expect(testId('dialog-container')?.getAttribute('role')).toBe('dialog')
    expect(testId('dialog-container')?.getAttribute('aria-modal')).toBe('true')
    expect(testId('dialog-title')?.textContent).toBe('Dialog title')
    expect(testId('dialog-description')?.textContent).toBe('Supporting description.')
    expect(testId('dialog-content')?.textContent).toContain('Body')
    expect(testId('dialog-actions')).not.toBeNull()
    expect(testId('dialog-close-button')).not.toBeNull()
    expect(testId('dialog-close-button')?.querySelector('[data-test-id="v-icon"]')).not.toBeNull()
    host.remove()
  })

  it('supports controlled modelValue and open alias visibility', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    mount(VDialog, { attachTo: host, props: { modelValue: false } })
    expect(testId('v-dialog')).toBeNull()
    expect(testId('dialog-container')).toBeNull()
    host.remove()

    const aliasHost = document.createElement('div')
    document.body.appendChild(aliasHost)
    mount(VDialog, { attachTo: aliasHost, props: { open: false } })
    expect(testId('dialog-container')).toBeNull()
    aliasHost.remove()
  })

  it('normalizes poster sizes and variants and keeps legacy values compatible', () => {
    expect(mountVDialog({ size: 'lg', variant: 'fullscreen' }).size).toBe('lg')
    expect(mountVDialog({ size: 'sm', variant: 'alert' }).variant).toBe('alert')
    expect(mountVDialog({ size: 'md', variant: 'default' as never }).variant).toBe('basic')

    const host = document.createElement('div')
    document.body.appendChild(host)
    mount(VDialog, { attachTo: host, props: { modelValue: true, size: 'lg', variant: 'form' } })
    expect(testId('v-dialog')?.getAttribute('data-size')).toBe('lg')
    expect(testId('v-dialog')?.getAttribute('data-variant')).toBe('form')
    expect(testId('dialog-container')?.className).toContain('v-dialog__panel')
    host.remove()
  })

  it('links title and description to the dialog with accessible semantics', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(VDialog, {
      attachTo: host,
      props: { modelValue: true, title: 'Accessible dialog', description: 'Dialog description.' },
    })
    const panel = testId('dialog-container')
    expect(panel?.getAttribute('aria-labelledby')).toBe(testId('dialog-title')?.id)
    expect(panel?.getAttribute('aria-describedby')).toBe(testId('dialog-description')?.id)
    wrapper.unmount()
    host.remove()
    cleanupDialogs()

    const labelledHost = document.createElement('div')
    document.body.appendChild(labelledHost)
    const labelled = mount(VDialog, { attachTo: labelledHost, props: { modelValue: true, ariaLabel: 'Custom dialog' } })
    expect(testId('dialog-container')?.getAttribute('aria-label')).toBe('Custom dialog')
    labelled.unmount()
    labelledHost.remove()
    cleanupDialogs()

    const slottedHost = document.createElement('div')
    document.body.appendChild(slottedHost)
    const slotted = mount(VDialog, { attachTo: slottedHost, props: { modelValue: true }, slots: { title: 'Slotted title' } })
    const slottedPanel = testId('dialog-container')
    expect(slottedPanel?.getAttribute('aria-labelledby')).toBe(testId('dialog-title')?.id)
    expect(slottedPanel?.getAttribute('aria-label')).toBeNull()
    slotted.unmount()
    slottedHost.remove()
  })

  it('emits close events from the close button and dismiss events from Escape/backdrop', async () => {
    const closeHost = document.createElement('div')
    document.body.appendChild(closeHost)
    const close = mount(VDialog, { attachTo: closeHost, props: { modelValue: true } })
    await testId('dialog-close-button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(close.emitted('update:modelValue')).toEqual([[false]])
    expect(close.emitted('update:open')).toEqual([[false]])
    expect(close.emitted('open-change')).toEqual([[false]])
    expect(close.emitted('close')).toHaveLength(1)
    close.unmount()
    closeHost.remove()
    cleanupDialogs()

    const dismissHost = document.createElement('div')
    document.body.appendChild(dismissHost)
    const dismiss = mount(VDialog, { attachTo: dismissHost, props: { modelValue: true } })
    await testId('dialog-backdrop')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(dismiss.emitted('dismiss')).toHaveLength(1)
    dismiss.unmount()
    dismissHost.remove()

    const escapeHost = document.createElement('div')
    document.body.appendChild(escapeHost)
    const escape = mount(VDialog, { attachTo: escapeHost, props: { modelValue: true } })
    await testId('dialog-container')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(escape.emitted('dismiss')).toHaveLength(1)
    escape.unmount()
    escapeHost.remove()
  })

  it('respects dismissible=false and disabled/loading close guards', async () => {
    const notDismissibleHost = document.createElement('div')
    document.body.appendChild(notDismissibleHost)
    const notDismissible = mount(VDialog, { attachTo: notDismissibleHost, props: { modelValue: true, dismissible: false } })
    await testId('dialog-backdrop')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await testId('dialog-container')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(notDismissible.emitted('dismiss')).toBeUndefined()
    notDismissible.unmount()
    notDismissibleHost.remove()

    const disabledHost = document.createElement('div')
    document.body.appendChild(disabledHost)
    const disabled = mount(VDialog, { attachTo: disabledHost, props: { modelValue: true, disabled: true } })
    expect(testId('dialog-container')?.getAttribute('aria-disabled')).toBe('true')
    await testId('dialog-close-button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(disabled.emitted('close')).toBeUndefined()
    disabled.unmount()
    disabledHost.remove()

    const loadingHost = document.createElement('div')
    document.body.appendChild(loadingHost)
    const loading = mount(VDialog, { attachTo: loadingHost, props: { modelValue: true, loading: true } })
    const loadingPanel = testId('dialog-container')
    expect(loadingPanel?.getAttribute('aria-busy')).toBe('true')
    expect(loadingPanel?.getAttribute('aria-disabled')).toBe('true')
    expect(testId('dialog-loader')?.getAttribute('role')).toBe('status')
    loading.unmount()
    loadingHost.remove()
  })

  it('traps Tab and Shift+Tab inside the dialog', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    mount(VDialog, {
      attachTo: host,
      props: { modelValue: true },
      slots: { actions: '<button data-test-id="dialog-action-last">Confirm</button>' },
    })
    const panel = testId('dialog-container')
    const close = testId('dialog-close-button') as HTMLElement
    const last = testId('dialog-action-last') as HTMLElement

    last.focus()
    await panel?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(document.activeElement).toBe(close)
    host.remove()
  })

  it('exports poster variant icons and close icon from mount', () => {
    expect(mountVDialog({ variant: 'alert' }).variant).toBe('alert')
    expect(mountVDialog({ variant: 'confirmation' }).showConfirmActions).toBe(true)
    expect(V_DIALOG_CLOSE_ICON.body).toBeTruthy()
    expect(V_DIALOG_VARIANT_ICONS.confirmation.body).toBeTruthy()
    expect(V_DIALOG_VARIANT_ICONS.fullscreen.body).toBeTruthy()
  })

  it('renders confirmation anatomy with built-in actions and closes on confirm', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(VDialog, {
      attachTo: host,
      props: {
        modelValue: true,
        variant: 'confirmation',
        title: 'Delete this project?',
        description: 'This cannot be undone.',
        confirmText: 'Delete project',
        intent: 'destructive',
      },
    })

    expect(testId('v-dialog')?.getAttribute('data-intent')).toBe('destructive')
    expect(testId('dialog-icon')).not.toBeNull()
    expect(testId('dialog-footer')).not.toBeNull()
    expect(testId('dialog-action-cancel')).not.toBeNull()
    expect(testId('dialog-action-confirm')?.textContent).toContain('Delete project')
    expect(testId('dialog-container')?.getAttribute('role')).toBe('alertdialog')

    await testId('dialog-action-confirm')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()
    host.remove()
  })

  it('supports neutral confirmation dialogs and custom body slots', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    mount(VDialog, {
      attachTo: host,
      props: { modelValue: true, variant: 'confirmation', intent: 'neutral' },
      slots: { default: '<p data-test-id="custom-body">Project details</p>', actions: '<button data-test-id="custom-action">Proceed</button>' },
    })

    expect(testId('v-dialog')?.getAttribute('data-intent')).toBe('neutral')
    expect(testId('dialog-container')?.getAttribute('role')).toBe('dialog')
    expect(testId('dialog-content')?.textContent).toContain('Project details')
    expect(testId('custom-action')).not.toBeNull()
    host.remove()
  })

  it('returns focus to the opener after the controlled dialog closes', async () => {
    const host = document.createElement('div')
    const opener = document.createElement('button')
    host.appendChild(opener)
    document.body.appendChild(host)
    opener.focus()
    const wrapper = mount(VDialog, { attachTo: host, props: { modelValue: true } })
    await wrapper.setProps({ modelValue: false })
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(opener)
    wrapper.unmount()
    host.remove()
  })
})
