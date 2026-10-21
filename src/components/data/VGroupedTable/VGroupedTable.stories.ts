import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import circleDashedHalfIcon from '@iconify-icons/keyline-icons/circle-dashed-half'
import circleDashedIcon from '@iconify-icons/keyline-icons/circle-dashed'
import circleDashedQuarterIcon from '@iconify-icons/keyline-icons/circle-dashed-quarter'
import circleCheckFillIcon from '@iconify-icons/keyline-icons/circle-check-fill'
import tagIcon from '@iconify-icons/keyline-icons/tag'
import usersIcon from '@iconify-icons/keyline-icons/users'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import userIcon from '@iconify-icons/keyline-icons/user'
import VGroupedTable from './VGroupedTable.vue'
import VAvatar from '../../images/VAvatar/VAvatar.vue'
import VGroupAvatar from '../../images/VAvatar/VGroupAvatar.vue'

const deal = (id: string, name: string, color: string, amount: string, date: string, owner: string, people: string[]) => ({
  id,
  name,
  color,
  amount,
  date,
  owner,
  people,
})

const groups = [
  {
    id: 'proposal',
    label: 'Proposal',
    icon: circleDashedHalfIcon,
    color: 'var(--v-color-success-base)',
    rows: [
      deal('tideline', 'Tideline', '#2563eb', '$450', '27 Aug', 'AM', ['SC', 'JC']),
      deal('bramble', 'Bramble', '#ea580c', '$24k', '15 Oct', 'LF', ['PP']),
      deal('ashford', 'Ashford', '#dc2626', '$52k', '29 Oct', 'JC', ['EW']),
    ],
  },
  {
    id: 'demo',
    label: 'Demo',
    icon: circleDashedQuarterIcon,
    color: 'var(--v-color-success-base)',
    rows: [
      deal('fielded', 'Fielded', '#111827', '$320', '12 Sept', 'SC', ['AM', 'LF']),
      deal('alvi', 'alvi.sh', '#7c3aed', '$10k', '3 Sept', 'PP', ['JC']),
      deal('vesper', 'Vesper', '#4338ca', '$18k', '22 Oct', 'EW', ['SC']),
    ],
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: circleDashedIcon,
    color: 'var(--v-color-success-base)',
    rows: [
      deal('holloway', 'Holloway', '#ca8a04', '$180', '27 Sept', 'AM', ['LF', 'PP', 'EW']),
      deal('northlane', 'Northlane', '#16a34a', '$36k', '5 Nov', 'JC', ['SC']),
      deal('quietwork', 'Quietwork', '#111827', '$12k', '12 Nov', 'LF', []),
    ],
  },
  {
    id: 'won',
    label: 'Closed Won',
    icon: circleCheckFillIcon,
    color: 'var(--v-color-success-base)',
    rows: [
      deal('wovenpath', 'Wovenpath', '#111827', '$125', '10 Aug', 'SC', ['AM']),
      deal('halden', 'Halden', '#f97316', '$28k', '21 Sept', 'PP', ['JC']),
    ],
  },
]

const columns = [
  { key: 'name', label: 'Deal' },
  { key: 'amount', label: 'Amount', icon: tagIcon, iconOnlyHeader: true, minWidth: 520, collapseInto: 'name' },
  { key: 'people', label: 'People', icon: usersIcon, iconOnlyHeader: true, minWidth: 520 },
  { key: 'date', label: 'Close date', icon: calendarIcon, iconOnlyHeader: true, align: 'start' as const },
  { key: 'owner', label: 'Owner', icon: userIcon, iconOnlyHeader: true, align: 'end' as const, width: '48px' },
]

const cellTemplate = `
  <template #cell-name="{ row }">
    <span style="display:inline-flex;align-items:center;gap:8px;font-weight:500;">
      <span :style="{ width: '14px', height: '14px', borderRadius: '4px', background: row.color }" />
      {{ row.name }}
    </span>
  </template>
  <template #cell-amount="{ row, inline }">
    <span :style="{ fontVariantNumeric: 'tabular-nums', color: inline ? undefined : 'var(--v-color-text-muted)' }">{{ inline ? row.amount : 'USD ' + row.amount.replace('$', '') }}</span>
  </template>
  <template #cell-people="{ row }">
    <VGroupAvatar v-if="row.people.length" size="xs" :max="3" :members="row.people.map((initials) => ({ initials }))" />
  </template>
  <template #cell-owner="{ row }">
    <VAvatar size="xs" :initials="row.owner" decorative />
  </template>`

