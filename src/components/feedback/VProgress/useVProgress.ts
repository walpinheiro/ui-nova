import { computed, type CSSProperties } from 'vue'
import type { VProgressProps } from './VProgress.types'
import { mountVProgress } from './mountVProgress'

export function useVProgress(props: VProgressProps) {
  const config = computed(() => mountVProgress(props))

  const rootAttrs = computed(() => ({
    class: [
      'v-progress',
      `v-progress--${config.value.variant}`,
      `v-progress--${config.value.size}`,
      `v-progress--${config.value.state}`,
    ],
    'data-test-id': config.value.testId,
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.state,
  }))

  const progressAttrs = computed(() => ({
    role: 'progressbar' as const,
    'aria-valuemin': config.value.isDeterminate ? 0 : undefined,
    'aria-valuemax': config.value.isDeterminate ? 100 : undefined,
    'aria-valuenow': config.value.isDeterminate ? config.value.value : undefined,
    'aria-label': config.value.ariaLabel,
    'aria-busy': config.value.state === 'indeterminate' ? 'true' : undefined,
  }))

  const linearValueStyle = computed<CSSProperties>(() => ({
    '--v-progress-value': String(config.value.valueRatio),
  }))

  const circularValueStyle = computed<CSSProperties>(() => {
    const offset = config.value.circularCircumference * (1 - config.value.valueRatio)
    return {
      strokeDasharray: `${config.value.circularCircumference}`,
      strokeDashoffset: `${offset}`,
    }
  })

  const circularWrapStyle = computed<CSSProperties>(() => ({
    width: `${config.value.circularSize}px`,
    height: `${config.value.circularSize}px`,
    minWidth: `${config.value.circularSize}px`,
    minHeight: `${config.value.circularSize}px`,
  }))

  const circularSvgStyle = computed<CSSProperties>(() => ({
    width: `${config.value.circularSize}px`,
    height: `${config.value.circularSize}px`,
    minWidth: `${config.value.circularSize}px`,
    minHeight: `${config.value.circularSize}px`,
  }))

  return { config, rootAttrs, progressAttrs, linearValueStyle, circularValueStyle, circularWrapStyle, circularSvgStyle }
}
