import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { VSwipeRowAction, VSwipeRowProps } from './VSwipeRow.types'
import { mountVSwipeRow } from './mountVSwipeRow'

type VSwipeRowEmit = {
  (event: 'action', payload: VSwipeRowAction): void
}

const DRAG_THRESHOLD = 4
const RESISTANCE = 0.2
const MAX_OVERSHOOT = 24
const FLING_VELOCITY = 0.5 // px/ms

export function useVSwipeRow(props: VSwipeRowProps, emit: VSwipeRowEmit) {
  const config = computed(() => mountVSwipeRow(props))
  const rootRef = ref<HTMLElement | null>(null)
  const contentRef = ref<HTMLElement | null>(null)
  const actionsRef = ref<HTMLElement | null>(null)
  const isExpressive = computed(() => props.motion === 'expressive' && !config.value.disabled)
  const hasActions = computed(() => config.value.actions.length > 0)
  const open = ref(false)
  const dragging = ref(false)
  const offset = ref(0)
  const width = ref(0)

  const measure = () => {
    const w = actionsRef.value?.offsetWidth ?? 0
    width.value = w || config.value.actions.length * 72
    return width.value
  }

  // Gesture state (not reactive on purpose)
  let pointerId: number | null = null
  let startX = 0
  let startY = 0
  let base = 0
  let lastX = 0
  let lastTime = 0
  let velocity = 0
  let engaged = false
  let suppressClick = false

  const constrain = (raw: number) => {
    const w = width.value
    if (raw > 0) return 0 // never travel towards the side without actions
    if (raw < -w) return -w - Math.min(MAX_OVERSHOOT, (-w - raw) * RESISTANCE)
    return raw
  }

  const setOpen = (value: boolean) => {
    open.value = value && hasActions.value
    offset.value = open.value ? -width.value : 0
  }

  const onContentPointerDown = (event: PointerEvent) => {
    if (!isExpressive.value || !hasActions.value) return
    if (event.button !== 0 && event.pointerType === 'mouse') return
    if (pointerId !== null) return
    measure()
    pointerId = event.pointerId
    startX = lastX = event.clientX
    startY = event.clientY
    base = open.value ? -width.value : 0
    lastTime = performance.now()
    velocity = 0
    engaged = false
  }

  const onContentPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    if (!engaged) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      if (Math.abs(dy) > Math.abs(dx)) {
        pointerId = null // vertical scroll intent
        return
      }
      engaged = true
      dragging.value = true
      try {
        contentRef.value?.setPointerCapture(event.pointerId)
      } catch {
        /* synthetic pointer */
      }
    }
    const now = performance.now()
    velocity = (event.clientX - lastX) / Math.max(1, now - lastTime)
    lastX = event.clientX
    lastTime = now
    offset.value = constrain(base + dx)
  }

  const endDrag = (event: PointerEvent, cancelled: boolean) => {
    if (event.pointerId !== pointerId) return
    pointerId = null
    const el = contentRef.value
    if (el?.hasPointerCapture?.(event.pointerId)) el.releasePointerCapture(event.pointerId)
    if (!engaged) return
    engaged = false
    dragging.value = false
    suppressClick = true
    setTimeout(() => (suppressClick = false), 0)
    const w = width.value
    let next: boolean
    if (cancelled) next = open.value
    else if (velocity <= -FLING_VELOCITY) next = true
    else if (velocity >= FLING_VELOCITY) next = false
    else next = offset.value < -w * 0.4
    setOpen(next)
  }

  const onContentPointerUp = (event: PointerEvent) => endDrag(event, false)
  const onContentPointerCancel = (event: PointerEvent) => endDrag(event, true)

  const onContentClickCapture = (event: MouseEvent) => {
    if (suppressClick) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  const onContentKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled || !hasActions.value) return
    if (event.key === 'ArrowLeft') {
      measure()
      setOpen(true)
      event.preventDefault()
    } else if (event.key === 'ArrowRight' || event.key === 'Escape') {
      if (open.value) {
        setOpen(false)
        event.preventDefault()
      }
    }
  }

  const onRootKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open.value) {
      setOpen(false)
      contentRef.value?.focus()
    }
  }

  const onAction = (action: VSwipeRowAction) => {
    emit('action', action)
    setOpen(false)
  }

  const onDocumentPointerDown = (event: Event) => {
    if (open.value && rootRef.value && !rootRef.value.contains(event.target as Node)) setOpen(false)
  }

  watch(open, (value) => {
    if (value) {
      measure()
      document.addEventListener('pointerdown', onDocumentPointerDown, true)
    } else {
      document.removeEventListener('pointerdown', onDocumentPointerDown, true)
    }
  })

  watch(
    () => [config.value.disabled, props.motion, config.value.actions.length],
    () => {
      if (!hasActions.value || config.value.disabled) setOpen(false)
    },
  )

  onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown, true))

  const contentStyle = computed(() => {
    const x = dragging.value ? offset.value : open.value ? -width.value : 0
    return {
      transform: x === 0 ? undefined : `translate3d(${x}px, 0, 0)`,
      transition: dragging.value || props.motion === 'none' ? 'none' : undefined,
    }
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-swipe-row',
      {
        'v-swipe-row--disabled': config.value.disabled,
        'v-swipe-row--expressive': isExpressive.value,
        'v-swipe-row--open': open.value,
        'v-swipe-row--dragging': dragging.value,
      },
    ],
    'data-test-id': 'v-swipe-row',
    onKeydown: onRootKeydown,
  }))

  return {
    config,
    rootAttrs,
    rootRef,
    contentRef,
    actionsRef,
    contentStyle,
    open,
    hasActions,
    onContentPointerDown,
    onContentPointerMove,
    onContentPointerUp,
    onContentPointerCancel,
    onContentClickCapture,
    onContentKeydown,
    onAction,
  }
}
