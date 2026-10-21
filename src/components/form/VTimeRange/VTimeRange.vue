<script setup lang="ts">
import { computed } from 'vue'
import './VTimeRange.scss'
import clockIcon from '@iconify-icons/keyline-icons/clock'
import arrowRightIcon from '@iconify-icons/keyline-icons/arrow-right'
import xIcon from '@iconify-icons/keyline-icons/x'
import { VIcon } from '../../primitives/VIcon'
import { mountVTimeRange, rangeMinutes } from './mountVTimeRange'
import type { VTimeRangeEmits, VTimeRangeProps } from './VTimeRange.types'

const props = withDefaults(defineProps<VTimeRangeProps>(), {
  start: '09:00',
  end: '10:00',
  step: 5,
  showDuration: true,
  closable: true,
  disabled: false,
  size: 'md',
  startLabel: 'Start time',
  endLabel: 'End time',
})

const emit = defineEmits<VTimeRangeEmits>()
const config = computed(() => mountVTimeRange(props))

function update(which: 'start' | 'end', event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (!value) return
  const range = { start: props.start, end: props.end, [which]: value }
  if (which === 'start') emit('update:start', value)
  else emit('update:end', value)
  emit('change', { ...range, minutes: rangeMinutes(range.start, range.end) ?? 0 })
}
</script>

<template>
  <div
    class="v-time-range"
    :class="[`v-time-range--${config.size}`, { 'is-disabled': disabled }]"
    role="group"
    :aria-label="`${startLabel} – ${endLabel}`"
    :data-test-id="dataTestId ?? 'v-time-range'"
  >
    <div class="v-time-range__pill">
      <VIcon class="v-time-range__icon" :icon="clockIcon" size="sm" aria-hidden="true" />
      <input
        class="v-time-range__input"
        type="time"
        :value="start"
        :step="config.stepSeconds"
        :aria-label="startLabel"
        :disabled="disabled"
        data-test-id="v-time-range-start"
        @change="update('start', $event)"
      >
      <VIcon class="v-time-range__arrow" :icon="arrowRightIcon" size="sm" aria-hidden="true" />
      <input
        class="v-time-range__input"
        type="time"
        :value="end"
        :step="config.stepSeconds"
        :aria-label="endLabel"
        :disabled="disabled"
        data-test-id="v-time-range-end"
        @change="update('end', $event)"
      >
      <output v-if="showDuration && config.duration" class="v-time-range__duration" data-test-id="v-time-range-duration">
        {{ config.duration }}
      </output>
    </div>
    <button
      v-if="closable"
      type="button"
      class="v-time-range__close"
      aria-label="Close"
      :disabled="disabled"
      data-test-id="v-time-range-close"
      @click="emit('close')"
    >
      <VIcon :icon="xIcon" size="sm" />
    </button>
  </div>
</template>
