import { computed, onUnmounted, ref, watch } from 'vue'
import type { VSplitViewEmitFn, VSplitViewProps, VSplitViewSizeValue } from './VSplitView.types'
import { mountVSplitView } from './mountVSplitView'

const RESIZE_STEP_PX = 24 // = var(--v-space-6); collapse usa var(--v-space-12)

function readPersistedSizes(key: string | undefined): VSplitViewSizeValue[] | null {
  if (!key || typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    const cleaned = parsed.filter((v): v is VSplitViewSizeValue => typeof v === 'number' || typeof v === 'string')
    return cleaned.length > 0 ? cleaned : null
  } catch {
    return null
  }
}

export function isFlexSize(value: number | string): boolean {
  if (typeof value === 'number') return value > 0 && value <= 24
  const raw = value.trim()
  if (/fr$/i.test(raw)) return true
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) && parsed <= 24 && !/px/i.test(raw)
}

/** Converte um valor de sizes para trilha CSS: flex units/percentual passam direto, numeros grandes viram px. */
export function splitSizeToTrack(value: number | string, defaultPx: number): string {
  if (typeof value === 'number') {
    if (value <= 0) return 'minmax(0, 1fr)'
    if (value <= 24) return `minmax(0, ${value}fr)`
    return `${value}px`
  }
  const raw = value.trim()
  if (raw === '') return `${defaultPx}px`
  if (/^(var|calc|minmax|clamp|min|max)\(/i.test(raw)) return raw
  if (/^\d+(\.\d+)?(px|%|fr|em|rem|vw|vh)$/i.test(raw)) return raw
  const parsed = Number.parseFloat(raw)
  if (Number.isFinite(parsed)) {
    if (parsed <= 24 && !/px/i.test(raw)) return `minmax(0, ${parsed}fr)`
    return `${parsed}px`
  }
  return `${defaultPx}px`
}

export function useVSplitView(
  props: VSplitViewProps,
  emit: VSplitViewEmitFn,
  slotPaneCount = 0,
) {
  const config = computed(() => mountVSplitView(props, slotPaneCount))
  const collapsed = ref<boolean[]>([])
  const draggingIndex = ref<number | null>(null)
  const pressedIndex = ref<number | null>(null)
  const committedSizes = ref<VSplitViewSizeValue[] | null>(null)

  watch(
    () => config.value.paneCount,
    (count) => {
      collapsed.value = Array.from({ length: count }, (_, i) => collapsed.value[i] ?? false)
    },
    { immediate: true },
  )

  const initialSizes = computed(() => {
    const count = config.value.paneCount
    const restored = readPersistedSizes(props.persistKey)
    const base = Array.isArray(props.sizes) ? [...props.sizes] : restored ? [...restored] : []
    while (base.length < count) base.push(1)
    return base.slice(0, count)
  })

  watch(
    () => props.sizes,
    (sizes) => {
      if (Array.isArray(sizes)) committedSizes.value = null
    },
    { deep: true },
  )

  const resolvedSizes = computed(() => committedSizes.value ?? initialSizes.value)

  const dragSizes = ref<VSplitViewSizeValue[] | null>(null)
  const dragStartSizes = ref<VSplitViewSizeValue[] | null>(null)
  let windowListeners: Array<() => void> | null = null

  const estimatedPx = (value: number | string): number => {
    if (typeof value === 'number') return value <= 24 ? value * config.value.defaultSizePx : value
    const raw = value.trim()
    if (raw.startsWith('var(')) return config.value.defaultSizePx
    if (raw.endsWith('%')) {
      const pct = Number.parseFloat(raw)
      return Number.isFinite(pct)
        ? (pct / 100) * config.value.defaultSizePx * config.value.paneCount
        : config.value.defaultSizePx
    }
    const parsed = Number.parseFloat(raw)
    if (Number.isFinite(parsed)) return parsed <= 24 && !/px/i.test(raw) ? parsed * config.value.defaultSizePx : parsed
    return config.value.defaultSizePx
  }

  const liveSizes = computed(() => dragSizes.value ?? resolvedSizes.value)

  const clampedSizes = computed(() =>
    liveSizes.value.map((size, index) => {
      if (collapsed.value[index]) return 'var(--v-space-12)'
      if (isFlexSize(size)) return size
      const px = estimatedPx(size)
      if (px < config.value.minSizePx) return `${config.value.minSizePx}px`
      if (px > config.value.maxSizePx) return `${config.value.maxSizePx}px`
      return size
    }),
  )

  const gridStyle = computed(() => {
    const tracks = clampedSizes.value.map((size) => splitSizeToTrack(size, config.value.defaultSizePx))
    const template = tracks.join(' var(--v-space-1) ')
    if (config.value.orientation === 'vertical') return { gridTemplateColumns: template }
    return { gridTemplateRows: template }
  })

  const isInteractive = computed(() => config.value.mode !== 'fixed' && !config.value.disabled)

  function emitSizes(next: (number | string)[]) {
    committedSizes.value = [...next]
    if (props.persistKey && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(props.persistKey, JSON.stringify(next))
      } catch {
        /* armazenamento indisponivel */
      }
    }
    emit('update:sizes', next)
    emit('resize', next)
  }

  function applyDelta(base: (number | string)[], index: number, deltaPx: number): (number | string)[] {
    const next = [...base]
    const target = Math.min(Math.max(index, 0), next.length - 2)
    if (target < 0) return next

    const aVal = next[target]
    const bVal = next[target + 1]
    const aFlex = isFlexSize(aVal)
    const bFlex = isFlexSize(bVal)

    if (!aFlex && bFlex) {
      const a = estimatedPx(aVal)
      next[target] = Math.min(Math.max(Math.round(a + deltaPx), config.value.minSizePx), config.value.maxSizePx)
      return next
    }

    if (aFlex && !bFlex) {
      const b = estimatedPx(bVal)
      next[target + 1] = Math.min(Math.max(Math.round(b - deltaPx), config.value.minSizePx), config.value.maxSizePx)
      return next
    }

    const a = estimatedPx(aVal)
    const b = estimatedPx(bVal)
    const nextA = Math.min(Math.max(a + deltaPx, config.value.minSizePx), config.value.maxSizePx)
    const applied = nextA - a
    const nextB = Math.min(Math.max(b - applied, config.value.minSizePx), config.value.maxSizePx)
    next[target] = Math.round(nextA)
    next[target + 1] = Math.round(nextB)
    return next
  }

  function nudge(index: number, direction: 1 | -1) {
    if (!isInteractive.value) return
    emitSizes(applyDelta(resolvedSizes.value, index, direction * RESIZE_STEP_PX))
  }

  function jumpToEdge(index: number, direction: 1 | -1) {
    if (!isInteractive.value) return
    const base = [...resolvedSizes.value]
    const target = Math.min(Math.max(index, 0), base.length - 2)
    if (target < 0) return
    const a = estimatedPx(base[target])
    const delta = direction === -1 ? config.value.minSizePx - a : config.value.maxSizePx - a
    emitSizes(applyDelta(base, target, delta))
  }

  function detachWindowListeners() {
    if (windowListeners) {
      for (const dispose of windowListeners) dispose()
      windowListeners = null
    }
  }

  function onWindowPointerMove(index: number, startClient: number, event: PointerEvent) {
    if (draggingIndex.value !== index || !dragStartSizes.value) return
    const vertical = config.value.orientation === 'vertical'
    const client = vertical ? event.clientX : event.clientY
    if (!Number.isFinite(client)) return
    const next = applyDelta(dragStartSizes.value, index, client - startClient)
    dragSizes.value = next
    emitSizes(next)
  }

  function onWindowPointerUp(index: number) {
    if (draggingIndex.value !== index) return
    stopDrag()
  }

  function startDrag(index: number, event?: PointerEvent) {
    if (!isInteractive.value) return
    detachWindowListeners()
    draggingIndex.value = index
    pressedIndex.value = index
    dragStartSizes.value = [...resolvedSizes.value]
    dragSizes.value = [...resolvedSizes.value]
    const vertical = config.value.orientation === 'vertical'
    const rawStart = event ? (vertical ? event.clientX : event.clientY) : 0
    const startClient = Number.isFinite(rawStart) ? (rawStart as number) : 0
    if (typeof window !== 'undefined' && event) {
      const move = (e: PointerEvent) => onWindowPointerMove(index, startClient, e)
      const up = () => onWindowPointerUp(index)
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
      windowListeners = [
        () => window.removeEventListener('pointermove', move),
        () => window.removeEventListener('pointerup', up),
        () => window.removeEventListener('pointercancel', up),
      ]
    }
  }

  function stopDrag() {
    detachWindowListeners()
    dragSizes.value = null
    dragStartSizes.value = null
    draggingIndex.value = null
    pressedIndex.value = null
  }

  onUnmounted(() => detachWindowListeners())

  function setPressed(index: number, pressed: boolean) {
    if (!isInteractive.value) return
    pressedIndex.value = pressed ? index : null
  }

  function toggleCollapse(index: number) {
    if (!config.value.collapsible || config.value.disabled) return
    const target = Math.min(Math.max(index, 0), collapsed.value.length - 1)
    collapsed.value[target] = !collapsed.value[target]
    if (collapsed.value[target]) emit('collapse', target)
    else emit('expand', target)
  }

  function onDividerKeydown(index: number, event: KeyboardEvent) {
    if (!isInteractive.value) return
    const key = (event.key ?? '').toLowerCase()
    const code = (event as KeyboardEvent & { code?: string }).code ?? ''
    const keyCode = (event as KeyboardEvent & { keyCode?: number }).keyCode ?? 0
    const vertical = config.value.orientation === 'vertical'
    const isLeft = key === 'arrowleft' || key === 'left' || code === 'ArrowLeft' || keyCode === 37
    const isRight = key === 'arrowright' || key === 'right' || code === 'ArrowRight' || keyCode === 39
    const isUp = key === 'arrowup' || key === 'up' || code === 'ArrowUp' || keyCode === 38
    const isDown = key === 'arrowdown' || key === 'down' || code === 'ArrowDown' || keyCode === 40
    const isHome = key === 'home' || code === 'Home' || keyCode === 36
    const isEnd = key === 'end' || code === 'End' || keyCode === 35
    const isConfirm = key === 'enter' || key === ' ' || key === 'spacebar' || key === 'space' || code === 'Enter' || code === 'Space' || keyCode === 13 || keyCode === 32
    if (vertical ? isLeft : isUp) {
      event.preventDefault()
      nudge(index, -1)
    } else if (vertical ? isRight : isDown) {
      event.preventDefault()
      nudge(index, 1)
    } else if (isHome) {
      event.preventDefault()
      jumpToEdge(index, -1)
    } else if (isEnd) {
      event.preventDefault()
      jumpToEdge(index, 1)
    } else if (isConfirm) {
      event.preventDefault()
      toggleCollapse(index)
    }
  }

  const rootAttrs = computed(() => ({
    class: [
      'v-split-view',
      `v-split-view--${config.value.orientation}`,
      `v-split-view--${config.value.mode}`,
      ...(config.value.disabled ? ['v-split-view--disabled'] : []),
      ...(draggingIndex.value !== null ? ['v-split-view--dragging'] : []),
    ],
    role: 'group',
    'aria-disabled': (config.value.disabled || undefined) as 'true' | undefined,
    'data-test-id': 'v-split-view',
    'data-orientation': config.value.orientation,
    'data-mode': config.value.mode,
  }))

  function dividerAttrs(index: number) {
    const collapsedPane = collapsed.value[index] || collapsed.value[index + 1]
    return {
      role: 'separator' as const,
      tabindex: isInteractive.value ? 0 : undefined,
      'aria-orientation': (config.value.orientation === 'vertical' ? 'vertical' : 'horizontal') as 'vertical' | 'horizontal',
      'aria-valuemin': config.value.minSizePx,
      'aria-valuemax': config.value.maxSizePx,
      'aria-valuenow': Math.round(estimatedPx(liveSizes.value[index] ?? 1)),
      'aria-valuetext': `${Math.round(estimatedPx(liveSizes.value[index] ?? 1))} pixels de ${config.value.maxSizePx} pixels maximo`,
      'aria-label': `Redimensionar paineis ${index + 1} e ${index + 2}`,
      'aria-disabled': (config.value.disabled || config.value.mode === 'fixed' || undefined) as 'true' | undefined,
      'aria-expanded': (collapsedPane ? 'false' : undefined) as 'false' | undefined,
      'data-test-id': `v-split-view-divider-${index}`,
      'data-collapsed': (collapsedPane || undefined) as 'true' | undefined,
      'data-pressed': (pressedIndex.value === index || draggingIndex.value === index || undefined) as 'true' | undefined,
      class: [
        'v-split-view__divider',
        ...(draggingIndex.value === index ? ['v-split-view__divider--dragging'] : []),
        ...(pressedIndex.value === index ? ['v-split-view__divider--pressed'] : []),
        ...(collapsedPane ? ['v-split-view__divider--collapsed'] : []),
      ],
    }
  }

  const paneSemanticIds = ['start', 'center', 'end'] as const

  function paneAttrs(index: number) {
    const semantic = paneSemanticIds[index]
    return {
      role: 'group' as const,
      'aria-label': `Pane ${index + 1} de ${config.value.paneCount}`,
      'data-test-id': semantic ? `v-split-view-pane-${semantic}` : `v-split-view-pane-${index + 1}`,
      'data-pane-index': String(index + 1),
      'data-collapsed': (collapsed.value[index] || undefined) as 'true' | undefined,
      class: ['v-split-view__pane', ...(collapsed.value[index] ? ['v-split-view__pane--collapsed'] : [])],
    }
  }

  function collapseLabel(index: number) {
    return collapsed.value[index] ? `Expandir pane ${index + 1}` : `Recolher pane ${index + 1}`
  }

  function collapseGlyph(index: number) {
    const vertical = config.value.orientation === 'vertical'
    const collapsedPane = collapsed.value[index]
    if (vertical) return collapsedPane ? '›' : '‹'
    return collapsedPane ? '▼' : '▲'
  }

  return {
    config,
    rootAttrs,
    gridStyle,
    collapsed,
    draggingIndex,
    pressedIndex,
    resolvedSizes,
    clampedSizes,
    isInteractive,
    dividerAttrs,
    paneAttrs,
    nudge,
    jumpToEdge,
    onDividerKeydown,
    startDrag,
    stopDrag,
    setPressed,
    toggleCollapse,
    collapseLabel,
    collapseGlyph,
  }
}
