import { computed, nextTick, provide, ref, shallowRef, watch, type InjectionKey } from 'vue'
import type {
  VAccordionConfig,
  VAccordionItemRegistration,
  VAccordionModelValue,
  VAccordionProps,
  VAccordionValue,
} from './VAccordion.types'
import { mountVAccordion } from './mountVAccordion'

export type VAccordionEmit = {
  (event: 'update:modelValue', value: VAccordionModelValue): void
  (event: 'open-change', value: VAccordionModelValue): void
}

export interface VAccordionContext {
  config: { value: VAccordionConfig }
  registerItem: (registration: VAccordionItemRegistration) => void
  unregisterItem: (value: VAccordionValue) => void
  isOpen: (value: VAccordionValue) => boolean
  toggle: (value: VAccordionValue) => void
  onTriggerKeydown: (event: KeyboardEvent, value: VAccordionValue) => void
}

export const VAccordionContextKey: InjectionKey<VAccordionContext> = Symbol('VAccordionContext')

function normalizeModelValue(value: VAccordionModelValue | undefined, multiple: boolean): VAccordionValue[] {
  if (value === undefined || value === null) return []
  const values = Array.isArray(value) ? value : [value]
  const unique = values.filter((candidate, index) => values.indexOf(candidate) === index)
  return multiple ? unique : unique.slice(0, 1)
}

function modelValueFromOpenValues(values: VAccordionValue[], multiple: boolean): VAccordionModelValue {
  return multiple ? values : (values[0] ?? null)
}

export function useVAccordion(props: VAccordionProps, emit: VAccordionEmit) {
  const config = computed(() => mountVAccordion(props))
  const internalOpenValues = ref<VAccordionValue[]>(normalizeModelValue(props.modelValue, config.value.multiple))
  const registrations = shallowRef<VAccordionItemRegistration[]>([])

  watch(
    () => [props.modelValue, props.multiple] as const,
    ([modelValue, multiple]) => {
      if (modelValue !== undefined) {
        internalOpenValues.value = normalizeModelValue(modelValue, Boolean(multiple))
      } else if (!multiple && internalOpenValues.value.length > 1) {
        internalOpenValues.value = internalOpenValues.value.slice(0, 1)
      }
    },
  )

  const openValues = computed(() =>
    props.modelValue === undefined
      ? internalOpenValues.value
      : normalizeModelValue(props.modelValue, config.value.multiple),
  )

  const setOpenValues = (values: VAccordionValue[]) => {
    const normalized = normalizeModelValue(modelValueFromOpenValues(values, config.value.multiple), config.value.multiple)
    internalOpenValues.value = normalized
    const modelValue = modelValueFromOpenValues(normalized, config.value.multiple)
    emit('update:modelValue', modelValue)
    emit('open-change', modelValue)
  }

  const registerItem = (registration: VAccordionItemRegistration) => {
    if (!registrations.value.some((item) => item.value.value === registration.value.value)) {
      registrations.value = [...registrations.value, registration]
    }
  }

  const unregisterItem = (value: VAccordionValue) => {
    registrations.value = registrations.value.filter((item) => item.value.value !== value)
  }

  const isOpen = (value: VAccordionValue) => openValues.value.some((candidate) => candidate === value)

  const toggle = (value: VAccordionValue) => {
    const current = openValues.value
    const next = isOpen(value)
      ? current.filter((candidate) => candidate !== value)
      : config.value.multiple
        ? [...current, value]
        : [value]
    setOpenValues(next)
  }

  const onTriggerKeydown = (event: KeyboardEvent, value: VAccordionValue) => {
    const enabledItems = registrations.value
    if (enabledItems.length === 0) return

    const currentIndex = enabledItems.findIndex((item) => item.value.value === value)
    let nextIndex: number | undefined
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % enabledItems.length
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = currentIndex < 0 ? enabledItems.length - 1 : (currentIndex - 1 + enabledItems.length) % enabledItems.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = enabledItems.length - 1
    }

    if (nextIndex === undefined) return
    event.preventDefault()
    void nextTick(() => enabledItems[nextIndex as number]?.triggerRef.value?.focus())
  }

  const rootAttrs = computed(() => ({
    class: [
      'v-accordion',
      `v-accordion--${config.value.size}`,
      `v-accordion--${config.value.variant}`,
    ],
    role: 'group',
    'aria-label': props.ariaLabel,
    'data-test-id': 'v-accordion',
    'data-accordion': 'accordion',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': 'default',
  }))

  const context: VAccordionContext = {
    config,
    registerItem,
    unregisterItem,
    isOpen,
    toggle,
    onTriggerKeydown,
  }
  provide(VAccordionContextKey, context)

  return { config, rootAttrs, openValues }
}
