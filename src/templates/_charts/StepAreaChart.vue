<script setup lang="ts">
import { computed } from 'vue'
import { curvedStepPaths, linearScale, stepAreaPath } from './chartMath'

const props = withDefaults(
  defineProps<{
    values: number[]
    height?: number
    color?: string
    ariaLabel?: string
    /** Join the column tops with smooth bezier curves (funnel look) instead of hard steps. */
    curve?: boolean
  }>(),
  { curve: false, height: 180, color: 'var(--chart-accent, var(--v-color-primary))' },
)

const W = 400
const uid = `sa-${Math.random().toString(36).slice(2, 7)}`
const base = computed(() => props.height - 4)
const max = computed(() => Math.max(...props.values) * 1.12)
const yOf = computed(() => linearScale(0, max.value, base.value, 10))
const curved = computed(() => curvedStepPaths(props.values, 0, W, base.value, yOf.value))
const d = computed(() => (props.curve ? curved.value.area : stepAreaPath(props.values, 0, W, base.value, yOf.value)))
const edge = computed(() => (props.curve ? curved.value.line : d.value))
const band = computed(() => W / props.values.length)
</script>

<template>
  <svg class="chart-step" :class="{ 'chart-step--curve': curve }" :viewBox="`0 0 ${W} ${height}`" preserveAspectRatio="none" role="img" :aria-label="ariaLabel ?? 'Stepped area chart'">
    <defs>
      <pattern :id="`${uid}-stripes`" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <rect width="3" height="8" :fill="color" opacity="0.5" />
      </pattern>
      <linearGradient :id="`${uid}-fade`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.32" />
        <stop offset="100%" :stop-color="color" stop-opacity="0.05" />
      </linearGradient>
    </defs>
    <path :d="d" :fill="`url(#${uid}-fade)`" />
    <path :d="d" :fill="`url(#${uid}-stripes)`" />
    <path :d="edge" fill="none" :stroke="color" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round" />
    <template v-for="(_, i) in values" :key="i">
      <line v-if="i > 0" class="chart-step__sep" :x1="band * i" :x2="band * i" y1="0" :y2="height" vector-effect="non-scaling-stroke" />
    </template>
  </svg>
</template>

<style scoped lang="scss">
.chart-step {
  display: block;
  width: 100%;
  height: auto;
  min-height: 140px;
  overflow: hidden;
  border-radius: var(--v-radius-8);

  &--curve {
    border-radius: 0;
  }

  &__sep {
    stroke: var(--v-color-surface);
    stroke-width: 2;
  }
}
</style>
