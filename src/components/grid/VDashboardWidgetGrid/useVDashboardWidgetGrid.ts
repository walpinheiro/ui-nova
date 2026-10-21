import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, shallowRef, watch } from 'vue'
import type { VDashboardWidgetGridContext, VDashboardWidgetGridProps, VDashboardWidgetLayoutItem } from './VDashboardWidgetGrid.types'
import { DASHBOARD_WIDGET_GRID_KEY } from './VDashboardWidgetGrid.types'
import { mountVDashboardWidgetGrid } from './mountVDashboardWidgetGrid'
import { resolveCols, resolveGapCss } from '../shared/gridUtils'
import { resolveLayout, type WidgetRect } from './layoutEngine'

export function useVDashboardWidgetGrid(
  props: VDashboardWidgetGridProps,
  emit: (event: 'update:layout' | 'update:editMode' | 'add', ...args: unknown[]) => void,
) {
  const config = computed(() => mountVDashboardWidgetGrid(props))
  const editMode = ref(Boolean(props.editMode))
  const draggingId = ref<string | null>(null)
  const canvasEl = ref<HTMLElement | null>(null)
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

  watch(() => props.editMode, (v) => {
    if (v !== undefined) editMode.value = v
  })

  function toggleEditMode() {
    editMode.value = !editMode.value
    emit('update:editMode', editMode.value)
  }

  /** Responsive column count, resolved against the grid's own width. */
  const cols = computed(() => resolveCols(props.cols ?? 12, width.value))
  const freeform = computed(() => false) // vertical gravity always on: no floating gaps after moves/removals

  // --- layout state ---------------------------------------------------------
  const items = shallowRef<VDashboardWidgetLayoutItem[]>([])
  const registered = ref<Set<string>>(new Set())

  function upsert(rect: VDashboardWidgetLayoutItem) {
    const next = items.value.slice()
    const idx = next.findIndex((i) => i.id === rect.id)
    if (idx >= 0) next[idx] = { ...next[idx], ...rect }
    else next.push({ ...rect })
    items.value = next
  }

  watch(
    () => props.layout,
    (layout) => {
      if (!layout) return
      for (const item of layout) upsert(item)
    },
    { immediate: true, deep: true },
  )

  const activeItems = computed(() => items.value.filter((i) => registered.value.has(i.id)))
  const placed = computed(() => {
    const result = resolveLayout(activeItems.value as WidgetRect[], cols.value, { freeform: freeform.value }) ?? []
    return new Map(result.map((r) => [r.id, r]))
  })

  function serialize(): VDashboardWidgetLayoutItem[] {
    return activeItems.value.map((i) => {
      const p = placed.value.get(i.id)
      return { ...i, x: p?.x ?? i.x, y: p?.y ?? i.y, w: p?.w ?? i.w, h: p?.h ?? i.h }
    })
  }

  function register(rect: VDashboardWidgetLayoutItem) {
    const existing = items.value.find((i) => i.id === rect.id)
    // A controlled `layout` entry wins over the widget's own x/y/w/h props.
    if (existing && props.layout?.some((l) => l.id === rect.id)) {
      upsert({ ...existing, locked: rect.locked || existing.locked, disabled: rect.disabled || existing.disabled, title: rect.title ?? existing.title })
    } else {
      upsert(rect)
    }
    registered.value = new Set(registered.value).add(rect.id)
    return () => {
      const s = new Set(registered.value)
      s.delete(rect.id)
      registered.value = s
      items.value = items.value.filter((i) => i.id !== rect.id)
    }
  }

  function syncFromProps(rect: VDashboardWidgetLayoutItem) {
    if (props.layout?.some((l) => l.id === rect.id)) return
    upsert(rect)
  }

  function update(id: string, patch: Partial<{ x: number; y: number; w: number; h: number }>) {
    const base = serialize()
    const target = base.find((i) => i.id === id)
    if (!target || target.locked || target.disabled) return false
    const merged = base.map((i) => (i.id === id ? { ...i, ...patch } : i))
    const result = resolveLayout(merged as WidgetRect[], cols.value, { priorityId: id, freeform: freeform.value })
    if (!result) return false
    const byId = new Map(result.map((r) => [r.id, r]))
    items.value = items.value.map((i) => {
      const r = byId.get(i.id)
      return r ? { ...i, x: r.x, y: r.y, w: r.w, h: r.h } : i
    })
    return true
  }

  function commit() {
    emit('update:layout', serialize())
  }

  function cellSize() {
    const el = canvasEl.value
    const rowH = config.value.rowHeight
    if (!el) return { w: 80, h: rowH }
    const cs = getComputedStyle(el)
    const gapX = parseFloat(cs.columnGap) || 0
    const gapY = parseFloat(cs.rowGap) || 0
    return { w: (el.clientWidth + gapX) / cols.value, h: rowH + gapY }
  }

  // --- responsive width -----------------------------------------------------
  let ro: ResizeObserver | null = null
  onMounted(() => {
    const el = canvasEl.value
    if (!el) return
    width.value = el.clientWidth || width.value
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect.width
        if (w) width.value = w
      })
      ro.observe(el)
    }
  })
  onBeforeUnmount(() => ro?.disconnect())

  const state = reactive({
    cols,
    rowHeight: computed(() => config.value.rowHeight),
    gap: computed(() => config.value.gap),
    editMode,
    draggingId,
    setDraggingId(id: string | null) {
      draggingId.value = id
    },
    register,
    syncFromProps,
    getRect: (id: string) => placed.value.get(id),
    update,
    commit,
    cellSize,
  }) as unknown as VDashboardWidgetGridContext

  provide(DASHBOARD_WIDGET_GRID_KEY, state)

  const rootStyle = computed(() => ({
    '--v-grid-cols': String(cols.value),
    '--v-grid-row-height': `${config.value.rowHeight}px`,
    '--v-dashboard-grid-gap': resolveGapCss(config.value.gap),
  }))

  const rootAttrs = computed(() => ({
    class: ['v-dashboard-widget-grid', `v-dashboard-widget-grid--${config.value.variant}`],
    role: 'grid',
    'aria-label': props.ariaLabel ?? 'Dashboard widget grid',
    'data-test-id': 'v-dashboard-widget-grid',
    'data-cols': String(cols.value),
    'data-row-height': String(config.value.rowHeight),
    'data-edit-mode': editMode.value ? 'true' : 'false',
    style: rootStyle.value,
  }))

  function addWidget() {
    emit('add')
  }

  return { config, cols, editMode, draggingId, canvasEl, toggleEditMode, addWidget, rootAttrs }
}
