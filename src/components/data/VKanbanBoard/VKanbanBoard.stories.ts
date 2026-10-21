import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import circleDashedIcon from '@iconify-icons/keyline-icons/circle-dashed'
import circleIcon from '@iconify-icons/keyline-icons/circle'
import circleDashedHalfIcon from '@iconify-icons/keyline-icons/circle-dashed-half'
import circleCheckFillIcon from '@iconify-icons/keyline-icons/circle-check-fill'
import VKanbanBoard from './VKanbanBoard.vue'
import type { VKanbanColumn } from './VKanbanBoard.types'

const TAGS = {
  backend: { label: 'Backend', color: '#22c55e' },
  growth: { label: 'Growth', color: '#f97316' },
  content: { label: 'Content', color: '#ec4899' },
  qa: { label: 'QA', color: '#14b8a6' },
  design: { label: 'Design', color: '#8b5cf6' },
  frontend: { label: 'Frontend', color: '#3b82f6' },
}

const boardColumns = (): VKanbanColumn[] => [
  {
    id: 'backlog',
    title: 'Backlog',
    icon: circleDashedIcon,
    items: [
      { id: 'WEB-148', code: 'WEB-148', title: 'Migrate blog to new CMS', tags: [TAGS.backend], priority: 2, due: 'Oct 21', assignee: { initials: 'JC', name: 'John Carter' } },
      { id: 'WEB-130', code: 'WEB-130', title: 'Write homepage copy', tags: [TAGS.content], priority: 1, due: 'Oct 11', assignee: { initials: 'PP', name: 'Priya Patel' } },
    ],
  },
  {
    id: 'todo',
    title: 'To Do',
    icon: circleIcon,
    items: [
      { id: 'WEB-133', code: 'WEB-133', title: 'Set up analytics events', tags: [TAGS.backend, TAGS.growth], priority: 2, due: 'Oct 13', assignee: { initials: 'ML' } },
      { id: 'WEB-136', code: 'WEB-136', title: 'Accessibility audit of templates', tags: [TAGS.qa], priority: 3, due: 'Oct 15', assignee: { initials: 'LF' } },
      { id: 'WEB-121', code: 'WEB-121', title: 'Review responsive layouts', tags: [TAGS.qa, TAGS.design], priority: 3, due: 'Oct 1', assignee: { initials: 'EW' } },
    ],
  },
  {
    id: 'progress',
    title: 'In Progress',
    icon: circleDashedHalfIcon,
    color: 'var(--v-color-warning-base)',
    items: [
      { id: 'WEB-112', code: 'WEB-112', title: 'Finalize navigation', tags: [TAGS.design, TAGS.frontend], priority: 3, progress: { done: 1, total: 3 }, due: 'Today', dueTone: 'warning', assignee: { initials: 'SC' } },
      { id: 'WEB-115', code: 'WEB-115', title: 'Design responsive nav', tags: [TAGS.design], priority: 2, progress: { done: 1, total: 2 }, due: 'Sat', assignee: { initials: 'AM' } },
      { id: 'WEB-127', code: 'WEB-127', title: 'Design mobile onboarding', tags: [TAGS.design], priority: 3, progress: { done: 1, total: 3 }, due: 'Yesterday', dueTone: 'danger', assignee: { initials: 'EW' } },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    icon: circleCheckFillIcon,
    color: 'var(--v-color-success-base)',
    items: [{ id: 'WEB-101', code: 'WEB-101', title: 'Kickoff with stakeholders', tags: [TAGS.growth], priority: 1, due: 'Sep 2' }],
  },
]

const meta = {
  title: 'data/VKanbanBoard',
  component: VKanbanBoard,
  tags: ['autodocs'],
  args: { columns: boardColumns(), draggable: true, addable: true, addLabel: 'Add task', size: 'md', ariaLabel: 'Product Launch board' },
  argTypes: {
    columns: { description: 'Colunas `{ id, title, icon?, color?, items }` (`v-model:columns`).', control: 'object' },
    draggable: { description: 'Arrastar com o ponteiro e mover com Alt+Setas.', control: 'boolean' },
    addable: { description: 'Ação "+" no cabeçalho e botão "Add task" no rodapé.', control: 'boolean' },
    addLabel: { description: 'Texto do botão de adicionar.', control: 'text' },
    size: { description: 'Densidade.', control: 'inline-radio', options: ['sm', 'md'] },
    columnWidth: { description: 'Largura fixa das colunas (CSS).', control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Quadro Kanban com cards ricos (tags, código, prioridade, prazo, checklist, responsável), drag-and-drop nativo e alternativa por teclado (**Alt + ←/→** muda de coluna, **Alt + ↑/↓** reordena) com anúncio em live region. Controlado via `v-model:columns`; o helper puro `moveKanbanItem` também é exportado. Slot `card` substitui o conteúdo do card.',
          '',
          '```vue',
          '<VKanbanBoard v-model:columns="columns" @add="openNewTask" />',
          '```',
        ].join('\n'),
      },
    },
  },
  render: (args) => ({
    components: { VKanbanBoard },
    setup: () => {
      const columns = ref(args.columns ?? boardColumns())
      const log = ref('')
      return { args, columns, log }
    },
    template: `<div>
      <VKanbanBoard v-bind="args" v-model:columns="columns" @move="(m) => (log = m.itemId + ' → ' + m.to + ' #' + (m.index + 1))" />
      <p style="margin-top:8px;font:12px var(--v-font-family-sans);color:var(--v-color-text-muted)">Último movimento: {{ log || '—' }}</p>
    </div>`,
  }),
} satisfies Meta<typeof VKanbanBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão**. Arraste cards entre colunas ou foque um card e use Alt + setas.' } } },
}

export const Compact: Story = {
  parameters: { docs: { description: { story: 'Variação **Compacta** sem ações de adicionar.' } } },
  args: { size: 'sm', addable: false },
}

export const CustomCard: Story = {
  parameters: { docs: { description: { story: 'Variação **Card customizado** via slot `card`.' } } },
  render: (args) => ({
    components: { VKanbanBoard },
    setup: () => ({ args, columns: ref(boardColumns().slice(0, 3)) }),
    template: `<VKanbanBoard v-bind="args" v-model:columns="columns" :addable="false" column-width="15rem">
      <template #card="{ item }">
        <strong style="font-size:13px">{{ item.title }}</strong>
        <span style="font-size:11px;color:var(--v-color-text-muted)">{{ item.code }}</span>
      </template>
    </VKanbanBoard>`,
  }),
}

export const ReadOnly: Story = {
  parameters: { docs: { description: { story: 'Variação **Somente leitura**. Props: `draggable=false`.' } } },
  args: { draggable: false, addable: false },
}
