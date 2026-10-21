<script setup lang="ts">
import { computed, ref } from 'vue'
import arrowDownRight from '@iconify-icons/keyline-icons/arrow-down-right'
import arrowRight from '@iconify-icons/keyline-icons/arrow-right'
import arrowUpRight from '@iconify-icons/keyline-icons/arrow-up-right'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import chevronDown from '@iconify-icons/keyline-icons/chevron-down'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import VAvatar from '../../components/images/VAvatar/VAvatar.vue'
import VBadge from '../../components/feedback/VBadge/VBadge.vue'
import VButton from '../../components/form/VButton/VButton.vue'
import VCard from '../../components/containment/VCard/VCard.vue'
import VProgress from '../../components/feedback/VProgress/VProgress.vue'
import VSidebar from '../../components/navigation/VSidebar/VSidebar.vue'
import VTable from '../../components/table/VTable/VTable.vue'
import type { VTableColumn } from '../../components/table/VTable/VTable.types'
import VTabs from '../../components/navigation/VTabs/VTabs.vue'
import { VIcon } from '../../components/primitives/VIcon'
import { LineChart } from '../_charts'
import ThemeToggle from '../_shared/ThemeToggle.vue'
import type { LineSeries } from '../_charts'
import AssetCoin from './parts/AssetCoin.vue'
import {
  ALLOCATION_DAYS,
  ALLOCATION_SERIES,
  BENCHMARK_SERIES,
  GAINERS,
  HOLDINGS,
  INTEL,
  KPIS,
  LEGEND,
  LOSERS,
  MONTHS,
  PORTFOLIO_SERIES,
  RAIL_ITEMS,
  TABS,
} from './data'

const tab = ref('overview')
const rail = ref('grid')
const period = ref('This Year')

const performanceSeries: LineSeries[] = [
  { id: 'benchmarks', label: 'Benchmarks', data: BENCHMARK_SERIES, color: 'var(--inv-bench)', dashed: true, width: 2 },
  { id: 'portfolio', label: 'Performance', data: PORTFOLIO_SERIES, color: 'var(--inv-pos)', width: 2.5 },
]
const allocationSeries: LineSeries[] = [
  { id: 'alloc', label: 'Allocation', data: ALLOCATION_SERIES, color: 'var(--inv-pos)', area: true },
]

const holdingColumns: VTableColumn[] = [
  { key: 'ticker', label: 'Asset' },
  { key: 'price', label: 'Price' },
  { key: 'weight', label: 'Weight' },
  { key: 'pl', label: 'P/L' },
]
const holdingRows = HOLDINGS.map((h) => ({ ...h, id: h.ticker }))

const signed = (n: number): string => `${n >= 0 ? '+' : ''}${n}%`
const tipDate = (i: number): string => (i === 7 ? 'Aug 30, 10:08 PM' : `${MONTHS[i]} 28, 4:00 PM`)
const showOverview = computed(() => tab.value === 'overview')
const showHoldings = computed(() => tab.value === 'overview' || tab.value === 'holdings')
const showMarket = computed(() => tab.value === 'overview' || tab.value === 'market')
</script>

