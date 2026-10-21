import { computed, ref, useId } from 'vue'
import type { VRadioGroupProps } from './VRadioGroup.types'
import { mountVRadioGroup } from './mountVRadioGroup'

type VRadioGroupEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}

export function useVRadioGroup(props: VRadioGroupProps, emit: VRadioGroupEmit) {
  const config = computed(() => mountVRadioGroup(props))
  const generatedId = useId()
  const groupId = computed(() => props.id ?? `v-radiogroup-${generatedId}`)
  const descriptionId = computed(() => `${groupId.value}-description`)
  const errorId = computed(() => `${groupId.value}-error`)
  const swellingValue = ref<string | null>(null)
  const isExpressive = computed(() => props.motion === 'expressive')

  const describedBy = computed(() => {
    const ids: string[] = []
    if (props.description) ids.push(descriptionId.value)
    if (config.value.hasError) ids.push(errorId.value)
    return ids.length ? ids.join(' ') : undefined
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-radiogroup',
      `v-radiogroup--${config.value.size}`,
      `v-radiogroup--${config.value.layout}`,
      {
        'v-radiogroup--disabled': config.value.disabled,
        'v-radiogroup--error': config.value.hasError,
        'v-radiogroup--expressive': isExpressive.value,
      },
    ],
    'data-test-id': 'v-radiogroup',
    'data-size': config.value.size,
    'data-layout': config.value.layout,
    'data-state': config.value.hasError ? 'invalid' : config.value.disabled ? 'disabled' : 'default',
    'aria-invalid': config.value.hasError ? true : undefined,
    'aria-describedby': describedBy.value,
    'aria-required': props.required || undefined,
  }))

  const optionInputId = (value: string) => `${groupId.value}-input-${value}`
  const optionDescriptionId = (value: string) => `${groupId.value}-description-${value}`

  const optionDescribedBy = (value: string, description?: string) => {
    if (!description) return undefined
    return optionDescriptionId(value)
  }

  const onChange = (value: string, optionDisabled = false) => {
    if (config.value.disabled || optionDisabled) return
    emit('update:modelValue', value)
    emit('change', value)
    if (isExpressive.value) {
      swellingValue.value = value
      window.setTimeout(() => {
        swellingValue.value = null
      }, 320)
    }
  }

  const optionClass = (value: string, selected: boolean, disabled: boolean) => ({
    'v-radiogroup__option--selected': selected,
    'v-radiogroup__option--disabled': disabled,
    'v-radiogroup__option--swell': swellingValue.value === value,
  })

  return {
    config,
    groupId,
    descriptionId,
    errorId,
    rootAttrs,
    optionInputId,
    optionDescriptionId,
    optionDescribedBy,
    onChange,
    optionClass,
  }
}
