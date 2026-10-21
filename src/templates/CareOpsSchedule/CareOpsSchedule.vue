<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import { VIcon } from '../../components/primitives/VIcon'
import VSidebar from '../../components/navigation/VSidebar/VSidebar.vue'
import type { VSidebarItem } from '../../components/navigation/VSidebar/VSidebar.types'
import VSearchField from '../../components/form/VSearchField/VSearchField.vue'
import VAvatar from '../../components/images/VAvatar/VAvatar.vue'
import VBadge from '../../components/feedback/VBadge/VBadge.vue'
import TimelineGrid from './parts/TimelineGrid.vue'
import ThemeToggle from '../_shared/ThemeToggle.vue'
import { caregivers, openShifts, SCHEDULE_END_HOUR, SCHEDULE_START_HOUR, type TimelineVisit } from './scheduleData'

const items: VSidebarItem[] = [
  {
    value: 'g-menu',
    label: 'MENU',
    type: 'group',
    children: [
      { value: 'overview', label: 'Overview', icon: 'overview' },
      { value: 'patients', label: 'Patients', icon: 'users', badge: 10, badgeTone: 'primary' },
      { value: 'caregivers', label: 'Caregivers', icon: 'heart' },
      { value: 'schedule', label: 'Schedule', icon: 'calendar', badge: 3, badgeTone: 'primary' },
      { value: 'visits', label: 'Visits', icon: 'clock' },
      { value: 'care-plans', label: 'Care Plans', icon: 'file' },
      { value: 'copilot', label: 'AI Copilot', icon: 'sparkles' },
    ],
  },
  {
    value: 'g-business',
    label: 'BUSINESS',
    type: 'group',
    children: [
      {
        value: 'billing',
        label: 'Billing & Claims',
        icon: 'billing',
        badge: 14,
        badgeTone: 'primary',
        children: [
          { value: 'claims', label: 'Claims' },
          { value: 'invoices', label: 'Invoices' },
          { value: 'payers', label: 'Payers' },
        ],
      },
      { value: 'compliance', label: 'Compliance', icon: 'shield' },
      {
        value: 'reports',
        label: 'Reports',
        icon: 'chart',
        children: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ],
      },
    ],
  },
]

const active = ref('schedule')
const query = ref('')
const selected = ref<TimelineVisit | null>(null)

const narrow = ref(false)
let mq: MediaQueryList | undefined
const sync = () => { narrow.value = !!mq?.matches }
onMounted(() => {
  mq = window.matchMedia('(max-width: 1100px)')
  sync()
  mq.addEventListener('change', sync)
})
onBeforeUnmount(() => mq?.removeEventListener('change', sync))

const rows = [openShifts, ...caregivers]
</script>

<template>
  <div class="care">
    <VSidebar
      class="care__side"
      v-model:active-item="active"
      :items="items"
      :collapsed="narrow"
      :expanded-sections="['g-menu', 'g-business']"
      :show-search="false"
      :show-footer="false"
      aria-label="CareOps"
    >
      <template #header>
        <span class="logo" aria-hidden="true"><VIcon :icon="plusIcon" size="sm" /></span>
        <span class="logo__name">CareOps</span>
      </template>
    </VSidebar>

    <div class="care__main">
      <header class="bar">
        <div class="bar__who">
          <VAvatar initials="JH" size="md" decorative />
          <div class="bar__text">
            <strong>Juniper Home Health</strong>
            <span>Schedule · Wednesday, Sep 30</span>
          </div>
        </div>
        <div class="bar__actions">
          <ThemeToggle orientation="horizontal" />
          <VSearchField v-model="query" class="bar__search" placeholder="Search patients…" aria-label="Search patients" />
        </div>
      </header>

      <main class="stage">
        <section class="panel" aria-labelledby="sched-h">
          <div class="card">
            <div class="card__head">
              <span class="tile" aria-hidden="true"><VIcon :icon="calendarIcon" /></span>
              <h1 id="sched-h">Schedule</h1>
              <span class="card__meta">Wednesday, Sep 30 · 142 visits</span>
              <VBadge variant="warning" size="sm" class="card__open">3 open shifts</VBadge>
            </div>
            <TimelineGrid
              :rows="rows"
              :start-hour="SCHEDULE_START_HOUR"
              :end-hour="SCHEDULE_END_HOUR"
              @select="(v) => (selected = v)"
            />
            <p class="card__sr" aria-live="polite">{{ selected ? `Selected visit: ${selected.patient}` : '' }}</p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.care { display: flex; min-height: 100vh; background: var(--v-color-surface); color: var(--v-color-text); font-family: var(--v-font-family-sans); }
.care__side { flex: none; }
.care__main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.logo { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--v-color-primary); color: var(--v-color-on-primary); flex: none; }
.logo__name { font-size: 17px; font-weight: 700; letter-spacing: -.01em; color: var(--v-color-text); }

.bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px 16px; padding: 16px 28px; }
.bar__who { display: flex; align-items: center; gap: 12px; min-width: 0; }
.bar__text { display: grid; line-height: 1.3; }
.bar__text strong { font-size: 15px; font-weight: 700; }
.bar__text span { font-size: 13px; color: var(--v-color-text-muted); }
.bar__actions { display: flex; align-items: center; gap: 12px; }
.bar__search { width: 260px; max-width: 100%; }
.bar__search :deep(input) { border-radius: var(--v-radius-pill); }

.stage { flex: 1; padding: 0 20px 20px 20px; min-width: 0; }
.panel { height: 100%; box-sizing: border-box; padding: 20px; border-radius: 28px; background: var(--v-color-primary-50); }
.card { padding: 20px; border-radius: 20px; background: var(--v-color-surface); border: 1px solid var(--v-color-border); box-shadow: var(--v-shadow-sm); min-width: 0; }
.card__head { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
.card__head h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -.01em; }
.card__meta { font-size: 14px; color: var(--v-color-text-muted); }
.card__open { margin-left: auto; }
.tile { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 12px; background: var(--v-color-primary-50); color: var(--v-color-primary-text); }
.card__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); margin: 0; }

@media (max-width: 720px) {
  .care { flex-direction: column; }
  .care__side { display: none; }
  .bar { padding: 14px 16px; }
  .bar__actions { width: 100%; }
  .bar__search { flex: 1; width: auto; }
  .stage { padding: 0 8px 8px; }
  .panel { padding: 8px; border-radius: 20px; }
  .card { padding: 14px; }
}
</style>