<template>
  <div class="inv">
    <VSidebar
      v-model:active-item="rail"
      class="inv__rail"
      variant="icons"
      :items="RAIL_ITEMS"
      :show-search="false"
      :show-footer="false"
      :show-collapse-toggle="false"
      aria-label="Primary"
    >
      <template #header>
        <span class="inv__logo" aria-label="Investo">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 17 10 7l4 7 2-3 3 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </template>
    </VSidebar>

    <main class="inv__panel">
      <header class="inv__head">
        <h1 class="inv__title">Investment</h1>
        <div class="inv__head-end">
          <ThemeToggle variant="pill" />
          <button type="button" class="inv__user" aria-label="Account menu for Tom Anderson">
            <VAvatar initials="TA" size="md" alt="Tom Anderson" />
            <span class="inv__user-text">
              <strong>Tom Anderson</strong>
              <span>tom@gmail.com</span>
            </span>
            <VIcon :icon="chevronDown" size="sm" />
          </button>
        </div>
      </header>

      <div class="inv__toolbar">
        <VTabs v-model="tab" class="inv__tabs" :items="TABS" :panels="false" aria-label="Investment sections">
          <template #actions>
            <div class="inv__actions">
              <VButton variant="outline" shape="pill" size="md" aria-haspopup="menu" @click="period = period === 'This Year' ? 'Last Year' : 'This Year'">
                <template #icon><VIcon :icon="calendarIcon" size="sm" /></template>
                {{ period }}
                <template #icon-end><VIcon :icon="chevronDown" size="sm" /></template>
              </VButton>
              <VButton variant="inverse" shape="pill" size="md">
                <template #icon><VIcon :icon="sparklesIcon" size="sm" /></template>
                Ask AI
              </VButton>
            </div>
          </template>
        </VTabs>
      </div>

      <section v-if="showOverview" class="inv__kpis" aria-label="Key metrics">
        <VCard v-for="k in KPIS" :key="k.id" variant="outlined" class="inv-card inv-kpi">
          <p class="inv-kpi__label">{{ k.label }}</p>
          <p class="inv-kpi__value">{{ k.value }}</p>
          <p class="inv-kpi__meta">
            <span class="inv-delta" :class="`inv-delta--${k.tone}`">
              <VIcon v-if="k.trend" :icon="k.trend === 'up' ? arrowUpRight : arrowDownRight" size="sm" />
              {{ k.delta }}
            </span>
            <span class="inv-kpi__caption">{{ k.caption }}</span>
          </p>
        </VCard>
      </section>

      <div v-if="showOverview || showHoldings" class="inv__row2" :class="{ 'inv__row2--single': !showOverview }">
        <VCard v-if="showOverview" variant="outlined" class="inv-card inv-perf">
          <div class="inv-card__head">
            <h2 class="inv-card__title">Performance Vs Benchmarks</h2>
            <div class="inv-chips">
              <span class="inv-chip">Alpha <strong class="inv-pos">+5.3%</strong></span>
              <span class="inv-chip">Sharpe <strong>1.24</strong></span>
            </div>
          </div>
          <ul class="inv-legend" aria-label="Benchmark returns">
            <li v-for="l in LEGEND" :key="l.id">
              <i class="inv-legend__dot" :class="`inv-legend__dot--${l.tone}`" />
              <span>{{ l.label }}</span>
              <strong :class="l.tone === 'pos' ? 'inv-pos' : 'inv-neg'">{{ l.value }}</strong>
            </li>
          </ul>
          <LineChart
            :labels="MONTHS"
            :series="performanceSeries"
            :y-min="-1"
            :y-max="5"
            :y-ticks="[-1, 0, 1, 2, 3, 4, 5]"
            :format-y="(n) => signed(n)"
            :height="340"
            :pad-top="74"
            :rest-index="7"
            anchor-series="portfolio"
            aria-label="Performance versus benchmarks, January to December. Use arrow keys to inspect each month."
          >
            <template #tooltip="{ index, points }">
              <span class="inv-tip__title">{{ tipDate(index) }}</span>
              <span class="inv-tip__row">
                <i class="inv-tip__dot inv-tip__dot--pos" />
                <span>Performance</span>
                <strong>{{ signed(points[1].value) }}</strong>
              </span>
              <span class="inv-tip__row">
                <i class="inv-tip__dot inv-tip__dot--bench" />
                <span>Benchmarks</span>
                <strong>{{ signed(points[0].value) }}</strong>
              </span>
            </template>
          </LineChart>
        </VCard>

        <VCard v-if="showHoldings" variant="outlined" class="inv-card inv-holdings">
          <div class="inv-card__head">
            <h2 class="inv-card__title">Holdings</h2>
            <a class="inv-link" href="#holdings" @click.prevent="tab = 'holdings'">View All <VIcon :icon="arrowRight" size="sm" /></a>
          </div>
          <VTable
            class="inv-table"
            :columns="holdingColumns"
            :rows="holdingRows"
            :selectable="false"
            :show-toolbar="false"
            :show-actions="false"
            :show-pagination="false"
            aria-label="Top holdings by weight"
          >
            <template #header-price="{ column }"><span class="inv-num">{{ column.label }}</span></template>
            <template #header-pl="{ column }"><span class="inv-num">{{ column.label }}</span></template>
            <template #cell-ticker="{ row }">
              <span class="inv-asset">
                <AssetCoin :glyph="String(row.glyph)" :color="String(row.color)" :label="String(row.name)" />
                <span class="inv-asset__text">
                  <strong>{{ row.ticker }}</strong>
                  <span>{{ row.name }}</span>
                </span>
              </span>
            </template>
            <template #cell-price="{ value }"><span class="inv-num">{{ value }}</span></template>
            <template #cell-weight="{ row }">
              <span class="inv-weight">
                <span class="inv-weight__pct">{{ row.weight }}%</span>
                <VProgress class="inv-weight__bar" size="sm" :value="Number(row.weight) * 2.4" :label="false" :aria-label="`${row.ticker} weight ${row.weight}%`" />
              </span>
            </template>
            <template #cell-pl="{ value }"><span class="inv-num"><VBadge variant="success" size="sm">{{ value }}</VBadge></span></template>
          </VTable>
        </VCard>
      </div>

      <div v-if="showOverview || showMarket" class="inv__row3">
        <VCard v-if="showOverview" variant="outlined" class="inv-card inv-alloc">
          <div class="inv-card__head">
            <h2 class="inv-card__title">Allocation</h2>
            <VBadge variant="neutral" size="md">This Week</VBadge>
          </div>
          <p class="inv-alloc__total">$45,878.00</p>
          <LineChart
            :labels="ALLOCATION_DAYS"
            :series="allocationSeries"
            :y-min="0"
            :y-max="16"
            :y-ticks="[0, 4, 8, 12, 16]"
            :show-y-axis="false"
            :height="236"
            :pad-top="40"
            :rest-index="4"
            tooltip-tone="none"
            edge-to-edge
            aria-label="Weekly allocation change. Use arrow keys to inspect each day."
          >
            <template #tooltip="{ points }">
              <span class="inv-pill">{{ points[0].value }}%</span>
            </template>
          </LineChart>
        </VCard>

        <VCard v-if="showMarket" variant="outlined" class="inv-card inv-movers">
          <div class="inv-card__head">
            <h2 class="inv-card__title">Top Movers</h2>
          </div>
          <div class="inv-movers__group">
            <p class="inv-cap inv-cap--pos">Gainers</p>
            <ul class="inv-list">
              <li v-for="m in GAINERS" :key="m.ticker">
                <span class="inv-list__sym"><strong>{{ m.ticker }}</strong><span>{{ m.name }}</span></span>
                <VBadge variant="success" size="sm">{{ m.change }}</VBadge>
              </li>
            </ul>
          </div>
          <div class="inv-movers__group">
            <p class="inv-cap inv-cap--neg">Losers</p>
            <ul class="inv-list">
              <li v-for="m in LOSERS" :key="m.ticker">
                <span class="inv-list__sym"><strong>{{ m.ticker }}</strong><span>{{ m.name }}</span></span>
                <VBadge variant="danger" size="sm">{{ m.change }}</VBadge>
              </li>
            </ul>
          </div>
        </VCard>

        <VCard v-if="showMarket" variant="outlined" class="inv-card inv-intel">
          <div class="inv-card__head">
            <h2 class="inv-card__title">Market Intelligence</h2>
            <span class="inv-muted">2h Ago</span>
          </div>
          <ul class="inv-intel__list">
            <li v-for="n in INTEL" :key="n.id">
              <a class="inv-intel__item" href="#intel" @click.prevent>
                <span class="inv-cap">{{ n.caption }}</span>
                <span class="inv-intel__headline">{{ n.headline }}</span>
              </a>
            </li>
          </ul>
        </VCard>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.inv {
  --inv-page: #eef0f3;
  --inv-pos: #16a34a;
  --inv-pos-soft: #dcfce7;
  --inv-neg: #e11d48;
  --inv-bench: #9ca3af;
  --inv-ink: #18181b;
  --chart-grid: #eceef1;
  --chart-tip-bg: #18181b;
  --chart-tip-fg: #fafafa;
  display: flex;
  align-items: flex-start;
  gap: var(--v-space-4);
  min-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  background: var(--inv-page);
  color: var(--v-color-text);
  font-family: var(--v-font-family-sans);


  &__rail {
    flex: none;
    position: sticky;
    top: 16px;
    --v-sidebar-icons-active-bg: var(--v-color-text);
    --v-sidebar-icons-active-fg: var(--v-color-bg);
    --v-sidebar-bg: transparent;

    :deep(.v-sidebar__list) {
      gap: 14px;
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
    }

    :deep(.v-nav-item) {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      color: var(--v-color-text-muted);
    }

    :deep(.v-sidebar__header-slot) {
      margin-bottom: 18px;
    }
  }

  &__logo {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: var(--v-color-text);
    color: var(--v-color-bg);
  }

  &__panel {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 20px;
    padding: 28px;
    border-radius: 28px;
    background: var(--v-color-surface);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 8px 32px rgb(0 0 0 / 0.04);
    border: 1px solid var(--v-color-divider);
  }

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__title {
    margin: 0;
    font-size: 32px;
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  &__head-end {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 8px 4px 4px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--v-color-text);
    font: inherit;
    cursor: pointer;

    &:hover {
      background: var(--v-color-neutral-100);
    }

    &:focus-visible {
      outline: var(--v-focus-ring-width) solid var(--v-color-focus);
      outline-offset: 2px;
    }
  }

  &__user-text {
    display: grid;
    text-align: left;
    line-height: 1.25;

    strong {
      font-size: 14px;
      font-weight: 600;
    }

    span {
      font-size: 12px;
      color: var(--v-color-text-muted);
    }
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid var(--v-color-divider);
  }

  &__tabs {
    flex: 1 1 auto;
    min-width: 0;

    --v-color-primary: var(--v-color-text);
    --v-color-primary-600: var(--v-color-text);
    --v-color-primary-700: var(--v-color-text);
    --v-color-primary-500: var(--v-color-text);
    --v-color-primary-text: var(--v-color-text);
    --v-tabs-hover-bg: var(--v-color-neutral-100);

    :deep(.v-tabs__tab) {
      font-size: 15px;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 16px;
  }

  &__row2 {
    display: grid;
    grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr);
    gap: 16px;

    &--single {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__row3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 1180px) {
  .inv__row2 {
    grid-template-columns: minmax(0, 1fr);
  }
  .inv__row3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .inv-intel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .inv {
    flex-direction: column;
    padding: 8px;
  }
  .inv__rail {
    position: static;
    width: 100%;

    :deep(.v-sidebar__list) {
      flex-direction: row;
      flex-wrap: wrap;
    }
    :deep(.v-sidebar__header-slot) {
      display: none;
    }
  }
  .inv__panel {
    width: 100%;
    box-sizing: border-box;
    padding: 18px;
    border-radius: 20px;
  }
  .inv__row3 {
    grid-template-columns: minmax(0, 1fr);
  }
  .inv__user-text {
    display: none;
  }
}

.inv-card {
  --v-card-padding: 20px;
  --v-card-radius: 18px;
  --v-card-gap: 12px;
  min-width: 0;
  background: var(--v-color-surface);

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
}

.inv-kpi {
  --v-card-gap: 6px;
  --v-card-padding: 18px 20px;

  p {
    margin: 0;
  }

  &__label {
    font-size: 13px;
    color: var(--v-color-text-muted);
  }

  &__value {
    margin-top: 6px !important;
    font-size: 32px;
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 8px !important;
    font-size: 12px;
  }

  &__caption {
    color: var(--v-color-text-muted);
  }
}

.inv-delta {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-weight: 600;

  &--pos {
    color: var(--inv-pos);
  }
  &--neg {
    color: var(--inv-neg);
  }
  &--neutral {
    color: var(--v-color-text);
  }
}

.inv-pos {
  color: var(--inv-pos);
}
.inv-neg {
  color: var(--inv-neg);
}
.inv-muted {
  font-size: 12px;
  color: var(--v-color-text-muted);
}

.inv-chips {
  display: flex;
  gap: 8px;
}
.inv-chip {
  display: inline-flex;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--v-color-neutral-100);
  font-size: 12px;
  color: var(--v-color-text-muted);

  strong {
    color: var(--v-color-text);
    font-weight: 600;
  }
  .inv-pos {
    color: var(--inv-pos);
  }
}

.inv-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
  font-size: 13px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--v-color-text-muted);
  }
  strong {
    font-weight: 600;
  }
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    &--pos {
      background: var(--inv-pos);
    }
    &--neg {
      background: var(--inv-neg);
    }
  }
}

