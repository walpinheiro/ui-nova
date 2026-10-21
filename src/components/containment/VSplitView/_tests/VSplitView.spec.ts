// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VSplitView from '../VSplitView.vue'

describe('VSplitView', () => {
  it('renders root, track, 2 panes + 1 divider with stable test ids', () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1] } })
    expect(w.find('[data-test-id="v-split-view"]').exists()).toBe(true)
    const root = w.get('[data-test-id="v-split-view"]')
    expect(root.attributes('role')).toBe('group')
    expect(root.attributes('aria-label')).toBe('Split view')
    expect(root.attributes('data-orientation')).toBe('vertical')
    expect(w.get('[data-test-id="v-split-view-track"]').element.tagName).toBe('DIV')
    expect(w.get('[data-test-id="v-split-view-pane-start"]').text()).toContain('Sidebar Pane')
    expect(w.get('[data-test-id="v-split-view-pane-center"]').text()).toContain('Content Pane')
    expect(w.get('[data-test-id="v-split-view-divider-0"]').attributes('role')).toBe('separator')
  })

  it('renders 3 panes for three sizes', () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1, 320] } })
    expect(w.get('[data-test-id="v-split-view-pane-end"]').text()).toContain('Inspector Pane')
    expect(w.findAll('[data-test-id^="v-split-view-divider-"]')).toHaveLength(2)
  })

  it('applies horizontal orientation and fixed mode attrs', () => {
    const w = mount(VSplitView, { props: { orientation: 'horizontal', mode: 'fixed', collapsible: false } })
    expect(w.get('[data-test-id="v-split-view"]').attributes('data-orientation')).toBe('horizontal')
    expect(w.get('[data-test-id="v-split-view"]').attributes('data-mode')).toBe('fixed')
    expect(w.get('[data-test-id="v-split-view-divider-0"]').attributes('aria-orientation')).toBe('horizontal')
    expect(w.get('[data-test-id="v-split-view-divider-0"]').attributes('aria-disabled')).toBe('true')
  })

  it('exposes separator a11y range attrs', () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1], minSize: 200, maxSize: 600 } })
    const divider = w.get('[data-test-id="v-split-view-divider-0"]')
    expect(divider.attributes('aria-valuemin')).toBe('200')
    expect(divider.attributes('aria-valuemax')).toBe('600')
    expect(divider.attributes('aria-valuenow')).toBe('280')
    expect(divider.attributes('aria-label')).toBe('Redimensionar paineis 1 e 2')
  })

  it('supports disabled state', () => {
    const w = mount(VSplitView, { props: { disabled: true } })
    const root = w.get('[data-test-id="v-split-view"]')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.classes()).toContain('v-split-view--disabled')
  })

  it('emits update:sizes + resize on arrow key nudge', async () => {
    const w = mount(VSplitView, { props: { sizes: [280, 400] } })
    await w.get('[data-test-id="v-split-view-divider-0"]').trigger('keydown.right')
    const updates = w.emitted('update:sizes')
    const resizes = w.emitted('resize')
    expect(updates?.[0]?.[0]).toEqual([304, 376])
    expect(resizes?.[0]?.[0]).toEqual([304, 376])
  })

  it('defaults to resizable mode with collapsible opt-in (no collapse button)', () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1] } })
    expect(w.get('[data-test-id="v-split-view"]').attributes('data-mode')).toBe('resizable')
    expect(w.find('[data-test-id="v-split-view-collapse-0"]').exists()).toBe(false)
  })

  it('shows collapse button only when collapsible opt-in', () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1], collapsible: true } })
    expect(w.find('[data-test-id="v-split-view-collapse-0"]').exists()).toBe(true)
    const modeW = mount(VSplitView, { props: { sizes: [280, 1], mode: 'collapsible' } })
    expect(modeW.find('[data-test-id="v-split-view-collapse-0"]').exists()).toBe(true)
  })

  it('emits collapse/expand on toggle via Enter and double click', async () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1], collapsible: true } })
    const divider = w.get('[data-test-id="v-split-view-divider-0"]')
    await divider.trigger('keydown.enter')
    expect(w.emitted('collapse')?.[0]).toEqual([0])
    expect(w.get('[data-test-id="v-split-view-pane-start"]').attributes('data-collapsed')).toBe('true')
    await divider.trigger('dblclick')
    expect(w.emitted('expand')?.[0]).toEqual([0])
  })

  it('emits collapse via collapse button click', async () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1], collapsible: true } })
    expect(w.find('[data-test-id="v-split-view-collapse-0"]').exists()).toBe(true)
    await w.get('[data-test-id="v-split-view-collapse-0"]').trigger('click')
    expect(w.emitted('collapse')?.[0]).toEqual([0])
  })

  it('applies pressed + dragging divider classes on drag lifecycle', async () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1] } })
    const divider = w.get('[data-test-id="v-split-view-divider-0"]')
    await divider.trigger('pointerdown')
    expect(w.find('.v-split-view__divider--dragging').exists()).toBe(true)
    expect(w.find('.v-split-view__divider--pressed').exists()).toBe(true)
    expect(w.find('.v-split-view--dragging').exists()).toBe(true)
    expect(w.find('[data-test-id="v-split-view-handle-0"]').exists()).toBe(true)
    await divider.trigger('pointerup')
    expect(w.find('.v-split-view__divider--dragging').exists()).toBe(false)
  })

  it('exposes orientation/mode/sizes contract on mount config', async () => {
    const w = mount(VSplitView, {
      props: { orientation: 'horizontal', mode: 'collapsible', sizes: [280, 1, 320], minSize: 200, maxSize: 600 },
    })
    const root = w.get('[data-test-id="v-split-view"]')
    expect(root.attributes('data-orientation')).toBe('horizontal')
    expect(root.attributes('data-mode')).toBe('collapsible')
    expect(w.findAll('[data-pane-index]')).toHaveLength(3)
    expect(w.findAll('[data-test-id^="v-split-view-divider-"]')).toHaveLength(2)
    expect(w.findAll('[data-test-id^="v-split-view-handle-"]')).toHaveLength(2)
    expect(w.get('[data-test-id="v-split-view-track"]').attributes('style')).toContain('grid-template-rows')
    const divider = w.get('[data-test-id="v-split-view-divider-0"]')
    expect(divider.attributes('aria-orientation')).toBe('horizontal')
    expect(divider.attributes('aria-valuemin')).toBe('200')
    expect(divider.attributes('aria-valuemax')).toBe('600')
  })

  it('ignores keyboard resize when mode is fixed', async () => {
    const w = mount(VSplitView, { props: { sizes: [280, 400], mode: 'fixed' } })
    await w.get('[data-test-id="v-split-view-divider-0"]').trigger('keydown.right')
    expect(w.emitted('update:sizes')).toBeUndefined()
  })

  it('filters arrow keys by orientation: vertical ignores Up/Down, horizontal ignores Left/Right', async () => {
    const vertical = mount(VSplitView, { props: { sizes: [280, 400] } })
    await vertical.get('[data-test-id="v-split-view-divider-0"]').trigger('keydown.up')
    await vertical.get('[data-test-id="v-split-view-divider-0"]').trigger('keydown.down')
    expect(vertical.emitted('update:sizes')).toBeUndefined()
    const horizontal = mount(VSplitView, { props: { orientation: 'horizontal', sizes: [280, 400] } })
    await horizontal.get('[data-test-id="v-split-view-divider-0"]').trigger('keydown.left')
    await horizontal.get('[data-test-id="v-split-view-divider-0"]').trigger('keydown.right')
    expect(horizontal.emitted('update:sizes')).toBeUndefined()
  })

  it('resizes horizontal with Up/Down and jumps Home/End to min/max', async () => {
    const w = mount(VSplitView, { props: { orientation: 'horizontal', sizes: [280, 400] } })
    const divider = w.get('[data-test-id="v-split-view-divider-0"]')
    await divider.trigger('keydown.up')
    expect(w.emitted('update:sizes')?.[0]?.[0]).toEqual([256, 424])
    await divider.trigger('keydown.home')
    expect(w.emitted('update:sizes')?.[1]?.[0]).toEqual([200, 480])
    await divider.trigger('keydown.end')
    expect(w.emitted('update:sizes')?.[2]?.[0]).toEqual([600, 200])
  })

  it('announces aria-expanded=false when collapsed', async () => {
    const w = mount(VSplitView, { props: { sizes: [280, 1], collapsible: true } })
    const divider = w.get('[data-test-id="v-split-view-divider-0"]')
    expect(divider.attributes('aria-expanded')).toBeUndefined()
    await divider.trigger('keydown.enter')
    expect(w.get('[data-test-id="v-split-view-divider-0"]').attributes('aria-expanded')).toBe('false')
  })

  it('emits live update:sizes + resize on window pointermove during drag, stops on pointerup', async () => {
    const w = mount(VSplitView, { props: { sizes: [280, 400] } })
    const divider = w.get('[data-test-id="v-split-view-divider-0"]')
    await divider.trigger('pointerdown', { clientX: 100 })
    expect(w.emitted('update:sizes')).toBeUndefined()
    const move = new window.Event('pointermove', { bubbles: true }) as Event & { clientX: number }
    move.clientX = 124
    window.dispatchEvent(move)
    await w.vm.$nextTick()
    expect(w.emitted('update:sizes')?.[0]?.[0]).toEqual([304, 376])
    expect(w.emitted('resize')?.[0]?.[0]).toEqual([304, 376])
    window.dispatchEvent(new window.Event('pointerup', { bubbles: true }))
    await w.vm.$nextTick()
    expect(w.find('.v-split-view__divider--dragging').exists()).toBe(false)
  })

  it('applies drag delta from drag start, not cumulatively from each move', async () => {
    const w = mount(VSplitView, { props: { sizes: [280, 400] } })
    const divider = w.get('[data-test-id="v-split-view-divider-0"]')
    await divider.trigger('pointerdown', { clientX: 100 })
    const move1 = new window.Event('pointermove', { bubbles: true }) as Event & { clientX: number }
    move1.clientX = 124
    window.dispatchEvent(move1)
    await w.vm.$nextTick()
    const move2 = new window.Event('pointermove', { bubbles: true }) as Event & { clientX: number }
    move2.clientX = 148
    window.dispatchEvent(move2)
    await w.vm.$nextTick()
    expect(w.emitted('update:sizes')?.[1]?.[0]).toEqual([328, 352])
  })

  it('renders start/default/end slot aliases', () => {
    const w = mount(VSplitView, {
      props: { sizes: [280, 1, 320] },
      slots: {
        start: '<div data-test-id="slot-start">Start slot</div>',
        default: '<div data-test-id="slot-default">Default slot</div>',
        end: '<div data-test-id="slot-end">End slot</div>',
      },
    })
    expect(w.get('[data-test-id="slot-start"]').text()).toBe('Start slot')
    expect(w.get('[data-test-id="slot-default"]').text()).toBe('Default slot')
    expect(w.get('[data-test-id="slot-end"]').text()).toBe('End slot')
  })

  it('persists sizes to localStorage when persistKey is set', async () => {
    const key = 'v-split-test-persist'
    window.localStorage.removeItem(key)
    const w = mount(VSplitView, { props: { sizes: [280, 400], persistKey: key } })
    await w.get('[data-test-id="v-split-view-divider-0"]').trigger('keydown.right')
    expect(JSON.parse(window.localStorage.getItem(key) ?? '[]')).toEqual([304, 376])
    const restored = mount(VSplitView, { props: { persistKey: key } })
    expect(restored.get('[data-test-id="v-split-view-divider-0"]').attributes('aria-valuenow')).toBe('304')
    window.localStorage.removeItem(key)
  })
})
