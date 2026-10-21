import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import arrowLeftIcon from '@iconify-icons/keyline-icons/arrow-left'
import arrowRightIcon from '@iconify-icons/keyline-icons/arrow-right'
import VButton from '../../components/form/VButton/VButton.vue'
import { VIcon } from '../../components/primitives/VIcon'
import VSidebar from '../../components/navigation/VSidebar/VSidebar.vue'
import VTopBar from '../../components/navigation/VTopBar/VTopBar.vue'
import VToolbar from '../../components/navigation/VToolbar/VToolbar.vue'
import VToolbarButton from '../../components/navigation/VToolbar/VToolbarButton.vue'
import VToolbarDivider from '../../components/navigation/VToolbar/VToolbarDivider.vue'
import VToolbarGroup from '../../components/navigation/VToolbar/VToolbarGroup.vue'
import VTable from '../../components/table/VTable/VTable.vue'
import VCard from '../../components/containment/VCard/VCard.vue'
import CanvasGrid from '../_shared/CanvasGrid.vue'

const cardItems = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'agent', label: 'lemAgent', icon: 'bot' },
  { value: 'find', label: 'Find & Manage', type: 'heading' as const },
  { value: 'people', label: 'People database', icon: 'users' },
  { value: 'signals', label: 'Signal agents', icon: 'radar' },
  { value: 'contacts', label: 'Contacts', icon: 'contact' },
  { value: 'companies', label: 'Companies', icon: 'building' },
  { value: 'engage', label: 'Engage', type: 'heading' as const },
  { value: 'campaigns', label: 'Campaigns', icon: 'send' },
  { value: 'tasks', label: 'Tasks', icon: 'check' },
  { value: 'inbox', label: 'Inbox', icon: 'inbox' },
]

const workspaceItems = [
  { value: 'workspace', label: 'Workspace', type: 'heading' as const },
  { value: 'overview', label: 'Overview', icon: 'overview' },
  { value: 'templates', label: 'Templates', icon: 'templates' },
  { value: 'workflow', label: 'Workflow Builder', icon: 'workflow' },
  { value: 'operations', label: 'Operations', type: 'heading' as const },
  { value: 'runs', label: 'Runs & Logs', icon: 'play' },
  { value: 'admin', label: 'Administration', type: 'heading' as const },
  { value: 'notifications', label: 'Notifications', icon: 'notifications', badge: 78 },
  { value: 'settings', label: 'System Settings', icon: 'settings' },
]

const appItems = [
  { value: 'overview', label: 'Overview' },
  { value: 'workflows', label: 'Workflows' },
  { value: 'traces', label: 'Traces' },
  { value: 'insights', label: 'Insights' },
]

const comparisonColumns = [
  { key: 'field', label: 'Context field' },
  { key: 'sent', label: 'Sent by router', cell: 'mark' as const },
  { key: 'expected', label: 'Expected by billing', cell: 'mark' as const },
  { key: 'status', label: 'Status', cell: 'status' as const },
]