.inv-tip {
  &__title {
    font-weight: 600;
    opacity: 0.75;
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 8px;

    strong {
      margin-left: auto;
      padding-left: 14px;
    }
  }
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    &--pos {
      background: var(--inv-pos);
    }
    &--bench {
      background: var(--inv-bench);
    }
  }
}

.inv-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--v-color-text);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: var(--v-focus-ring-width) solid var(--v-color-focus);
    outline-offset: 2px;
    border-radius: 4px;
  }
}

.inv-table {
  --v-table-grid-min-width: 0;
  --v-table-cell-padding-x: 8px;
}

.inv-num {
  display: block;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.inv-asset {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 400;

  &__text {
    display: grid;
    line-height: 1.25;

    strong {
      font-size: 14px;
      font-weight: 600;
    }
    span {
      font-size: 12px;
      color: var(--v-color-text-muted);
    }
  }
}

.inv-weight {
  display: grid;
  gap: 4px;
  min-width: 72px;

  &__pct {
    font-size: 13px;
  }
  &__bar {
    --v-progress-fill-bg: var(--inv-pos);
    --v-progress-track-bg: var(--v-color-neutral-200);
  }
}

.inv-alloc {
  &__total {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
}

.inv-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--inv-pos-soft);
  color: var(--inv-pos);
  font-size: 12px;
  font-weight: 700;
  border: 1px solid color-mix(in srgb, var(--inv-pos) 30%, transparent);
}

