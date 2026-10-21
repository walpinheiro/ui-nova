import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import {
  addMonths,
  formatDate,
  formatDateRange,
  getCalendarDays,
  getMonthLabel,
  getWeekdayLabels,
  isDateDisabled,
  isInRange,
  isSameDay,
  resolvePresetRange,
  startOfDay,
  toDateKey,
  type DateRangeValue,
} from '../_shared/dateUtils'
import { useOverlayPosition } from '../_shared/useOverlayPosition'
import { mountVDatePicker } from './mountVDatePicker'
import type { VDatePickerProps, VDatePickerState } from './VDatePicker.types'

type VDatePickerEmit = {
  (event: 'update:modelValue', value: Date | null): void
  (event: 'update:rangeValue', value: DateRangeValue): void
  (event: 'change', value: Date | null): void
  (event: 'open-change', value: boolean): void
}

export function useVDatePicker(props: VDatePickerProps, emit: VDatePickerEmit) {
  const config = computed(() => mountVDatePicker(props))
  const generatedId = useId()
  const inputId = computed(() => `datepicker-input-${generatedId}`)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const open = ref(false)
  const focused = ref(false)
  const liveMessage = ref('')
  const viewDate = ref(startOfDay(props.modelValue ?? new Date()))
  const draftRange = ref<DateRangeValue>({ start: null, end: null })

  const { placement, positionStyle, updatePosition, bindListeners, unbindListeners } = useOverlayPosition(
    triggerRef,
    panelRef,
    open,
  )

  const selectedDate = computed(() => (props.modelValue ? startOfDay(props.modelValue) : null))
  const rangeValue = computed<DateRangeValue>(() => props.rangeValue ?? draftRange.value)
  const hasValue = computed(() => Boolean(selectedDate.value || rangeValue.value.start || rangeValue.value.end))

  const displayValue = computed(() => {
    if (props.range || config.value.variant === 'range') {
      return formatDateRange(rangeValue.value, config.value.format)
    }
    return selectedDate.value ? formatDate(selectedDate.value, config.value.format) : ''
  })

  const dataState = computed<VDatePickerState>(() => {
    if (config.value.disabled) return 'disabled'
    if (open.value) return 'open'
    if (hasValue.value) return 'filled'
    if (focused.value) return 'focus'
    return 'default'
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-date-picker',
      `v-date-picker--${config.value.size}`,
      `v-date-picker--${config.value.variant}`,
      {
        'v-date-picker--open': open.value,
        'v-date-picker--disabled': config.value.disabled,
        'v-date-picker--has-value': hasValue.value,
      },
    ],
    'data-test-id': 'v-date-picker',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-state': dataState.value,
  }))

  const calendarDays = computed(() => getCalendarDays(viewDate.value.getFullYear(), viewDate.value.getMonth()))
  const weekdayLabels = computed(() => getWeekdayLabels())
  const monthLabel = computed(() => getMonthLabel(viewDate.value))
  const today = computed(() => startOfDay(new Date()))

  const announce = (message: string) => {
    liveMessage.value = message
  }

  const setOpen = async (value: boolean) => {
    if (config.value.disabled) return
    open.value = value
    emit('open-change', value)
    if (value) {
      bindListeners()
      await updatePosition()
    } else {
      unbindListeners()
    }
  }

  const toggle = () => setOpen(!open.value)

  const selectDate = (day: Date) => {
    if (
      isDateDisabled(day, {
        min: props.min,
        max: props.max,
        disabledDates: props.disabledDates,
      })
    ) {
      announce(`${formatDate(day, config.value.format)} unavailable`)
      return
    }

    if (props.range || config.value.variant === 'range') {
      const current = rangeValue.value
      if (!current.start || (current.start && current.end)) {
        draftRange.value = { start: startOfDay(day), end: null }
      } else if (current.start && !current.end) {
        const start = current.start
        const end = startOfDay(day)
        draftRange.value =
          end.getTime() < start.getTime() ? { start: end, end: start } : { start, end }
        emit('update:rangeValue', draftRange.value)
        announce(formatDateRange(draftRange.value, config.value.format))
      }
      return
    }

    const normalized = startOfDay(day)
    emit('update:modelValue', normalized)
    emit('change', normalized)
    announce(formatDate(normalized, config.value.format))
  }

  const applyDone = () => {
    void setOpen(false)
  }

  const clearValue = () => {
    if (props.range || config.value.variant === 'range') {
      draftRange.value = { start: null, end: null }
      emit('update:rangeValue', draftRange.value)
      announce('Date range cleared')
      return
    }
    emit('update:modelValue', null)
    emit('change', null)
    announce('Date cleared')
  }

  const goToday = () => {
    viewDate.value = today.value
    selectDate(today.value)
  }

  const prevMonth = () => {
    viewDate.value = addMonths(viewDate.value, -1)
  }

  const nextMonth = () => {
    viewDate.value = addMonths(viewDate.value, 1)
  }

  const applyPreset = (key: string) => {
    draftRange.value = resolvePresetRange(key)
    emit('update:rangeValue', draftRange.value)
    announce(formatDateRange(draftRange.value, config.value.format))
  }

  const dayClasses = (day: Date) => {
    const inCurrentMonth = day.getMonth() === viewDate.value.getMonth()
    const selected = selectedDate.value && isSameDay(day, selectedDate.value)
    const inRange = isInRange(day, rangeValue.value.start, rangeValue.value.end)
    const disabled = isDateDisabled(day, {
      min: props.min,
      max: props.max,
      disabledDates: props.disabledDates,
    })
    const isToday = isSameDay(day, today.value)
    const hasEvent = props.eventDates?.some((eventDate) => isSameDay(eventDate, day))

    return {
      'v-date-picker__day--outside': !inCurrentMonth,
      'v-date-picker__day--selected': selected || false,
      'v-date-picker__day--in-range': inRange,
      'v-date-picker__day--disabled': disabled,
      'v-date-picker__day--today': isToday,
      'v-date-picker__day--event': hasEvent,
    }
  }

  const dayTestId = (day: Date) => {
    if (selectedDate.value && isSameDay(day, selectedDate.value)) return 'datepicker-day-selected'
    if (isInRange(day, rangeValue.value.start, rangeValue.value.end)) return 'datepicker-day-in-range'
    if (
      isDateDisabled(day, { min: props.min, max: props.max, disabledDates: props.disabledDates })
    ) {
      return 'datepicker-day-disabled'
    }
    if (isSameDay(day, today.value)) return 'datepicker-day-today'
    if (props.eventDates?.some((eventDate) => isSameDay(eventDate, day))) return 'datepicker-day-event'
    return 'datepicker-day'
  }

  const onDocumentPointerDown = (event: MouseEvent) => {
    const target = event.target as Node
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    void setOpen(false)
  }

  watch(open, (value) => {
    if (value) document.addEventListener('mousedown', onDocumentPointerDown)
    else document.removeEventListener('mousedown', onDocumentPointerDown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onDocumentPointerDown)
    unbindListeners()
  })

  return {
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
    setOpen,
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
  }
}
