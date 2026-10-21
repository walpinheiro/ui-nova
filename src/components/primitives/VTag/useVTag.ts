import { computed } from 'vue'
import type { VTagProps } from './VTag.types'
import { mountVTag } from './mountVTag'

export function useVTag(
  props: VTagProps,
  emit: { (event: 'click', payload: MouseEvent): void; (event: 'remove', payload: MouseEvent): void },
) {
  const config = computed(() => mountVTag(props))

  const rootTag = computed(() => (config.value.interactive ? 'button' : 'span'))

  const rootAttrs = computed(() => ({
    class: [
      'v-tag',
      `v-tag--${config.value.size}`,
      `v-tag--${config.value.variant}`,
      {
        'v-tag--interactive': config.value.interactive,
        'v-tag--removable': config.value.removable,
        'v-tag--selected': props.selected,
        'v-tag--disabled': config.value.disabled,
        'v-tag--leaving': props.leaving,
      },
    ],
    type: config.value.interactive ? 'button' : undefined,
    disabled: config.value.interactive && config.value.disabled ? true : undefined,
    'aria-disabled': config.value.disabled || undefined,
    'aria-pressed': config.value.interactive ? String(Boolean(props.selected)) : undefined,
    'aria-label': props.ariaLabel,
    'data-test-id': config.value.testId,
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.disabled
      ? 'disabled'
      : props.selected
        ? 'selected'
        : 'default',
  }))

  const removeAttrs = computed(() => ({
    type: 'button' as const,
    class: 'v-tag__remove',
    'aria-label': props.removeLabel ?? props.ariaLabel ?? 'Remove',
    'data-test-id': config.value.removeTestId,
    disabled: config.value.disabled ? true : undefined,
  }))

  function handleClick(event: MouseEvent) {
    if (!config.value.interactive || config.value.disabled) return
    emit('click', event)
  }

  function handleRemove(event: MouseEvent) {
    event.stopPropagation()
    if (config.value.disabled) return
    emit('remove', event)
  }

  return { config, rootTag, rootAttrs, removeAttrs, handleClick, handleRemove }
}
