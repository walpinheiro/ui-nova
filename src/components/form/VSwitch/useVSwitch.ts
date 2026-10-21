import { computed, useId, useSlots } from 'vue'
import type { VSwitchProps, VSwitchState } from './VSwitch.types'
import { mountVSwitch } from './mountVSwitch'

type VSwitchEmit = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
}

export function useVSwitch(props: VSwitchProps, emit: VSwitchEmit) {
  const slots = useSlots()
  const config = computed(() => mountVSwitch(props))
  const generatedId = useId()
  const inputId = computed(() => props.id ?? `v-switch-${generatedId}`)
  const descriptionId = computed(() => `${inputId.value}-description`)

  const hasLabel = computed(() => Boolean(props.label || slots.label || slots.default))
  const activeIcon = computed(() => (config.value.checked ? config.value.onIcon : config.value.offIcon))

  const dataState = computed<VSwitchState>(() => {
    if (config.value.disabled) return 'disabled'
    return config.value.checked ? 'on' : 'off'
  })

  const describedBy = computed(() => (props.description ? descriptionId.value : undefined))

  const rootAttrs = computed(() => ({
    class: [
      'v-switch',
      `v-switch--${config.value.size}`,
      {
        'v-switch--on': config.value.checked,
        'v-switch--disabled': config.value.disabled,
        'v-switch--labeled': hasLabel.value,
        'v-switch--with-description': Boolean(props.description),
        'v-switch--expressive': props.motion === 'expressive',
      },
    ],
    'data-test-id': 'v-switch',
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const inputAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-switch__input',
    'data-test-id': 'v-switch-input',
    type: 'checkbox',
    role: 'switch',
    name: props.name,
    checked: config.value.checked,
    disabled: config.value.disabled || undefined,
    'aria-checked': config.value.checked,
    'aria-label': props.ariaLabel || (!hasLabel.value ? 'Toggle switch' : undefined),
    'aria-describedby': describedBy.value,
    'aria-disabled': config.value.disabled || undefined,
  }))

  const onChange = (event: Event) => {
    if (config.value.disabled) return
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.checked)
    emit('change', target.checked)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled) return
    if (event.key === 'Enter') {
      event.preventDefault()
      emit('update:modelValue', !config.value.checked)
      emit('change', !config.value.checked)
    }
  }

  return {
    config,
    rootAttrs,
    inputAttrs,
    descriptionId,
    hasLabel,
    activeIcon,
    onChange,
    onKeydown,
  }
}
