import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VDateTile from './VDateTile.vue'

const meta = {
  title: 'data/VDateTile',
  component: VDateTile,
  tags: ['autodocs'],
  args: { date: '2026-09-29', size: 'md', tone: 'neutral', locale: 'en-US' },
  argTypes: {
    date: { description: 'Data (`Date`, timestamp ou ISO `YYYY-MM-DD`, lido como data local).', control: 'text' },
    month: { description: 'Sobrescreve o mês exibido.', control: 'text' },
    day: { description: 'Sobrescreve o dia exibido.', control: 'text' },
    locale: { description: 'Locale BCP-47 para o mês.', control: 'text' },
    size: { description: 'Tamanho.', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { description: 'Tom: `neutral`, `primary`, `warning` ou `danger`.', control: 'inline-radio', options: ['neutral', 'primary', 'warning', 'danger'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Mini-calendário "SEP 29" para prazos em listas. Renderiza `<time datetime>` com rótulo acessível por extenso.',
          '',
          '```vue',
          '<VDateTile date="2026-09-29" tone="danger" />',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof VDateTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão**.' } } },
}

export const Tones: Story = {
  parameters: { docs: { description: { story: 'Variação **Tons e tamanhos**.' } } },
  render: () => ({
    components: { VDateTile },
    template: `<div style="display:grid;gap:12px;">
      <div v-for="size in ['sm','md','lg']" :key="size" style="display:flex;gap:12px;align-items:center;">
        <VDateTile v-for="tone in ['neutral','primary','warning','danger']" :key="tone" date="2026-10-01" :size="size" :tone="tone" />
      </div></div>`,
  }),
}

export const Localized: Story = {
  parameters: { docs: { description: { story: 'Variação **pt-BR**. Props: `locale="pt-BR"`.' } } },
  args: { locale: 'pt-BR', date: '2026-10-03' },
}
