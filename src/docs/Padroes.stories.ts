import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import walletIcon from '@iconify-icons/keyline-icons/wallet'
import cameraIcon from '@iconify-icons/keyline-icons/image'
import circleDashedIcon from '@iconify-icons/keyline-icons/circle-dashed'
import circleIcon from '@iconify-icons/keyline-icons/circle'
import circleDashedHalfIcon from '@iconify-icons/keyline-icons/circle-dashed-half'
import VStatCard from '../components/data/VStatCard/VStatCard.vue'
import VBarChart from '../components/data/VBarChart/VBarChart.vue'
import VBarList from '../components/data/VBarList/VBarList.vue'
import VFunnelChart from '../components/data/VFunnelChart/VFunnelChart.vue'
import VTimeline from '../components/data/VTimeline/VTimeline.vue'
import VDescriptionList from '../components/data/VDescriptionList/VDescriptionList.vue'
import VDateTile from '../components/data/VDateTile/VDateTile.vue'
import VFlowPath from '../components/data/VFlowPath/VFlowPath.vue'
import VKanbanBoard from '../components/data/VKanbanBoard/VKanbanBoard.vue'
import VAudioRecorder from '../components/form/VAudioRecorder/VAudioRecorder.vue'
import VTimeRange from '../components/form/VTimeRange/VTimeRange.vue'
import VTable from '../components/table/VTable/VTable.vue'
import VTabs from '../components/navigation/VTabs/VTabs.vue'
import VSegmentedControl from '../components/navigation/VSegmentedControl/VSegmentedControl.vue'
import VToolbar from '../components/navigation/VToolbar/VToolbar.vue'
import VToolbarButton from '../components/navigation/VToolbar/VToolbarButton.vue'
import VToolbarDivider from '../components/navigation/VToolbar/VToolbarDivider.vue'
import VBadge from '../components/feedback/VBadge/VBadge.vue'
import VAlert from '../components/feedback/VAlert/VAlert.vue'
import VButton from '../components/form/VButton/VButton.vue'
import VProgress from '../components/feedback/VProgress/VProgress.vue'
import { VIcon } from '../components/primitives/VIcon'
import type { VKanbanColumn } from '../components/data/VKanbanBoard/VKanbanBoard.types'

