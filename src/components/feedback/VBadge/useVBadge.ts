import { computed, ref, watch } from 'vue'
import type { VBadgeProps } from './VBadge.types'
import { mountVBadge } from './mountVBadge'

type VBadgeEmit = {
  (event: 'click', payload: MouseEvent): void
  (event: 'select', payload: MouseEvent): void
  (event: 'update:selected', payload: boolean): void
  (event: 'remove', payload: MouseEvent): void
}

export function useVBadge(
  props: VBadgeProps,
  emit: VBadgeEmit,
) {
  const config = computed(() => mountVBadge(props))
  const selected = ref(Boolean(props.selected))

  watch(
    () => props.selected,
    (value) => {
      if (value !== undefined) selected.value = value
    },
  )

  const rootTag = computed(() => (config.value.interactive ? 'button' : 'span'))

  const rootAttrs = computed(() => ({
    class: [
      'v-badge',
      `v-badge--${config.value.size}`,
      `v-badge--${config.value.variant}`,
      {
        'v-badge--interactive': config.value.interactive,
        'v-badge--removable': config.value.removable,
        'v-badge--leaving': props.leaving,
        'v-badge--selected': selected.value,
        'v-badge--loading': props.loading,
      },
    ],
    'aria-disabled': config.value.interactive && config.value.disabled ? 'true' : undefined,
    'aria-busy': props.loading ? 'true' : undefined,
    'aria-label': props.ariaLabel,
    'aria-pressed': config.value.interactive ? String(selected.value) : undefined,
    role: config.value.interactive ? undefined : config.value.live || props.loading ? 'status' : undefined,
    type: config.value.interactive ? 'button' : undefined,
    disabled: config.value.interactive && config.value.disabled ? true : undefined,
    'data-test-id': config.value.testId,
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': props.loading ? 'loading' : config.value.disabled ? 'disabled' : selected.value ? 'selected' : 'default',
  }))

  const removeAttrs = computed(() => ({
    type: 'button' as const,
    class: 'v-badge__remove',
    'aria-label': props.removeLabel ?? props.ariaLabel ?? 'Remove',
    'data-test-id': config.value.removeTestId,
    disabled: config.value.disabled ? true : undefined,
  }))

  function handleClick(event: MouseEvent) {
    if (!config.value.interactive || config.value.disabled) return

    if (props.selected === undefined) selected.value = !selected.value
    emit('update:selected', selected.value)
    emit('select', event)
    emit('click', event)
  }

  function handleRemove(event: MouseEvent) {
    event.stopPropagation()
    if (config.value.disabled) return
    emit('remove', event)
  }

  return { config, rootTag, rootAttrs, removeAttrs, selected, handleClick, handleRemove }
}
