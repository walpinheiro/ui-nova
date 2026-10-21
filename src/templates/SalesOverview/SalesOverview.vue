<script setup lang="ts">
import { computed, ref } from 'vue'
import chevronDown from '@iconify-icons/keyline-icons/chevron-down'
import chevronsUpDown from '@iconify-icons/keyline-icons/chevrons-up-down'
import VAvatar from '../../components/images/VAvatar/VAvatar.vue'
import VBadge from '../../components/feedback/VBadge/VBadge.vue'
import VBreadcrumb from '../../components/navigation/VBreadcrumb/VBreadcrumb.vue'
import VButton from '../../components/form/VButton/VButton.vue'
import VCard from '../../components/containment/VCard/VCard.vue'
import VPanel from '../../components/containment/VPanel/VPanel.vue'
import VSegmentedControl from '../../components/navigation/VSegmentedControl/VSegmentedControl.vue'
import VSidebar from '../../components/navigation/VSidebar/VSidebar.vue'
import { VIcon } from '../../components/primitives/VIcon'
import { LineChart, StepAreaChart } from '../_charts'
import ThemeToggle from '../_shared/ThemeToggle.vue'
import '../_shared/sidebarPatterns.scss'
import type { LineSeries } from '../_charts'
import CapsuleBars from './parts/CapsuleBars.vue'
import {
  APPOINTMENT_BARS,
  DAYS,
  DEALS,
  GOALS,
  GROSS,
  MARGIN,
  NAV_ITEMS,
  PIPELINE,
  PROFIT,
  RAIL_ITEMS,
  SALES_MODES,
  SCHEDULE,
  TOTALS,
  UPCOMING,
  dayTitle,
} from './data'

const mode = ref<'gross' | 'profit'>('profit')
const nav = ref('overview')
const rail = ref('chart')
const period = ref('Last 7 days')

const crumbs = [{ label: 'Dashboard', href: '#dashboard' }, { label: 'Company' }]
const filters = ['Last 7 days', 'All tags', 'All models']

const salesSeries = computed<LineSeries[]>(() => [
  { id: 'goals', label: 'Goals', data: GOALS, color: 'var(--so-goals)', area: true, width: 2.5 },
  {
    id: 'profit',
    label: mode.value === 'profit' ? 'Profit' : 'Gross',
    data: mode.value === 'profit' ? PROFIT : GROSS,
    color: 'var(--so-accent)',
    width: 2.75,
  },
])

const k = (n: number): string => `$${Math.round(n)}K`
const delta = (i: number): string => {
  const series = mode.value === 'profit' ? PROFIT : GROSS
  if (i === 0) return '-'
  const d = ((series[i] - series[i - 1]) / series[i - 1]) * 100
  return `${d >= 0 ? '+' : ''}${d.toFixed(1)}%`
}
const total = computed(() => TOTALS[mode.value])
</script>

