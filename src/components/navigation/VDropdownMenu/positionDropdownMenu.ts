export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface DropdownMenuPositionResult {
  top: number
  left: number
  placement: DropdownMenuPlacement
}

export function computeDropdownMenuPosition(
  triggerRect: DOMRectReadOnly | DOMRect,
  menuRect: DOMRectReadOnly | DOMRect,
  preferredAlign: 'start' | 'end',
  gap = 4,
  viewportPadding = 8,
  viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768,
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
): DropdownMenuPositionResult {
  const spaceBelow = viewportHeight - triggerRect.bottom - viewportPadding
  const spaceAbove = triggerRect.top - viewportPadding
  const fitsBelow = spaceBelow >= menuRect.height + gap
  const fitsAbove = spaceAbove >= menuRect.height + gap

  // Prefer below; flip above only when below does not fit; if neither fits, stay below.
  const openDown = fitsBelow || !fitsAbove

  let align: 'start' | 'end' = preferredAlign
  let left = align === 'end' ? triggerRect.right - menuRect.width : triggerRect.left

  if (left + menuRect.width > viewportWidth - viewportPadding) {
    left = triggerRect.right - menuRect.width
    align = 'end'
  }
  if (left < viewportPadding) {
    left = triggerRect.left
    align = 'start'
  }

  left = Math.max(viewportPadding, Math.min(left, viewportWidth - menuRect.width - viewportPadding))

  let top: number
  let placement: DropdownMenuPlacement

  if (openDown) {
    top = triggerRect.bottom + gap
    placement = align === 'end' ? 'bottom-end' : 'bottom-start'
  } else {
    top = triggerRect.top - menuRect.height - gap
    placement = align === 'end' ? 'top-end' : 'top-start'
  }

  return { top, left, placement }
}
