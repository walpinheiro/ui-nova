import { computed } from 'vue'
import type { VBarChartDatum, VBarChartProps } from './VBarChart.types'
import { mountVBarChart } from './mountVBarChart'

type Emit = {
  (event: 'update:active', index: number): void
  (event: 'select', datum: VBarChartDatum, index: number): void
}

export function useVBarChart(props: VBarChartProps, emit: Emit) {
  const config = computed(() => mountVBarChart(props))

  const rootAttrs = computed(() => ({
    class: [
      'v-bar-chart',
      `v-bar-chart--${config.value.variant}`,
      `v-bar-chart--${config.value.tone}`,
      { 'v-bar-chart--interactive': props.interactive },
    ],
    role: 'img' as const,
    'aria-label': props.ariaLabel ?? config.value.bars.map((bar) => `${bar.label}: ${bar.text}`).join(', '),
    'data-test-id': props.dataTestId ?? 'v-bar-chart',
    style: { '--v-bar-chart-height': `${config.value.height}px` },
  }))

  function activate(index: number) {
    if (!props.interactive) return
    const datum = props.data?.[index]
    if (!datum) return
    emit('update:active', index)
    emit('select', datum, index)
  }

  return { config, rootAttrs, activate }
}
