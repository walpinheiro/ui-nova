import { computed, ref, useId } from 'vue'
import type { VPasswordInputProps, VPasswordInputState } from './VPasswordInput.types'
import { mountVPasswordInput } from './mountVPasswordInput'

type VPasswordInputEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
  (event: 'toggle-visibility', visible: boolean): void
}

export function useVPasswordInput(props: VPasswordInputProps, emit: VPasswordInputEmit) {
  const config = computed(() => mountVPasswordInput(props))
  const inputRef = ref<HTMLInputElement | null>(null)
  const focused = ref(false)
  const revealed = ref(false)
  const generatedId = useId()
  const inputId = computed(() => props.id ?? `v-password-input-${generatedId}`)
  const helperId = computed(() => `${inputId.value}-helper`)
  const errorId = computed(() => `${inputId.value}-error`)
  const requirementsId = computed(() => `${inputId.value}-requirements`)
  const meterId = computed(() => `${inputId.value}-meter`)

  const hasValue = computed(() => Boolean(props.modelValue && props.modelValue.length > 0))
  const inputType = computed(() => (revealed.value ? 'text' : 'password'))

  const describedBy = computed(() => {
    const ids: string[] = []
    if (props.helperText && !config.value.hasError) ids.push(helperId.value)
    if (config.value.hasError) ids.push(errorId.value)
    if (config.value.showRequirements) ids.push(requirementsId.value)
    if (config.value.showStrength) ids.push(meterId.value)
    return ids.length ? ids.join(' ') : undefined
  })

  const dataState = computed<VPasswordInputState>(() => {
    if (config.value.disabled) return 'disabled'
    if (config.value.hasError) return 'invalid'
    if (revealed.value) return 'revealed'
    if (focused.value) return 'focus'
    return 'default'
  })

  const toggleAriaLabel = computed(() => {
    if (revealed.value) return props.maskLabel ?? 'Hide password'
    return props.revealLabel ?? 'Show password'
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-password-input',
      `v-password-input--${config.value.size}`,
      `v-password-input--${config.value.variant}`,
      {
        'v-password-input--disabled': config.value.disabled,
        'v-password-input--readonly': config.value.readonly,
        'v-password-input--error': config.value.hasError,
        'v-password-input--focused': focused.value,
        'v-password-input--revealed': revealed.value,
        'v-password-input--has-value': hasValue.value,
      },
    ],
    'data-test-id': 'v-password-input',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const controlAttrs = computed(() => ({
    class: 'v-password-input__control',
  }))

  const inputAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-password-input__input',
    'data-test-id': 'v-password-input-field',
    type: inputType.value,
    name: props.name,
    value: props.modelValue ?? '',
    placeholder: props.placeholder,
    disabled: config.value.disabled || undefined,
    readonly: config.value.readonly || undefined,
    required: props.required || undefined,
    autocomplete: props.autocomplete ?? 'current-password',
    'aria-invalid': config.value.hasError ? true : undefined,
    'aria-describedby': describedBy.value,
    'aria-required': props.required || undefined,
  }))

  const toggleAttrs = computed(() => ({
    type: 'button',
    class: 'v-password-input__toggle',
    'data-test-id': revealed.value ? 'v-password-input-toggle-hide' : 'v-password-input-toggle-show',
    'aria-label': toggleAriaLabel.value,
    'aria-pressed': revealed.value,
    disabled: config.value.disabled || undefined,
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

  const toggleVisibility = () => {
    if (config.value.disabled) return
    revealed.value = !revealed.value
    emit('toggle-visibility', revealed.value)
    inputRef.value?.focus()
  }

  const onToggleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleVisibility()
    }
  }

  const requirementResults = computed(() =>
    config.value.requirements.map((rule) => ({
      ...rule,
      met: rule.test(props.modelValue ?? ''),
    })),
  )

  return {
    config,
    inputRef,
    rootAttrs,
    controlAttrs,
    inputAttrs,
    toggleAttrs,
    inputId,
    helperId,
    errorId,
    requirementsId,
    meterId,
    revealed,
    hasValue,
    requirementResults,
    onInput,
    onFocus,
    onBlur,
    toggleVisibility,
    onToggleKeydown,
  }
}
