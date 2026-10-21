import { computed, onBeforeUnmount, ref, useId, type CSSProperties } from 'vue'
import {
  clampValue,
  formatSliderValue,
  mountVSlider,
  percentForValue,
  snapToNearestMark,
  snapValue,
} from './mountVSlider'
import type { VSliderProps, VSliderState, VSliderThumb } from './VSlider.types'

type VSliderEmit = {
  (event: 'update:modelValue', value: number | [number, number]): void
  (event: 'change', value: number | [number, number]): void
}

function normalizeModelValue(
  props: VSliderProps,
  min: number,
  max: number,
  range: boolean,
): number | [number, number] {
  if (range) {
    const current = Array.isArray(props.modelValue) ? props.modelValue : [min, max]
    const start = clampValue(current[0] ?? min, min, max)
    const end = clampValue(current[1] ?? max, min, max)
    return start <= end ? [start, end] : [end, start]
  }
  const value = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue
  return clampValue(value ?? min, min, max)
}

export function useVSlider(props: VSliderProps, emit: VSliderEmit) {
  const config = computed(() => mountVSlider(props))
  const generatedId = useId()
  const rootId = computed(() => props.id ?? `v-slider-${generatedId}`)
  const trackRef = ref<HTMLElement | null>(null)
  const activeThumb = ref<VSliderThumb | null>(null)
  const dragging = ref(false)
  const focusedThumb = ref<VSliderThumb | null>(null)
  const hoveredThumb = ref<VSliderThumb | null>(null)
  const wakeIntensity = ref(0)
  let lastPointerX = 0
  let lastPointerTime = 0
  const isExpressive = computed(() => props.motion === 'expressive')

  const values = computed(() => normalizeModelValue(props, config.value.min, config.value.max, config.value.range))

  const markValues = computed(() => config.value.marks.map((mark) => mark.value))

  const singleValue = computed(() => (Array.isArray(values.value) ? values.value[0] : values.value))
  const minValue = computed(() => (Array.isArray(values.value) ? values.value[0] : values.value))
  const maxValue = computed(() => (Array.isArray(values.value) ? values.value[1] : values.value))

  const dataState = computed<VSliderState>(() => {
    if (config.value.disabled) return 'disabled'
    if (dragging.value) return 'dragging'
    if (focusedThumb.value) return 'focus'
    if (hoveredThumb.value) return 'hover'
    return 'default'
  })

  const valueLabel = computed(() => formatSliderValue(values.value))

  const resolveValue = (raw: number, thumb: VSliderThumb): number | [number, number] => {
    let next = snapValue(raw, config.value.step, config.value.min, config.value.max)
    if (config.value.snapToMarks && markValues.value.length) {
      next = snapToNearestMark(next, markValues.value, config.value.min, config.value.max)
    }

    if (!config.value.range) return next

    const current = values.value as [number, number]
    if (thumb === 'min') {
      const max = current[1]
      return [Math.min(next, max), max]
    }
    const min = current[0]
    return [min, Math.max(next, min)]
  }

  const emitValue = (next: number | [number, number], commit = false) => {
    emit('update:modelValue', next)
    if (commit) emit('change', next)
  }

  const updateFromPointer = (clientX: number, clientY: number, thumb: VSliderThumb, commit = false) => {
    const track = trackRef.value
    if (!track || config.value.disabled) return
    const rect = track.getBoundingClientRect()
    const ratio = config.value.orientation === 'vertical'
      ? 1 - (clientY - rect.top) / rect.height
      : (clientX - rect.left) / rect.width
    const clampedRatio = clampValue(ratio, 0, 1)
    const raw = config.value.min + clampedRatio * (config.value.max - config.value.min)
    emitValue(resolveValue(raw, thumb), commit)
  }

  const onTrackPointerDown = (event: PointerEvent) => {
    if (config.value.disabled) return
    const track = trackRef.value
    if (!track) return
    track.setPointerCapture(event.pointerId)
    const thumb = config.value.range
      ? chooseRangeThumb(event.clientX, event.clientY)
      : 'single'
    activeThumb.value = thumb
    dragging.value = true
    updateFromPointer(event.clientX, event.clientY, thumb)
  }

  const onTrackPointerMove = (event: PointerEvent) => {
    if (!dragging.value || !activeThumb.value) return
    if (isExpressive.value) {
      const now = performance.now()
      const dt = Math.max(1, now - lastPointerTime)
      const velocity = Math.abs(event.clientX - lastPointerX) / dt
      wakeIntensity.value = Math.min(1, velocity * 0.08)
      lastPointerX = event.clientX
      lastPointerTime = now
    }
    updateFromPointer(event.clientX, event.clientY, activeThumb.value)
  }

  const onTrackPointerUp = (event: PointerEvent) => {
    if (!dragging.value || !activeThumb.value) return
    updateFromPointer(event.clientX, event.clientY, activeThumb.value, true)
    dragging.value = false
    activeThumb.value = null
    wakeIntensity.value = 0
    trackRef.value?.releasePointerCapture(event.pointerId)
  }

  const chooseRangeThumb = (clientX: number, clientY: number): VSliderThumb => {
    const track = trackRef.value
    if (!track) return 'min'
    const rect = track.getBoundingClientRect()
    const ratio = config.value.orientation === 'vertical'
      ? 1 - (clientY - rect.top) / rect.height
      : (clientX - rect.left) / rect.width
    const raw = config.value.min + clampValue(ratio, 0, 1) * (config.value.max - config.value.min)
    const [min, max] = values.value as [number, number]
    return Math.abs(raw - min) <= Math.abs(raw - max) ? 'min' : 'max'
  }

  const adjustValue = (thumb: VSliderThumb, delta: number, page = false) => {
    if (config.value.disabled) return
    const jump = page ? (config.value.max - config.value.min) / 10 : config.value.step
    const current = thumb === 'max'
      ? maxValue.value
      : thumb === 'min'
        ? minValue.value
        : singleValue.value
    emitValue(resolveValue(current + delta * jump, thumb), true)
  }

  const onThumbKeydown = (event: KeyboardEvent, thumb: VSliderThumb) => {
    if (config.value.disabled) return
    const horizontal = config.value.orientation === 'horizontal'
    const decreaseKeys = horizontal ? ['ArrowLeft'] : ['ArrowDown']
    const increaseKeys = horizontal ? ['ArrowRight'] : ['ArrowUp']

    if (decreaseKeys.includes(event.key)) {
      event.preventDefault()
      adjustValue(thumb, -1)
      return
    }
    if (increaseKeys.includes(event.key)) {
      event.preventDefault()
      adjustValue(thumb, 1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      emitValue(resolveValue(config.value.min, thumb), true)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      emitValue(resolveValue(config.value.max, thumb), true)
      return
    }
    if (event.key === 'PageDown') {
      event.preventDefault()
      adjustValue(thumb, -1, true)
      return
    }
    if (event.key === 'PageUp') {
      event.preventDefault()
      adjustValue(thumb, 1, true)
    }
  }

  const thumbStyle = (value: number): CSSProperties => {
    const percent = percentForValue(value, config.value.min, config.value.max)
    if (config.value.orientation === 'vertical') {
      return { bottom: `${percent}%` }
    }
    return { left: `${percent}%` }
  }

  const fillStyle = computed((): CSSProperties => {
    if (config.value.range) {
      const start = percentForValue(minValue.value, config.value.min, config.value.max)
      const end = percentForValue(maxValue.value, config.value.min, config.value.max)
      if (config.value.orientation === 'vertical') {
        return { bottom: `${start}%`, height: `${end - start}%` }
      }
      return { left: `${start}%`, width: `${end - start}%` }
    }
    const percent = percentForValue(singleValue.value, config.value.min, config.value.max)
    if (config.value.orientation === 'vertical') {
      return { height: `${percent}%` }
    }
    return { width: `${percent}%` }
  })

  const showThumbTooltip = (thumb: VSliderThumb) =>
    config.value.showTooltip && dragging.value && activeThumb.value === thumb

  const thumbAttrs = (thumb: VSliderThumb, value: number) => ({
    role: 'slider',
    tabindex: config.value.disabled ? -1 : 0,
    'aria-disabled': config.value.disabled || undefined,
    'aria-orientation': config.value.orientation,
    'aria-valuemin': config.value.min,
    'aria-valuemax': config.value.max,
    'aria-valuenow': value,
    'aria-valuetext': String(value),
    'aria-label': props.ariaLabel ?? (thumb === 'min' ? 'Minimum value' : thumb === 'max' ? 'Maximum value' : 'Slider value'),
    'data-test-id': thumb === 'min' ? 'v-slider-thumb-min' : thumb === 'max' ? 'v-slider-thumb-max' : 'v-slider-thumb',
    style: thumbStyle(value),
    onFocus: () => { focusedThumb.value = thumb },
    onBlur: () => { if (focusedThumb.value === thumb) focusedThumb.value = null },
    onMouseenter: () => { hoveredThumb.value = thumb },
    onMouseleave: () => { if (hoveredThumb.value === thumb) hoveredThumb.value = null },
    onKeydown: (event: KeyboardEvent) => onThumbKeydown(event, thumb),
  })

  const rootAttrs = computed(() => ({
    id: rootId.value,
    class: [
      'v-slider',
      `v-slider--${config.value.size}`,
      `v-slider--${config.value.orientation}`,
      {
        'v-slider--range': config.value.range,
        'v-slider--disabled': config.value.disabled,
        'v-slider--dragging': dragging.value,
        'v-slider--expressive': isExpressive.value,
      },
    ],
    'data-test-id': 'v-slider',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dataState.value,
    'data-orientation': config.value.orientation,
  }))

  onBeforeUnmount(() => {
    dragging.value = false
    activeThumb.value = null
  })

  return {
    config,
    trackRef,
    rootAttrs,
    fillStyle,
    values,
    singleValue,
    minValue,
    maxValue,
    valueLabel,
    dataState,
    dragging,
    activeThumb,
    showThumbTooltip,
    thumbAttrs,
    onTrackPointerDown,
    onTrackPointerMove,
    onTrackPointerUp,
    wakeIntensity,
    isExpressive,
  }
}
