import type { Meta, StoryObj } from '@storybook/vue3-vite'
import walletIcon from '@iconify-icons/keyline-icons/wallet'
import VStatCard from './VStatCard.vue'
import VBarChart from '../VBarChart/VBarChart.vue'
import VBadge from '../../feedback/VBadge/VBadge.vue'
import VButton from '../../form/VButton/VButton.vue'

const meta = {
  title: 'data/VStatCard',
  component: VStatCard,
  tags: ['autodocs'],
  args: { label: 'Runs on this edge', value: '1,842', caption: 'Last 24 hours', size: 'md', variant: 'outlined' },
  argTypes: {
    label: { description: 'Rótulo do KPI.', control: 'text' },
    value: { description: 'Valor principal (já formatado).', control: 'text' },
    caption: { description: 'Linha secundária abaixo do valor.', control: 'text' },
    delta: { description: 'Variação exibida como pílula; o sinal define a tendência quando `trend` não é passado.', control: 'text' },
    trend: { description: 'Força a tendência: `up`, `down` ou `neutral`.', control: 'inline-radio', options: ['up', 'down', 'neutral'] },
    deltaCaption: { description: 'Texto após a pílula de variação.', control: 'text' },
    size: { description: 'Escala do valor e do padding.', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { description: 'Superfície: `plain`, `outlined`, `elevated` ou `tinted`.', control: 'inline-radio', options: ['plain', 'outlined', 'elevated', 'tinted'] },
    loading: { description: 'Mostra skeleton no lugar do valor.', control: 'boolean' },
    stats: { description: 'Métricas secundárias abaixo de um divisor `{ label, value, caption?, color? }`.', control: 'object' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Cartão de KPI: rótulo, valor em destaque, variação com tendência e métricas secundárias. Slots: `header-trailing` (ex.: seletor de período), `value-trailing`, default (gráfico) e `footer`.',
          '',
          '```vue',
          '<VStatCard label="Recovered this month" value="$84,620" delta="14.8%" delta-caption="vs $73,710 in August" />',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof VStatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão**. Use a aba **Controls** para experimentar as props ao vivo.' } } },
}

export const WithDelta: Story = {
  parameters: { docs: { description: { story: 'Variação **Com variação**. Props: `delta="14.8%"`, `delta-caption`.' } } },
  args: { label: 'Recovered this month', value: '$84,620', caption: undefined, delta: '14.8%', deltaCaption: 'vs $73,710 in August' },
}

export const NegativeDelta: Story = {
  parameters: { docs: { description: { story: 'Variação **Queda**. Delta negativo infere `trend="down"`.' } } },
  args: { label: 'Success rate', value: '82.2%', caption: undefined, delta: '-3.1%', deltaCaption: 'vs last week' },
}

export const KpiRow: Story = {
  parameters: { docs: { description: { story: 'Variação **Linha de KPIs** (página Evidence): `variant="plain"` separados por divisores.' } } },
  render: () => ({
    components: { VStatCard },
    template: `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:860px;">
      <VStatCard variant="plain" label="Open" value="7" caption="$10,240 in claims" />
      <VStatCard variant="plain" label="Overdue" value="2" caption="$5,120 in claims">
        <template #value-trailing><VBadge size="sm" variant="danger" dot>Nudge today</VBadge></template>
      </VStatCard>
      <VStatCard variant="plain" label="Answered in" value="1.4 days" caption="Average, last 30 days" />
      <VStatCard variant="plain" label="Answered" value="94%" caption="Last 30 days" />
    </div>`,
  }),
}

export const EdgeHealthGrid: Story = {
  parameters: { docs: { description: { story: 'Variação **Grade 2×2** (Edge health): `size="sm"`, `variant="tinted"`.' } } },
  render: () => ({
    components: { VStatCard },
    template: `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-width:360px;">
      <VStatCard size="sm" variant="tinted" label="Runs on this edge" value="1,842" />
      <VStatCard size="sm" variant="tinted" label="Success rate" value="82.2%" />
      <VStatCard size="sm" variant="tinted" label="Avg latency" value="190 ms" />
      <VStatCard size="sm" variant="tinted" label="Context complete" value="1,714" />
    </div>`,
  }),
}

export const HeroWithStats: Story = {
  parameters: { docs: { description: { story: 'Variação **Hero** (Clawback): `size="lg"`, `variant="elevated"`, `icon`, seletor em `#header-trailing` e `stats` com pontos coloridos.' } } },
  render: () => ({
    components: { VStatCard, VButton },
    setup: () => ({
      walletIcon,
      stats: [
        { label: 'Pending', value: '$31.2K', caption: '22 claims', color: 'var(--v-color-info-base)' },
        { label: 'At risk', value: '$12.4K', caption: '5 claims', color: 'var(--v-color-warning-base)' },
        { label: 'Denied', value: '$8.7K', caption: '7 claims', color: 'var(--v-color-error-base)' },
      ],
    }),
    template: `<div style="max-width:420px;">
      <VStatCard size="lg" variant="elevated" :icon="walletIcon" label="Recovered this month" value="$84,620"
        delta="14.8%" delta-caption="vs $73,710 in August" :stats="stats">
        <template #header-trailing><VButton size="sm" variant="secondary">September</VButton></template>
      </VStatCard>
    </div>`,
  }),
}

export const WithChart: Story = {
  parameters: { docs: { description: { story: 'Variação **Com gráfico no slot default**: `VBarChart` dentro do cartão.' } } },
  render: () => ({
    components: { VStatCard, VBarChart },
    setup: () => ({
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((label, i) => ({ label, value: 20 + i * 8 + (i % 3) * 6 })),
    }),
    template: `<div style="max-width:420px;">
      <VStatCard label="Recovered in 2026" value="$428,650" caption="212 claims paid · 78% recovery rate">
        <VBarChart :data="data" :height="96" />
      </VStatCard>
    </div>`,
  }),
}

export const Loading: Story = {
  parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading`.' } } },
  args: { loading: true },
}
