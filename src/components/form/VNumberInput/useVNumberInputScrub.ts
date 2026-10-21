import { computed, ref, type Ref } from 'vue'
import { rubberBand } from '../../../motion/gestures'
import type { VNumberInputProps } from './VNumberInput.types'

export function useVNumberInputScrub(
  props: VNumberInputProps,
  modelValue: Ref<number | null | undefined>,
  onUpdate: (value: number | null) => void,
) {
  const scrubbing = ref(false)
  const isScrub = computed(() => {
    if (props.motion === 'none') return false
    if (props.interaction === 'scrub') return true
    return props.motion === 'expressive' && props.interaction !== 'default'
  })

  let startX = 0
  let startValue = 0

  const onScrubPointerDown = (event: PointerEvent) => {
    if (!isScrub.value || event.button !== 0) return
    const target = (event.currentTarget as HTMLElement).closest('.v-number-input__control') as HTMLElement
    if (!target) return
    startX = event.clientX
    startValue = modelValue.value ?? props.min ?? 0
    scrubbing.value = true
    target.setPointerCapture(event.pointerId)
  }

  const onScrubPointerMove = (event: PointerEvent) => {
    if (!scrubbing.value) return
    const delta = event.clientX - startX
    const step = props.step ?? 1
    let next = startValue + Math.round(delta / 4) * step
    if (typeof props.min === 'number' && typeof props.max === 'number') {
      next = rubberBand(next, props.min, props.max)
    }
    onUpdate(next)
  }

  const onScrubPointerUp = (event: PointerEvent) => {
    if (!scrubbing.value) return
    scrubbing.value = false
    const target = event.currentTarget as HTMLElement
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId)
    }
    const final = modelValue.value
    if (final == null) return
    if (typeof props.min === 'number' && final < props.min) onUpdate(props.min)
    if (typeof props.max === 'number' && final > props.max) onUpdate(props.max)
  }

  return {
    isScrub,
    scrubbing,
    onScrubPointerDown,
    onScrubPointerMove,
    onScrubPointerUp,
  }
}
