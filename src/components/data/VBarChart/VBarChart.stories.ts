import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VBarChart from './VBarChart.vue'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const values = [22, 26, 24, 31, 35, 40, 46, 58, 84.6]
const data = months.map((label, index) => ({ label, value: values[index], display: `$${values[index]}K` }))

const meta = {
  title: 'data/VBarChart',
  component: VBarChart,
  tags: ['autodocs'],
  args: { data, height: 120, variant: 'pill', tone: 'primary', showValue: 'active', showLabels: true, interactive: false },
  argTypes: {
    data: { description: 'Série `{ label, value, display? }`.', control: 'object' },
    active: { description: 'Índice da barra em destaque (`v-model:active`). Padrão: última; `-1` = nenhuma.', control: 'number' },
    height: { description: 'Altura da área de plot em px.', control: 'number' },
    variant: { description: '`pill` (cápsulas) ou `solid` (cantos discretos).', control: 'inline-radio', options: ['pill', 'solid'] },
    tone: { description: '`primary`, `neutral` ou `inverse` (barras brancas para fundos com gradiente).', control: 'inline-radio', options: ['primary', 'neutral', 'inverse'] },
    showValue: { description: 'Quais barras exibem o valor: `active`, `all` ou `none`.', control: 'inline-radio', options: ['active', 'all', 'none'] },
    showLabels: { description: 'Rótulos do eixo X.', control: 'boolean' },
    interactive: { description: 'Barras viram botões que mudam a barra ativa.', control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Gráfico de barras verticais leve (sem dependências) para tendências curtas — barras em cápsula com destaque na barra ativa, como no hero do Clawback.',
          '',
          '```vue',
          '<VBarChart :data="months" v-model:active="month" interactive />',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:440px;"><story /></div>' })],
} satisfies Meta<typeof VBarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão**. Destaca a última barra.' } } },
}

export const Interactive: Story = {
  parameters: { docs: { description: { story: 'Variação **Interativa** com `v-model:active`: clique/foque uma barra.' } } },
  render: (args) => ({
    components: { VBarChart },
    setup: () => ({ args, active: ref(data.length - 1) }),
    template: `<div>
      <VBarChart v-bind="args" v-model:active="active" interactive />
      <p style="margin-top:12px;font:12px var(--v-font-family-sans);color:var(--v-color-text-muted)">Ativo: {{ args.data[active]?.label }}</p>
    </div>`,
  }),
}

export const InverseOnGradient: Story = {
  parameters: { docs: { description: { story: 'Variação **Inverse** sobre gradiente (hero do Clawback/Carrier).' } } },
  args: { tone: 'inverse' },
  render: (args) => ({
    components: { VBarChart },
    setup: () => ({ args }),
    template: `<div style="padding:24px;border-radius:20px;background:linear-gradient(135deg,#c7d7fe,#7aa2f7);">
      <VBarChart v-bind="args" />
    </div>`,
  }),
}

export const SolidNeutral: Story = {
  parameters: { docs: { description: { story: 'Variação **Sólida neutra** com todos os valores.' } } },
  args: { variant: 'solid', tone: 'neutral', showValue: 'all', data: data.slice(-6), height: 100 },
}
