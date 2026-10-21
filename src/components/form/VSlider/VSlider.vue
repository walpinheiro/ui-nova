<script setup lang="ts">
import './VSlider.scss'
import { useVSlider } from './useVSlider'
import type { VSliderProps } from './VSlider.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VSliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  orientation: 'horizontal',
  disabled: false,
  size: 'md',
  showValue: true,
  showTooltip: true,
  snapToMarks: false,
  motion: V_MOTION_DEFAULT,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | [number, number]]
  change: [value: number | [number, number]]
}>()

const {
  config,
  trackRef,
  rootAttrs,
  fillStyle,
  singleValue,
  minValue,
  maxValue,
  valueLabel,
  dragging,
  activeThumb,
  showThumbTooltip,
  thumbAttrs,
  onTrackPointerDown,
  onTrackPointerMove,
  onTrackPointerUp,
  wakeIntensity,
  isExpressive,
} = useVSlider(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <span
      v-if="config.showValue"
      class="v-slider__value"
      data-test-id="v-slider-value"
    >
      {{ valueLabel }}
    </span>

    <div class="v-slider__control">
      <div
        :ref="(el) => { trackRef = el as HTMLElement | null }"
        class="v-slider__track"
        data-test-id="v-slider-track"
        @pointerdown="onTrackPointerDown"
        @pointermove="onTrackPointerMove"
        @pointerup="onTrackPointerUp"
        @pointercancel="onTrackPointerUp"
      >
        <div
          class="v-slider__fill"
          data-test-id="v-slider-fill"
          :style="fillStyle"
        />

        <div
          v-if="isExpressive"
          class="v-slider__wake"
          aria-hidden="true"
          :style="{ opacity: wakeIntensity }"
        >
          <span
            v-for="bar in 5"
            :key="bar"
            class="v-slider__wake-bar"
            :style="{ '--v-slider-wake-delay': `${bar * 40}ms` }"
          />
        </div>

        <button
          v-if="!config.range"
          type="button"
          class="v-slider__thumb"
          :class="{ 'v-slider__thumb--dragging': dragging && activeThumb === 'single' }"
          v-bind="thumbAttrs('single', singleValue)"
        >
          <span
            v-if="showThumbTooltip('single')"
            class="v-slider__tooltip"
            data-test-id="v-slider-tooltip"
          >
            {{ singleValue }}
          </span>
        </button>

        <template v-else>
          <button
            type="button"
            class="v-slider__thumb v-slider__thumb--min"
            :class="{ 'v-slider__thumb--dragging': dragging && activeThumb === 'min' }"
            v-bind="thumbAttrs('min', minValue)"
          >
            <span
              v-if="showThumbTooltip('min')"
              class="v-slider__tooltip"
              data-test-id="v-slider-tooltip"
            >
              {{ minValue }}
            </span>
          </button>
          <button
            type="button"
            class="v-slider__thumb v-slider__thumb--max"
            :class="{ 'v-slider__thumb--dragging': dragging && activeThumb === 'max' }"
            v-bind="thumbAttrs('max', maxValue)"
          >
            <span
              v-if="showThumbTooltip('max')"
              class="v-slider__tooltip"
              data-test-id="v-slider-tooltip"
            >
              {{ maxValue }}
            </span>
          </button>
        </template>
      </div>

      <div
        v-if="config.marks.length"
        class="v-slider__marks"
        aria-hidden="true"
      >
        <span
          v-for="mark in config.marks"
          :key="mark.value"
          class="v-slider__mark"
          :data-test-id="`v-slider-mark-${mark.value}`"
          :style="thumbAttrs('single', mark.value).style"
        >
          <span class="v-slider__mark-dot" />
          <span v-if="mark.label" class="v-slider__mark-label">{{ mark.label }}</span>
          <span v-else class="v-slider__mark-label">{{ mark.value }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
