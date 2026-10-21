<script setup lang="ts">
import { computed, ref } from 'vue'
import searchIcon from '@iconify-icons/keyline-icons/search'
import bellIcon from '@iconify-icons/keyline-icons/bell'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import repeatIcon from '@iconify-icons/keyline-icons/repeat'
import eyeOffIcon from '@iconify-icons/keyline-icons/eye-off'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import wrenchIcon from '@iconify-icons/keyline-icons/wrench'
import zapIcon from '@iconify-icons/keyline-icons/zap'
import playIcon from '@iconify-icons/keyline-icons/play'
import gitBranchIcon from '@iconify-icons/keyline-icons/git-branch'
import { VIcon } from '../../components/primitives/VIcon'
import VTopBar from '../../components/navigation/VTopBar/VTopBar.vue'
import VBreadcrumb from '../../components/navigation/VBreadcrumb/VBreadcrumb.vue'
import VButton from '../../components/form/VButton/VButton.vue'
import VBadge from '../../components/feedback/VBadge/VBadge.vue'
import VAvatar from '../../components/images/VAvatar/VAvatar.vue'
import VCard from '../../components/containment/VCard/VCard.vue'
import VSlider from '../../components/form/VSlider/VSlider.vue'
import RailNav from './parts/RailNav.vue'
import VTable from '../../components/table/VTable/VTable.vue'
import type { VTableColumn } from '../../components/table/VTable/VTable.types'

const navItems = [
  { value: 'overview', label: 'Overview' },
  { value: 'workflows', label: 'Workflows' },
  { value: 'live-map', label: 'Live Map' },
  { value: 'traces', label: 'Traces' },
  { value: 'incidents', label: 'Incidents' },
  { value: 'insights', label: 'Insights' },
]
const activeNav = ref('insights')

const crumbs = [
  { label: 'Insights', href: '#' },
  { label: 'Coordination Health', href: '#' },
  { label: 'Delegation loop' },
]

const explainers = [
  { icon: eyeOffIcon, title: 'Why monitoring misses it', text: 'Every call returns 200 and latency looks normal, so health checks stay green while agents hand work back and forth.' },
  { icon: zapIcon, title: 'What it costs', text: 'Each extra cycle re-sends the full context. Loops of 10+ hops burn tokens fast and delay the customer-facing answer.' },
  { icon: repeatIcon, title: 'Why it recurs', text: 'Neither agent owns a stop condition, so any ambiguous task can bounce between them again after a prompt change.' },
]

export interface Occurrence {
  id: string
  path: string
  workflow: string
  cycles: number
  runs: string
  cost: string
  firstSeen: string
  incident?: string
}

const occurrenceColumns: VTableColumn[] = [
  { key: 'path', label: 'Cycle path' },
  { key: 'workflow', label: 'Workflow' },
  { key: 'cycles', label: 'Cycles' },
  { key: 'runs', label: 'Runs' },
  { key: 'cost', label: 'Cost' },
  { key: 'firstSeen', label: 'First seen' },
  { key: 'incident', label: 'Incident' },
]

const occurrences: Occurrence[] = [
  { id: 'o1', path: 'Supervisor ⇄ Research', workflow: 'customer-escalation-triage', cycles: 17, runs: '412', cost: '$126.40', firstSeen: 'Sep 24, 09:12', incident: 'INC-2481' },
  { id: 'o2', path: 'Planner ⇄ Critic', workflow: 'contract-redline-review', cycles: 9, runs: '318', cost: '$84.10', firstSeen: 'Sep 25, 14:03' },
  { id: 'o3', path: 'Router ⇄ Billing Agent', workflow: 'invoice-dispute-resolution', cycles: 6, runs: '287', cost: '$61.75', firstSeen: 'Sep 26, 11:47' },
  { id: 'o4', path: 'Researcher ⇄ Verifier', workflow: 'market-brief-generation', cycles: 4, runs: '187', cost: '$35.90', firstSeen: 'Sep 28, 16:30' },
]

const rule = [
  'same (caller → callee) pair repeats',
  '≥ 3 times',
  'within one trace',
  'with no terminal status',
  '# and total tokens > 50,000',
]

const threshold = ref(3)
const scenarios = [
  { n: 2, detail: '2,611 runs flagged · 1,407 false positives' },
  { n: 3, detail: '1,204 runs flagged · 12 false positives' },
  { n: 5, detail: '689 runs flagged · 3 false positives' },
  { n: 10, detail: '214 runs flagged · 0 false positives' },
]
const activeScenario = computed(() => scenarios.find((s) => s.n === threshold.value)?.n)