<template>
  <div class="so">
    <VSidebar
      v-model:active-item="rail"
      class="so__rail sp-app-rail"
      variant="icons"
      :items="RAIL_ITEMS"
      :show-search="false"
      :show-footer="false"
      :show-brand="false"
      :show-collapse-toggle="false"
      aria-label="Apps"
    />

    <aside class="so__side sp-side" aria-label="Workspace navigation">
      <VSidebar
        v-model:active-item="nav"
        class="so__nav sp-side__nav"
        :items="NAV_ITEMS"
        :expanded-sections="['g-pipeline', 'g-reports', 'g-workspace', 'g-settings', 'deals']"
        :show-search="false"
        :show-footer="false"
        aria-label="Workspace"
      >
        <template #header>
          <button type="button" class="so__switcher sp-switcher" aria-haspopup="menu" aria-label="Switch workspace: sparkpixel.studio">
            <span class="so__mark sp-switcher__mark" aria-hidden="true">s</span>
            <span class="so__switcher-name sp-switcher__name">sparkpixel.studio</span>
            <VIcon :icon="chevronsUpDown" size="sm" />
          </button>
        </template>
      </VSidebar>
    </aside>

    <main class="so__main">
      <header class="so__top">
        <VBreadcrumb :items="crumbs" aria-label="Breadcrumb" />
        <div class="so__filters">
          <VButton v-for="f in filters" :key="f" variant="outline" size="sm" aria-haspopup="menu">
            {{ f }}
            <template #icon-end><VIcon :icon="chevronDown" size="sm" /></template>
          </VButton>
          <ThemeToggle variant="pill" size="sm" />
        </div>
      </header>

      <div class="so__grid">
        <VCard variant="outlined" class="so-card so-sales">
          <div class="so-card__head">
            <div>
              <h2 class="so-eyebrow">Recent sales</h2>
              <p class="so-sales__total">{{ total }}</p>
              <p class="so-muted">Last 7 days</p>
            </div>
            <div class="so-sales__controls">
              <VSegmentedControl v-model="mode" :options="SALES_MODES" size="sm" aria-label="Revenue measure" />
              <VButton variant="outline" size="sm" aria-haspopup="menu">
                {{ period }}
                <template #icon-end><VIcon :icon="chevronDown" size="sm" /></template>
              </VButton>
            </div>
          </div>
          <LineChart
            :labels="DAYS"
            :series="salesSeries"
            :y-min="20"
            :y-max="100"
            :y-ticks="[20, 40, 60, 80, 100]"
            :show-y-axis="false"
            :height="360"
            :pad-top="140"
            :rest-index="3"
            anchor-series="goals"
            tooltip-tone="light"
            column-highlight
            bands
            aria-label="Recent sales, Monday to Sunday. Use arrow keys to inspect each day."
          >
            <template #tooltip="{ index, points }">
              <span class="so-tip__date">{{ dayTitle(index) }}</span>
              <span class="so-tip__row"><i class="so-tip__dot so-tip__dot--accent" />{{ points[1].series.label }}<strong>{{ k(points[1].value) }}</strong></span>
              <span class="so-tip__row"><i class="so-tip__dot so-tip__dot--goals" />Goals<strong>{{ k(points[0].value) }}</strong></span>
              <span class="so-tip__row"><i class="so-tip__dot so-tip__dot--deals" />Deals<strong>{{ DEALS[index] }} closed</strong></span>
              <hr class="so-tip__rule" />
              <span class="so-tip__row">Margin<strong>{{ MARGIN }}%</strong></span>
              <span class="so-tip__row">vs prev day<strong class="so-tip__up">{{ delta(index) }}</strong></span>
            </template>
          </LineChart>
        </VCard>

        <VCard variant="outlined" class="so-card so-upcoming">
          <div class="so-card__head">
            <div>
              <h2 class="so-eyebrow">Upcoming appointments</h2>
              <p class="so-sales__total">$3.2M</p>
              <p class="so-muted">Pipeline Value</p>
            </div>
          </div>
          <CapsuleBars class="so-caps" :bars="APPOINTMENT_BARS" :height="290" />
        </VCard>

        <VCard variant="outlined" class="so-card so-activity">
          <div class="so-card__head">
            <h2 class="so-eyebrow">Appointment activity</h2>
            <VBadge variant="neutral" size="md">Aug 16 - 22</VBadge>
          </div>
          <div class="so-activity__panels">
            <VPanel title="Schedule" heading-level="3" variant="bordered" class="so-sub">
              <ul class="so-schedule">
                <li v-for="s in SCHEDULE" :key="s.id" class="so-schedule__row">
                  <span class="so-date" aria-hidden="true"><strong>{{ s.day }}</strong><span>{{ s.month }}</span></span>
                  <span class="so-schedule__text">
                    <span class="so-schedule__time">{{ s.time }}</span>
                    <strong>{{ s.name }}</strong>
                    <span class="so-muted">{{ s.detail }}</span>
                  </span>
                  <strong class="so-schedule__amount">{{ s.amount }}</strong>
                </li>
              </ul>
            </VPanel>

            <VPanel title="Lead Pipeline" heading-level="3" variant="bordered" class="so-sub">
              <ul class="so-stages">
                <li v-for="p in PIPELINE" :key="p.id">
                  <span class="so-muted">{{ p.label }}</span>
                  <strong>{{ p.display }}</strong>
                </li>
              </ul>
              <StepAreaChart curve :values="PIPELINE.map((p) => p.value)" :height="170" color="var(--so-accent)" aria-label="Lead pipeline value by stage: valuation $850K, consult $1.2M, signing $680K" />
            </VPanel>

            <VPanel title="Upcoming" heading-level="3" variant="bordered" class="so-sub">
              <ul class="so-upnext">
                <li v-for="u in UPCOMING" :key="u.id">
                  <VAvatar :initials="u.initials" size="sm" :alt="u.name" />
                  <span class="so-upnext__text">
                    <strong>{{ u.name }}</strong>
                    <span class="so-muted">{{ u.when }}</span>
                  </span>
                  <VBadge :variant="u.tone" size="sm">{{ u.tag }}</VBadge>
                </li>
              </ul>
            </VPanel>
          </div>
        </VCard>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.so {
  --so-accent: #f97316;
  --so-goals: #3b82f6;
  --so-page: var(--v-color-bg);
  --chart-grid: #e8eaee;
  --chart-column: color-mix(in srgb, #3b82f6 8%, transparent);
  display: flex;
  min-height: 100vh;
  background: var(--so-page);
  color: var(--v-color-text);
  font-family: var(--v-font-family-sans);

  &__main {
    flex: 1;
    min-width: 0;
    display: grid;
    align-content: start;
    gap: 20px;
    padding: 16px 28px 32px;
  }

  &__top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 44px;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 20px;
  }
}

