<script setup lang="ts">
import './VFunnelChart.scss'
import arrowRightIcon from '@iconify-icons/keyline-icons/arrow-right'
import { VIcon } from '../../primitives/VIcon'
import { useVFunnelChart } from './useVFunnelChart'
import type { VFunnelChartProps } from './VFunnelChart.types'

const props = withDefaults(defineProps<VFunnelChartProps>(), {
  height: 120,
  showConversion: true,
  tone: 'primary',
})

const vm = useVFunnelChart(props)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <div
      v-for="column in vm.config.value.columns"
      :key="column.key"
      class="v-funnel-chart__stage"
      role="listitem"
      data-test-id="v-funnel-chart-stage"
    >
      <div class="v-funnel-chart__head">
        <span class="v-funnel-chart__label">{{ column.label }}</span>
        <span class="v-funnel-chart__value">{{ column.text }}</span>
        <span v-if="column.caption" class="v-funnel-chart__caption">{{ column.caption }}</span>
      </div>
      <div class="v-funnel-chart__capsule" aria-hidden="true">
        <span class="v-funnel-chart__fill" :style="{ height: `${column.percent}%` }" />
      </div>
      <span
        v-if="showConversion && column.conversion !== null"
        class="v-funnel-chart__conversion"
        data-test-id="v-funnel-chart-conversion"
        :aria-label="`${column.conversion}% convert to the next stage`"
      >
        <VIcon :icon="arrowRightIcon" size="sm" />
        {{ column.conversion }}%
      </span>
    </div>
  </div>
</template>