const meta = {
  title: 'data/VGroupedTable',
  component: VGroupedTable,
  tags: ['autodocs'],
  args: { columns, groups, collapsible: true, showHeader: 'auto', headerMinWidth: 640, size: 'default', interactive: false, ariaLabel: 'Deals' },
  argTypes: {
    columns: { description: 'Colunas `{ key, label, icon?, iconOnlyHeader?, width?, align?, minWidth?, collapseInto? }`. `minWidth` (px do container) esconde a coluna em painéis estreitos; `collapseInto` mostra o valor inline em outra coluna.', control: 'object' },
    groups: { description: 'Grupos `{ id, label, icon?, color?, count?, rows }`.', control: 'object' },
    collapsed: { description: 'IDs de grupos recolhidos (`v-model:collapsed`).', control: 'object' },
    collapsible: { description: 'Cabeçalhos de grupo viram botões de expandir/recolher.', control: 'boolean' },
    showHeader: { description: '`true`, `false` ou `auto` (aparece a partir de `headerMinWidth`).', control: 'select', options: [true, false, 'auto'] },
    headerMinWidth: { description: 'Largura mínima para o cabeçalho em modo `auto`.', control: 'number' },
    size: { description: 'Densidade.', control: 'inline-radio', options: ['compact', 'default'] },
    interactive: { description: 'Linhas focáveis que emitem `row-click`.', control: 'boolean' },
    containerWidth: { description: 'Força a largura medida (SSR/testes).', control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Tabela agrupada e responsiva ao **container** (não à viewport): colunas aparecem/somem conforme a largura do painel e podem "colapsar" inline na coluna principal — o padrão "tables that split, stretch and snap". Slots `cell-{key}` (recebem `row`, `group`, `value`, `inline`) e `group-header`.',
          '',
          '```vue',
          '<VGroupedTable :columns="columns" :groups="groups" v-model:collapsed="collapsed">',
          '  <template #cell-name="{ row }">…</template>',
          '</VGroupedTable>',
          '```',
        ].join('\n'),
      },
    },
  },
  render: (args) => ({
    components: { VGroupedTable, VAvatar, VGroupAvatar },
    setup: () => ({ args, collapsed: ref<string[]>([]) }),
    template: `<VGroupedTable v-bind="args" v-model:collapsed="collapsed">${cellTemplate}</VGroupedTable>`,
  }),
} satisfies Meta<typeof VGroupedTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão**. Redimensione o canvas para ver as colunas entrarem/saírem.' } } },
}

export const ResizablePanel: Story = {
  parameters: { docs: { description: { story: 'Variação **Painel redimensionável**: arraste a borda direita do painel. Abaixo de 520px, `Amount` vira texto inline ao lado do nome e `People` some; abaixo de 640px o cabeçalho some.' } } },
  render: (args) => ({
    components: { VGroupedTable, VAvatar, VGroupAvatar },
    setup: () => ({ args, collapsed: ref<string[]>([]) }),
    template: `<div style="resize:horizontal;overflow:auto;width:420px;min-width:300px;max-width:100%;padding:8px;border:1px solid var(--v-color-border);border-radius:16px;background:var(--v-color-surface);box-shadow:var(--v-shadow-md);">
      <div style="display:flex;align-items:center;gap:8px;padding:6px 8px 10px;font:500 13px var(--v-font-family-sans);">Deals <span style="color:var(--v-color-text-muted)">11</span></div>
      <VGroupedTable v-bind="args" size="compact" v-model:collapsed="collapsed">${cellTemplate}</VGroupedTable>
    </div>`,
  }),
}

export const Collapsed: Story = {
  parameters: { docs: { description: { story: 'Variação **Grupos recolhidos**. Props: `collapsed=["leads","won"]`.' } } },
  render: (args) => ({
    components: { VGroupedTable, VAvatar, VGroupAvatar },
    setup: () => ({ args, collapsed: ref<string[]>(['leads', 'won']) }),
    template: `<VGroupedTable v-bind="args" v-model:collapsed="collapsed">${cellTemplate}</VGroupedTable>`,
  }),
}

export const ForcedNarrow: Story = {
  parameters: { docs: { description: { story: 'Variação **Largura forçada** (`container-width="380"`), útil para SSR.' } } },
  args: { containerWidth: 380 },
}
