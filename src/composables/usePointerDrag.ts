import { onBeforeUnmount, ref, type Ref } from 'vue'
import { rubberBand, snapFromVelocity } from '../motion/gestures'

export interface PointerDragOptions {
  axis?: 'x' | 'y' | 'both'
  min?: number
  max?: number
  rubberBand?: boolean
  onCommit?: (offset: number, velocity: number) => void
  onUpdate?: (offset: number, velocity: number) => void
}

export function usePointerDrag(
  elementRef: Ref<HTMLElement | null>,
  options: PointerDragOptions = {},
) {
  const offset = ref(0)
  const dragging = ref(false)
  let startX = 0
  let startY = 0
  let lastX = 0
  let lastTime = 0
  let velocity = 0
  let pointerId: number | null = null

  const axis = options.axis ?? 'x'

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    const el = elementRef.value
    if (!el) return
    pointerId = event.pointerId
    dragging.value = true
    startX = event.clientX
    startY = event.clientY
    lastX = axis === 'y' ? event.clientY : event.clientX
    lastTime = performance.now()
    velocity = 0
    el.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging.value || event.pointerId !== pointerId) return
    const now = performance.now()
    const current = axis === 'y' ? event.clientY : event.clientX
    const delta = current - (axis === 'y' ? startY : startX)
    const dt = Math.max(1, now - lastTime)
    velocity = (current - lastX) / dt
    lastX = current
    lastTime = now

    let next = delta
    if (options.rubberBand && options.min !== undefined && options.max !== undefined) {
      next = rubberBand(delta, options.min, options.max)
    }
    offset.value = next
    options.onUpdate?.(next, velocity)
  }

  const onPointerUp = (event: PointerEvent) => {
    if (!dragging.value || event.pointerId !== pointerId) return
    dragging.value = false
    pointerId = null
    options.onCommit?.(offset.value, velocity)
    const el = elementRef.value
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId)
    }
  }

  const reset = () => {
    offset.value = 0
    velocity = 0
    dragging.value = false
  }

  onBeforeUnmount(reset)

  return {
    offset,
    dragging,
    snapFromVelocity,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    reset,
  }
}
