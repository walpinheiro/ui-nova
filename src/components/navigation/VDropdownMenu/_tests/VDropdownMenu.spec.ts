/**
 * @vitest-environment jsdom
 */
import { defineComponent, h } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'
import { provideDropdownGroup } from '../dropdownGroup'
import VDropdownMenu from '../VDropdownMenu.vue'
import type { VDropdownMenuProps } from '../VDropdownMenu.types'

const items = [
  { value: 'view', label: 'View details', icon: 'eye' },
  { value: 'rename', label: 'Rename', icon: 'edit', selected: true },
  { value: 'divider', label: '', divider: true },
  { value: 'delete', label: 'Delete', icon: 'trash', destructive: true },
]

const mountedWrappers: Array<ReturnType<typeof mount>> = []

function mountDropdown(props: VDropdownMenuProps = {}, options = {}) {
  const w = mount(VDropdownMenu, {
    props,
    attachTo: document.body,
    ...options,
  })
  mountedWrappers.push(w)
  return w
}

function menuInBody() {
  return document.body.querySelector('[data-test-id="dropdown-menu"]')
}

afterEach(() => {
  while (mountedWrappers.length) mountedWrappers.pop()?.unmount()
})

describe('VDropdownMenu', () => {
  it('renders and exposes stable test id', () => {
    const w = mountDropdown()
    expect(w.find('[data-test-id="dropdown"]').exists()).toBe(true)
  })

  it('defaults to secondary variant and md size', () => {
    const w = mountDropdown()
    const root = w.get('[data-test-id="dropdown"]')
    expect(root.classes()).toContain('v-dropdown-menu--secondary')
    expect(root.classes()).toContain('v-dropdown-menu--md')
    expect(root.attributes('data-variant')).toBe('secondary')
    expect(root.attributes('data-size')).toBe('md')
  })

  it('renders trigger with label, icon and chevron', () => {
    const w = mountDropdown({ label: 'More options' })
    expect(w.get('[data-test-id="dropdown-trigger"]').text()).toContain('More options')
    expect(w.find('[data-test-id="dropdown-trigger-icon"]').exists()).toBe(true)
    expect(w.find('[data-test-id="dropdown-chevron"]').exists()).toBe(true)
  })

  it('opens menu on trigger click and exposes menu role', async () => {
    const w = mountDropdown({ items })
    await w.get('[data-test-id="dropdown-trigger"]').element.click()
    expect(menuInBody()).toBeTruthy()
    expect(w.get('[data-test-id="dropdown-trigger"]').attributes('aria-expanded')).toBe('true')
    expect(document.body.querySelectorAll('[role="menuitem"]').length).toBe(3)
  })

  it('emits select and closes on item click', async () => {
    const w = mountDropdown({ items })
    await w.get('[data-test-id="dropdown-trigger"]').element.click()
    await (document.body.querySelector('[data-test-id="dropdown-item-view"]') as HTMLElement).click()
    expect(w.emitted('select')).toEqual([['view']])
    expect(w.emitted('open-change')).toContainEqual([false])
    expect(menuInBody()).toBeFalsy()
  })

  it('supports all 4 variants and 3 sizes', () => {
    for (const variant of ['secondary', 'primary', 'ghost', 'destructive'] as const) {
      const w = mountDropdown({ variant })
      expect(w.get('[data-test-id="dropdown"]').classes()).toContain(`v-dropdown-menu--${variant}`)
    }
    for (const size of ['sm', 'md', 'lg'] as const) {
      const w = mountDropdown({ size })
      expect(w.get('[data-test-id="dropdown"]').classes()).toContain(`v-dropdown-menu--${size}`)
    }
  })

  it('maps legacy default/subtle variants', () => {
    const secondary = mountDropdown({ variant: 'default' as never })
    expect(secondary.get('[data-test-id="dropdown"]').attributes('data-variant')).toBe('secondary')
    const ghost = mountDropdown({ variant: 'subtle' as never })
    expect(ghost.get('[data-test-id="dropdown"]').attributes('data-variant')).toBe('ghost')
  })

  it('renders separator and destructive item markers', async () => {
    const w = mountDropdown({ items })
    await w.get('[data-test-id="dropdown-trigger"]').element.click()
    expect(document.body.querySelector('[data-test-id="dropdown-separator"]')).toBeTruthy()
    expect(document.body.querySelector('[data-test-id="dropdown-item-destructive"]')).toBeTruthy()
    expect(document.body.querySelector('[data-test-id="dropdown-item-selected"]')).toBeTruthy()
  })

  it('opens submenu on parent item with children', async () => {
    const w = mountDropdown({
      items: [
        {
          value: 'share',
          label: 'Share',
          icon: 'share',
          children: [{ value: 'copy-link', label: 'Copy link', icon: 'link' }],
        },
      ],
    })
    await w.get('[data-test-id="dropdown-trigger"]').element.click()
    const share = new DOMWrapper(document.body.querySelector('[data-test-id="dropdown-item-share"]')!)
    await share.trigger('click')
    expect(document.body.querySelector('[data-test-id="dropdown-submenu"]')).toBeTruthy()
    expect(document.body.querySelector('[data-test-id="dropdown-item-copy-link"]')).toBeTruthy()
  })

  it('opens with Enter/Space/ArrowDown on trigger', async () => {
    const w = mountDropdown({ items })
    await w.get('[data-test-id="dropdown-trigger"]').trigger('keydown', { key: 'Enter' })
    expect(menuInBody()).toBeTruthy()
    await w.get('[data-test-id="dropdown-trigger"]').element.click()
    await w.get('[data-test-id="dropdown-trigger"]').trigger('keydown', { key: ' ' })
    expect(menuInBody()).toBeTruthy()
    await w.get('[data-test-id="dropdown-trigger"]').trigger('click')
    await w.get('[data-test-id="dropdown-trigger"]').trigger('keydown', { key: 'ArrowDown' })
    expect(menuInBody()).toBeTruthy()
  })

  it('closes with Escape and returns focus semantics via aria-expanded', async () => {
    const w = mountDropdown({ items })
    const trigger = w.get('[data-test-id="dropdown-trigger"]')
    await trigger.element.click()
    await trigger.trigger('keydown', { key: 'Escape' })
    expect(menuInBody()).toBeFalsy()
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('supports disabled and loading states', () => {
    const disabled = mountDropdown({ disabled: true })
    expect(disabled.get('[data-test-id="dropdown-trigger"]').attributes('aria-disabled')).toBe('true')
    const loading = mountDropdown({ loading: true })
    expect(loading.get('[data-test-id="dropdown-trigger"]').attributes('aria-busy')).toBe('true')
    expect(loading.find('[data-test-id="dropdown-loader"]').exists()).toBe(true)
  })

  it('respects modelValue for open state', async () => {
    const w = mountDropdown({ items, modelValue: true })
    expect(menuInBody()).toBeTruthy()
    await w.setProps({ modelValue: false })
    expect(menuInBody()).toBeFalsy()
  })

  it('emits update:modelValue and open-change when toggled', async () => {
    const w = mountDropdown({ items })
    await w.get('[data-test-id="dropdown-trigger"]').element.click()
    expect(w.emitted('update:modelValue')).toContainEqual([true])
    expect(w.emitted('open-change')).toContainEqual([true])
  })

  it('supports custom trigger slot', () => {
    const w = mount(VDropdownMenu, {
      slots: {
        trigger: () => h('button', { 'data-test-id': 'custom-trigger' }, 'Custom'),
      },
    })
    expect(w.find('[data-test-id="custom-trigger"]').exists()).toBe(true)
    expect(w.find('[data-test-id="dropdown-trigger"]').exists()).toBe(false)
  })

  it('exposes ARIA label from ariaLabel', () => {
    const w = mountDropdown({ ariaLabel: 'Actions menu' })
    expect(w.get('[data-test-id="dropdown-trigger"]').attributes('aria-label')).toBe('Actions menu')
  })

  it('teleports menu to body with placement metadata', async () => {
    const w = mountDropdown({ items })
    await w.get('[data-test-id="dropdown-trigger"]').element.click()
    const menu = menuInBody()
    expect(menu).toBeTruthy()
    expect(menu?.getAttribute('data-placement')).toMatch(/^(bottom|top)-(start|end)$/)
  })

  it('closes sibling dropdown when another opens in the same group', async () => {
    const Host = defineComponent({
      setup() {
        provideDropdownGroup()
        return () => h('div', [
          h(VDropdownMenu, { items, label: 'First' }),
          h(VDropdownMenu, { items, label: 'Second' }),
        ])
      },
    })
    const w = mount(Host, { attachTo: document.body })
    mountedWrappers.push(w)
    const triggers = w.findAll('[data-test-id="dropdown-trigger"]')
    await triggers[0].element.click()
    expect(document.body.querySelectorAll('[data-test-id="dropdown-menu"]').length).toBe(1)
    await triggers[1].element.click()
    expect(document.body.querySelectorAll('[data-test-id="dropdown-menu"]').length).toBe(1)
    expect(triggers[0].attributes('aria-expanded')).toBe('false')
    expect(triggers[1].attributes('aria-expanded')).toBe('true')
  })
})
