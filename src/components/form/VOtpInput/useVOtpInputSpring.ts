import { computed, ref, watch } from 'vue'
import { useSpringValue } from '../../../composables/useSpringValue'

export function useVOtpInputSpring(length: number, filledCount: () => number, expressive: () => boolean) {
  const scales = Array.from({ length }, () => {
    const target = ref(0)
    const spring = useSpringValue(target, { stiffness: 300, damping: 20 })
    return { target, spring }
  })

  watch(
    () => filledCount(),
    (count) => {
      scales.forEach((slot, index) => {
        const filled = index < count ? 1 : 0
        slot.target.value = expressive() ? filled : 0
      })
    },
    { immediate: true },
  )

  const slotStyle = (index: number) =>
    computed(() => {
      if (!expressive()) return undefined
      const scale = 0.88 + scales[index].spring.value.value * 0.12
      return {
        transform: `scale(${scale})`,
      }
    })

  return { slotStyle }
}
