import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VDescriptionList from './VDescriptionList.vue'
import VBadge from '../../feedback/VBadge/VBadge.vue'

const submission = [
  { label: 'Confirmation', value: 'CW-7730418' },
  { label: 'Submitted by', value: 'Nizam, today 9:14 AM' },
  { label: 'Portal account', value: 'Carrier dealer 4471' },
]

const breakdown = [
  { label: 'Replacement compressor', hint: 'Part credit · 10-year parts warranty', value: '$1,140' },
  { label: 'Labor', hint: '4.5 h at $88 · extended labor plan', value: '$396' },
  { label: 'Refrigerant R-410A', hint: '6 lb recovered and recharged', value: '$186' },
  { label: 'Diagnostic allowance', hint: 'Flat rate', value: '$65' },
  { label: 'Freight', hint: 'Part shipping', value: '$53' },
]

const meta = {
  title: 'data/VDescriptionList',
  component: VDescriptionList,
  tags: ['autodocs'],
  args: { items: submission, layout: 'inline', size: 'sm', dividers: false },
  argTypes: {
    items: { description: 'Pares `{ key?, label, value?, hint? }`.', control: 'object' },
    layout: { description: '`inline`, `stacked` ou `grid`.', control: 'inline-radio', options: ['inline', 'stacked', 'grid'] },
    size: { description: 'Tamanho do texto.', control: 'inline-radio', options: ['sm', 'md'] },
    dividers: { description: 'Linha entre itens.', control: 'boolean' },
    total: { description: 'Linha de total `{ label, value }` em destaque.', control: 'object' },
    columns: { description: 'Colunas no layout `grid`.', control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Lista de descrição (`<dl>`) para metadados e detalhamentos com total. Slots `value-{key}` ou `value` permitem badges/links no valor.',
          '',
          '```vue',
          '<VDescriptionList :items="items" :total="{ label: \'Claimed\', value: \'$1,840\' }" dividers />',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:520px;"><story /></div>' })],
} satisfies Meta<typeof VDescriptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão** (bloco Submission).' } } },
}

export const BreakdownWithTotal: Story = {
  parameters: { docs: { description: { story: 'Variação **Detalhamento com total** (Recovery breakdown): `hint`, `dividers`, `total`.' } } },
  args: { items: breakdown, dividers: true, size: 'md', total: { label: 'Claimed', value: '$1,840' } },
}

export const Grid: Story = {
  parameters: { docs: { description: { story: 'Variação **Grade** com slot de valor customizado.' } } },
  args: {
    layout: 'grid',
    columns: 3,
    items: [
      { key: 'status', label: 'Status', value: 'Submitted' },
      { key: 'owner', label: 'Owner', value: 'Marcus Reed' },
      { key: 'serial', label: 'Serial', value: '3819A44218' },
    ],
  },
  render: (args) => ({
    components: { VDescriptionList, VBadge },
    setup: () => ({ args }),
    template: `<VDescriptionList v-bind="args">
      <template #value-status="{ item }"><VBadge size="sm" variant="primary" dot>{{ item.value }}</VBadge></template>
    </VDescriptionList>`,
  }),
}

export const Stacked: Story = {
  parameters: { docs: { description: { story: 'Variação **Empilhada**.' } } },
  args: { layout: 'stacked' },
}