const meta = {
  title: 'Patterns/Referências',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Telas de referência (SaaS de recuperação de garantia, inspetor de handoff entre agentes, workspace de projetos, barras de composer) montadas **somente** com componentes da lib. Servem como receita de composição para `VStatCard`, `VBarChart`, `VBarList`, `VFunnelChart`, `VTimeline`, `VDescriptionList`, `VDateTile`, `VFlowPath`, `VKanbanBoard`, `VAudioRecorder` e `VTimeRange`.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const surface =
  'background:var(--v-color-surface);border:1px solid var(--v-color-border);border-radius:20px;padding:20px;font-family:var(--v-font-family-sans);color:var(--v-color-text);'
const h2 = 'margin:0;font-size:15px;font-weight:600;'
const muted = 'color:var(--v-color-text-muted);font-size:12px;'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const recovered = [31, 36, 34, 41, 45, 50, 57, 68, 84.6]

export const RecoveryOverview: Story = {
  name: 'Recovery overview (dashboard)',
  parameters: { docs: { description: { story: 'Hero com `VStatCard` sobre gradiente + `VBarChart tone="inverse"`, fila de prazos com `VDateTile`, e `VBarList` para motivos de negação.' } } },
  render: () => ({
    components: { VStatCard, VBarChart, VBarList, VDateTile, VBadge, VButton, VAlert, VIcon },
    setup: () => ({
      walletIcon,
      cameraIcon,
      chart: months.map((label, i) => ({ label, value: recovered[i], display: `$${recovered[i]}K` })),
      stats: [
        { label: 'Pending', value: '$31.2K', caption: '22 claims', color: 'var(--v-color-info-base)' },
        { label: 'At risk', value: '$12.4K', caption: '5 claims', color: 'var(--v-color-warning-base)' },
        { label: 'Denied', value: '$8.7K', caption: '7 claims', color: 'var(--v-color-error-base)' },
      ],
      claims: [
        { date: '2026-09-29', title: 'Compressor replacement', meta: 'CL-10482 · Carrier', left: '2 days left', status: 'Ready to submit', amount: '$1,840', ready: true },
        { date: '2026-09-30', title: 'Evaporator coil', meta: 'CL-10477 · Trane', left: '3 days left', status: 'Needs failure photo', amount: '$3,840' },
        { date: '2026-10-01', title: 'Heat exchanger', meta: 'CL-10471 · Lennox', left: '4 days left', status: 'Needs labor detail', amount: '$2,740' },
        { date: '2026-10-04', title: 'Condenser coil', meta: 'CL-10466 · Carrier', left: '7 days left', status: 'Ready to submit', amount: '$2,830', ready: true },
      ],
      denials: [
        { label: 'Missing documentation', value: 38 },
        { label: 'Incorrect part number', value: 21 },
        { label: 'Late submission', value: 17 },
        { label: 'Warranty expired', value: 13 },
        { label: 'Other', value: 11 },
      ],
    }),
    template: `<div style="display:grid;gap:20px;max-width:1040px;font-family:var(--v-font-family-sans);">
      <div>
        <h1 style="margin:0;font-size:26px;font-weight:500;letter-spacing:-0.02em;">Good morning, Nizam</h1>
        <p style="margin:4px 0 0;${muted}"><b style="color:var(--v-color-text)">6 new claims</b> found in yesterday's jobs. <b style="color:var(--v-color-text)">$8,420</b> is due in the next 4 days.</p>
      </div>
      <div style="display:grid;grid-template-columns:minmax(280px,380px) 1fr;gap:24px;align-items:end;padding:16px;border-radius:24px;background:linear-gradient(120deg,#ede9fe 0%,#dbeafe 45%,#93c5fd 100%);">
        <VStatCard size="lg" variant="elevated" :icon="walletIcon" label="Recovered this month" value="$84,620" delta="14.8%" delta-caption="vs $73,710 in August" :stats="stats">
          <template #header-trailing><VButton size="sm" variant="secondary">September</VButton></template>
        </VStatCard>
        <div class="v-theme-light" style="display:grid;gap:8px;background:transparent;">
          <VStatCard variant="plain" size="sm" label="Recovered in 2026" value="$428,650" caption="212 claims paid · 78% recovery rate" />
          <VBarChart :data="chart" tone="inverse" :height="140" interactive />
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:20px;">
        <section style="${surface}">
          <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <h2 style="${h2}">Recover $12,410 at risk</h2><VButton size="sm" variant="ghost">Review all →</VButton>
          </header>
          <ul style="list-style:none;margin:0;padding:0;">
            <li v-for="c in claims" :key="c.title" style="display:grid;grid-template-columns:auto 1fr auto auto auto;gap:14px;align-items:center;padding:10px 0;border-top:1px solid var(--v-color-border);">
              <VDateTile :date="c.date" size="sm" />
              <span><b style="font-size:13px;font-weight:500;">{{ c.title }}</b><br><span style="${muted}">{{ c.meta }} · <span style="color:var(--v-color-error-base)">●</span> {{ c.left }}</span></span>
              <span :style="{ fontSize: '12px', color: c.ready ? 'var(--v-color-primary)' : 'var(--v-color-text-muted)' }">{{ c.status }}</span>
              <b style="font-size:13px;font-variant-numeric:tabular-nums;">{{ c.amount }}</b>
              <VButton size="sm" :variant="c.ready ? 'inverse' : 'outline'">{{ c.ready ? 'Submit' : 'Request' }}</VButton>
            </li>
          </ul>
        </section>
        <section style="${surface}display:grid;gap:16px;align-content:start;">
          <div><h2 style="${h2}">Why claims get denied</h2><span style="${muted}">47 claims · $32,840 in 2026</span></div>
          <VBarList :items="denials" unit="%" aria-label="Why claims get denied" />
          <VAlert variant="info" size="sm" title="Failure photos were missing on 12 of the 18 claims denied for documentation." description="See technician quality →" />
        </section>
      </div>
    </div>`,
  }),
}

export const ClaimDetail: Story = {
  name: 'Claim detail (timeline + breakdown)',
  parameters: { docs: { description: { story: '`VTimeline` (etapas), `VDescriptionList` com total e cartão lateral de status com `VStatCard` + `VProgress`.' } } },
  render: () => ({
    components: { VTimeline, VDescriptionList, VStatCard, VTabs, VBadge, VButton, VProgress },
    setup: () => ({
      tab: ref('overview'),
      tabs: [
        { value: 'overview', label: 'Overview' },
        { value: 'evidence', label: 'Evidence 9/10' },
        { value: 'activity', label: 'Activity 7' },
      ],
      steps: [
        { id: 1, title: 'Compressor replaced', description: 'Job #4821 · 4.5 h labor · R-410A recharged.', time: 'Sep 18' },
        { id: 2, title: 'Claim prepared', description: 'Warranty matched, 9 of 10 evidence items.', time: 'Sep 21' },
        { id: 3, title: 'Submitted to Carrier', description: 'Confirmation CW-7730418.', time: 'Today, 9:14 AM' },
        { id: 4, title: 'Carrier review', description: 'Clawback checks the Carrier portal every morning.', time: 'By Oct 13', state: 'current' },
        { id: 5, title: 'Payment', description: 'Credit memo, usually 6 days after approval.', time: 'About Oct 19', state: 'upcoming' },
      ],
      breakdown: [
        { label: 'Replacement compressor', hint: 'Part credit · 10-year parts warranty', value: '$1,140' },
        { label: 'Labor', hint: '4.5 h at $88 · extended labor plan', value: '$396' },
        { label: 'Refrigerant R-410A', hint: '6 lb recovered and recharged', value: '$186' },
        { label: 'Diagnostic allowance', hint: 'Flat rate', value: '$65' },
        { label: 'Freight', hint: 'Part shipping', value: '$53' },
      ],
      submission: [
        { label: 'Confirmation', value: 'CW-7730418' },
        { label: 'Submitted by', value: 'Nizam, today 9:14 AM' },
        { label: 'Portal account', value: 'Carrier dealer 4471' },
      ],
    }),
    template: `<div style="${surface}max-width:1000px;display:grid;gap:16px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <h1 style="margin:0;font-size:24px;font-weight:500;">Compressor replacement</h1>
        <VBadge size="sm" variant="primary" dot>Submitted</VBadge>
        <VButton size="sm" variant="outline" style="margin-left:auto">Open job</VButton>
      </div>
      <VTabs v-model="tab" :items="tabs" :panels="false" size="sm" />
      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:28px;">
        <div style="display:grid;gap:28px;align-content:start;">
          <section><header style="display:flex;justify-content:space-between;margin-bottom:12px;"><h2 style="${h2}">Claim timeline</h2><span style="${muted}">Updated today, 9:14 AM</span></header>
            <VTimeline :items="steps" size="sm" aria-label="Claim timeline" /></section>
          <section><header style="display:flex;justify-content:space-between;margin-bottom:4px;"><h2 style="${h2}">Recovery breakdown</h2><span style="${muted}">Carrier labor guide 2026</span></header>
            <VDescriptionList :items="breakdown" dividers size="sm" :total="{ label: 'Claimed', value: '$1,840' }" /></section>
        </div>
        <div style="display:grid;gap:16px;align-content:start;">
          <div style="padding:10px;border-radius:22px;background:linear-gradient(140deg,#dbeafe,#a5b4fc);">
            <VStatCard variant="elevated" label="Expected recovery" value="$1,840" caption="Decision by Oct 13 · Carrier averages 14 days">
              <template #header-trailing><span style="${muted}">CL-10482</span></template>
              <div style="display:grid;gap:6px;">
                <div style="display:flex;justify-content:space-between;${muted}"><span>Approval odds</span><b style="color:var(--v-color-primary)">High</b></div>
                <VProgress :value="84" size="sm" :label="false" aria-label="Approval odds" />
                <span style="${muted}">Carrier approved 41 of 49 compressor claims this year.</span>
              </div>
              <template #footer><VButton variant="outline" size="sm" style="width:100%">View in Carrier portal</VButton></template>
            </VStatCard>
          </div>
          <section><h3 style="margin:0 0 4px;${muted}text-transform:uppercase;letter-spacing:.06em;">Submission</h3>
            <VDescriptionList :items="submission" size="sm" /></section>
        </div>
      </div>
    </div>`,
  }),
}

export const RecoveryPipeline: Story = {
  name: 'Recovery pipeline (funnel)',
  parameters: { docs: { description: { story: '`VSegmentedControl` + `VFunnelChart tone="inverse"` + `VBarList` empilhada.' } } },
  render: () => ({
    components: { VFunnelChart, VBarList, VSegmentedControl },
    setup: () => ({
      period: ref('month'),
      options: [
        { value: 'month', label: 'Month' },
        { value: 'quarter', label: 'Quarter' },
        { value: 'year', label: 'Year' },
      ],
      stages: [
        { label: 'Detected', value: 182.4, display: '$182.4K', caption: '118 claims' },
        { label: 'Prepared', value: 96.3, display: '$96.3K', caption: '64 claims' },
        { label: 'Submitted', value: 71.6, display: '$71.6K', caption: '50 claims' },
        { label: 'Approved', value: 58.1, display: '$58.1K', caption: '41 claims' },
        { label: 'Paid', value: 51.3, display: '$51.3K', caption: '36 claims' },
      ],
      speed: [
        { label: 'Detected to prepared', value: 3.4, display: '3.4 days' },
        { label: 'Prepared to submitted', value: 2.1, display: '2.1 days' },
        { label: 'Submitted to decision', value: 12.6, display: '12.6 days', emphasized: true },
        { label: 'Approved to paid', value: 6.3, display: '6.3 days' },
      ],
    }),
    template: `<div style="${surface}max-width:1000px;display:grid;gap:20px;">
      <div><h1 style="margin:0;font-size:24px;font-weight:500;">Recovery</h1><span style="${muted}">Claims detected in September: $182,400 across 118 claims.</span></div>
      <VSegmentedControl v-model="period" :options="options" size="sm" style="justify-self:start" />
      <div style="padding:24px;border-radius:20px;background:linear-gradient(120deg,#ede9fe,#bfdbfe 55%,#93c5fd);">
        <VFunnelChart :stages="stages" tone="inverse" :height="110" aria-label="Recovery pipeline" />
      </div>
      <div style="max-width:440px;"><h2 style="${h2}margin-bottom:12px;">How fast money moves</h2>
        <VBarList :items="speed" layout="stacked" emphasis="none" aria-label="How fast money moves" /></div>
    </div>`,
  }),
}

export const HandoffInspector: Story = {
  name: 'Handoff inspector (agentes)',
  parameters: { docs: { description: { story: '`VFlowPath` com métricas na aresta, `VTable variant="comparison"` (já existente) e grade de `VStatCard`.' } } },
  render: () => ({
    components: { VFlowPath, VTable, VStatCard, VBadge, VButton, VAlert },
    setup: () => ({
      nodes: [
        { id: 'router', title: 'Router Agent', subtitle: 'sandy context · scope: admin' },
        { id: 'billing', title: 'Billing Agent', subtitle: 'accepted request · scope: admin' },
      ],
      edges: [{ label: 'Handoff', status: 'success', metrics: [
        { value: '9.1 KB', label: 'context' }, { value: '188 ms', label: 'latency' },
        { value: '1,904', label: 'tokens' }, { value: '5 of 5', label: 'fields' },
      ] }],
      columns: [
        { key: 'field', label: 'Context field' },
        { key: 'sent', label: 'Sent by router', cell: 'mark' },
        { key: 'expected', label: 'Expected by billing', cell: 'mark' },
        { key: 'status', label: 'Status', cell: 'status' },
      ],
      rows: [
        { id: 'customer_id', field: 'customer_id', tone: 'match', sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' },
        { id: 'intent', field: 'intent', tone: 'match', sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' },
        { id: 'scope', field: 'authorization_scope', tone: 'match', sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' },
        { id: 'session', field: 'session_metadata', tone: 'neutral', sent: { ok: true, label: 'present' }, expected: { ok: false, label: 'not used' }, status: 'unused' },
      ],
    }),
    template: `<div style="display:grid;gap:16px;max-width:1080px;font-family:var(--v-font-family-sans);">
      <section style="${surface}display:grid;gap:14px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <h1 style="margin:0;font-size:24px;font-weight:600;">Router Agent → Billing Agent</h1>
          <VBadge size="sm" variant="success" dot>Context complete</VBadge>
          <VButton size="sm" variant="primary" style="margin-left:auto">Compare with failed run</VButton>
        </div>
        <VFlowPath :nodes="nodes" :edges="edges" aria-label="Handoff path" />
      </section>
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:16px;">
        <section style="${surface}"><h2 style="${h2}margin-bottom:12px;">Context comparison</h2>
          <VTable variant="comparison" :columns="columns" :rows="rows" :selectable="false" :show-toolbar="false" /></section>
        <section style="${surface}display:grid;gap:12px;align-content:start;">
          <h2 style="${muted}margin:0;text-transform:uppercase;letter-spacing:.06em;">Edge health · 24h</h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <VStatCard size="sm" variant="tinted" label="Runs on this edge" value="1,842" />
            <VStatCard size="sm" variant="tinted" label="Success rate" value="82.2%" />
            <VStatCard size="sm" variant="tinted" label="Avg latency" value="190 ms" />
            <VStatCard size="sm" variant="tinted" label="Context complete" value="1,714" />
          </div>
          <VAlert variant="success" size="sm" title="Nothing to fix on this run" description="FIX-117 is watching this edge in Monitor mode." />
        </section>
      </div>
    </div>`,
  }),
}

export const ComposerBars: Story = {
  name: 'Composer bars (toolbar, voz, horário)',
  parameters: { docs: { description: { story: 'Pilha de barras flutuantes: `VToolbar variant="floating"`, `VAudioRecorder` (pronto e gravando) e `VTimeRange`.' } } },
  render: () => ({
    components: { VToolbar, VToolbarButton, VToolbarDivider, VAudioRecorder, VTimeRange },
    setup: () => ({
      start: ref('12:00'),
      end: ref('12:30'),
      levels: Array.from({ length: 22 }, (_, i) => 0.2 + Math.abs(Math.sin(i * 0.9)) * 0.8),
    }),
    template: `<div style="display:grid;gap:16px;justify-items:start;padding:32px;border-radius:24px;background:var(--v-color-surface-muted);max-width:520px;">
      <VToolbar variant="floating" aria-label="Formatting">
        <VToolbarButton icon="bold" aria-label="Bold" />
        <VToolbarButton icon="italic" aria-label="Italic" />
        <VToolbarButton icon="underline" aria-label="Underline" />
        <VToolbarDivider />
        <VToolbarButton icon="image" aria-label="Insert image" />
        <VToolbarButton icon="list" aria-label="List" />
        <VToolbarButton icon="link" aria-label="Link" />
      </VToolbar>
      <VAudioRecorder state="ready" :duration="12" :levels="[]" />
      <VAudioRecorder state="recording" :elapsed="4" :levels="levels" />
      <VTimeRange v-model:start="start" v-model:end="end" />
    </div>`,
  }),
}

const board = (): VKanbanColumn[] => [
  { id: 'backlog', title: 'Backlog', icon: circleDashedIcon, items: [
    { id: 'WEB-148', code: 'WEB-148', title: 'Migrate blog to new CMS', tags: [{ label: 'Backend', color: '#22c55e' }], priority: 2, due: 'Oct 21', assignee: { initials: 'JC' } },
    { id: 'WEB-130', code: 'WEB-130', title: 'Write homepage copy', tags: [{ label: 'Content', color: '#ec4899' }], priority: 1, due: 'Oct 11', assignee: { initials: 'PP' } },
  ] },
  { id: 'todo', title: 'To Do', icon: circleIcon, items: [
    { id: 'WEB-133', code: 'WEB-133', title: 'Set up analytics events', tags: [{ label: 'Backend', color: '#22c55e' }, { label: 'Growth', color: '#f97316' }], priority: 2, due: 'Oct 13', assignee: { initials: 'ML' } },
    { id: 'WEB-136', code: 'WEB-136', title: 'Accessibility audit of templates', tags: [{ label: 'QA', color: '#14b8a6' }], priority: 3, due: 'Oct 15', assignee: { initials: 'LF' } },
  ] },
  { id: 'progress', title: 'In Progress', icon: circleDashedHalfIcon, color: 'var(--v-color-warning-base)', items: [
    { id: 'WEB-112', code: 'WEB-112', title: 'Finalize navigation', tags: [{ label: 'Design', color: '#8b5cf6' }, { label: 'Frontend', color: '#3b82f6' }], priority: 3, progress: { done: 1, total: 3 }, due: 'Today', dueTone: 'warning', assignee: { initials: 'SC' } },
  ] },
]

export const ProjectWorkspace: Story = {
  name: 'Project workspace (board + activity)',
  parameters: { docs: { description: { story: '`VTabs` como navegação de views; aba Board com `VKanbanBoard` e aba Activity com `VTimeline variant="feed"`.' } } },
  render: () => ({
    components: { VTabs, VKanbanBoard, VTimeline, VBadge },
    setup: () => ({
      view: ref('board'),
      views: [
        { value: 'overview', label: 'Overview' },
        { value: 'board', label: 'Board' },
        { value: 'list', label: 'List' },
        { value: 'activity', label: 'Activity' },
      ],
      columns: ref(board()),
      activity: [
        { id: 1, group: 'Today', title: 'You completed Launch readiness checklist', time: '4h ago', avatar: { initials: 'AM' } },
        { id: 2, group: 'Today', title: 'Lena Fischer commented on Launch readiness checklist', time: '7h ago', avatar: { initials: 'LF' } },
        { id: 3, group: 'Earlier', title: 'You created project Product Launch', time: 'Sep 2', avatar: { initials: 'AM' } },
      ],
    }),
    template: `<div style="${surface}display:grid;gap:12px;max-width:1100px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <h1 style="margin:0;font-size:22px;font-weight:600;">Product Launch</h1>
        <VBadge size="sm" variant="danger" dot>At Risk</VBadge>
      </div>
      <VTabs v-model="view" :items="views" :panels="false" size="sm" aria-label="Project views" />
      <VKanbanBoard v-if="view === 'board'" v-model:columns="columns" aria-label="Product Launch board" />
      <div v-else-if="view === 'activity'" style="max-width:560px;margin:8px auto;width:100%;">
        <VTimeline variant="feed" :items="activity" aria-label="Activity" />
      </div>
      <p v-else style="${muted}">Selecione Board ou Activity.</p>
    </div>`,
  }),
}
