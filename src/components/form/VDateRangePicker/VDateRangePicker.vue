<script setup lang="ts">
import './VDateRangePicker.scss'
import { VButton } from '../VButton'
import { VIcon } from '../../primitives/VIcon'
import { useVDateRangePicker } from './useVDateRangePicker'
import type { VDateRangePickerProps } from './VDateRangePicker.types'

const props = withDefaults(defineProps<VDateRangePickerProps>(), {
  modelValue: null,
  variant: 'default',
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: import('./VDateRangePicker.types').VDateRangeValue | null]
  change: [value: import('./VDateRangePicker.types').VDateRangeValue | null]
  'open-change': [value: boolean]
  apply: [value: import('./VDateRangePicker.types').VDateRangeValue | null]
  cancel: []
}>()

const {
  config,
  triggerRef,
  panelRef,
  open,
  focused,
  rootAttrs,
  placement,
  positionStyle,
  displayValue,
  monthPanels,
  weekdayLabels,
  liveMessage,
  hasValue,
  activePreset,
  hoverDay,
  toggle,
  selectDay,
  applyPreset,
  applyRange,
  cancel,
  clearRange,
  prevMonth,
  nextMonth,
  dayClasses,
  getCalendarDays,
  getMonthLabel,
  toDateKey,
  presetTestId,
} = useVDateRangePicker(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <label v-if="props.label" class="v-date-range-picker__label">{{ props.label }}</label>

    <div ref="triggerRef" class="v-date-range-picker__anchor">
    <div
      class="v-date-range-picker__field"
      data-test-id="v-date-range-picker-input"
      @click="toggle"
    >
      <span class="v-date-range-picker__leading-icon" data-test-id="v-date-range-picker-leading-icon" aria-hidden="true">
        <VIcon :icon="config.calendarIcon" size="sm" />
      </span>

      <span class="v-date-range-picker__value" data-test-id="v-date-range-picker-start">
        {{ displayValue || config.placeholder }}
      </span>

      <button
        v-if="hasValue"
        type="button"
        class="v-date-range-picker__clear"
        data-test-id="v-date-range-picker-clear"
        aria-label="Clear date range"
        @click.stop="clearRange"
      >
        <VIcon :icon="config.clearIcon" size="sm" />
      </button>

      <button
        type="button"
        class="v-date-range-picker__chevron"
        data-test-id="v-date-range-picker-chevron"
        :disabled="config.disabled || undefined"
        aria-label="Open date range picker"
        @click.stop="toggle"
        @focus="focused = true"
        @blur="focused = false"
      >
        <VIcon :icon="open ? config.chevronUpIcon : config.chevronDownIcon" size="sm" />
      </button>
    </div>

      <div
        v-if="open"
        ref="panelRef"
        class="v-date-range-picker__popover"
        :class="`v-date-range-picker__popover--${placement}`"
        data-test-id="v-date-range-picker-popover"
        role="dialog"
        aria-label="Choose date range"
        :style="positionStyle"
      >
        <div class="v-date-range-picker__body">
        <aside
          v-if="config.variant === 'presets' || config.presets.length"
          class="v-date-range-picker__presets"
          data-test-id="v-date-range-picker-presets"
        >
          <button
            v-for="preset in config.presets"
            :key="preset.range"
            type="button"
            class="v-date-range-picker__preset"
            :class="{ 'v-date-range-picker__preset--active': activePreset === preset.range }"
            :data-test-id="presetTestId(preset.range)"
            @click="applyPreset(preset.range)"
          >
            {{ preset.label }}
          </button>
        </aside>

        <div class="v-date-range-picker__calendars">
          <div class="v-date-range-picker__nav">
            <button type="button" data-test-id="v-date-range-picker-calendar-prev" aria-label="Previous month" @click="prevMonth">
              <VIcon :icon="config.prevIcon" size="sm" />
            </button>
            <button type="button" data-test-id="v-date-range-picker-calendar-next" aria-label="Next month" @click="nextMonth">
              <VIcon :icon="config.nextIcon" size="sm" />
            </button>
          </div>

          <div class="v-date-range-picker__months">
            <section v-for="(monthDate, panelIndex) in monthPanels" :key="panelIndex" class="v-date-range-picker__month">
              <header>{{ getMonthLabel(monthDate) }}</header>
              <div class="v-date-range-picker__weekdays" aria-hidden="true">
                <span v-for="day in weekdayLabels" :key="`${panelIndex}-${day}`">{{ day }}</span>
              </div>
              <div class="v-date-range-picker__days" role="grid">
                <button
                  v-for="day in getCalendarDays(monthDate.getFullYear(), monthDate.getMonth())"
                  :key="`${panelIndex}-${toDateKey(day)}`"
                  type="button"
                  class="v-date-range-picker__day"
                  :class="dayClasses(day)"
                  :data-test-id="`v-date-range-picker-day-${toDateKey(day)}`"
                  :aria-selected="dayClasses(day)['v-date-range-picker__day--selected'] || undefined"
                  :aria-disabled="dayClasses(day)['v-date-range-picker__day--disabled'] || undefined"
                  @click="selectDay(day)"
                  @mouseenter="hoverDay = day"
                  @mouseleave="hoverDay = null"
                >
                  {{ day.getDate() }}
                </button>
              </div>
            </section>
          </div>
        </div>
        </div>

        <footer class="v-date-range-picker__footer">
          <VButton variant="ghost" data-test-id="v-date-range-picker-cancel" @click="cancel">Cancel</VButton>
          <VButton variant="primary" data-test-id="v-date-range-picker-apply" @click="applyRange">Apply</VButton>
        </footer>
      </div>
    </div>

    <span class="v-date-range-picker__live" aria-live="polite">{{ liveMessage }}</span>
  </div>
</template>
