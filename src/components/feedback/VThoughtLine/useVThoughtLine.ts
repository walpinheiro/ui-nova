import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { isMotionDisabled, useReducedMotion } from '../../../composables/useReducedMotion'
import type { VThoughtLineEmit, VThoughtLineProps } from './VThoughtLine.types'
import { mountVThoughtLine } from './mountVThoughtLine'

export function useVThoughtLine(props: VThoughtLineProps, emit: VThoughtLineEmit) {
  const config = computed(() => mountVThoughtLine(props))
  const reduced = useReducedMotion()
  const expanded = ref(props.defaultExpanded ?? false)
  const elapsedMs = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  const motionDisabled = computed(() => isMotionDisabled(config.value.motion, reduced.value))
  const isExpressive = computed(() => config.value.motion === 'expressive' && !motionDisabled.value)
  const isThinking = computed(() => !config.value.isComplete)
  const displayMs = computed(() => (config.value.isComplete ? config.value.duration : elapsedMs.value))

  const formattedDuration = computed(() => {
    const seconds = Math.max(0, displayMs.value) / 1000
    return seconds >= 10 ? `${seconds.toFixed(0)}s` : `${seconds.toFixed(1)}s`
  })

  const summaryLabel = computed(() => {
    if (isThinking.value) return config.value.label
    return `Thought for ${formattedDuration.value}`
  })

  const clearTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }

  const startTimer = () => {
    clearTimer()
    if (config.value.isComplete) return
    const started = performance.now()
    timer = setInterval(() => {
      elapsedMs.value = performance.now() - started
    }, 50)
  }

  watch(
    () => config.value.isComplete,
    (complete) => {
      if (complete) clearTimer()
      else startTimer()
    },
    { immediate: true },
  )

  watch(
    () => props.defaultExpanded,
    (value) => {
      if (value !== undefined) expanded.value = value
    },
  )

  onBeforeUnmount(clearTimer)

  const rootAttrs = computed(() => ({
    class: [
      'v-thought-line',
      {
        'v-thought-line--expanded': expanded.value,
        'v-thought-line--thinking': isThinking.value,
        'v-thought-line--complete': config.value.isComplete,
        'v-thought-line--expressive': isExpressive.value,
      },
    ],
    'data-test-id': 'v-thought-line',
    'data-state': config.value.isComplete ? 'complete' : 'thinking',
  }))

  const headerAttrs = computed(() => ({
    type: 'button' as const,
    class: 'v-thought-line__header',
    'data-test-id': 'v-thought-line-header',
    'aria-expanded': expanded.value,
    'aria-label': props.ariaLabel ?? summaryLabel.value,
  }))

  const toggleExpanded = () => {
    expanded.value = !expanded.value
    emit('update:expanded', expanded.value)
  }

  return {
    config,
    rootAttrs,
    headerAttrs,
    expanded,
    summaryLabel,
    formattedDuration,
    isThinking,
    isExpressive,
    toggleExpanded,
  }
}
