<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { areaPath, bandPositions, clampIndex, linearScale, linePath, nearestIndex } from './chartMath'
import type { LineSeries, TooltipPoint } from './types'

const props = withDefaults(
  defineProps<{
    labels: string[]
    series: LineSeries[]
    yMin: number
    yMax: number
    yTicks?: number[]
    formatY?: (n: number) => string
    formatValue?: (n: number, s: LineSeries) => string
    height?: number
    smooth?: boolean
    showYAxis?: boolean
    showGrid?: boolean
    /** Index shown when pointer/keyboard are away (a pinned tooltip). */
    restIndex?: number | null
    /** Highlight the active column with a soft band instead of a thin crosshair. */
    columnHighlight?: boolean
    /** `dark` bubble, `light` card, or `none` (slot supplies the whole look). */
    tooltipTone?: 'dark' | 'light' | 'none'
    ariaLabel?: string
    xLabelStep?: number
    /** Series id the tooltip anchors to (defaults to the first). */
    anchorSeries?: string
    /** Remove the side gutters so the plot touches both edges. */
    edgeToEdge?: boolean
    /** Extra headroom above the plot (room for a pinned tooltip). */
    padTop?: number
    /** Centre each category in an equal-width band (bar-chart style) so column highlights never overflow. */
    bands?: boolean
  }>(),
  {
    smooth: true,
    height: 260,
    showYAxis: true,
    showGrid: true,
    restIndex: null,
    columnHighlight: false,
    tooltipTone: 'dark',
    xLabelStep: 1,
    edgeToEdge: false,
    padTop: 14,
    bands: false,
    formatY: (n: number) => String(n),
  },
)
const emit = defineEmits<{ hover: [index: number | null] }>()

const gid = `lc-${Math.random().toString(36).slice(2, 8)}`

const root = ref<HTMLElement | null>(null)
const width = ref(640)
const hoverIndex = ref<number | null>(null)
let ro: ResizeObserver | null = null

onMounted(() => {
  if (!root.value) return
  width.value = root.value.clientWidth || 640
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) width.value = Math.round(w)
    })
    ro.observe(root.value)
  }
})
onBeforeUnmount(() => ro?.disconnect())

const pad = computed(() => ({
  top: props.padTop,
  right: props.edgeToEdge ? 0 : 18,
  bottom: 28,
  left: props.showYAxis ? 46 : props.edgeToEdge ? 0 : 18,
}))
const plot = computed(() => ({
  l: pad.value.left,
  r: Math.max(pad.value.left + 10, width.value - pad.value.right),
  t: pad.value.top,
  b: props.height - pad.value.bottom,
}))
const bandWidth = computed(() => (plot.value.r - plot.value.l) / Math.max(1, props.labels.length))
const xs = computed(() =>
  props.bands
    ? bandPositions(props.labels.length, plot.value.l + bandWidth.value / 2, plot.value.r - bandWidth.value / 2)
    : bandPositions(props.labels.length, plot.value.l, plot.value.r),
)
const yOf = computed(() => linearScale(props.yMin, props.yMax, plot.value.b, plot.value.t))
const ticks = computed(() => {
  if (props.yTicks) return props.yTicks
  const out: number[] = []
  const step = (props.yMax - props.yMin) / 4
  for (let i = 0; i <= 4; i++) out.push(props.yMin + step * i)
  return out
})

/** Skip labels (every 2nd, 3rd...) when the plot is too narrow to fit them all. */
const labelStep = computed(() => {
  const n = props.labels.length
  const slot = n > 1 ? (plot.value.r - plot.value.l) / (n - 1) : Infinity
  const fit = Math.max(1, Math.ceil(46 / Math.max(slot, 1)))
  return Math.max(props.xLabelStep, fit)
})

const lines = computed(() =>
  props.series.map((s) => {
    const pts = s.data.map((v, i) => ({ x: xs.value[i], y: yOf.value(v) }))
    return {
      s,
      pts,
      d: linePath(pts, props.smooth),
      area: s.area ? areaPath(pts, plot.value.b, props.smooth) : '',
    }
  }),
)
const markerLines = computed(() => lines.value.filter((l) => l.s.marker !== false && !l.s.dashed))

const activeIndex = computed(() => hoverIndex.value ?? props.restIndex ?? null)

