<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineRow, TimelineVisit } from '../scheduleData'
import { VAvatar } from '../../../components/images/VAvatar'

const props = withDefaults(
  defineProps<{
    rows: TimelineRow[]
    startHour?: number
    endHour?: number
    /** Pixel width of one hour column. */
    hourWidth?: number
  }>(),
  { startHour: 7, endHour: 19, hourWidth: 72 },
)

const emit = defineEmits<{ select: [visit: TimelineVisit, row: TimelineRow] }>()

const hours = computed(() =>
  Array.from({ length: props.endHour - props.startHour }, (_, i) => props.startHour + i),
)

function hourLabel(h: number) {
  const suffix = h >= 12 ? 'PM' : 'AM'
  const n = h % 12 === 0 ? 12 : h % 12
  return `${n} ${suffix}`
}
function clock(v: number) {
  const h = Math.floor(v)
  const m = Math.round((v - h) * 60)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const n = h % 12 === 0 ? 12 : h % 12
  return m ? `${n}:${String(m).padStart(2, '0')} ${suffix}` : `${n} ${suffix}`
}
function pillStyle(v: TimelineVisit) {
  return {
    left: `calc(${((v.start - props.startHour) / span.value) * 100}% + 3px)`,
    width: `calc(${((v.end - v.start) / span.value) * 100}% - 6px)`,
  }
}
const span = computed(() => props.endHour - props.startHour)
const laneWidth = computed(() => `${hours.value.length * props.hourWidth}px`)
</script>

<template>
  <div
    class="tl"
    role="region"
    aria-label="Visit timeline, scrolls horizontally"
    tabindex="0"
    :style="{ '--tl-hw': `${hourWidth}px`, '--tl-lane': laneWidth, '--tl-n': span }"
  >
    <div class="tl__inner">
      <div class="tl__head">
        <div class="tl__corner" aria-hidden="true">Caregiver</div>
        <div class="tl__hours" aria-hidden="true">
          <span v-for="h in hours" :key="h" class="tl__hour">{{ hourLabel(h) }}</span>
        </div>
      </div>

      <ul class="tl__rows">
        <li v-for="row in rows" :key="row.id" class="tl__row" :class="{ 'tl__row--open': row.open }">
          <div class="tl__who">
            <span v-if="row.open" class="tl__stripe" aria-hidden="true" />
            <span v-else class="tl__av" :style="{ '--av': row.color }">
              <VAvatar :initials="row.initials ?? row.name.split(' ').map((p) => p[0]).slice(0, 2).join('')" size="sm" decorative />
            </span>
            <span class="tl__name">{{ row.name }}</span>
            <span v-if="row.alert" class="tl__alert" role="img" aria-label="Needs attention" />
          </div>
          <div class="tl__lane">
            <button
              v-for="v in row.visits"
              :key="v.id"
              type="button"
              class="tl__pill"
              :class="[v.tone ? `tl__pill--${v.tone}` : '', row.open ? 'tl__pill--open' : '']"
              :style="pillStyle(v)"
              :aria-label="`${v.patient}, ${clock(v.start)} to ${clock(v.end)}${row.open ? ', open shift' : ', ' + row.name}`"
              @click="emit('select', v, row)"
            >
              <span class="tl__pill-name">{{ v.patient }}</span>
              <span class="tl__pill-time">{{ clock(v.start) }} – {{ clock(v.end) }}</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tl { overflow: auto; border-radius: var(--v-radius-12); }
.tl:focus-visible { outline: 2px solid var(--v-color-focus); outline-offset: 2px; }
.tl__inner { --tl-who: 188px; min-width: calc(var(--tl-who) + var(--tl-lane)); }

.tl__head { position: sticky; top: 0; z-index: 3; display: grid; grid-template-columns: var(--tl-who) minmax(var(--tl-lane), 1fr); background: var(--v-color-surface); border-bottom: 1px solid var(--v-color-divider); }
.tl__corner { position: sticky; left: 0; z-index: 4; display: flex; align-items: center; padding: 10px 12px; background: var(--v-color-surface); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--v-color-text-muted); }
.tl__hours { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); }
.tl__hour { padding: 10px 0 10px 8px; font-size: 12px; color: var(--v-color-text-muted); border-left: 1px solid var(--v-color-divider); font-variant-numeric: tabular-nums; }

.tl__rows { list-style: none; margin: 0; padding: 0; }
.tl__row { display: grid; grid-template-columns: var(--tl-who) minmax(var(--tl-lane), 1fr); border-bottom: 1px solid var(--v-color-divider); }
.tl__row:last-child { border-bottom: 0; }
.tl__who { position: sticky; left: 0; z-index: 2; display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--v-color-surface); font-size: 13px; font-weight: 600; color: var(--v-color-text); min-width: 0; }
.tl__name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tl__av :deep(.v-avatar) { --v-avatar-initials-bg: var(--av); --v-avatar-initials-color: var(--v-color-on-primary); }
.tl__alert { width: 8px; height: 8px; margin-left: auto; border-radius: 50%; background: var(--v-color-orange-base); flex: none; }
.tl__stripe { width: 32px; height: 32px; flex: none; border-radius: 50%; border: 1px dashed var(--v-color-primary-300); background: repeating-linear-gradient(135deg, var(--v-color-primary-100) 0 3px, transparent 3px 6px); }

.tl__lane { position: relative; min-width: 0; height: 56px; background-image: linear-gradient(to right, var(--v-color-divider) 1px, transparent 1px); background-size: calc(100% / var(--tl-n)) 100%; }
.tl__pill { position: absolute; top: 7px; height: 42px; box-sizing: border-box; display: grid; align-content: center; gap: 1px; padding: 0 12px; text-align: left; border: 0; border-radius: 12px; cursor: pointer; overflow: hidden; background: var(--v-color-primary-100); color: var(--v-color-primary-800); font-family: inherit; }
.tl__pill:hover { box-shadow: 0 0 0 1.5px var(--v-color-primary-400) inset; }
.tl__pill:focus-visible { outline: 2px solid var(--v-color-focus); outline-offset: 1px; z-index: 1; }
.tl__pill-name { font-size: 12.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tl__pill-time { font-size: 11px; opacity: .75; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tl__pill--lime { background: var(--v-color-lime-light); color: var(--v-color-lime-dark); }
.tl__pill--lime:hover { box-shadow: 0 0 0 1.5px var(--v-color-lime-base) inset; }
.tl__pill--open { background: repeating-linear-gradient(135deg, var(--v-color-primary-50) 0 6px, var(--v-color-primary-100) 6px 12px); border: 1px dashed var(--v-color-primary-300); color: var(--v-color-primary-text); }
</style>
