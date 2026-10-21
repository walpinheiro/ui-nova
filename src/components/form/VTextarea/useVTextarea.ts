import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import type { VTextareaProps, VTextareaState } from './VTextarea.types'
import { mountVTextarea } from './mountVTextarea'

type VTextareaEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
}

export function useVTextarea(props: VTextareaProps, emit: VTextareaEmit) {
  const config = computed(() => mountVTextarea(props))
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const focused = ref(false)
  const generatedId = useId()
  const inputId = computed(() => props.id ?? `v-textarea-${generatedId}`)
  const helperId = computed(() => `${inputId.value}-helper`)
  const errorId = computed(() => `${inputId.value}-error`)
  const counterId = computed(() => `${inputId.value}-counter`)

  const charCount = computed(() => (props.modelValue ?? '').length)
  const isOverLimit = computed(() => {
    if (!config.value.counter) return false
    return charCount.value > config.value.counter
  })

  const describedBy = computed(() => {
    const ids: string[] = []
    if (props.helperText && !config.value.hasError) ids.push(helperId.value)
    if (config.value.hasError) ids.push(errorId.value)
    if (config.value.counter) ids.push(counterId.value)
    return ids.length ? ids.join(' ') : undefined
  })

  const dataState = computed<VTextareaState>(() => {
    if (config.value.disabled) return 'disabled'
    if (config.value.readonly) return 'readonly'
    if (config.value.hasError || isOverLimit.value) return 'invalid'
    if (props.modelValue && props.modelValue.length > 0) return 'filled'
    if (focused.value) return 'focus'
    return 'default'
  })

  const counterText = computed(() => {
    if (!config.value.counter) return ''
    return `${charCount.value} / ${config.value.counter}`
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-textarea',
      `v-textarea--${config.value.size}`,
      `v-textarea--${config.value.variant}`,
      {
        'v-textarea--disabled': config.value.disabled,
        'v-textarea--readonly': config.value.readonly,
        'v-textarea--error': config.value.hasError || isOverLimit.value,
        'v-textarea--focused': focused.value,
        'v-textarea--auto-resize': config.value.autoResize,
        'v-textarea--has-counter': Boolean(config.value.counter),
      },
    ],
    'data-test-id': 'v-textarea',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const controlAttrs = computed(() => ({
    class: 'v-textarea__control',
  }))

  const textareaAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-textarea__input',
    'data-test-id': 'v-textarea-input',
    name: props.name,
    value: props.modelValue ?? '',
    placeholder: props.placeholder,
    disabled: config.value.disabled || undefined,
    readonly: config.value.readonly || undefined,
    required: props.required || undefined,
    rows: config.value.rows,
    spellcheck: props.spellcheck,
    'aria-invalid': config.value.hasError || isOverLimit.value ? true : undefined,
    'aria-describedby': describedBy.value,
    'aria-required': props.required || undefined,
    style: { resize: config.value.autoResize ? 'none' : config.value.resize },
  }))

  const adjustHeight = () => {
    if (!config.value.autoResize || !textareaRef.value) return
    const el = textareaRef.value
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const onInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
    void nextTick(adjustHeight)
  }

  const onFocus = (event: FocusEvent) => {
    focused.value = true
    emit('focus', event)
  }

  const onBlur = (event: FocusEvent) => {
    focused.value = false
    emit('blur', event)
  }

  watch(
    () => props.modelValue,
    () => {
      void nextTick(adjustHeight)
    },
  )

  onMounted(() => {
    adjustHeight()
  })

  return {
    config,
    textareaRef,
    rootAttrs,
    controlAttrs,
    textareaAttrs,
    inputId,
    helperId,
    errorId,
    counterId,
    counterText,
    isOverLimit,
    onInput,
    onFocus,
    onBlur,
  }
}
