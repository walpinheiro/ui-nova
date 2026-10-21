import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VTable from './VTable.vue'
import VAvatar from '../../images/VAvatar/VAvatar.vue'
import VBadge from '../../feedback/VBadge/VBadge.vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'lastActive', label: 'Last Active' },
]

const rows = [
  {
    id: 1,
    name: 'Alex Carter',
    role: 'Product Designer',
    status: 'active',
    lastActive: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  },
  {
    id: 2,
    name: 'Priya Shah',
    role: 'Frontend Engineer',
    status: 'in-review',
    lastActive: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  },
  {
    id: 3,
    name: 'Marcus Lee',
    role: 'Product Manager',
    status: 'active',
    lastActive: '5 hours ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
  },
  {
    id: 4,
    name: 'Elena Garcia',
    role: 'UX Researcher',
    status: 'away',
    lastActive: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
  },
  {
    id: 5,
    name: 'Daniel Kim',
    role: 'DevOps Engineer',
    status: 'inactive',
    lastActive: '1 week ago',
    disabledActions: true,
  },
  {
    id: 6,
    name: 'Sophia Chen',
    role: 'Data Analyst',
    status: 'active',
    lastActive: '3 hours ago',
    expandedContent: 'Expanded details for Sophia Chen.',
  },
]

const meta = {
  parameters: {
    docs: { description: { component: 'Exibição de dados estruturados para ver, entender e operar: suporta sorting, seleção, inline actions e progressive disclosure num design limpo, consistente e flexível. (Tab) título "Table — Structured data display", subtítulo "Turn rows into insight.' } },
  },
  title: 'table/VTable',
  component: VTable,
  tags: ['autodocs'],
  args: { columns, rows, selectable: true, multiple: true },
} satisfies Meta<typeof VTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Hero: Story = { parameters: { docs: { description: { story: 'Variação **Hero**.' } } }, args: { columns, rows } }

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VTable },
    template: `
      <div style="display:grid;gap:24px">
        <VTable :columns="columns" :rows="rows" variant="default" />
        <VTable :columns="columns" :rows="rows" variant="bordered" />
        <VTable :columns="columns" :rows="rows" variant="striped" />
        <VTable :columns="columns" :rows="rows" variant="minimal" />
      </div>
    `,
    setup: () => ({ columns, rows }),
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VTable },
    template: `
      <div style="display:grid;gap:24px">
        <VTable :columns="columns" :rows="rows" size="compact" />
        <VTable :columns="columns" :rows="rows" size="default" />
        <VTable :columns="columns" :rows="rows" size="comfortable" />
      </div>
    `,
    setup: () => ({ columns, rows }),
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**.' } },
  },
  render: () => ({
    components: { VTable },
    template: `
      <div style="display:grid;gap:24px">
        <VTable :columns="columns" :rows="rows" :selected="[4]" />
        <VTable :columns="columns" :rows="rows" loading />
        <VTable :columns="columns" :rows="[]" />
      </div>
    `,
    setup: () => ({ columns, rows }),
  }),
}

const comparisonColumns = [
  { key: 'field', label: 'Context field' },
  { key: 'sent', label: 'Sent by router', cell: 'mark' as const },
  { key: 'expected', label: 'Expected by billing', cell: 'mark' as const },
  { key: 'status', label: 'Status', cell: 'status' as const },
]

const comparisonRows = [
  { id: 'customer_id', field: 'customer_id', tone: 'match' as const, sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' as const },
  { id: 'intent', field: 'intent', tone: 'match' as const, sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' as const },
  { id: 'order_id', field: 'order_id', tone: 'match' as const, sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' as const },
  { id: 'scope', field: 'authorization_scope', tone: 'match' as const, sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'required' }, status: 'match' as const },
  { id: 'history', field: 'conversation_history', tone: 'match' as const, sent: { ok: true, label: 'present' }, expected: { ok: true, label: 'optional' }, status: 'match' as const },
  { id: 'session', field: 'session_metadata', tone: 'neutral' as const, sent: { ok: true, label: 'present' }, expected: { ok: false, label: 'not used' }, status: 'unused' as const },
]

export const Comparison: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Comparison**. Props: `variant="comparison"`, `selectable=false`, `showToolbar=false`.' } },
  },
  args: {
    variant: 'comparison',
    columns: comparisonColumns,
    rows: comparisonRows,
    selectable: false,
    showToolbar: false,
  },
}

