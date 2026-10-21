import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InsightsDetail from './InsightsDetail.vue'

const meta = {
  title: 'Templates/Insights Detail',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Página de detalhe de um insight (detector de loop de delegação): `VSidebar` lateral (ícones; expande para mostrar os textos), `VTopBar` com pill nav, cabeçalho com `VBreadcrumb`, tabela de ocorrências, regra de detecção com `VSlider` e playbook. Funciona em light/dark; o toggle sol/lua no rail altera `data-theme` no `<html>`.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Delegation loop',
  render: () => ({ components: { InsightsDetail }, template: '<InsightsDetail />' }),
}
