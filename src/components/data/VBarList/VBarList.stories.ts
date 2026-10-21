import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VBarList from './VBarList.vue'

const denials = [
  { label: 'Missing documentation', value: 38 },
  { label: 'Incorrect part number', value: 21 },
  { label: 'Late submission', value: 17 },
  { label: 'Warranty expired', value: 13 },
  { label: 'Other', value: 11 },
]

const meta = {
  title: 'data/VBarList',
  component: VBarList,
  tags: ['autodocs'],
  args: { items: denials, unit: '%', layout: 'inline', emphasis: 'max', size: 'md', showValue: true, ariaLabel: 'Why claims get denied' },
  argTypes: {
    items: { description: 'Itens `{ label, value, display?, hint?, color?, emphasized? }`.', control: 'object' },
    max: { description: 'Máximo da escala (padrão: maior valor).', control: 'number' },
    unit: { description: 'Sufixo para valores sem `display` (ex.: `%`).', control: 'text' },
    layout: { description: '`inline` (rótulo · barra · valor) ou `stacked` (rótulo e valor acima da barra).', control: 'inline-radio', options: ['inline', 'stacked'] },
    emphasis: { description: 'Quais barras ficam fortes: `max`, `first`, `all` ou `none`.', control: 'inline-radio', options: ['max', 'first', 'all', 'none'] },
    size: { description: 'Espessura e espaçamento.', control: 'inline-radio', options: ['sm', 'md'] },
    showValue: { description: 'Mostra a coluna de valor.', control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Lista de barras horizontais rotuladas para rankings e distribuições ("Why claims get denied", "How fast money moves"). Cada barra é um `role="meter"` acessível.',
          '',
          '```vue',
          '<VBarList :items="[{ label: \'Missing docs\', value: 38 }]" unit="%" />',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:420px;"><story /></div>' })],
} satisfies Meta<typeof VBarList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão** (inline, destaca o maior).' } } },
}

export const Stacked: Story = {
  parameters: { docs: { description: { story: 'Variação **Empilhada** com `display` customizado e um item forçado em destaque.' } } },
  args: {
    layout: 'stacked',
    emphasis: 'none',
    unit: undefined,
    ariaLabel: 'How fast money moves',
    items: [
      { label: 'Detected to prepared', value: 3.4, display: '3.4 days' },
      { label: 'Prepared to submitted', value: 2.1, display: '2.1 days' },
      { label: 'Submitted to decision', value: 12.6, display: '12.6 days', emphasized: true },
      { label: 'Approved to paid', value: 6.3, display: '6.3 days' },
    ],
  },
}

export const WithHints: Story = {
  parameters: { docs: { description: { story: 'Variação **Com hint** sob o rótulo e cores por item.' } } },
  args: {
    emphasis: 'none',
    unit: undefined,
    items: [
      { label: 'Paid', hint: '36 claims', value: 51300, display: '$51,300', color: 'var(--v-color-primary)' },
      { label: 'In flight', hint: '25 collecting evidence', value: 79760, display: '$79,760', color: 'var(--v-color-primary-300)' },
      { label: 'Lost', hint: '23 not eligible', value: 51340, display: '$51,340', color: 'var(--v-color-neutral-300)' },
    ],
  },
}

export const Small: Story = {
  parameters: { docs: { description: { story: 'Variação **Compacta**. Props: `size="sm"`, `emphasis="first"`.' } } },
  args: { size: 'sm', emphasis: 'first' },
}
