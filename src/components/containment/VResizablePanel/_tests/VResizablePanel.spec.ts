/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VResizablePanel from '../VResizablePanel.vue'

describe('VResizablePanel', () => {
  it('renders and exposes stable test id with spec variant/orientation', () => {
    const w = mount(VResizablePanel)
    const root = w.find('[data-test-id="v-resizable-panel"]')
    expect(root.exists()).toBe(true)
    expect(root.attributes('data-variant')).toBe('left')
    expect(root.attributes('data-orientation')).toBe('vertical')
  })

  it('renders default slot content inside surface/content anatomy', () => {
    const w = mount(VResizablePanel, { slots: { default: 'Panel content' } })
    expect(w.find('[data-test-id="v-resizable-panel-surface"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-resizable-panel-content"]').text()).toContain('Panel content')
    expect(w.find('[data-test-id="v-resizable-panel-edge"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-resizable-panel-handle"]').exists()).toBe(true)
    expect(w.find('.v-resizable-panel__handle-grip').exists()).toBe(true)
  })

  it('applies spec size presets as live px width (sm 240 / md 320 / lg 480)', () => {
    const sm = mount(VResizablePanel, { props: { size: 'sm' } })
    const md = mount(VResizablePanel, { props: { size: 'md' } })
    const lg = mount(VResizablePanel, { props: { size: 'lg' } })
    expect((sm.find('[data-test-id="v-resizable-panel"]').element as HTMLElement).style.width).toBe('240px')
    expect((md.find('[data-test-id="v-resizable-panel"]').element as HTMLElement).style.width).toBe('320px')
    expect((lg.find('[data-test-id="v-resizable-panel"]').element as HTMLElement).style.width).toBe('480px')
  })

  it('supports numeric v-model:size with min/max clamp', () => {
    const w = mount(VResizablePanel, { props: { size: 600, min: 200, max: 480 } })
    expect((w.find('[data-test-id="v-resizable-panel"]').element as HTMLElement).style.width).toBe('480px')
  })

  it('applies spec variants left/right/bottom/collapsible', () => {
    for (const variant of ['left', 'right', 'bottom', 'collapsible'] as const) {
      const w = mount(VResizablePanel, { props: { variant } })
      const root = w.find('[data-test-id="v-resizable-panel"]')
      expect(root.classes()).toContain(`v-resizable-panel--${variant}`)
      expect(root.attributes('data-variant')).toBe(variant)
    }
  })

  it('exposes focusable separator handle with ARIA value semantics', () => {
    const w = mount(VResizablePanel, { props: { size: 320, min: 200, max: 480 } })
    const handle = w.find('[data-test-id="v-resizable-panel-handle"]')
    expect(handle.attributes('role')).toBe('separator')
    expect(handle.attributes('tabindex')).toBe('0')
    expect(handle.attributes('aria-orientation')).toBe('vertical')
    expect(handle.attributes('aria-valuemin')).toBe('200')
    expect(handle.attributes('aria-valuemax')).toBe('480')
    expect(handle.attributes('aria-valuenow')).toBe('320')
    expect(handle.attributes('aria-valuetext')).toBe('320px')
  })

  it('horizontal orientation announces row semantics and sizes height', () => {
    const w = mount(VResizablePanel, { props: { orientation: 'horizontal', size: 240 } })
    const handle = w.find('[data-test-id="v-resizable-panel-handle"]')
    expect(handle.attributes('aria-orientation')).toBe('horizontal')
    expect((w.find('[data-test-id="v-resizable-panel"]').element as HTMLElement).style.height).toBe('240px')
  })

  it('keyboard arrows adjust size and emit update:size; Home/End jump to min/max', async () => {
    const w = mount(VResizablePanel, { props: { size: 320, min: 200, max: 480 } })
    const handle = w.find('[data-test-id="v-resizable-panel-handle"]')
    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:size')?.[0]).toEqual([336])
    await handle.trigger('keydown', { key: 'Home' })
    const homeEmits = w.emitted('update:size') ?? []
    expect(homeEmits[homeEmits.length - 1]).toEqual([200])
    await handle.trigger('keydown', { key: 'End' })
    const endEmits = w.emitted('update:size') ?? []
    expect(endEmits[endEmits.length - 1]).toEqual([480])
  })

  it('drag pointerdown/move resizes live and pointerup emits update:size', async () => {
    const w = mount(VResizablePanel, { props: { size: 320, min: 200, max: 480 } })
    const handle = w.find('[data-test-id="v-resizable-panel-handle"]')
    await handle.trigger('pointerdown', { clientX: 100, preventDefault: () => { } })
    await handle.trigger('pointermove', { clientX: 150 })
    const root = w.find('[data-test-id="v-resizable-panel"]')
    expect((root.element as HTMLElement).style.width).toBe('370px')
    expect(root.classes()).toContain('v-resizable-panel--dragging')
    expect(handle.classes()).toContain('v-resizable-panel__handle--dragging')
    await handle.trigger('pointerup')
    const dragEmits = w.emitted('update:size') ?? []
    expect(dragEmits[dragEmits.length - 1]).toEqual([370])
  })

  it('bottom panel drag increases height when handle moves down', async () => {
    const w = mount(VResizablePanel, { props: { variant: 'bottom', orientation: 'horizontal', size: 240, min: 120, max: 360 } })
    const handle = w.find('[data-test-id="v-resizable-panel-handle"]')
    await handle.trigger('pointerdown', { clientY: 100, preventDefault: () => { } })
    await handle.trigger('pointermove', { clientY: 140 })
    expect((w.find('[data-test-id="v-resizable-panel"]').element as HTMLElement).style.height).toBe('280px')
  })

  it('right panel drag decreases width when handle moves right', async () => {
    const w = mount(VResizablePanel, { props: { variant: 'right', size: 320, min: 200, max: 480 } })
    const handle = w.find('[data-test-id="v-resizable-panel-handle"]')
    await handle.trigger('pointerdown', { clientX: 100, preventDefault: () => { } })
    await handle.trigger('pointermove', { clientX: 150 })
    expect((w.find('[data-test-id="v-resizable-panel"]').element as HTMLElement).style.width).toBe('270px')
  })

  it('collapse trigger toggles with aria-expanded and collapse/expand events', async () => {
    const w = mount(VResizablePanel, { props: { collapsible: true } })
    const trigger = w.find('[data-test-id="v-resizable-panel-collapse-trigger"]')
    expect(trigger.exists()).toBe(true)
    expect(trigger.attributes('aria-expanded')).toBe('true')
    await trigger.trigger('click')
    expect(w.emitted('collapse')).toBeTruthy()
    expect(w.find('[data-test-id="v-resizable-panel"]').attributes('data-state')).toBe('collapsed')
    expect(w.find('[data-test-id="v-resizable-panel-collapse-trigger"]').exists()).toBe(false)
    expect(w.find('.v-resizable-panel__handle-icon').exists()).toBe(true)
    await w.find('[data-test-id="v-resizable-panel-handle"]').trigger('pointerdown', { preventDefault: () => { } })
    expect(w.emitted('expand')).toBeTruthy()
  })

  it('shows collapse trigger for left variant when collapsible is enabled', () => {
    const w = mount(VResizablePanel, { props: { variant: 'left', collapsible: true } })
    expect(w.find('[data-test-id="v-resizable-panel-collapse-trigger"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-resizable-panel"]').classes()).toContain('v-resizable-panel--has-collapse')
  })

  it('uses variant-aware collapse chevrons', () => {
    const left = mount(VResizablePanel, { props: { variant: 'left', collapsible: true } })
    expect(left.find('[data-test-id="v-resizable-panel-collapse-trigger"] .v-icon').exists()).toBe(true)
    const right = mount(VResizablePanel, { props: { variant: 'right', collapsible: true } })
    expect(right.find('[data-test-id="v-resizable-panel-collapse-trigger"] .v-icon').exists()).toBe(true)
  })

  it('announces size changes through aria-live region', async () => {
    const w = mount(VResizablePanel, { props: { size: 320, min: 200, max: 480 } })
    const live = w.find('[data-test-id="v-resizable-panel-live"]')
    expect(live.attributes('aria-live')).toBe('polite')
    await w.find('[data-test-id="v-resizable-panel-handle"]').trigger('keydown', { key: 'ArrowRight' })
    expect(live.text()).toBe('Panel size 336 pixels')
  })

  it('renders drag tooltip and min/max limit markers', () => {
    const w = mount(VResizablePanel)
    expect(w.find('[data-test-id="v-resizable-panel-drag-tooltip"]').text()).toBe('Drag to resize')
    expect(w.find('[data-test-id="v-resizable-panel-min"]').exists()).toBe(true)
    expect(w.find('[data-test-id="v-resizable-panel-max"]').exists()).toBe(true)
  })

  it('supports disabled state', () => {
    const w = mount(VResizablePanel, { props: { disabled: true } })
    const root = w.find('[data-test-id="v-resizable-panel"]')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(w.find('[data-test-id="v-resizable-panel-handle"]').attributes('tabindex')).toBe(undefined)
  })

  it('supports loading state with loader and aria-busy', () => {
    const w = mount(VResizablePanel, { props: { loading: true } })
    const root = w.find('[data-test-id="v-resizable-panel"]')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(root.classes()).toContain('v-resizable-panel--loading')
    expect(w.find('[data-test-id="v-resizable-panel-loader"]').exists()).toBe(true)
  })

  it('exposes ARIA label from ariaLabel', () => {
    const w = mount(VResizablePanel, { props: { ariaLabel: 'Resizable' } })
    expect(w.find('[data-test-id="v-resizable-panel"]').attributes('aria-label')).toBe('Resizable')
  })
})
