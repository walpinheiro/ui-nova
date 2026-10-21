import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { springStep } from '../motion/springs'
import { useReducedMotion } from './useReducedMotion'

export function useSpringValue(
  target: Ref<number>,
  options: { stiffness?: number; damping?: number; immediate?: boolean } = {},
) {
  const value = ref(target.value)
  const velocity = ref(0)
  const reduced = useReducedMotion()
  let frame: number | null = null

  const tick = () => {
    const result = springStep(
      value.value,
      target.value,
      velocity.value,
      options.stiffness ?? 180,
      options.damping ?? 18,
    )
    value.value = result.value
    velocity.value = result.velocity
    if (Math.abs(result.value - target.value) < 0.001 && Math.abs(result.velocity) < 0.01) {
      value.value = target.value
      velocity.value = 0
      frame = null
      return
    }
    frame = requestAnimationFrame(tick)
  }

  const start = () => {
    if (frame) cancelAnimationFrame(frame)
    if (reduced.value || options.immediate) {
      value.value = target.value
      velocity.value = 0
      return
    }
    frame = requestAnimationFrame(tick)
  }

  watch(target, start, { immediate: true })

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame)
  })

  const jump = (next: number) => {
    if (frame) cancelAnimationFrame(frame)
    value.value = next
    velocity.value = 0
  }

  return { value, jump, start }
}
