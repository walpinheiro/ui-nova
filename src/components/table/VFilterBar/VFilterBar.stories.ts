import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VFilterBar from './VFilterBar.vue'

const chips = [
  { id: 'design', label: 'Design' },
  { id: 'priority', label: 'High Priority' },
  { id: 'owner', label: 'Alex Chen' },
]

const selects = [
  {
    id: 'status',
    label: 'Status',
    value: 'all',
    options: [{ label: 'All', value: 'all' }, { label: 'Active', value: 'active' }],
  },
  {
    id: 'assignee',
    label: 'Assignee',
    value: 'all',
    options: [{ label: 'All', value: 'all' }, { label: 'Alex Chen', value: 'alex' }],
  },
]

const meta = {
  parameters: {
    docs: { description: { component: 'Conjunto de controles inline para buscar, filtrar e refinar data views: ajuda a estreitar conteúdo rapidamente com interface limpa, consistente e flexível. (Design) valores: Flexible (search, selects, date ranges, chips…), Composable (mix-and-match p/ qualquer caso), Clean & Consistent. (Visual) valores: Discoverable (filtros comuns fáceis de achar/entender), Flexible, Fast (estreita resultados em segundos).' } },
  },
  title: 'table/VFilterBar',
  component: VFilterBar,
  tags: ['autodocs'],
  args: {
    title: 'Project Tasks',
    chips,
    selects,
    resultsCount: 243,
    totalCount: 1284,
    activeCount: 3,
    dateRange: 'Jan 1 2026 – Jan 31 2026',
    variant: 'advanced',
  },
} satisfies Meta<typeof VFilterBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Hero: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Hero**. Props: `title="Project Tasks"`, `resultsCount=243`, `totalCount=1284`, `activeCount=3`, `variant="advanced"`.' } },
  },
  args: {
    title: 'Project Tasks',
    chips,
    selects,
    resultsCount: 243,
    totalCount: 1284,
    activeCount: 3,
    variant: 'advanced',
  },
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VFilterBar },
    template: `
      <div style="display:grid;gap:24px">
        <VFilterBar title="Basic" variant="basic" :selects="selects" :results-count="1482" />
        <VFilterBar variant="chips" :chips="chips" :results-count="243" :total-count="1284" />
        <VFilterBar variant="advanced" title="Advanced" :selects="selects" :chips="chips" :results-count="1482" />
        <VFilterBar variant="sticky" sticky :results-count="243" :active-count="2" />
      </div>
    `,
    setup: () => ({ chips, selects }),
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VFilterBar },
    template: `
      <div style="display:grid;gap:24px">
        <VFilterBar size="sm" :selects="selects" :results-count="243" />
        <VFilterBar size="md" :selects="selects" :results-count="243" />
        <VFilterBar size="lg" :selects="selects" :results-count="243" />
      </div>
    `,
    setup: () => ({ selects }),
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**.' } },
  },
  render: () => ({
    components: { VFilterBar },
    template: `
      <div style="display:grid;gap:24px">
        <VFilterBar :selects="selects" :results-count="243" />
        <VFilterBar loading :selects="selects" :results-count="243" />
        <VFilterBar disabled :selects="selects" :results-count="243" />
        <VFilterBar variant="chips" :chips="[{ id: 'active', label: 'Active', dot: true, severity: 'success' }]" :results-count="1482" />
      </div>
    `,
    setup: () => ({ selects }),
  }),
}

export const FiltersAndShortcut: Story = { parameters: { docs: { description: { story: 'Variação **Filters e Shortcut**. Props: `searchShortcut=true`.' } } }, args: { filters: { status: 'open' }, searchShortcut: true } }
