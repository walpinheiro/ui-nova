import { computed, ref, useId, useSlots } from 'vue'
import type { VTextInputProps, VTextInputState } from './VTextInput.types'
import { mountVTextInput } from './mountVTextInput'

type VTextInputEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
}

export function useVTextInput(props: VTextInputProps, emit: VTextInputEmit) {
  const slots = useSlots()
  const config = computed(() => mountVTextInput(props))
  const inputRef = ref<HTMLInputElement | null>(null)
  const focused = ref(false)
  const generatedId = useId()
  const inputId = computed(() => props.id ?? `v-text-input-${generatedId}`)
  const helperId = computed(() => `${inputId.value}-helper`)
  const errorId = computed(() => `${inputId.value}-error`)
  const successId = computed(() => `${inputId.value}-success`)
  const prefixId = computed(() => `${inputId.value}-prefix`)
  const suffixId = computed(() => `${inputId.value}-suffix`)

  const hasValue = computed(() => Boolean(props.modelValue && props.modelValue.length > 0))
  const hasLeadingIcon = computed(() => Boolean(props.leadingIcon || slots['leading-icon']))
  const showClear = computed(
    () => config.value.clearable && hasValue.value && !config.value.disabled && !config.value.readonly,
  )

  const describedBy = computed(() => {
    const ids: string[] = []
    if (props.helperText && !config.value.hasError && !config.value.hasSuccess) ids.push(helperId.value)
    if (props.prefix) ids.push(prefixId.value)
    if (props.suffix) ids.push(suffixId.value)
    if (config.value.hasError) ids.push(errorId.value)
    if (config.value.hasSuccess) ids.push(successId.value)
    return ids.length ? ids.join(' ') : undefined
  })

  const dataState = computed<VTextInputState>(() => {
    if (config.value.disabled) return 'disabled'
    if (config.value.hasError) return 'invalid'
    if (hasValue.value) return 'filled'
    if (focused.value) return 'focus'
    return 'default'
  })

  const clearAriaLabel = computed(() => {
    if (props.clearLabel) return props.clearLabel
    if (props.label) return `Clear ${props.label}`
    return 'Clear input'
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-text-input',
      `v-text-input--${config.value.size}`,
      `v-text-input--${config.value.variant}`,
      {
        'v-text-input--disabled': config.value.disabled,
        'v-text-input--readonly': config.value.readonly,
        'v-text-input--has-value': hasValue.value,
        'v-text-input--focused': focused.value,
        'v-text-input--has-leading-icon': hasLeadingIcon.value,
        'v-text-input--has-prefix': Boolean(props.prefix),
        'v-text-input--has-suffix': Boolean(props.suffix),
        'v-text-input--clearable': config.value.clearable,
      },
    ],
    'data-test-id': 'v-text-input',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const controlAttrs = computed(() => ({
    class: 'v-text-input__control',
  }))

  const inputAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-text-input__input',
    'data-test-id': 'v-text-input-field',
    type: config.value.type,
    name: props.name,
    value: props.modelValue ?? '',
    placeholder: props.placeholder,
    disabled: config.value.disabled || undefined,
    readonly: config.value.readonly || undefined,
    required: props.required || undefined,
    autocomplete: props.autocomplete,
    spellcheck: props.spellcheck,
    autocapitalize: props.autocapitalize,
    'aria-invalid': config.value.hasError ? true : undefined,
    'aria-describedby': describedBy.value,
    'aria-required': props.required || undefined,
  }))

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }

  const onFocus = (event: FocusEvent) => {
    focused.value = true
    emit('focus', event)
  }

  const onBlur = (event: FocusEvent) => {
    focused.value = false
    emit('blur', event)
  }

  const clear = () => {
    if (!showClear.value) return
    emit('update:modelValue', '')
    emit('clear')
    inputRef.value?.focus()
  }

  const onClearKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      clear()
    }
  }

  return {
    config,
    inputRef,
    rootAttrs,
    controlAttrs,
    inputAttrs,
    inputId,
    helperId,
    errorId,
    successId,
    prefixId,
    suffixId,
    hasValue,
    hasLeadingIcon,
    showClear,
    clearAriaLabel,
    onInput,
    onFocus,
    onBlur,
    clear,
    onClearKeydown,
  }
}
