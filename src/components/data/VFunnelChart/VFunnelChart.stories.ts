import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VFunnelChart from './VFunnelChart.vue'

const stages = [
  { label: 'Detected', value: 182.4, display: '$182.4K', caption: '118 claims' },
  { label: 'Prepared', value: 96.3, display: '$96.3K', caption: '64 claims' },
  { label: 'Submitted', value: 71.6, display: '$71.6K', caption: '50 claims' },
  { label: 'Approved', value: 58.1, display: '$58.1K', caption: '41 claims' },
  { label: 'Paid', value: 51.3, display: '$51.3K', caption: '36 claims' },
]

const meta = {
  title: 'data/VFunnelChart',
  component: VFunnelChart,
  tags: ['autodocs'],
  args: { stages, height: 120, showConversion: true, tone: 'primary', ariaLabel: 'Recovery pipeline' },
  argTypes: {
    stages: { description: 'Etapas `{ label, value, display?, caption? }` em ordem.', control: 'object' },
    height: { description: 'Altura das cápsulas em px.', control: 'number' },
    showConversion: { description: 'Chip de conversão entre etapas (ex.: `→ 53%`).', control: 'boolean' },
    tone: { description: '`primary` ou `inverse` (para fundo com gradiente).', control: 'inline-radio', options: ['primary', 'inverse'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Funil de pipeline em colunas: valor por etapa, cápsula proporcional à maior etapa e taxa de conversão entre etapas.',
          '',
          '```vue',
          '<VFunnelChart :stages="stages" />',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof VFunnelChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão**.' } } },
}

export const OnGradient: Story = {
  parameters: { docs: { description: { story: 'Variação **Inverse** sobre gradiente (página Recovery).' } } },
  args: { tone: 'inverse' },
  render: (args) => ({
    components: { VFunnelChart },
    setup: () => ({ args }),
    template: `<div style="padding:24px 24px 28px;border-radius:20px;background:linear-gradient(120deg,#e0e7ff,#bfdbfe 50%,#93c5fd);">
      <VFunnelChart v-bind="args" />
    </div>`,
  }),
}

export const ThreeStages: Story = {
  parameters: { docs: { description: { story: 'Variação **Três etapas** sem conversão.' } } },
  args: { stages: stages.slice(0, 3), showConversion: false, height: 80 },
}
