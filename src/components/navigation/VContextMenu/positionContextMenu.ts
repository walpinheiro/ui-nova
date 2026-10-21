export interface ContextMenuPositionResult {
  top: number
  left: number
}

export function computeContextMenuPosition(
  x: number,
  y: number,
  menuRect: DOMRectReadOnly | DOMRect,
  viewportPadding = 8,
  viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768,
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
): ContextMenuPositionResult {
  let left = x
  let top = y

  if (left + menuRect.width > viewportWidth - viewportPadding) {
    left = viewportWidth - menuRect.width - viewportPadding
  }
  if (top + menuRect.height > viewportHeight - viewportPadding) {
    top = viewportHeight - menuRect.height - viewportPadding
  }

  left = Math.max(viewportPadding, left)
  top = Math.max(viewportPadding, top)

  return { top, left }
}