export const Sorting: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sorting**.' } },
  },
  args: {
    sort: [{ key: 'name', direction: 'desc', priority: 1 }],
  },
  render: (args) => ({
    components: { VTable },
    setup: () => ({ args, columns, rows }),
    template: '<VTable v-bind="args" :columns="columns" :rows="rows" />',
  }),
}

const holdingColumns = [
  { key: 'name', label: 'Holding' },
  { key: 'weight', label: 'Weight' },
  { key: 'pl', label: 'P/L' },
]

const holdingRows = [
  { id: 1, name: 'Alex Carter', weight: 42, pl: 12.4 },
  { id: 2, name: 'Priya Shah', weight: 27, pl: -3.1 },
  { id: 3, name: 'Marcus Lee', weight: 18, pl: 5.8 },
  { id: 4, name: 'Sofia Reyes', weight: 13, pl: -0.6 },
]

export const CustomCells: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Personalizado células**. Props: `selectable=false`, `showToolbar=false`. Slots usados: `#header-weight`, `#cell-name`, `#cell-weight`, `#cell-pl`.' } },
  },
  args: { columns: holdingColumns, rows: holdingRows, selectable: false, showToolbar: false },
  render: (args) => ({
    components: { VTable, VAvatar, VBadge },
    setup: () => ({ args }),
    template: `
      <VTable v-bind="args">
        <template #header-weight="{ column }"><span style="font-weight:600">{{ column.label }} (%)</span></template>
        <template #cell-name="{ row }">
          <span style="display:inline-flex;align-items:center;gap:var(--v-space-2)">
            <VAvatar :alt="row.name" size="sm" decorative />
            <strong>{{ row.name }}</strong>
          </span>
        </template>
        <template #cell-weight="{ value }">
          <span style="display:flex;align-items:center;gap:var(--v-space-2);min-width:140px">
            <span style="flex:1;height:6px;border-radius:999px;background:var(--v-color-neutral-100);overflow:hidden">
              <span :style="{ display:'block', height:'100%', width: value + '%', background:'var(--v-color-primary-500)' }" />
            </span>
            <span>{{ value }}%</span>
          </span>
        </template>
        <template #cell-pl="{ value }">
          <VBadge :variant="value >= 0 ? 'success' : 'danger'">{{ value >= 0 ? '+' : '' }}{{ value }}%</VBadge>
        </template>
      </VTable>
    `,
  }),
}

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }

export const SearchAndPagination: Story = { parameters: { docs: { description: { story: 'Variação **Busca e Pagination**. Props: `showPagination=true`, `page=1`, `pageSize=5`, `total=5`, `search="a"`.' } } }, args: { showPagination: true, page: 1, pageSize: 5, total: 5, search: 'a' } }

export const NoRowActions: Story = { parameters: { docs: { description: { story: 'Variação **Sem Row ações**. Props: `showActions=false`.' } } }, args: { showActions: false } }

export const ControlledSelectionSortSearch: Story = {
  parameters: { docs: { description: { story: 'Estado controlado: `v-model:selected`, `v-model:sort`, `v-model:search` e `v-model:page` ligados a refs; o estado atual é exibido abaixo da tabela.' } } },
  render: (args) => ({
    components: { VTable },
    setup() {
      const selected = ref<Array<string | number>>([1])
      const sort = ref<Array<{ key: string; direction: 'asc' | 'desc' }>>([{ key: 'name', direction: 'asc' }])
      const search = ref('')
      const page = ref(1)
      return { args, selected, sort, search, page }
    },
    template: '<div style="display:grid;gap:12px"><VTable v-bind="args" v-model:selected="selected" v-model:sort="sort" v-model:search="search" v-model:page="page" /><code>selected = {{ JSON.stringify(selected) }} · sort = {{ JSON.stringify(sort) }} · search = "{{ search }}" · page = {{ page }}</code></div>',
  }),
}
