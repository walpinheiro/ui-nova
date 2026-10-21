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
} from '../_shared/dateUtils'
import { useOverlayPosition } from '../_shared/useOverlayPosition'
import { mountVDateRangePicker } from './mountVDateRangePicker'
import type { VDateRangePickerProps, VDateRangePickerState, VDateRangeValue } from './VDateRangePicker.types'

type VDateRangePickerEmit = {
  (event: 'update:modelValue', value: VDateRangeValue | null): void
  (event: 'change', value: VDateRangeValue | null): void
  (event: 'open-change', value: boolean): void
  (event: 'apply', value: VDateRangeValue | null): void
  (event: 'cancel'): void
}

const EMPTY_RANGE: VDateRangeValue = { start: null, end: null }

export function useVDateRangePicker(props: VDateRangePickerProps, emit: VDateRangePickerEmit) {
  const config = computed(() => mountVDateRangePicker(props))
  const generatedId = useId()
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const open = ref(false)
  const focused = ref(false)
  const liveMessage = ref('')
  const activePreset = ref<string | null>(null)
  const viewDate = ref(startOfDay(new Date()))
  const draft = ref<VDateRangeValue>(props.modelValue ?? { ...EMPTY_RANGE })
  const hoverDay = ref<Date | null>(null)

  const { placement, positionStyle, updatePosition, bindListeners, unbindListeners } = useOverlayPosition(
    triggerRef,
    panelRef,
    open,
  )

  watch(
    () => props.modelValue,
    (value) => {
      draft.value = value ?? { ...EMPTY_RANGE }
    },
    { deep: true },
  )

  const appliedRange = computed(() => props.modelValue ?? EMPTY_RANGE)
  const hasValue = computed(() => Boolean(appliedRange.value.start || appliedRange.value.end))

  const activeFormat = computed(() => {
    if (config.value.variant === 'compact') return config.value.compactFormat
    if (config.value.variant === 'inline') return 'MMM d'
    if (config.value.enableTime) return `${config.value.format} HH:mm`
    return config.value.format
  })

  const displayValue = computed(() => {
    if (activePreset.value && config.value.variant === 'presets') {
      const preset = config.value.presets.find((entry) => entry.range === activePreset.value)
      return preset?.label ?? ''
    }
    return formatDateRange(appliedRange.value, activeFormat.value)
  })

  const previewRange = computed<VDateRangeValue>(() => {
    if (draft.value.start && hoverDay.value && !draft.value.end) {
      const start = draft.value.start
      const end = hoverDay.value
      return end.getTime() < start.getTime() ? { start: end, end: start } : { start, end }
    }
    return draft.value
  })

  const dataState = computed<VDateRangePickerState>(() => {
    if (config.value.disabled) return 'disabled'
    if (open.value) return 'open'
    if (hasValue.value) return 'range-selected'
    if (focused.value) return 'focus'
    return 'default'
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-date-range-picker',
      `v-date-range-picker--${config.value.size}`,
      `v-date-range-picker--${config.value.variant}`,
      {
        'v-date-range-picker--open': open.value,
        'v-date-range-picker--disabled': config.value.disabled,
        'v-date-range-picker--has-value': hasValue.value,
      },
    ],
    'data-test-id': 'v-date-range-picker',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-state': dataState.value,
  }))

  const monthPanels = computed(() => [viewDate.value, addMonths(viewDate.value, 1)])
  const weekdayLabels = computed(() => getWeekdayLabels())
  const today = computed(() => startOfDay(new Date()))

  const announce = (message: string) => {
    liveMessage.value = message
  }

  const setOpen = async (value: boolean) => {
    if (config.value.disabled) return
    open.value = value
    emit('open-change', value)
    if (value) {
      draft.value = { ...(props.modelValue ?? EMPTY_RANGE) }
      bindListeners()
      await updatePosition()
    } else {
      unbindListeners()
    }
  }

  const toggle = () => setOpen(!open.value)

  const selectDay = (day: Date) => {
    if (isDateDisabled(day, { min: props.min, max: props.max, disabledDates: props.disabledDates })) {
      announce(`${formatDate(day, activeFormat.value)} unavailable`)
      return
    }

    const normalized = startOfDay(day)
    if (!draft.value.start || (draft.value.start && draft.value.end)) {
      draft.value = { start: normalized, end: null }
      activePreset.value = 'custom'
      return
    }

    const start = draft.value.start
    const end = normalized
    draft.value = end.getTime() < start.getTime() ? { start: end, end: start } : { start, end }
    activePreset.value = 'custom'
  }

  const applyPreset = (key: string) => {
    if (key === 'custom') {
      activePreset.value = key
      return
    }
    activePreset.value = key
    draft.value = resolvePresetRange(key)
    announce(formatDateRange(draft.value, activeFormat.value))
  }

  const applyRange = () => {
    emit('update:modelValue', draft.value)
    emit('change', draft.value)
    emit('apply', draft.value)
    announce(formatDateRange(draft.value, activeFormat.value))
    void setOpen(false)
  }

  const cancel = () => {
    draft.value = { ...(props.modelValue ?? EMPTY_RANGE) }
    emit('cancel')
    void setOpen(false)
  }

  const clearRange = () => {
    draft.value = { ...EMPTY_RANGE }
    activePreset.value = null
    emit('update:modelValue', null)
    emit('change', null)
    announce('Date range cleared')
  }

  const prevMonth = () => {
    viewDate.value = addMonths(viewDate.value, -1)
  }

  const nextMonth = () => {
    viewDate.value = addMonths(viewDate.value, 1)
  }

  const dayClasses = (day: Date) => {
    const range = previewRange.value
    return {
      'v-date-range-picker__day--selected':
        (range.start && isSameDay(day, range.start)) || (range.end && isSameDay(day, range.end)),
      'v-date-range-picker__day--in-range': isInRange(day, range.start, range.end),
      'v-date-range-picker__day--disabled': isDateDisabled(day, {
        min: props.min,
        max: props.max,
        disabledDates: props.disabledDates,
      }),
      'v-date-range-picker__day--today': isSameDay(day, today.value),
      'v-date-range-picker__day--outside': day.getMonth() !== viewDate.value.getMonth() &&
        day.getMonth() !== addMonths(viewDate.value, 1).getMonth(),
    }
  }

  const presetTestId = (key: string) => {
    const map: Record<string, string> = {
      '7d': 'v-date-range-picker-preset-7d',
      '30d': 'v-date-range-picker-preset-30d',
      '90d': 'v-date-range-picker-preset-90d',
      'this-month': 'v-date-range-picker-preset-this-month',
      'last-month': 'v-date-range-picker-preset-last-month',
      custom: 'v-date-range-picker-preset-custom',
    }
    return map[key] ?? `v-date-range-picker-preset-${key}`
  }

  const onDocumentPointerDown = (event: MouseEvent) => {
    const target = event.target as Node
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    cancel()
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
  }
}