const playbook = [
  { title: 'Set a hop budget on the supervisor', code: 'max_delegations: 3' },
  { title: 'Require a terminal status per hop', code: 'status ∈ {done, handoff, failed}' },
  { title: 'Add a loop-break fallback', code: 'on_cycle → escalate_to_human' },
  { title: 'Backtest against the last 7 days', code: 'replay --detector delegation_loop' },
]
</script>

<template>
  <div class="insights">
    <div class="insights__frame">
      <RailNav />

      <div class="insights__main">
        <VTopBar class="insights__top" v-model:active-item="activeNav" :items="navItems" variant="app" aria-label="OrchestrateIQ">
          <template #leading>
            <a class="brand" href="#" aria-label="OrchestrateIQ home">
              <span class="brand__mark" aria-hidden="true"><VIcon :icon="gitBranchIcon" size="sm" /></span>
              <span class="brand__name">OrchestrateIQ</span>
            </a>
          </template>
          <template #actions>
            <VBadge variant="success" size="md" dot class="live">Live</VBadge>
            <VButton variant="secondary" size="sm" class="range">
              <template #icon><VIcon :icon="calendarIcon" size="sm" /></template>
              30 min
            </VButton>
            <VButton variant="icon" size="sm" aria-label="Search"><template #icon><VIcon :icon="searchIcon" size="sm" /></template></VButton>
            <VButton variant="icon" size="sm" aria-label="Notifications"><template #icon><VIcon :icon="bellIcon" size="sm" /></template></VButton>
            <button type="button" class="user" aria-label="Account menu: Platform Team">
              <VAvatar initials="PT" size="sm" decorative />
              <span class="user__text"><strong>Platform Team</strong><small>Owner · acme.ai</small></span>
              <VIcon :icon="chevronDownIcon" size="sm" />
            </button>
          </template>
        </VTopBar>

        <main class="content">
          <VCard variant="outlined" class="card" aria-label="Detector summary">
          <header class="head">
            <div class="head__text">
              <VBreadcrumb :items="crumbs" size="sm" />
              <div class="head__title">
                <span class="tile tile--orange" aria-hidden="true"><VIcon :icon="repeatIcon" /></span>
                <h1>Delegation loop</h1>
                <VBadge variant="danger" size="md" dot>Critical</VBadge>
              </div>
              <p class="head__sub">4 open occurrences · 1,204 runs affected in the last 7 days · $308 of wasted compute</p>
            </div>
            <div class="head__actions">
              <VButton variant="secondary"><template #icon><VIcon :icon="eyeOffIcon" size="sm" /></template>Mute this detector</VButton>
              <VButton variant="primary"><template #icon><VIcon :icon="sparklesIcon" size="sm" /></template>Create fix for all</VButton>
            </div>
          </header>
          </VCard>

          <div class="grid">
            <div class="col">
              <VCard variant="outlined" class="card" aria-labelledby="what-h">
                <h2 id="what-h" class="card__title">What this pattern is</h2>
                <p class="lead">
                  Two agents keep delegating the same task to each other without either one finishing it. Each hop looks
                  valid on its own, but the trace never reaches a terminal status, so the run loops until a token or time
                  limit stops it.
                </p>
                <div class="explain">
                  <article v-for="e in explainers" :key="e.title" class="sub">
                    <span class="tile tile--sm" aria-hidden="true"><VIcon :icon="e.icon" size="sm" /></span>
                    <h3>{{ e.title }}</h3>
                    <p>{{ e.text }}</p>
                  </article>
                </div>
              </VCard>

              <VCard variant="outlined" class="card" aria-labelledby="occ-h">
                <div class="card__row">
                  <h2 id="occ-h" class="card__title">Occurrences</h2>
                  <VBadge variant="neutral" size="sm">last 7 days</VBadge>
                </div>
                <VTable
                  class="occ"
                  :columns="occurrenceColumns"
                  :rows="occurrences"
                  :selectable="false"
                  :show-toolbar="false"
                  :show-actions="false"
                  :show-pagination="false"
                  aria-label="Occurrences table"
                >
                  <template #header-cycles="{ column }"><span class="occ__num">{{ column.label }}</span></template>
                  <template #header-runs="{ column }"><span class="occ__num">{{ column.label }}</span></template>
                  <template #header-cost="{ column }"><span class="occ__num">{{ column.label }}</span></template>
                  <template #header-incident="{ column }"><span class="occ__sr">{{ column.label }}</span></template>
                  <template #cell-path="{ value }"><span class="occ__path">{{ value }}</span></template>
                  <template #cell-workflow="{ value }"><span class="occ__wf" :title="String(value)">{{ value }}</span></template>
                  <template #cell-cycles="{ value }"><span class="occ__num occ__num--strong">{{ value }}</span></template>
                  <template #cell-runs="{ value }"><span class="occ__num">{{ value }}</span></template>
                  <template #cell-cost="{ value }"><span class="occ__num">{{ value }}</span></template>
                  <template #cell-firstSeen="{ value }"><span class="occ__muted">{{ value }}</span></template>
                  <template #cell-incident="{ value }">
                    <span class="occ__num">
                      <VBadge v-if="value" variant="danger" size="sm">{{ value }}</VBadge>
                      <VBadge v-else variant="neutral" size="sm">no incident</VBadge>
                    </span>
                  </template>
                </VTable>
                <p class="foot">The 17-cycle run is the longest chain; the other three stopped on the token cap before reaching a terminal status.</p>
                <div class="foot__actions">
                  <VButton variant="secondary" size="sm"><template #icon><VIcon :icon="gitBranchIcon" size="sm" /></template>Open the 17-cycle trace</VButton>
                  <VButton variant="secondary" size="sm"><template #icon><VIcon :icon="playIcon" size="sm" /></template>Watch it form in replay</VButton>
                </div>
              </VCard>
            </div>

            <aside class="col" aria-label="Detector configuration">
              <VCard variant="outlined" class="card" aria-labelledby="rule-h">
                <h2 id="rule-h" class="caption">Detection rule</h2>
                <pre class="code"><code><span v-for="(l, i) in rule" :key="i" class="code__line" :class="{ 'code__line--c': l.startsWith('#') }">{{ l }}</span></code></pre>

                <div class="thr">
                  <div class="thr__row">
                    <span class="thr__label">Cycle threshold</span>
                    <output class="thr__val" aria-live="polite">{{ threshold }} cycles</output>
                  </div>
                  <VSlider v-model="threshold" :min="2" :max="10" :step="1" :show-value="false" aria-label="Cycle threshold" />
                </div>

                <h2 class="caption caption--gap">What changing it would have caught · last 7 days</h2>
                <ul class="scen">
                  <li v-for="s in scenarios" :key="s.n" class="scen__item" :class="{ 'is-active': activeScenario === s.n }" :aria-current="activeScenario === s.n ? 'true' : undefined">
                    <strong>{{ s.n }} cycles</strong>
                    <span>{{ s.detail }}</span>
                  </li>
                </ul>

                <h2 class="caption caption--gap">Remediation playbook</h2>
                <ol class="play">
                  <li v-for="(p, i) in playbook" :key="p.title">
                    <span class="play__n" aria-hidden="true">{{ i + 1 }}</span>
                    <div><strong>{{ p.title }}</strong><code>{{ p.code }}</code></div>
                  </li>
                </ol>
                <VButton variant="secondary" class="block"><template #icon><VIcon :icon="wrenchIcon" size="sm" /></template>Open fix builder</VButton>
              </VCard>
            </aside>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.insights { min-height: 100vh; box-sizing: border-box; padding: 16px; background: var(--v-color-bg); color: var(--v-color-text); font-family: var(--v-font-family-sans); }