const anchor = computed(() => lines.value.find((l) => l.s.id === props.anchorSeries) ?? lines.value[0])
const tipPoints = computed<TooltipPoint[]>(() => {
  const i = activeIndex.value
  if (i === null) return []
  return props.series.map((s) => ({ series: s, value: s.data[i] }))
})
const tipStyle = computed(() => {
  const i = activeIndex.value
  if (i === null || !anchor.value) return {}
  const x = xs.value[i]
  const y = anchor.value.pts[i].y
  const edge = 110
  const align = x < edge ? '-12%' : x > width.value - edge ? '-88%' : '-50%'
  return { left: `${x}px`, top: `${y}px`, '--tip-x': align } as Record<string, string>
})

const colWidth = computed(() => {
  const n = props.labels.length
  if (props.bands) return bandWidth.value
  return n > 1 ? (plot.value.r - plot.value.l) / (n - 1) : 40
})

function fmtValue(v: number, s: LineSeries): string {
  return props.formatValue ? props.formatValue(v, s) : props.formatY(v)
}

function setIndex(i: number | null): void {
  if (hoverIndex.value === i) return
  hoverIndex.value = i
  emit('hover', i)
}

function onMove(e: PointerEvent): void {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  setIndex(nearestIndex(e.clientX - rect.left, xs.value))
}

function onKey(e: KeyboardEvent): void {
  const n = props.labels.length
  const cur = activeIndex.value ?? -1
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setIndex(clampIndex(cur + 1, n))
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setIndex(clampIndex(cur < 0 ? n - 1 : cur - 1, n))
  else if (e.key === 'Home') setIndex(0)
  else if (e.key === 'End') setIndex(n - 1)
  else if (e.key === 'Escape') setIndex(null)
  else return
  e.preventDefault()
}

function onFocus(): void {
  if (activeIndex.value === null) setIndex(0)
}

const liveText = computed(() => {
  const i = activeIndex.value
  if (i === null) return ''
  return `${props.labels[i]}: ${props.series.map((s) => `${s.label} ${fmtValue(s.data[i], s)}`).join(', ')}`
})

defineExpose({ activeIndex, xs })
</script>

<template>
  <div
    ref="root"
    class="chart-line"
    :style="{ height: `${height}px` }"
    tabindex="0"
    role="group"
    aria-roledescription="line chart"
    :aria-label="ariaLabel ?? 'Line chart. Use arrow keys to inspect values.'"
    @pointermove="onMove"
    @pointerleave="setIndex(null)"
    @focus="onFocus"
    @blur="setIndex(null)"
    @keydown="onKey"
  >
    <svg class="chart-line__svg" :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true">
      <defs>
        <linearGradient v-for="l in lines" :id="`${gid}-${l.s.id}`" :key="l.s.id" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="l.s.color" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="l.s.color" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g v-if="showGrid" class="chart-line__grid">
        <line v-for="t in ticks" :key="t" :x1="plot.l" :x2="plot.r" :y1="yOf(t)" :y2="yOf(t)" />
      </g>
      <g v-if="showYAxis" class="chart-line__yaxis">
        <text v-for="t in ticks" :key="t" :x="plot.l - 12" :y="yOf(t)" text-anchor="end" dominant-baseline="middle">{{ formatY(t) }}</text>
      </g>
      <g class="chart-line__xaxis">
        <template v-for="(lab, i) in labels" :key="lab + i">
          <text
            v-if="i % labelStep === 0"
            :x="xs[i]"
            :y="height - 8"
            :text-anchor="edgeToEdge && i === 0 ? 'start' : edgeToEdge && i === labels.length - 1 ? 'end' : 'middle'"
            :class="{ 'is-active': activeIndex === i }"
          >{{ lab }}</text>
        </template>
      </g>

      <rect
        v-if="columnHighlight && activeIndex !== null"
        class="chart-line__column"
        :x="xs[activeIndex] - colWidth / 2"
        :y="plot.t - 6"
        :width="colWidth"
        :height="plot.b - plot.t + 6"
        rx="12"
      />
      <line
        v-else-if="activeIndex !== null"
        class="chart-line__crosshair"
        :x1="xs[activeIndex]"
        :x2="xs[activeIndex]"
        :y1="plot.t"
        :y2="plot.b"
      />

      <template v-for="l in lines" :key="`a-${l.s.id}`">
        <path v-if="l.area" :d="l.area" :fill="`url(#${gid}-${l.s.id})`" class="chart-line__area" />
      </template>
      <path
        v-for="l in lines"
        :key="`p-${l.s.id}`"
        :d="l.d"
        class="chart-line__path"
        :class="{ 'chart-line__path--dashed': l.s.dashed }"
        :stroke="l.s.color"
        :stroke-width="l.s.width ?? 2.25"
        :data-series="l.s.id"
        fill="none"
      />
      <template v-if="activeIndex !== null">
        <g v-for="l in markerLines" :key="`m-${l.s.id}`" class="chart-line__marker">
          <circle :cx="l.pts[activeIndex].x" :cy="l.pts[activeIndex].y" r="10" :fill="l.s.color" opacity="0.18" />
          <circle :cx="l.pts[activeIndex].x" :cy="l.pts[activeIndex].y" r="5" class="chart-line__ring" :stroke="l.s.color" stroke-width="2.5" />
        </g>
      </template>
    </svg>

    <div
      v-if="activeIndex !== null && (tooltipTone !== 'none' || $slots.tooltip)"
      class="chart-line__tip"
      :class="`chart-line__tip--${tooltipTone}`"
      :style="tipStyle"
      data-test-id="chart-tooltip"
    >
      <slot name="tooltip" :index="activeIndex" :label="labels[activeIndex]" :points="tipPoints">
        <span class="chart-line__tip-title">{{ labels[activeIndex] }}</span>
        <span v-for="p in tipPoints" :key="p.series.id" class="chart-line__tip-row">
          <i class="chart-line__tip-dot" :style="{ background: p.series.color }" />
          <span>{{ p.series.label }}</span>
          <strong>{{ fmtValue(p.value, p.series) }}</strong>
        </span>
      </slot>
    </div>
    <span class="chart-line__live" aria-live="polite">{{ liveText }}</span>
  </div>
