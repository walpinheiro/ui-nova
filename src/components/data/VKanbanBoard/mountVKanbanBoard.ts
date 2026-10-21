import type { VKanbanColumn, VKanbanMove } from './VKanbanBoard.types'

/** Pure move: returns new columns (inputs untouched) or `null` when the move is invalid. */
export function moveKanbanItem(columns: VKanbanColumn[], move: VKanbanMove): VKanbanColumn[] | null {
  const from = columns.find((column) => column.id === move.from)
  const to = columns.find((column) => column.id === move.to)
  if (!from || !to) return null
  const sourceIndex = from.items.findIndex((item) => item.id === move.itemId)
  if (sourceIndex < 0) return null

  const next = columns.map((column) => ({ ...column, items: [...column.items] }))
  const nextFrom = next.find((column) => column.id === move.from)!
  const nextTo = next.find((column) => column.id === move.to)!
  const [item] = nextFrom.items.splice(sourceIndex, 1)
  const index = Math.max(0, Math.min(move.index, nextTo.items.length))
  nextTo.items.splice(index, 0, item)
  return next
}

export function locateKanbanItem(columns: VKanbanColumn[], itemId: VKanbanMove['itemId']) {
  for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
    const index = columns[columnIndex].items.findIndex((item) => item.id === itemId)
    if (index >= 0) return { columnIndex, index }
  }
  return null
}

/** Keyboard move: Alt+ArrowLeft/Right changes column, Alt+ArrowUp/Down reorders. */
export function keyboardKanbanMove(
  columns: VKanbanColumn[],
  itemId: VKanbanMove['itemId'],
  key: string,
): VKanbanMove | null {
  const location = locateKanbanItem(columns, itemId)
  if (!location) return null
  const { columnIndex, index } = location
  const column = columns[columnIndex]

  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const target = columns[columnIndex + (key === 'ArrowLeft' ? -1 : 1)]
    if (!target) return null
    return { itemId, from: column.id, to: target.id, index: Math.min(index, target.items.length) }
  }
  if (key === 'ArrowUp' || key === 'ArrowDown') {
    const nextIndex = index + (key === 'ArrowUp' ? -1 : 1)
    if (nextIndex < 0 || nextIndex >= column.items.length) return null
    return { itemId, from: column.id, to: column.id, index: nextIndex }
  }
  return null
}
