export interface WidgetRect {
  id: string
  x: number
  y: number
  w: number
  h: number
  locked?: boolean
}

function collides(a: WidgetRect, b: WidgetRect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function clamp(r: WidgetRect, cols: number): WidgetRect {
  const w = Math.min(Math.max(1, Math.round(r.w)), cols)
  const h = Math.max(1, Math.round(r.h))
  const x = Math.min(Math.max(0, Math.round(r.x)), cols - w)
  const y = Math.max(0, Math.round(r.y))
  return { ...r, x, y, w, h }
}

/**
 * Resolves a layout for `cols` columns.
 * - locked widgets keep their cell (clamped) and are placed first;
 * - the `priorityId` widget (the one being dragged/resized) keeps its requested cell;
 * - the rest are pushed down on collision and, unless `freeform`, pulled up (vertical gravity).
 * Returns null when the priority widget would overlap a locked one.
 */
export function resolveLayout(
  items: WidgetRect[],
  cols: number,
  opts: { priorityId?: string | null; freeform?: boolean } = {},
): WidgetRect[] | null {
  const safeCols = Math.max(1, cols)
  const clamped = items.map((i) => clamp(i, safeCols))
  const placed: WidgetRect[] = []
  const out = new Map<string, WidgetRect>()

  for (const l of clamped.filter((i) => i.locked && i.id !== opts.priorityId)) {
    placed.push(l)
    out.set(l.id, l)
  }
  const priority = clamped.find((i) => i.id === opts.priorityId)
  if (priority) {
    if (placed.some((p) => collides(p, priority))) return null
    placed.push(priority)
    out.set(priority.id, priority)
  }

  const rest = clamped
    .filter((i) => !out.has(i.id))
    .sort((a, b) => a.y - b.y || a.x - b.x)
  for (const item of rest) {
    const r = { ...item, y: opts.freeform ? item.y : 0 }
    while (placed.some((p) => collides(p, r))) r.y += 1
    placed.push(r)
    out.set(r.id, r)
  }
  return items.map((i) => out.get(i.id)!)
}
