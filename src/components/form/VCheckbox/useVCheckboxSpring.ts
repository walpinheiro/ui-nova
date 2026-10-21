import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { springReadings, springStep, zetaFromBounce } from '../../../motion/springs'
import type { VMotionStrike } from '../../../motion/types'
import { useReducedMotion } from '../../../composables/useReducedMotion'

const VISUAL_DURATION = 0.2

export function useVCheckboxSpring(
  checked: Ref<boolean>,
  options: {
    expressive: Ref<boolean>
    doneOpacity: Ref<number>
    strikeLag: Ref<number>
    bounce: Ref<number>
  },
) {
  const t = ref(checked.value ? 1 : 0)
  const reduced = useReducedMotion()
  let frame: number | null = null
  let velocity = 0

  const strikeMode = ref<VMotionStrike>('left')

  const readings = computed(() =>
    springReadings(t.value, options.doneOpacity.value, options.strikeLag.value),
  )

  const boxStyle = computed(() => ({
    transform: `scale(${readings.value.boxScale})`,
  }))

  const fillStyle = computed(() => ({
    transform: `scale(${readings.value.fillScale})`,
  }))

  const tickStyle = computed(() => ({
    strokeDashoffset: `${readings.value.tickOffset}`,
  }))

  const labelStyle = computed(() => ({
    opacity: String(readings.value.wordOpacity),
  }))

  const ruleStyle = computed(() => ({
    transform: `scaleX(${readings.value.ruleScale})`,
  }))

  const animateTo = (target: number) => {
    if (frame) cancelAnimationFrame(frame)
    if (reduced.value || !options.expressive.value) {
      t.value = target
      velocity = 0
      return
    }
    const stiffness = 200 / VISUAL_DURATION
    const damping = 18 + zetaFromBounce(options.bounce.value) * 8
    const step = () => {
      const result = springStep(t.value, target, velocity, stiffness, damping)
      t.value = result.value
      velocity = result.velocity
      if (Math.abs(result.value - target) < 0.002 && Math.abs(velocity) < 0.02) {
        t.value = target
        velocity = 0
        frame = null
        return
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }

  watch(checked, (value) => animateTo(value ? 1 : 0), { immediate: true })

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame)
  })

  return { readings, boxStyle, fillStyle, tickStyle, labelStyle, ruleStyle, strikeMode }
}
