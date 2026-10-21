import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import type { VDashboardWidgetGridContext, VDashboardWidgetProps } from './VDashboardWidgetGrid.types'
import { DASHBOARD_WIDGET_GRID_KEY } from './VDashboardWidgetGrid.types'

export function useVDashboardWidget(
  props: VDashboardWidgetProps,
  emit: (event: 'close' | 'move' | 'resize', ...args: unknown[]) => void,
) {
  const grid = inject<VDashboardWidgetGridContext | null>(DASHBOARD_WIDGET_GRID_KEY, null)
  const dragging = ref(false)
  const resizing = ref(false)
  const offset = ref({ x: 0, y: 0 })

  const widgetId = computed(() => props.id ?? props.title?.toLowerCase().replace(/\s+/g, '-') ?? 'widget')

  const propRect = () => ({
    id: widgetId.value,
    x: props.x ?? 0,
    y: props.y ?? 0,
    w: props.w ?? 2,
    h: props.h ?? 2,
    title: props.title,
    locked: props.locked,
    disabled: props.disabled,
  })

  const unregister = grid?.register(propRect())
  watch(
    () => [props.x, props.y, props.w, props.h, props.locked, props.disabled, props.title],
    () => grid?.syncFromProps(propRect()),
  )
  onBeforeUnmount(() => {
    unregister?.()
    if (grid?.draggingId === widgetId.value) grid.setDraggingId(null)
  })

  /** Resolved cell: the grid owns placement (collisions, responsive columns); props are the fallback. */
  const rect = computed(() => grid?.getRect(widgetId.value) ?? { x: props.x ?? 0, y: props.y ?? 0, w: props.w ?? 2, h: props.h ?? 2 })
  const isLocked = computed(() => Boolean(props.locked || (rect.value as { locked?: boolean }).locked))

  const gridStyle = computed(() => ({
    gridColumn: `${rect.value.x + 1} / span ${rect.value.w}`,
    gridRow: `${rect.value.y + 1} / span ${rect.value.h}`,
    ...(dragging.value ? { transform: `translate(${offset.value.x}px, ${offset.value.y}px)` } : null),
  }))

  const rootAttrs = computed(() => ({
    class: [
      'v-dashboard-widget',
      props.disabled ? 'v-dashboard-widget--disabled' : null,
      isLocked.value ? 'v-dashboard-widget--locked' : null,
      props.focused ? 'v-dashboard-widget--focused' : null,
      dragging.value ? 'v-dashboard-widget--dragging' : null,
      resizing.value ? 'v-dashboard-widget--resizing' : null,
      grid?.editMode && !isLocked.value ? 'v-dashboard-widget--editable' : null,
    ],
    role: 'gridcell',
    tabindex: props.disabled ? -1 : 0,
    'data-test-id': `v-dashboard-widget-${widgetId.value}`,
    'data-x': String(rect.value.x),
    'data-y': String(rect.value.y),
    'data-w': String(rect.value.w),
    'data-h': String(rect.value.h),
    'data-dragging': dragging.value ? 'true' : undefined,
    'data-resizing': resizing.value ? 'true' : undefined,
    'data-focused': props.focused ? 'true' : undefined,
    'data-locked': isLocked.value ? 'true' : undefined,
    'aria-label': props.title ?? 'Dashboard widget',
    'aria-disabled': props.disabled || undefined,
    style: gridStyle.value,
  }))

  const canEdit = () => Boolean(grid?.editMode) && !props.disabled && !isLocked.value

  let start = { x: 0, y: 0, w: 0, h: 0, px: 0, py: 0, cw: 80, ch: 128 }

  function begin(event: PointerEvent) {
    const cell = grid!.cellSize()
    start = { x: rect.value.x, y: rect.value.y, w: rect.value.w, h: rect.value.h, px: event.clientX, py: event.clientY, cw: cell.w, ch: cell.h }
    ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  }

  function release(event: PointerEvent) {
    try {
      ;(event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId)
    } catch {
      /* noop */
    }
  }

  function onDragStart(event: PointerEvent) {
    if (!canEdit() || !grid) return
    event.preventDefault()
    dragging.value = true
    offset.value = { x: 0, y: 0 }
    grid.setDraggingId(widgetId.value)
    begin(event)
  }

  function onDragMove(event: PointerEvent) {
    if (!dragging.value || !grid) return
    const dx = event.clientX - start.px
    const dy = event.clientY - start.py
    grid.update(widgetId.value, {
      x: start.x + Math.round(dx / start.cw),
      y: start.y + Math.round(dy / start.ch),
    })
    // Residual keeps the card glued to the pointer between snap steps.
    offset.value = {
      x: dx - (rect.value.x - start.x) * start.cw,
      y: dy - (rect.value.y - start.y) * start.ch,
    }
  }

  function onDragEnd(event: PointerEvent) {
    if (!dragging.value) return
    dragging.value = false
    offset.value = { x: 0, y: 0 }
    grid?.setDraggingId(null)
    grid?.commit()
    emit('move', { x: rect.value.x, y: rect.value.y })
    release(event)
  }

  function onResizeStart(event: PointerEvent) {
    if (!canEdit() || !grid) return
    event.preventDefault()
    event.stopPropagation()
    resizing.value = true
    begin(event)
  }

  function onResizeMove(event: PointerEvent) {
    if (!resizing.value || !grid) return
    grid.update(widgetId.value, {
      w: start.w + Math.round((event.clientX - start.px) / start.cw),
      h: start.h + Math.round((event.clientY - start.py) / start.ch),
    })
  }

  function onResizeEnd(event: PointerEvent) {
    if (!resizing.value) return
    resizing.value = false
    grid?.commit()
    emit('resize', { w: rect.value.w, h: rect.value.h })
    release(event)
  }

  /** Edit mode keyboard: arrows move, Shift+arrows resize. */
  function onKeydown(event: KeyboardEvent) {
    if (!grid || event.target !== event.currentTarget || !canEdit()) return
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }
    const step = d[event.key]
    if (!step) return
    event.preventDefault()
    const r = rect.value
    if (event.shiftKey) {
      if (!grid.update(widgetId.value, { w: r.w + step[0], h: r.h + step[1] })) return
      grid.commit()
      emit('resize', { w: rect.value.w, h: rect.value.h })
    } else {
      if (!grid.update(widgetId.value, { x: r.x + step[0], y: r.y + step[1] })) return
      grid.commit()
      emit('move', { x: rect.value.x, y: rect.value.y })
    }
  }

  return {
    grid,
    widgetId,
    rect,
    isLocked,
    dragging,
    resizing,
    rootAttrs,
    onDragStart,
    onDragMove,
    onDragEnd,
    onResizeStart,
    onResizeMove,
    onResizeEnd,
    onKeydown,
    onClose: () => emit('close'),
  }
}