.insights__frame { display: flex; min-height: calc(100vh - 32px); border: 1px solid var(--v-color-border); border-radius: 28px; background: var(--v-color-surface); overflow: hidden; box-shadow: var(--v-shadow-sm); }
.insights__main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.insights__top { padding-block: 10px; border-bottom: 1px solid var(--v-color-divider); }

.brand { display: inline-flex; align-items: center; gap: 10px; color: var(--v-color-text); text-decoration: none; font-weight: 700; font-size: 16px; white-space: nowrap; }
.brand:focus-visible { outline: 2px solid var(--v-color-focus); outline-offset: 2px; border-radius: 8px; }
.brand__mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 9px; background: var(--v-color-primary); color: var(--v-color-on-primary); }

.user:focus-visible { outline: 2px solid var(--v-color-focus); outline-offset: 1px; }
.user { display: inline-flex; align-items: center; gap: 10px; padding: 4px 8px 4px 4px; border: 0; border-radius: var(--v-radius-pill); background: transparent; color: var(--v-color-text-muted); cursor: pointer; text-align: left; }
.user:hover { background: var(--v-color-surface-muted); }
.user__text { display: grid; line-height: 1.2; }
.user__text strong { font-size: 13px; color: var(--v-color-text); }
.user__text small { font-size: 11px; color: var(--v-color-text-muted); }

