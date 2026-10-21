import type { IconifyIcon } from '@iconify/types'

export type VKanbanSize = 'sm' | 'md'
export type VKanbanDueTone = 'default' | 'warning' | 'danger'

export interface VKanbanTag {
  label: string
  /** Dot color (any CSS color). */
  color?: string
}

export interface VKanbanItem {
  id: string | number
  title: string
  /** Short reference shown in the footer (e.g. "WEB-148"). */
  code?: string
  tags?: VKanbanTag[]
  /** 0–3 signal bars. */
  priority?: 0 | 1 | 2 | 3
  due?: string
  dueTone?: VKanbanDueTone
  /** Checklist progress (renders "1/3" + bar). */
  progress?: { done: number; total: number }
  assignee?: { initials?: string; src?: string; name?: string }
  [key: string]: unknown
}

export interface VKanbanColumn {
  id: string
  title: string
  icon?: IconifyIcon
  /** Icon color (any CSS color). */
  color?: string
  items: VKanbanItem[]
}

export interface VKanbanMove {
  itemId: VKanbanItem['id']
  from: string
  to: string
  /** Target index inside `to` after the move. */
  index: number
}

export interface VKanbanBoardProps {
  columns?: VKanbanColumn[]
  /** Pointer drag-and-drop plus Alt+Arrow keyboard moves. */
  draggable?: boolean
  /** Shows the "+" header action and the "Add task" footer button. */
  addable?: boolean
  addLabel?: string
  size?: VKanbanSize
  /** Fixed column width (CSS length). */
  columnWidth?: string
  ariaLabel?: string
  dataTestId?: string
}

export type VKanbanBoardEmits = {
  'update:columns': [columns: VKanbanColumn[]]
  move: [move: VKanbanMove]
  add: [columnId: string]
  'item-click': [item: VKanbanItem, column: VKanbanColumn]
  'column-menu': [columnId: string]
}
