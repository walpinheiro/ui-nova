<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

type Dot = { ox: number; oy: number; x: number; y: number; hidden: boolean }
type Surface = { l: number; t: number; r: number; b: number; carryX: number; carryY: number }

let dots: Dot[] = []
let cols = 0
let frame = 0
let reduced = false
const previous = new Map<Element, { cx: number; cy: number; carryX: number; carryY: number }>()

function rebuild() {
  const el = canvas.value
  const host = root.value
  if (!el || !host) return
  const box = host.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.max(1, Math.floor(box.width * dpr))
  el.height = Math.max(1, Math.floor(box.height * dpr))
  const gap = 22 * dpr
  dots = []
  cols = 0
  for (let y = gap; y < el.height - gap / 2; y += gap) {
    let count = 0
    for (let x = gap; x < el.width - gap / 2; x += gap) {
      dots.push({ ox: x, oy: y, x, y, hidden: false })
      count += 1
    }
    cols = count
  }
}

function surfaces(host: HTMLElement, dpr: number): Surface[] {
  const box = host.getBoundingClientRect()
  return [...host.querySelectorAll<HTMLElement>('[data-surface]')].map((node) => {
    const rect = node.getBoundingClientRect()
    const l = (rect.left - box.left) * dpr
    const t = (rect.top - box.top) * dpr
    const r = (rect.right - box.left) * dpr
    const b = (rect.bottom - box.top) * dpr
    const cx = (l + r) / 2
    const cy = (t + b) / 2
    const last = previous.get(node) ?? { cx, cy, carryX: 0, carryY: 0 }
    const vx = cx - last.cx
    const vy = cy - last.cy
    const moving = Math.hypot(vx, vy) > 0.4
    const carryX = moving ? last.carryX + vx : last.carryX * 0.84
    const carryY = moving ? last.carryY + vy : last.carryY * 0.84
    previous.set(node, { cx, cy, carryX, carryY })
    return { l, t, r, b, carryX, carryY }
  })
}

function draw() {
  const el = canvas.value
  const host = root.value
  if (!el || !host) return
  const ctx = el.getContext('2d')
  if (!ctx) return
  const dpr = el.width / Math.max(host.getBoundingClientRect().width, 1)
  const bodies = surfaces(host, dpr)
  const color = getComputedStyle(host).color
  const ease = reduced ? 1 : 0.2
  const reach = 72 * dpr

  for (const dot of dots) {
    let tx = dot.ox
    let ty = dot.oy
    let hidden = false
    for (const body of bodies) {
      const inside = dot.ox > body.l && dot.ox < body.r && dot.oy > body.t && dot.oy < body.b
      if (inside) hidden = true
      const travel = Math.hypot(body.carryX, body.carryY)
      if (travel < 0.5) continue
      const nearestX = Math.min(Math.max(dot.ox, body.l), body.r)
      const nearestY = Math.min(Math.max(dot.oy, body.t), body.b)
      const dist = inside ? 0 : Math.hypot(dot.ox - nearestX, dot.oy - nearestY)
      if (dist < reach) {
        const falloff = 1 - dist / reach
        tx += body.carryX * falloff
        ty += body.carryY * falloff
      }
    }
    dot.hidden = hidden
    dot.x += (tx - dot.x) * ease
    dot.y += (ty - dot.y) * ease
  }

  ctx.clearRect(0, 0, el.width, el.height)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = dpr
  ctx.globalAlpha = 0.55
  ctx.beginPath()
  for (let i = 0; i < dots.length; i += 1) {
    const dot = dots[i]
    if (dot.hidden) continue
    const right = i % cols === cols - 1 ? undefined : dots[i + 1]
    const below = dots[i + cols]
    if (right && !right.hidden) {
      ctx.moveTo(dot.x, dot.y)
      ctx.lineTo(right.x, right.y)
    }
    if (below && !below.hidden) {
      ctx.moveTo(dot.x, dot.y)
      ctx.lineTo(below.x, below.y)
    }
  }
  ctx.stroke()
  ctx.globalAlpha = 0.8
  for (const dot of dots) {
    if (dot.hidden) continue
    ctx.beginPath()
    ctx.arc(dot.x, dot.y, 1.15 * dpr, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function tick() {
  draw()
  frame = requestAnimationFrame(tick)
}

let observer: ResizeObserver | undefined

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  rebuild()
  observer = new ResizeObserver(() => rebuild())
  if (root.value) observer.observe(root.value)
  frame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="canvas-grid">
    <canvas ref="canvas" class="grid" aria-hidden="true" />
    <div class="canvas-grid__stage">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.canvas-grid {
  position: relative;
  min-height: 560px;
  overflow: hidden;
  border-radius: var(--v-radius-lg);
  background: var(--v-color-neutral-50);
  color: var(--v-color-neutral-300);

  .grid {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__stage {
    position: relative;
    z-index: 1;
    min-height: 560px;
  }
}
</style>