.inv-cap {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--v-color-text-muted);

  &--pos {
    color: var(--inv-pos);
  }
  &--neg {
    color: var(--inv-neg);
  }
}

.inv-movers {
  &__group {
    display: grid;
    gap: 8px;
  }
}

.inv-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--v-color-neutral-50);
  }
  &__sym {
    display: grid;
    line-height: 1.25;

    strong {
      font-size: 14px;
    }
    span {
      font-size: 12px;
      color: var(--v-color-text-muted);
    }
  }
}

.inv-intel {
  &__list {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  &__item {
    display: grid;
    gap: 6px;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--v-color-neutral-50);
    color: var(--v-color-text);
    text-decoration: none;
    transition: background 0.15s;

    &:hover {
      background: var(--v-color-neutral-100);
    }
    &:focus-visible {
      outline: var(--v-focus-ring-width) solid var(--v-color-focus);
      outline-offset: 2px;
    }
  }
  &__headline {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>

<style lang="scss">
:root[data-theme='dark'] .inv {
  --inv-page: #050507;
  --inv-pos: #34d399;
  --inv-pos-soft: #052e22;
  --inv-neg: #fb7185;
  --inv-bench: #71717a;
  --chart-grid: #2e2e35;
  --chart-tip-bg: #2b2b33;
  --chart-tip-border: #3a3a44;
  --chart-tip-fg: #fafafa;
}
</style>