</template>

<style scoped lang="scss">
.chart-line {
  position: relative;
  width: 100%;
  min-width: 0;
  border-radius: var(--v-radius-md);
  outline: none;
  touch-action: pan-y;

  &:focus-visible {
    outline: var(--v-focus-ring-width) solid var(--v-color-focus);
    outline-offset: 2px;
  }

  &__svg {
    display: block;
    overflow: visible;
    max-width: 100%;
  }

  &__grid line {
    stroke: var(--chart-grid, var(--v-color-divider));
    stroke-width: 1;
    shape-rendering: crispEdges;
  }

  &__yaxis text,
  &__xaxis text {
    fill: var(--chart-axis, var(--v-color-text-muted));
    font: 500 11px var(--v-font-family-sans);
  }

  &__xaxis text.is-active {
    fill: var(--v-color-text);
    font-weight: 700;
  }

  &__crosshair {
    stroke: var(--chart-axis, var(--v-color-text-muted));
    stroke-width: 1;
    stroke-dasharray: 3 4;
    opacity: 0.7;
  }

  &__column {
    fill: var(--chart-column, color-mix(in srgb, var(--v-color-primary) 9%, transparent));
  }

  &__path {
    stroke-linecap: round;
    stroke-linejoin: round;

    &--dashed {
      stroke-dasharray: 5 6;
      opacity: 0.9;
    }
  }

  &__ring {
    fill: var(--v-color-surface);
  }

  &__tip {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    display: grid;
    gap: 4px;
    width: max-content;
    max-width: 260px;
    padding: 10px 12px;
    border-radius: var(--v-radius-12);
    font-size: 12px;
    line-height: 16px;
    transform: translate(var(--tip-x, -50%), calc(-100% - 16px));
    white-space: nowrap;

    &--dark {
      background: var(--chart-tip-bg, var(--v-color-text));
      color: var(--chart-tip-fg, var(--v-color-bg));
      border: 1px solid var(--chart-tip-border, transparent);
      box-shadow: var(--v-shadow-lg);
    }

    &--light {
      padding: 12px 14px;
      border: 1px solid var(--v-color-border);
      background: var(--v-color-surface);
      color: var(--v-color-text);
      box-shadow: var(--v-shadow-lg);
    }

    &--none {
      padding: 0;
    }
  }

  &__tip-title {
    font-weight: 600;
    opacity: 0.8;
  }

  &__tip-row {
    display: flex;
    align-items: center;
    gap: 8px;

    strong {
      margin-left: auto;
      padding-left: 12px;
      font-weight: 700;
    }
  }

  &__tip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
  }

  &__live {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
}
</style>
