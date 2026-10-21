<script setup lang="ts">
import './VBarChart.scss'
import { useVBarChart } from './useVBarChart'
import type { VBarChartEmits, VBarChartProps } from './VBarChart.types'

const props = withDefaults(defineProps<VBarChartProps>(), {
  active: undefined,
  height: 120,
  variant: 'pill',
  tone: 'primary',
  showValue: 'active',
  showLabels: true,
  interactive: false,
})

const emit = defineEmits<VBarChartEmits>()
const vm = useVBarChart(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <div class="v-bar-chart__plot">
      <div
        v-for="bar in vm.config.value.bars"
        :key="bar.key"
        class="v-bar-chart__column"
        :class="{ 'v-bar-chart__column--active': bar.active }"
        data-test-id="v-bar-chart-column"
        :data-active="bar.active || undefined"
      >
        <span class="v-bar-chart__slot" :style="{ height: `${bar.percent}%` }">
          <span v-if="bar.valueVisible" class="v-bar-chart__value" data-test-id="v-bar-chart-value">{{ bar.text }}</span>
          <component
            :is="interactive ? 'button' : 'span'"
            :type="interactive ? 'button' : undefined"
            class="v-bar-chart__bar"
            :aria-label="interactive ? `${bar.label}: ${bar.text}` : undefined"
            :aria-pressed="interactive ? bar.active : undefined"
            @click="vm.activate(bar.index)"
            @focus="vm.activate(bar.index)"
          />
        </span>
      </div>
    </div>
    <div v-if="showLabels" class="v-bar-chart__labels" aria-hidden="true">
      <span
        v-for="bar in vm.config.value.bars"
        :key="bar.key"
        class="v-bar-chart__label"
        :class="{ 'v-bar-chart__label--active': bar.active }"
      >{{ bar.label }}</span>
    </div>
  </div>
</template>