.occ { --v-table-grid-min-width: 600px; --v-table-cell-padding-x: 8px; }
.occ__num { display: block; text-align: right; font-variant-numeric: tabular-nums; }
.occ__num--strong { font-weight: 600; }
.occ__muted { color: var(--v-color-text-muted); white-space: nowrap; }
.occ__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.occ__wf { display: block; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--v-font-family-mono, ui-monospace, monospace); font-size: 12px; color: var(--v-color-text-muted); }
.occ__path { display: inline-block; padding: 4px 10px; border-radius: 8px; font-weight: 600; white-space: nowrap; background: var(--v-color-orange-light); color: var(--v-color-orange-dark); }

.content { padding: 24px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-content: start; }
.card { --v-card-padding: 24px; --v-card-radius: 20px; --v-card-gap: 0; }
.card__title { margin: 0 0 12px; font-size: 17px; font-weight: 700; letter-spacing: -.01em; }
.card__row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.card__row .card__title { margin: 0; }

.head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 16px 24px; }
.head__text { display: grid; gap: 14px; min-width: 0; }
.head__title { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.head h1 { margin: 0; font-size: 28px; line-height: 1.15; font-weight: 700; letter-spacing: -.02em; }
.head__sub { margin: 0; color: var(--v-color-text-muted); font-size: 14px; }
.head__actions { display: flex; flex-wrap: wrap; gap: 10px; }
.tile { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: var(--v-color-surface-muted); color: var(--v-color-text-muted); }
.tile--orange { background: var(--v-color-orange-light); color: var(--v-color-orange-dark); }
.tile--sm { width: 32px; height: 32px; border-radius: 10px; background: var(--v-color-primary-50); color: var(--v-color-primary-text); }

.grid { display: grid; grid-template-columns: minmax(0, 1.85fr) minmax(300px, 1fr); gap: 20px; align-items: start; }
.col { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; min-width: 0; }
.lead { margin: 0 0 18px; color: var(--v-color-text-muted); font-size: 14px; line-height: 1.6; }
.explain { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.sub { padding: 16px; border: 1px solid var(--v-color-border); border-radius: 14px; background: var(--v-color-surface-muted); }
.sub h3 { margin: 12px 0 6px; font-size: 14px; font-weight: 700; }
.sub p { margin: 0; font-size: 13px; line-height: 1.5; color: var(--v-color-text-muted); }
.foot { margin: 16px 0 12px; font-size: 13px; color: var(--v-color-text-muted); }
.foot__actions { display: flex; flex-wrap: wrap; gap: 10px; }

.caption { margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--v-color-text-muted); }
.caption--gap { margin-top: 24px; }
.code { margin: 0; padding: 14px 16px; border-radius: 12px; background: var(--v-color-surface-muted); border: 1px solid var(--v-color-border); overflow-x: auto; font: 12.5px/1.8 var(--v-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace); }
.code__line { display: block; white-space: pre; color: var(--v-color-text); }
.code__line--c { color: var(--v-color-text-muted); }
.thr { margin-top: 20px; }
.thr__row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; font-size: 14px; }
.thr__label { font-weight: 600; }
.thr__val { font-weight: 700; color: var(--v-color-primary-text); font-variant-numeric: tabular-nums; }
.scen { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.scen__item { display: grid; gap: 2px; padding: 10px 14px; border: 1px solid var(--v-color-border); border-radius: 12px; font-size: 13px; }
.scen__item span { color: var(--v-color-text-muted); font-size: 12px; }
.scen__item.is-active { border-color: var(--v-color-primary); background: var(--v-color-primary-50); box-shadow: 0 0 0 1px var(--v-color-primary) inset; }
.play { list-style: none; margin: 0 0 20px; padding: 0; display: grid; gap: 14px; }
.play li { display: flex; gap: 12px; align-items: flex-start; }
.play__n { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 50%; background: var(--v-color-primary-50); color: var(--v-color-primary-text); font-size: 12px; font-weight: 700; }
.play div { display: grid; gap: 2px; font-size: 14px; min-width: 0; }
.play code { font: 12px var(--v-font-family-mono, ui-monospace, monospace); color: var(--v-color-text-muted); overflow-wrap: anywhere; }
.block { width: 100%; }

@media (max-width: 960px) { .grid { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 1100px) { .user__text, .live { display: none; } .insights__top :deep(.v-top-bar__actions) { gap: 4px; } }
@media (max-width: 900px) { .explain { grid-template-columns: 1fr; } }
@media (max-width: 720px) {
  .insights { padding: 0; }
  .insights__frame { flex-direction: column; border-radius: 0; border: 0; }
  .content { padding: 12px; }
  .card { --v-card-padding: 16px; --v-card-radius: 16px; }
  .head h1 { font-size: 24px; }
  .insights__top { flex-wrap: wrap; }
  .head__actions > * { flex: 1 1 100%; }
}
</style>
