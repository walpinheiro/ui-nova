import { computed, useSlots } from 'vue'
import type { VCommandItemEmits, VCommandItemProps } from './VCommandItem.types'
import { mountVCommandItem } from './mountVCommandItem'

type EmitFn = <K extends keyof VCommandItemEmits>(event: K, ...args: VCommandItemEmits[K]) => void

export function useVCommandItem(props: VCommandItemProps, emit: EmitFn) {
  const slots = useSlots()
  const config = computed(() => mountVCommandItem(props))

  const hasIcon = computed(() => Boolean(slots.icon || config.value.iconData))
  const hasLabel = computed(() => Boolean(props.label || slots.default))

  const itemAttrs = computed(() => ({
    class: [
      'v-command-item',
      `v-command-item--${config.value.size}`,
      `v-command-item--${config.value.variant}`,
      {
        'v-command-item--selected': config.value.selected,
        'v-command-item--disabled': config.value.disabled,
        'v-command-item--loading': config.value.loading,
        'v-command-item--with-icon': hasIcon.value,
      },
    ],
    type: 'button' as const,
    role: 'option' as const,
    id: config.value.domId,
    'aria-selected': config.value.selected,
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel ?? (config.value.label || undefined),
    disabled: config.value.disabled || undefined,
    tabindex: config.value.selected ? 0 : -1,
    'data-test-id': config.value.testId,
    'data-selected': config.value.selected ? 'true' : 'false',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : config.value.selected
          ? 'selected'
          : 'default',
  }))

  function onClick(event: MouseEvent) {
    if (config.value.disabled) return
    emit('click', event)
    emit('select', { id: config.value.id, label: config.value.label })
  }

  function onKeydown(event: KeyboardEvent) {
    if (config.value.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event as unknown as MouseEvent)
    }
  }

  return { config, hasIcon, hasLabel, itemAttrs, onClick, onKeydown }
}