.so-card {
  --v-card-padding: 24px;
  --v-card-radius: 20px;
  --v-card-gap: 16px;
  min-width: 0;
  background: var(--v-color-surface);

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
}

.so-sales {
  grid-column: span 8;
}
.so-upcoming {
  grid-column: span 4;
}
.so-activity {
  grid-column: 1 / -1;
}

.so-eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--v-color-text-muted);
}

.so-sales__total {
  margin: 0;
  font-size: 36px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.so-muted {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--v-color-text-muted);
}

.so-sales__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.so-tip {
  &__date {
    margin-bottom: 4px;
    font-weight: 600;
    color: var(--v-color-text);
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 190px;
    color: var(--v-color-text-muted);

    strong {
      margin-left: auto;
      color: var(--v-color-text);
    }
  }
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    &--accent {
      background: var(--so-accent);
    }
    &--goals {
      background: var(--so-goals);
    }
    &--deals {
      background: var(--v-color-neutral-400);
    }
  }
  &__rule {
    width: 100%;
    margin: 4px 0;
    border: 0;
    border-top: 1px solid var(--v-color-divider);
  }
  &__up {
    color: var(--v-color-success-strong);
  }
}

.so-activity__panels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.so-sub {
  min-width: 0;
}

.so-date {
  display: grid;
  place-items: center;
  align-content: center;
  flex: none;
  width: 48px;
  height: 52px;
  border-radius: 12px;
  background: var(--v-color-neutral-100);
  line-height: 1.1;

  strong {
    font-size: 18px;
  }
  span {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--so-accent);
  }
}

.so-schedule,
.so-upnext {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.so-schedule__row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.so-schedule__text {
  display: grid;
  flex: 1;
  min-width: 0;
  line-height: 1.35;
  font-size: 13px;

  .so-muted {
    margin: 0;
  }
}
.so-schedule__time {
  font-size: 11px;
  font-weight: 600;
  color: var(--so-accent);
}
.so-schedule__amount {
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.so-stages {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0 0 12px;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    gap: 2px;
  }
  strong {
    font-size: 20px;
    letter-spacing: -0.02em;
  }
}

.so-upnext li {
  display: flex;
  align-items: center;
  gap: 12px;
}
/* soft tinted pills instead of solid badges */
.so-upnext :deep(.v-badge) {
  background: color-mix(in srgb, var(--v-color-primary) 14%, transparent);
  color: var(--v-color-primary-text);
  font-weight: 600;
}
.so-upnext :deep(.v-badge--success) {
  background: color-mix(in srgb, var(--v-color-success-base) 16%, transparent);
  color: var(--v-color-success-strong);
}
.so-upnext :deep(.v-badge--warning) {
  background: color-mix(in srgb, var(--v-color-warning-base) 18%, transparent);
  color: var(--v-color-warning-strong);
}
.so-upnext__text {
  display: grid;
  flex: 1;
  min-width: 0;
  font-size: 13px;
  line-height: 1.35;

  .so-muted {
    margin: 0;
  }
}

@media (max-width: 1280px) {
  .so__side {
    width: 220px;
  }
  .so-sales,
  .so-upcoming {
    grid-column: 1 / -1;
  }
  .so-activity__panels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1280px) {
  .so-caps {
    --caps-h: 200px;
  }
}

@media (max-width: 960px) {
  .so__side {
    display: none;
  }
  .so__main {
    padding: 12px 16px 24px;
  }
  .so-activity__panels {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .so__rail {
    display: none;
  }
  .so-card {
    --v-card-padding: 16px;
  }
}
</style>

<style lang="scss">
:root[data-theme='dark'] .so {
  --so-accent: #fb923c;
  --so-goals: #60a5fa;
  --so-page: #050507;
  --chart-grid: #26262c;
  --chart-column: color-mix(in srgb, #60a5fa 10%, transparent);
}
</style>
