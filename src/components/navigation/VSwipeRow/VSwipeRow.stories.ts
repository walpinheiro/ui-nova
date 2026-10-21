import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VSwipeRow from './VSwipeRow.vue'

const meta = {
  title: 'navigation/VSwipeRow',
  component: VSwipeRow,
  tags: ['autodocs'],
  args: {
    actions: [
      { key: 'archive', label: 'Arquivar' },
      { key: 'delete', label: 'Excluir', intent: 'destructive' },
    ],
    disabled: false,
    motion: 'expressive',
  },
  argTypes: {
    actions: { description: 'Lista de ações reveladas ao arrastar a linha: `{ key, label, intent?: "default" | "destructive" }`.' },
    disabled: { description: 'Desativa o gesto de arrastar.', control: 'boolean' },
    motion: { description: 'O gesto de arrastar só é habilitado com `expressive`.', control: 'inline-radio', options: ['default', 'expressive', 'none'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Linha com ações reveladas por **swipe horizontal** (arraste o conteúdo para a esquerda; as ações ficam à direita, então arrastar para a direita é bloqueado). Teclado: **Seta esquerda** revela as ações, **Seta direita**/**Esc** fecha; clicar fora também fecha. Emite `action` com a ação clicada.',
          '',
          '```vue',
          '<VSwipeRow :actions="[{ key: \'delete\', label: \'Excluir\', intent: \'destructive\' }]" @action="onAction">',
          '  Mensagem da caixa de entrada',
          '</VSwipeRow>',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:420px"><story /></div>' })],
  render: (args) => ({
    components: { VSwipeRow },
    setup: () => ({ args }),
    template: `<VSwipeRow v-bind="args">
      <div style="padding:16px;background:var(--v-color-surface);color:var(--v-color-text);">Mensagem da caixa de entrada</div>
    </VSwipeRow>`,
  }),
} satisfies Meta<typeof VSwipeRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}
export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }
export const SingleAction: Story = { parameters: { docs: { description: { story: 'Variação **Single Action**.' } } }, args: { actions: [{ key: 'delete', label: 'Excluir', intent: 'destructive' }] } }
export const NoMotion: Story = { parameters: { docs: { description: { story: 'Variação **Sem movimento**. Props: `motion="none"`.' } } }, args: { motion: 'none' } }
