import { computed, onUnmounted, ref, watch } from 'vue'
import type { IconifyIcon } from '@iconify/types'
import type { VResizablePanelEmitFn, VResizablePanelProps } from './VResizablePanel.types'
import {
  V_RESIZABLE_PANEL_COLLAPSED_SIZE,
  V_RESIZABLE_PANEL_KEYBOARD_STEP,
} from './VResizablePanel.types'
import { clampSizePx, mountVResizablePanel, resolveSizePx, V_RESIZABLE_PANEL_UI_ICONS } from './mountVResizablePanel'

/** Largura/altura viva do painel (runtime). O tamanho inicial vem de v-model:size. */
export function useVResizablePanel(props: VResizablePanelProps, emit: VResizablePanelEmitFn) {
  const config = computed(() => mountVResizablePanel(props))
  const collapsed = ref(false)
  const dragging = ref(false)
  const liveSize = ref<number>(config.value.sizePx)
  const hasLocalCommit = ref(false)

  watch(
    () => resolveSizePx(props.size ?? 'md'),
    (next) => {
      if (!dragging.value && !hasLocalCommit.value) {
        liveSize.value = clampSizePx(next, config.value.minPx, config.value.maxPx)
      }
    },
  )
  watch(
    () => [config.value.minPx, config.value.maxPx] as const,
    ([min, max]) => {
      if (!dragging.value) liveSize.value = clampSizePx(liveSize.value, min, max)
    },
  )
  watch(
    () => props.size,
    (size) => {
      if (size === undefined || dragging.value) return
      hasLocalCommit.value = false
      liveSize.value = clampSizePx(resolveSizePx(size ?? 'md'), config.value.minPx, config.value.maxPx)
    },
  )

  const displayedSize = computed(() =>
    collapsed.value ? V_RESIZABLE_PANEL_COLLAPSED_SIZE : liveSize.value,
  )
  const expandedBeforeCollapse = ref<number>(config.value.sizePx)
  const isHorizontal = computed(() => config.value.orientation === 'horizontal')
  const collapseTowardStart = computed(
    () => config.value.variant === 'left' || config.value.variant === 'collapsible',
  )
  const collapseIcon = computed((): IconifyIcon => {
    const { chevronLeft, chevronRight, chevronUp, chevronDown } = V_RESIZABLE_PANEL_UI_ICONS
    if (isHorizontal.value) {
      if (collapsed.value) return chevronDown
      return chevronUp
    }
    if (collapsed.value) return collapseTowardStart.value ? chevronRight : chevronLeft
    return collapseTowardStart.value ? chevronLeft : chevronRight
  })

  const handleIcon = computed((): IconifyIcon | null => {
    if (!collapsed.value) return null
    return collapseIcon.value
  })
  const ariaLiveMessage = ref('')

  const panelStyle = computed(() => {
    const live = `${displayedSize.value}px`
    if (isHorizontal.value) return { height: live }
    return { width: live }
  })

  const sizeLabel = computed(() => `${displayedSize.value}px`)

  function announceSize(sizePx: number) {
    ariaLiveMessage.value = `Panel size ${sizePx} pixels`
  }

  function setLiveSize(next: number, announce: 'resize' | 'commit' = 'resize') {
    const clamped = clampSizePx(next, config.value.minPx, config.value.maxPx)
    liveSize.value = clamped
    announceSize(clamped)
    if (announce === 'commit') {
      hasLocalCommit.value = true
      emit('update:size', clamped)
      emit('resize', clamped)
    } else {
      emit('resize', clamped)
    }
  }

  let dragStartPos = 0
  let dragStartSize = 0
  let activePointerId: number | null = null
  let windowListeners: Array<() => void> | null = null

  function detachWindowListeners() {
    if (windowListeners) {
      for (const dispose of windowListeners) dispose()
      windowListeners = null
    }
  }

  function onWindowPointerMove(event: PointerEvent) {
    if (!dragging.value || config.value.disabled) return
    if (activePointerId !== null && event.pointerId !== activePointerId) return
    const pos = isHorizontal.value ? event.clientY : event.clientX
    const sign = config.value.variant === 'right' ? -1 : 1
    setLiveSize(dragStartSize + sign * (pos - dragStartPos))
  }

  function onWindowPointerUp(event: PointerEvent) {
    if (activePointerId !== null && event.pointerId !== activePointerId) return
    stopDrag()
  }

  function stopDrag() {
    if (!dragging.value) return
    dragging.value = false
    activePointerId = null
    detachWindowListeners()
    hasLocalCommit.value = true
    emit('update:size', liveSize.value)
    emit('resize', liveSize.value)
  }

  function onHandlePointerDown(event: PointerEvent) {
    if (config.value.disabled) return
    event.preventDefault()
    if (collapsed.value) {
      toggleCollapse()
      return
    }
    dragging.value = true
    activePointerId = event.pointerId
    dragStartPos = isHorizontal.value ? event.clientY : event.clientX
    dragStartSize = liveSize.value
    const target = event.currentTarget as HTMLElement | null
    target?.setPointerCapture?.(event.pointerId)

    if (typeof window !== 'undefined') {
      detachWindowListeners()
      const move = (e: PointerEvent) => onWindowPointerMove(e)
      const up = (e: PointerEvent) => onWindowPointerUp(e)
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

  function onHandlePointerMove(event: PointerEvent) {
    onWindowPointerMove(event)
  }

  function onHandlePointerUp(event: PointerEvent) {
    onWindowPointerUp(event)
  }

  function onHandleKeyDown(event: KeyboardEvent) {
    if (config.value.disabled) return
    const horizontal = !isHorizontal.value
    let delta: number | null = null
    if (horizontal && event.key === 'ArrowLeft') delta = -V_RESIZABLE_PANEL_KEYBOARD_STEP
    else if (horizontal && event.key === 'ArrowRight') delta = V_RESIZABLE_PANEL_KEYBOARD_STEP
    else if (!horizontal && event.key === 'ArrowUp') delta = V_RESIZABLE_PANEL_KEYBOARD_STEP
    else if (!horizontal && event.key === 'ArrowDown') delta = -V_RESIZABLE_PANEL_KEYBOARD_STEP
    else if (event.key === 'Home') {
      event.preventDefault()
      setLiveSize(config.value.minPx, 'commit')
      return
    } else if (event.key === 'End') {
      event.preventDefault()
      setLiveSize(config.value.maxPx, 'commit')
      return
    } else if (event.key === 'Enter') {
      event.preventDefault()
      setLiveSize(liveSize.value, 'commit')
      return
    } else {
      return
    }
    event.preventDefault()
    collapsed.value = false
    setLiveSize(liveSize.value + (delta ?? 0), 'commit')
  }

  function toggleCollapse() {
    if (!config.value.collapsible || config.value.disabled) return
    if (collapsed.value) {
      collapsed.value = false
      liveSize.value = clampSizePx(expandedBeforeCollapse.value, config.value.minPx, config.value.maxPx)
      hasLocalCommit.value = true
      emit('expand')
      emit('update:size', liveSize.value)
    } else {
      expandedBeforeCollapse.value = liveSize.value
      collapsed.value = true
      emit('collapse')
    }
  }

  onUnmounted(() => detachWindowListeners())

  const rootAttrs = computed(() => ({
    class: [
      'v-resizable-panel',
      `v-resizable-panel--${config.value.variant}`,
      ...(isHorizontal.value ? ['v-resizable-panel--horizontal'] : ['v-resizable-panel--vertical']),
      ...(collapsed.value ? ['v-resizable-panel--collapsed'] : []),
      ...(dragging.value ? ['v-resizable-panel--dragging'] : []),
      ...(config.value.disabled ? ['v-resizable-panel--disabled'] : []),
      ...(props.loading ? ['v-resizable-panel--loading'] : []),
      ...(config.value.collapsible ? ['v-resizable-panel--has-collapse'] : []),
    ],
    style: panelStyle.value,
    'aria-disabled': (config.value.disabled || undefined) as 'true' | undefined,
    'aria-busy': (props.loading || undefined) as 'true' | undefined,
    'aria-label': props.ariaLabel,
    'data-test-id': 'v-resizable-panel',
    'data-variant': config.value.variant,
    'data-state': collapsed.value
      ? 'collapsed'
      : dragging.value
        ? 'dragging'
        : config.value.disabled
          ? 'disabled'
          : props.loading
            ? 'loading'
            : 'default',
    'data-orientation': config.value.orientation,
    'data-collapsed': (collapsed.value || undefined) as 'true' | undefined,
    'data-has-collapse': (config.value.collapsible || undefined) as 'true' | undefined,
  }))

  const handleAttrs = computed(() => ({
    class: {
      'v-resizable-panel__handle--dragging': dragging.value,
    },
    role: 'separator' as const,
    tabindex: config.value.disabled ? undefined : 0,
    'aria-orientation': config.value.orientation,
    'aria-valuemin': config.value.minPx,
    'aria-valuemax': config.value.maxPx,
    'aria-valuenow': displayedSize.value,
    'aria-valuetext': sizeLabel.value,
    'aria-label': 'Resize panel. Drag to resize.',
    'aria-disabled': (config.value.disabled || undefined) as 'true' | undefined,
    'data-test-id': 'v-resizable-panel-handle',
  }))

  const collapseAttrs = computed(() => ({
    type: 'button' as const,
    'aria-expanded': (!collapsed.value) as unknown as 'true' | 'false',
    'aria-label': collapsed.value ? 'Expand panel' : 'Collapse panel',
    disabled: (config.value.disabled || undefined) as true | undefined,
    'data-test-id': 'v-resizable-panel-collapse-trigger',
  }))

  return {
    config,
    collapsed,
    collapseIcon,
    handleIcon,
    dragging,
    liveSize,
    displayedSize,
    sizeLabel,
    ariaLiveMessage,
    panelStyle,
    rootAttrs,
    handleAttrs,
    collapseAttrs,
    setLiveSize,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onHandleKeyDown,
    toggleCollapse,
  }
}
