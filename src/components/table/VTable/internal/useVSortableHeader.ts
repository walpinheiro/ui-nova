import { computed } from 'vue'
import type { VSortDirection } from '../VTable.types'
import type { VSortableHeaderProps } from './VSortableHeader.types'
import { mountVSortableHeader, nextSortDirection } from './mountVSortableHeader'

type VSortableHeaderEmit = {
  (event: 'sort', payload: { direction: VSortDirection; columnKey?: string; shiftKey: boolean }): void
}

export function useVSortableHeader(props: VSortableHeaderProps, emit: VSortableHeaderEmit) {
  const config = computed(() => mountVSortableHeader(props))

  const rootAttrs = computed(() => ({
    class: [
      'v-table__sortable-header',
      `v-table__sortable-header--${config.value.size}`,
      `v-table__sortable-header--${config.value.stateModifier}`,
      {
        'v-table__sortable-header--active': config.value.direction !== null,
        'v-table__sortable-header--disabled': config.value.disabled,
      },
    ],
    'data-test-id': config.value.testId,
    'data-state': config.value.stateModifier,
    role: 'columnheader',
    'aria-sort': config.value.ariaSort,
    tabindex: config.value.disabled ? undefined : 0,
    'aria-disabled': config.value.disabled ? true : undefined,
  }))

  function handleClick(event: MouseEvent) {
    if (config.value.disabled) return
    const nextDirection = nextSortDirection(config.value.direction)
    emit('sort', { direction: nextDirection, columnKey: props.columnKey, shiftKey: event.shiftKey })
  }

  function handleKeydown(event: KeyboardEvent) {
    if (config.value.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick(event as unknown as MouseEvent)
    }
  }

  return { config, rootAttrs, handleClick, handleKeydown }
}