const comparisonRows = [
  { id: 'customer_id', field: 'customer_id', tone: 'match' as const, sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' as const },
  { id: 'intent', field: 'intent', tone: 'match' as const, sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' as const },
  { id: 'session', field: 'session_metadata', tone: 'neutral' as const, sent: { ok: true, label: 'present' }, expected: { ok: false, label: 'not used' }, status: 'unused' as const },
]

const meta = {
  title: 'templates/ProductShell',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const CardMenu: Story = {
  render: () => ({
    components: { VSidebar },
    setup: () => ({ cardItems, active: ref('home') }),
    template: `
      <div style="display:flex;min-height:100vh;background:var(--v-color-neutral-50);">
        <VSidebar
          variant="card"
          brand-name="Current"
          :show-search="false"
          :show-footer="false"
          v-model:active-item="active"
          :items="cardItems"
          style="height:100vh"
        />
        <main style="flex:1;padding:32px;color:var(--v-color-text-muted);">Sidebar</main>
      </div>
    `,
  }),
}

export const Dashboard: Story = {
  render: () => ({
    components: { VSidebar, VTopBar, VToolbar, VToolbarButton, VToolbarGroup, VToolbarDivider, VButton, VIcon, VTable },
    setup: () => ({
      workspaceItems,
      appItems,
      comparisonColumns,
      comparisonRows,
      arrowLeftIcon,
      arrowRightIcon,
      section: ref('templates'),
      nav: ref('traces'),
      tool: ref('select'),
    }),
    template: `
      <div style="display:flex;min-height:100vh;background:var(--v-color-neutral-50, var(--v-color-neutral-100));">
        <VSidebar
          variant="workspace"
          brand-name="FlowPilot"
          :show-search="false"
          :show-footer="false"
          v-model:active-item="section"
          :items="workspaceItems"
        />
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;">
          <VTopBar variant="app" :items="appItems" v-model:active-item="nav">
            <template #leading>
              <strong>OrchestrateIQ</strong>
            </template>
            <template #actions>
              <span style="padding:4px 10px;border-radius:999px;background:var(--v-color-success-soft);color:var(--v-color-success-strong);font-size:12px;font-weight:600;">Live</span>
            </template>
          </VTopBar>
          <div style="padding:24px 28px;display:flex;flex-direction:column;gap:20px;">
            <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;">
              <div>
                <h1 style="margin:0;font-size:28px;">Router Agent → Billing Agent</h1>
                <p style="margin:6px 0 0;color:var(--v-color-text-muted);">Handoff inspector · same contract, healthy run.</p>
              </div>
              <div style="display:flex;gap:8px;">
                <VButton variant="outline" shape="pill">
                  <template #icon><VIcon :icon="arrowLeftIcon" size="sm" /></template>
                  Back to trace
                </VButton>
                <VButton shape="pill">
                  <template #icon><VIcon :icon="arrowRightIcon" size="sm" /></template>
                  Compare with failed run
                </VButton>
              </div>
            </div>
            <VToolbar variant="segmented" aria-label="Canvas tools">
              <VToolbarGroup aria-label="Pointer">
                <VToolbarButton icon="select" variant="toggle" :active="tool === 'select'" aria-label="Select" @click="tool = 'select'" />
                <VToolbarButton icon="pan" variant="toggle" :active="tool === 'pan'" aria-label="Pan" @click="tool = 'pan'" />
                <VToolbarButton icon="zoom" variant="toggle" :active="tool === 'zoom'" aria-label="Zoom" @click="tool = 'zoom'" />
              </VToolbarGroup>
              <VToolbarDivider />
              <VToolbarGroup aria-label="History">
                <VToolbarButton icon="undo" aria-label="Undo" />
                <VToolbarButton icon="redo" aria-label="Redo" />
              </VToolbarGroup>
            </VToolbar>
            <VTable variant="comparison" :columns="comparisonColumns" :rows="comparisonRows" />
          </div>
        </div>
      </div>
    `,
  }),
}

const chartBars = [28, 44, 36, 52, 40, 58, 48]

export const CanvasCards: Story = {
  render: () => ({
    components: { VCard, CanvasGrid },
    setup: () => {
      const nodes = ref([
        { id: 'router', title: 'Router Agent', description: 'sends context · scope: admin', x: 48, y: 64, w: 200 },
        { id: 'metric', title: '9.1 KB', description: '188 ms · 5 of 5', x: 300, y: 88, w: 150 },
        { id: 'billing', title: 'Billing Agent', description: 'accepted request · scope: admin', x: 520, y: 64, w: 200 },
        { id: 'rate', title: '82.2%', description: 'Success rate', x: 48, y: 280, w: 180 },
        { id: 'health', title: 'Edge health', description: '', x: 280, y: 280, w: 240 },
      ])
      const active = ref('router')

      function nodeStyle(node: { id: string; x: number; y: number; w: number }) {
        return {
          position: 'absolute',
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: active.value === node.id ? `${node.w + 80}px` : `${node.w}px`,
          zIndex: active.value === node.id ? '3' : '2',
          cursor: 'grab',
          touchAction: 'none',
          userSelect: 'none',
          transition: 'width var(--v-motion-normal) var(--v-ease-out)',
        }
      }

      function drag(event: PointerEvent, node: { id: string; x: number; y: number }) {
        if (event.button !== 0) return
        event.preventDefault()
        active.value = node.id
        const handle = event.currentTarget as HTMLElement | null
        handle?.setPointerCapture?.(event.pointerId)
        const originX = event.clientX
        const originY = event.clientY
        const startX = node.x
        const startY = node.y
        const move = (next: PointerEvent) => {
          node.x = startX + next.clientX - originX
          node.y = startY + next.clientY - originY
        }
        const stop = () => {
          handle?.removeEventListener('pointermove', move)
          handle?.removeEventListener('pointerup', stop)
          handle?.removeEventListener('pointercancel', stop)
        }
        handle?.addEventListener('pointermove', move)
        handle?.addEventListener('pointerup', stop)
        handle?.addEventListener('pointercancel', stop)
      }

      return { chartBars, nodes, drag, nodeStyle }
    },
    template: `
      <div style="min-height:100vh;padding:24px;background:var(--v-color-neutral-100);">
        <CanvasGrid>
          <div
            v-for="node in nodes"
            :key="node.id"
            data-surface
            :style="nodeStyle(node)"
            @pointerdown="drag($event, node)"
          >
            <VCard variant="outlined" :title="node.title" :description="node.description || undefined" style="width:100%;pointer-events:none">
              <svg v-if="node.id === 'health'" viewBox="0 0 196 72" width="100%" height="72" role="img" aria-label="Runs over the last day">
                <rect
                  v-for="(bar, index) in chartBars"
                  :key="index"
                  :x="index * 28"
                  :y="64 - bar"
                  width="16"
                  :height="bar"
                  rx="4"
                  fill="var(--v-color-primary-500)"
                />
              </svg>
            </VCard>
          </div>
        </CanvasGrid>
      </div>
    `,
  }),
}
