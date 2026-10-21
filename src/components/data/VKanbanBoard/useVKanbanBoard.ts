import { computed, nextTick, ref } from 'vue'
import type { VKanbanBoardProps, VKanbanColumn, VKanbanItem, VKanbanMove } from './VKanbanBoard.types'
import { keyboardKanbanMove, moveKanbanItem } from './mountVKanbanBoard'

type Emit = {
  (event: 'update:columns', columns: VKanbanColumn[]): void
  (event: 'move', move: VKanbanMove): void
  (event: 'add', columnId: string): void
  (event: 'item-click', item: VKanbanItem, column: VKanbanColumn): void
  (event: 'column-menu', columnId: string): void
}

const CARD_SELECTOR = '[data-kanban-card]'

export function useVKanbanBoard(props: VKanbanBoardProps, emit: Emit) {
  const draggingId = ref<VKanbanItem['id'] | null>(null)
  const dropTarget = ref<{ columnId: string; index: number } | null>(null)
  const announcement = ref('')

  const columns = computed(() => props.columns ?? [])

  const rootAttrs = computed(() => ({
    class: ['v-kanban', `v-kanban--${props.size ?? 'md'}`, { 'v-kanban--dragging': draggingId.value !== null }],
    'data-test-id': props.dataTestId ?? 'v-kanban',
    style: props.columnWidth ? { '--v-kanban-column-width': props.columnWidth } : undefined,
  }))

  function commit(move: VKanbanMove) {
    const next = moveKanbanItem(columns.value, move)
    if (!next) return false
    emit('move', move)
    emit('update:columns', next)
    const item = next.find((column) => column.id === move.to)?.items[move.index]
    const target = next.find((column) => column.id === move.to)
    announcement.value = `${item?.title ?? 'Item'} moved to ${target?.title ?? move.to}, position ${move.index + 1}`
    return true
  }

  function columnOf(itemId: VKanbanItem['id']) {
    return columns.value.find((column) => column.items.some((item) => item.id === itemId))
  }

  function onDragStart(event: DragEvent, item: VKanbanItem) {
    if (!props.draggable) return
    draggingId.value = item.id
    event.dataTransfer?.setData('text/plain', String(item.id))
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  }

  function insertionIndex(list: HTMLElement, clientY: number) {
    const cards = [...list.querySelectorAll<HTMLElement>(CARD_SELECTOR)].filter(
      (card) => card.dataset.kanbanCard !== String(draggingId.value),
    )
    const index = cards.findIndex((card) => {
      const rect = card.getBoundingClientRect()
      return clientY < rect.top + rect.height / 2
    })
    return index === -1 ? cards.length : index
  }

  function onDragOver(event: DragEvent, columnId: string) {
    if (!props.draggable || draggingId.value === null) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    const list = event.currentTarget as HTMLElement
    dropTarget.value = { columnId, index: insertionIndex(list, event.clientY) }
  }

  function onDrop(event: DragEvent, columnId: string) {
    if (!props.draggable || draggingId.value === null) return
    event.preventDefault()
    const from = columnOf(draggingId.value)
    const index = dropTarget.value?.columnId === columnId ? dropTarget.value.index : 0
    if (from) commit({ itemId: draggingId.value, from: from.id, to: columnId, index })
    onDragEnd()
  }

  function onDragEnd() {
    draggingId.value = null
    dropTarget.value = null
  }

  async function onCardKeydown(event: KeyboardEvent, item: VKanbanItem, column: VKanbanColumn) {
    if (event.key === 'Enter') {
      emit('item-click', item, column)
      return
    }
    if (!props.draggable || !event.altKey) return
    const move = keyboardKanbanMove(columns.value, item.id, event.key)
    if (!move) return
    event.preventDefault()
    const root = (event.currentTarget as HTMLElement).closest('.v-kanban')
    if (commit(move)) {
      // Keep focus on the moved card once the parent re-renders it.
      await nextTick()
      root?.querySelector<HTMLElement>(`[data-kanban-card="${String(item.id)}"]`)?.focus()
    }
  }

  /** Drop indexes ignore the dragged card, so map rendered items onto that space. */
  function dropLineBefore(column: VKanbanColumn, item: VKanbanItem | null) {
    if (dropTarget.value?.columnId !== column.id || item?.id === draggingId.value) return false
    const others = column.items.filter((entry) => entry.id !== draggingId.value)
    const index = item ? others.findIndex((entry) => entry.id === item.id) : others.length
    return dropTarget.value.index === index
  }

  return {
    columns,
    rootAttrs,
    draggingId,
    dropTarget,
    announcement,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    onCardKeydown,
    dropLineBefore,
  }
}
