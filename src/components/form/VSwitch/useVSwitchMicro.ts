import { computed, ref, type ComputedRef } from 'vue'
import { usePointerDrag } from '../../../composables/usePointerDrag'
import type { VSwitchProps } from './VSwitch.types'

type SwitchConfig = { checked: boolean; disabled: boolean }

type VSwitchEmit = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
}

export function useVSwitchMicro(
  props: VSwitchProps,
  config: ComputedRef<SwitchConfig>,
  emit: VSwitchEmit,
) {
  const thumbRef = ref<HTMLElement | null>(null)
  const trackRef = ref<HTMLElement | null>(null)
  const stretch = ref(1)

  const isExpressive = computed(() => props.motion === 'expressive' && !config.value.disabled)

  const maxTravel = () => {
    const track = trackRef.value
    const thumb = thumbRef.value
    if (!track || !thumb) return 24
    const styles = getComputedStyle(track)
    const padding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight)
    return Math.max(0, track.offsetWidth - thumb.offsetWidth - padding)
  }

  const drag = usePointerDrag(thumbRef, {
    axis: 'x',
    onUpdate: (_offset, velocity) => {
      stretch.value = 1 + Math.min(Math.abs(velocity) * 0.015, 0.4)
    },
    onCommit: (offset, velocity) => {
      const travel = maxTravel()
      const base = config.value.checked ? travel : 0
      const next = base + offset
      const shouldToggle =
        (!config.value.checked && drag.snapFromVelocity(next, velocity))
        || (config.value.checked && drag.snapFromVelocity(travel - next, -velocity))
        || Math.abs(offset) > travel * 0.35
      if (shouldToggle) {
        emit('update:modelValue', !config.value.checked)
        emit('change', !config.value.checked)
      }
      drag.reset()
      stretch.value = 1
    },
  })

  const thumbStyle = computed(() => {
    if (!isExpressive.value || !drag.dragging.value) return undefined
    const travel = maxTravel()
    const base = config.value.checked ? travel : 0
    const x = base + drag.offset.value
    return {
      transform: `translateX(${x}px) scaleX(${stretch.value})`,
      transition: 'none',
    }
  })

  const onThumbPointerDown = (event: PointerEvent) => {
    if (!isExpressive.value) return
    event.preventDefault()
    drag.onPointerDown(event)
  }

  const onThumbPointerMove = (event: PointerEvent) => {
    if (!isExpressive.value || !drag.dragging.value) return
    drag.onPointerMove(event)
  }

  const onThumbPointerUp = (event: PointerEvent) => {
    if (!isExpressive.value || !drag.dragging.value) return
    drag.onPointerUp(event)
  }

  return {
    isExpressive,
    thumbRef,
    trackRef,
    thumbStyle,
    onThumbPointerDown,
    onThumbPointerMove,
    onThumbPointerUp,
  }
}
