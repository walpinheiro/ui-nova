import type { Meta, StoryObj } from '@storybook/vue3-vite'
import databaseIcon from '@iconify-icons/keyline-icons/database'
import VFlowPath from './VFlowPath.vue'

const nodes = [
  { id: 'router', title: 'Router Agent', subtitle: 'sandy context · scope: admin' },
  { id: 'billing', title: 'Billing Agent', subtitle: 'accepted request · scope: admin' },
]

const edges = [
  {
    label: 'Handoff',
    status: 'success' as const,
    metrics: [
      { value: '9.1 KB', label: 'context' },
      { value: '188 ms', label: 'latency' },
      { value: '1,904', label: 'tokens' },
      { value: '5 of 5', label: 'fields' },
    ],
  },
]

const meta = {
  title: 'data/VFlowPath',
  component: VFlowPath,
  tags: ['autodocs'],
  args: { nodes, edges, animated: true, ariaLabel: 'Handoff path' },
  argTypes: {
    nodes: { description: 'Nós `{ id, title, subtitle?, icon? }` em ordem.', control: 'object' },
    edges: { description: '`edges[i]` liga `nodes[i]` → `nodes[i+1]`: `{ status?, metrics?, label? }`.', control: 'object' },
    animated: { description: 'Tracejado animado em arestas `active`.', control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Caminho de fluxo linear (agentes, serviços, etapas) com métricas na aresta. Em containers estreitos (< 34rem) vira vertical via container query. Slots: `node`, `edge`.',
          '',
          '```vue',
          '<VFlowPath :nodes="nodes" :edges="[{ status: \'success\', metrics: [{ value: \'188 ms\', label: \'latency\' }] }]" />',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof VFlowPath>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão** (Router → Billing).' } } },
}

export const MultiHopStatuses: Story = {
  parameters: { docs: { description: { story: 'Variação **Vários saltos** com estados `active`, `warning` e `error`.' } } },
  args: {
    nodes: [
      { id: 'in', title: 'Intake' },
      { id: 'router', title: 'Router' },
      { id: 'billing', title: 'Billing' },
      { id: 'ledger', title: 'Ledger', icon: databaseIcon },
    ],
    edges: [
      { status: 'active' as const, metrics: [{ value: '42 ms', label: 'latency' }] },
      { status: 'warning' as const, metrics: [{ value: '4 of 5', label: 'fields' }] },
      { status: 'error' as const, metrics: [{ value: 'timeout', label: '30 s' }] },
    ],
  },
}

export const Narrow: Story = {
  parameters: { docs: { description: { story: 'Variação **Container estreito**: layout vertical automático.' } } },
  render: (args) => ({
    components: { VFlowPath },
    setup: () => ({ args }),
    template: '<div style="max-width:320px;"><VFlowPath v-bind="args" /></div>',
  }),
}
