import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VStatusMark from './VStatusMark.vue'

const meta = {
  title: 'feedback/VStatusMark',
  component: VStatusMark,
  tags: ['autodocs'],
  args: { state: 'running', size: 'md', label: 'Executando' },
  argTypes: {
    state: { description: 'Estado visual: `idle`, `running` (spinner), `success` ou `error`.', control: 'select', options: ['idle', 'running', 'success', 'error'] },
    size: { description: 'Tamanho do marcador.', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { description: 'Texto ao lado do glifo; também vira `aria-label`.', control: 'text' },
    motion: { description: 'Nível de movimento: `default`, `expressive` ou `none`.', control: 'inline-radio', options: ['default', 'expressive', 'none'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Marcador compacto de status de uma tarefa/execução (ocioso, em andamento, sucesso, erro) com `role="status"`.',
          '',
          '```vue',
          '<VStatusMark state="success" label="Concluído" />',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof VStatusMark>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}
export const Idle: Story = { parameters: { docs: { description: { story: 'Variação **Idle**. Props: `state="idle"`, `label="Aguardando"`.' } } }, args: { state: 'idle', label: 'Aguardando' } }
export const Running: Story = { parameters: { docs: { description: { story: 'Variação **Running**. Props: `state="running"`, `label="Executando"`.' } } }, args: { state: 'running', label: 'Executando' } }
export const Success: Story = { parameters: { docs: { description: { story: 'Variação **Sucesso**. Props: `state="success"`, `label="Concluído"`.' } } }, args: { state: 'success', label: 'Concluído' } }
export const Error: Story = { parameters: { docs: { description: { story: 'Variação **Erro**. Props: `state="error"`, `label="Falhou"`.' } } }, args: { state: 'error', label: 'Falhou' } }
export const WithoutLabel: Story = { parameters: { docs: { description: { story: 'Variação **Sem rótulo**. Props: `state="success"`.' } } }, args: { state: 'success', label: undefined } }

export const AllStatesAndSizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Todos estados e tamanhos**.' } },
  },
  render: () => ({
    components: { VStatusMark },
    template: `<div style="display:grid;gap:12px;">
      <div v-for="size in ['sm','md','lg']" :key="size" style="display:flex;gap:20px;align-items:center;">
        <VStatusMark v-for="s in ['idle','running','success','error']" :key="s" :state="s" :size="size" :label="s" />
      </div></div>`,
  }),
}
