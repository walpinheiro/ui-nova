import { computed, ref, useId, useSlots, watch } from 'vue'
import type { VCheckboxProps, VCheckboxVisualState } from './VCheckbox.types'
import { mountVCheckbox } from './mountVCheckbox'

type VCheckboxEmit = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
}

export function useVCheckbox(props: VCheckboxProps, emit: VCheckboxEmit) {
  const slots = useSlots()
  const config = computed(() => mountVCheckbox(props))
  const inputRef = ref<HTMLInputElement | null>(null)
  const generatedId = useId()
  const inputId = computed(() => props.id ?? `v-checkbox-${generatedId}`)
  const helperId = computed(() => `${inputId.value}-helper`)
  const errorId = computed(() => `${inputId.value}-error`)
  const descriptionId = computed(() => `${inputId.value}-description`)

  const hasLabel = computed(() => Boolean(props.label || slots.label || slots.default))
  const activeIcon = computed(() =>
    config.value.indeterminate ? config.value.indeterminateIcon : config.value.checkIcon,
  )

  const dataState = computed<VCheckboxVisualState>(() => {
    if (config.value.disabled) return 'disabled'
    if (config.value.indeterminate) return 'indeterminate'
    if (config.value.checked) return 'checked'
    return 'unchecked'
  })

  const describedBy = computed(() => {
    const ids: string[] = []
    if (props.description) ids.push(descriptionId.value)
    if (props.helperText && !config.value.hasError) ids.push(helperId.value)
    if (config.value.hasError) ids.push(errorId.value)
    return ids.length ? ids.join(' ') : undefined
  })

  const ariaChecked = computed<'true' | 'false' | 'mixed'>(() => {
    if (config.value.indeterminate) return 'mixed'
    return config.value.checked ? 'true' : 'false'
  })

  const isExpressive = computed(() => props.motion === 'expressive')

  const strikeThroughMode = computed(() => {
    if (props.strikeThrough === false || props.strikeThrough === 'none') return 'none'
    if (props.strikeThrough === true || props.strikeThrough === undefined) return 'left'
    return props.strikeThrough
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-checkbox',
      `v-checkbox--${config.value.size}`,
      {
        'v-checkbox--checked': config.value.checked,
        'v-checkbox--indeterminate': config.value.indeterminate,
        'v-checkbox--disabled': config.value.disabled,
        'v-checkbox--error': config.value.hasError,
        'v-checkbox--has-description': Boolean(props.description),
        'v-checkbox--expressive': isExpressive.value,
        [`v-checkbox--strike-${strikeThroughMode.value}`]: isExpressive.value && strikeThroughMode.value !== 'none',
      },
    ],
    'data-test-id': 'v-checkbox',
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const inputAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-checkbox__input',
    'data-test-id': 'v-checkbox-input',
    type: 'checkbox',
    name: props.name,
    value: props.value as string | undefined,
    checked: config.value.checked,
    disabled: config.value.disabled || undefined,
    required: props.required || undefined,
    'aria-checked': ariaChecked.value,
    'aria-invalid': config.value.hasError ? true : undefined,
    'aria-describedby': describedBy.value,
    'aria-disabled': config.value.disabled || undefined,
  }))

  const syncIndeterminate = () => {
    if (!inputRef.value) return
    inputRef.value.indeterminate = config.value.indeterminate
  }

  watch(() => [config.value.indeterminate, config.value.checked], syncIndeterminate, { flush: 'post' })

  const onChange = (event: Event) => {
    if (config.value.disabled) return
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.checked)
    emit('change', target.checked)
    syncIndeterminate()
  }

  const onLinkClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  return {
    config,
    inputRef,
    rootAttrs,
    inputAttrs,
    inputId,
    helperId,
    errorId,
    descriptionId,
    hasLabel,
    activeIcon,
    isExpressive,
    strikeThroughMode,
    doneOpacity: computed(() => props.doneOpacity ?? 0.42),
    onChange,
    onLinkClick,
    syncIndeterminate,
  }
}
