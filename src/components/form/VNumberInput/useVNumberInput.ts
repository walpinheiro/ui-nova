import { computed, onBeforeUnmount, ref, toRef, useId, watch } from 'vue'
import type { VNumberInputProps, VNumberInputState } from './VNumberInput.types'
import { clampNumber, mountVNumberInput, parseNumberInput } from './mountVNumberInput'
import { useVNumberInputScrub } from './useVNumberInputScrub'

type VNumberInputEmit = {
  (event: 'update:modelValue', value: number | null): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
  (event: 'increment'): void
  (event: 'decrement'): void
}

export function useVNumberInput(props: VNumberInputProps, emit: VNumberInputEmit) {
  const config = computed(() => mountVNumberInput(props))
  const inputRef = ref<HTMLInputElement | null>(null)
  const focused = ref(false)
  const pressedStepper = ref<'increment' | 'decrement' | null>(null)
  const displayValue = ref('')
  const generatedId = useId()
  const inputId = computed(() => props.id ?? `v-number-input-${generatedId}`)
  const helperId = computed(() => `${inputId.value}-helper`)
  const errorId = computed(() => `${inputId.value}-error`)
  const prefixId = computed(() => `${inputId.value}-prefix`)
  const suffixId = computed(() => `${inputId.value}-suffix`)
  let repeatTimer: ReturnType<typeof setInterval> | null = null

  const syncDisplayFromModel = () => {
    if (props.modelValue === null || props.modelValue === undefined || Number.isNaN(props.modelValue)) {
      displayValue.value = ''
      return
    }
    displayValue.value = String(props.modelValue)
  }

  syncDisplayFromModel()

  watch(
    () => props.modelValue,
    () => {
      if (!focused.value) syncDisplayFromModel()
    },
  )

  const describedBy = computed(() => {
    const ids: string[] = []
    if (props.helperText && !config.value.hasError) ids.push(helperId.value)
    if (props.prefix) ids.push(prefixId.value)
    if (props.suffix) ids.push(suffixId.value)
    if (config.value.hasError) ids.push(errorId.value)
    return ids.length ? ids.join(' ') : undefined
  })

  const canIncrement = computed(() => {
    if (config.value.disabled || config.value.readonly) return false
    if (typeof config.value.max !== 'number') return true
    const current = props.modelValue ?? config.value.min ?? 0
    return current + config.value.step <= config.value.max
  })

  const canDecrement = computed(() => {
    if (config.value.disabled || config.value.readonly) return false
    if (typeof config.value.min !== 'number') return true
    const current = props.modelValue ?? config.value.min ?? 0
    return current - config.value.step >= config.value.min
  })

  const dataState = computed<VNumberInputState>(() => {
    if (config.value.disabled) return 'disabled'
    if (config.value.hasError) return 'invalid'
    if (pressedStepper.value) return 'pressed-stepper'
    if (focused.value) return 'focus'
    return 'default'
  })

  const scrub = useVNumberInputScrub(
    props,
    toRef(() => props.modelValue),
    (value) => {
      emit('update:modelValue', value)
      if (value !== null) displayValue.value = String(value)
    },
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-number-input',
      `v-number-input--${config.value.size}`,
      `v-number-input--${config.value.variant}`,
      {
        'v-number-input--disabled': config.value.disabled,
        'v-number-input--readonly': config.value.readonly,
        'v-number-input--error': config.value.hasError,
        'v-number-input--focused': focused.value,
        'v-number-input--has-prefix': Boolean(props.prefix),
        'v-number-input--has-suffix': Boolean(props.suffix),
        'v-number-input--scrub': scrub.isScrub.value,
        'v-number-input--scrubbing': scrub.scrubbing.value,
      },
    ],
    'data-test-id': 'v-number-input',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const controlAttrs = computed(() => ({
    class: 'v-number-input__control',
  }))

  const inputAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-number-input__input',
    'data-test-id': 'v-number-input-field',
    type: 'text',
    inputmode: 'decimal',
    role: 'spinbutton',
    name: props.name,
    value: displayValue.value,
    placeholder: props.placeholder,
    disabled: config.value.disabled || undefined,
    readonly: config.value.readonly || undefined,
    required: props.required || undefined,
    min: config.value.min,
    max: config.value.max,
    step: config.value.step,
    'aria-valuemin': config.value.min,
    'aria-valuemax': config.value.max,
    'aria-valuenow': props.modelValue ?? undefined,
    'aria-invalid': config.value.hasError ? true : undefined,
    'aria-describedby': describedBy.value,
    'aria-required': props.required || undefined,
  }))

  const commitValue = (raw: string) => {
    const parsed = parseNumberInput(raw)
    if (parsed === null) {
      emit('update:modelValue', null)
      displayValue.value = ''
      return
    }
    const clamped = clampNumber(parsed, config.value.min, config.value.max)
    emit('update:modelValue', clamped)
    displayValue.value = String(clamped)
  }

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    displayValue.value = target.value
    const parsed = parseNumberInput(target.value)
    if (parsed !== null) {
      emit('update:modelValue', clampNumber(parsed, config.value.min, config.value.max))
    } else if (!target.value.trim()) {
      emit('update:modelValue', null)
    }
  }

  const onFocus = (event: FocusEvent) => {
    focused.value = true
    emit('focus', event)
  }

  const onBlur = (event: FocusEvent) => {
    focused.value = false
    commitValue(displayValue.value)
    emit('blur', event)
  }

  const stepBy = (direction: 1 | -1) => {
    if (config.value.disabled || config.value.readonly) return
    const base = props.modelValue ?? config.value.min ?? 0
    const next = clampNumber(base + direction * config.value.step, config.value.min, config.value.max)
    emit('update:modelValue', next)
    displayValue.value = String(next)
    if (direction === 1) emit('increment')
    else emit('decrement')
    inputRef.value?.focus()
  }

  const stopRepeat = () => {
    pressedStepper.value = null
    if (repeatTimer) {
      clearInterval(repeatTimer)
      repeatTimer = null
    }
  }

  const startRepeat = (direction: 1 | -1) => {
    stopRepeat()
    pressedStepper.value = direction === 1 ? 'increment' : 'decrement'
    stepBy(direction)
    repeatTimer = setInterval(() => stepBy(direction), 120)
  }

  const onStepPointerDown = (direction: 1 | -1) => {
    if ((direction === 1 && !canIncrement.value) || (direction === -1 && !canDecrement.value)) return
    startRepeat(direction)
  }

  const onStepPointerUp = () => {
    stopRepeat()
  }

  const onInputKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (canIncrement.value) stepBy(1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (canDecrement.value) stepBy(-1)
    }
  }

  onBeforeUnmount(() => {
    stopRepeat()
  })

  return {
    config,
    inputRef,
    rootAttrs,
    controlAttrs,
    inputAttrs,
    inputId,
    helperId,
    errorId,
    prefixId,
    suffixId,
    canIncrement,
    canDecrement,
    onInput,
    onFocus,
    onBlur,
    onInputKeydown,
    onStepPointerDown,
    onStepPointerUp,
    scrub,
  }
}
