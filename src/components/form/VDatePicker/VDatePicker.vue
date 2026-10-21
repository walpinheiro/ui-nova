<script setup lang="ts">
import './VDatePicker.scss'
import { VButton } from '../VButton'
import { VIcon } from '../../primitives/VIcon'
import { useVDatePicker } from './useVDatePicker'
import type { VDatePickerProps } from './VDatePicker.types'

const props = withDefaults(defineProps<VDatePickerProps>(), {
  modelValue: null,
  range: false,
  variant: 'default',
  size: 'md',
  disabled: false,
  showToday: true,
  clearable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  'update:rangeValue': [value: { start: Date | null; end: Date | null }]
  change: [value: Date | null]
  'open-change': [value: boolean]
}>()

const {
  config,
  inputId,
  triggerRef,
  panelRef,
  open,
  focused,
  rootAttrs,
  placement,
  positionStyle,
  displayValue,
  calendarDays,
  weekdayLabels,
  monthLabel,
  liveMessage,
  hasValue,
  toggle,
  selectDate,
  applyDone,
  clearValue,
  goToday,
  prevMonth,
  nextMonth,
  applyPreset,
  dayClasses,
  dayTestId,
  toDateKey,
} = useVDatePicker(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <label v-if="props.label" class="v-date-picker__label" :for="inputId">{{ props.label }}</label>

    <div ref="triggerRef" class="v-date-picker__anchor">
      <div class="v-date-picker__field" data-test-id="datepicker-input">
        <span
          v-if="config.showLeadingIcon"
          class="v-date-picker__leading-icon"
          data-test-id="datepicker-leading-icon"
          aria-hidden="true"
        >
          <VIcon :icon="config.calendarIcon" size="sm" />
        </span>

        <button
          :id="inputId"
          type="button"
          class="v-date-picker__value"
          :disabled="config.disabled || undefined"
          :aria-expanded="open"
          :aria-haspopup="'dialog'"
          @click="toggle"
          @focus="focused = true"
          @blur="focused = false"
        >
          {{ displayValue || config.placeholder }}
        </button>

        <button
          v-if="config.clearable && hasValue"
          type="button"
          class="v-date-picker__clear"
          data-test-id="datepicker-clear-button"
          aria-label="Clear date"
          @click.stop="clearValue"
        >
          <VIcon :icon="config.clearIcon" size="sm" />
        </button>

        <button
          type="button"
          class="v-date-picker__trigger"
          data-test-id="datepicker-trigger"
          :disabled="config.disabled || undefined"
          aria-label="Open calendar"
          @click="toggle"
        >
          <VIcon :icon="open ? config.chevronUpIcon : config.chevronDownIcon" size="sm" />
        </button>
      </div>

      <div
        v-if="open"
        ref="panelRef"
        class="v-date-picker__calendar"
        :class="`v-date-picker__calendar--${placement}`"
        data-test-id="datepicker-calendar"
        role="dialog"
        aria-label="Choose date"
        :style="positionStyle"
      >
        <div class="v-date-picker__calendar-header">
          <button type="button" data-test-id="datepicker-month-prev" aria-label="Previous month" @click="prevMonth">
            <VIcon :icon="config.prevIcon" size="sm" />
          </button>
          <strong>{{ monthLabel }}</strong>
          <button type="button" data-test-id="datepicker-month-next" aria-label="Next month" @click="nextMonth">
            <VIcon :icon="config.nextIcon" size="sm" />
          </button>
        </div>

        <div class="v-date-picker__weekdays" aria-hidden="true">
          <span v-for="day in weekdayLabels" :key="day">{{ day }}</span>
        </div>

        <div class="v-date-picker__days" role="grid">
          <button
            v-for="day in calendarDays"
            :key="toDateKey(day)"
            type="button"
            class="v-date-picker__day"
            :class="dayClasses(day)"
            :data-test-id="dayTestId(day)"
            :aria-selected="dayClasses(day)['v-date-picker__day--selected'] || undefined"
            :aria-disabled="dayClasses(day)['v-date-picker__day--disabled'] || undefined"
            @click="selectDate(day)"
          >
            {{ day.getDate() }}
          </button>
        </div>

        <div class="v-date-picker__footer">
          <button
            v-if="config.showToday"
            type="button"
            class="v-date-picker__today"
            data-test-id="datepicker-today-button"
            @click="goToday"
          >
            Today
          </button>
          <button type="button" class="v-date-picker__clear-action" data-test-id="datepicker-clear-action" @click="clearValue">
            Clear
          </button>
          <VButton size="sm" variant="primary" data-test-id="datepicker-done-button" @click="applyDone">
            Done
          </VButton>
        </div>
      </div>
    </div>

    <div v-if="config.variant === 'with-preset'" class="v-date-picker__presets">
      <button
        v-for="preset in config.presets"
        :key="preset.value"
        type="button"
        class="v-date-picker__preset"
        @click="applyPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>

    <span class="v-date-picker__live" aria-live="polite">{{ liveMessage }}</span>
  </div>
</template>
