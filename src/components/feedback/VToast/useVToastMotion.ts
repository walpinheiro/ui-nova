import { computed, ref } from 'vue'
import { usePointerDrag } from '../../../composables/usePointerDrag'
import type { VToastProps } from './VToast.types'

export function useVToastMotion(
  props: VToastProps,
  dismiss: () => void,
) {
  const rootRef = ref<HTMLElement | null>(null)
  const isExpressive = computed(() => props.motion === 'expressive' && !props.disabled)

  const drag = usePointerDrag(rootRef, {
    axis: 'y',
    rubberBand: true,
    min: 0,
    max: 0,
    onCommit: (offset, velocity) => {
      if (drag.snapFromVelocity(offset, velocity) || offset > 60) {
        dismiss()
      }
      drag.reset()
    },
  })

  const rootStyle = computed(() => {
    if (!isExpressive.value || !drag.offset.value) return undefined
    return {
      transform: `translateY(${Math.max(0, drag.offset.value)}px)`,
      transition: drag.dragging.value ? 'none' : undefined,
    }
  })

  const onPointerDown = (event: PointerEvent) => {
    if (!isExpressive.value) return
    drag.onPointerDown(event)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!isExpressive.value || !drag.dragging.value) return
    drag.onPointerMove(event)
  }

  const onPointerUp = (event: PointerEvent) => {
    if (!isExpressive.value || !drag.dragging.value) return
    drag.onPointerUp(event)
  }

  return {
    isExpressive,
    rootRef,
    rootStyle,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
