import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TemplateShell from '../_shared/TemplateShell.vue'
import ReaderTabsCanvasDemo from './ReaderTabsCanvasDemo.vue'

const meta = {
  title: 'Templates/Reader + Abas + Canvas',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Painel central com `VTabs` alternando Leitor, Canvas (workspace com grade) e Pré-visualização. Árvore de ficheiros à esquerda.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ComCanvas: Story = {
  name: 'Abas Leitor · Canvas · Preview',
  render: () => ({
    components: { TemplateShell, ReaderTabsCanvasDemo },
    template: `
      <TemplateShell title="VTabs no centro — inclui workspace canvas" height="720px">
        <ReaderTabsCanvasDemo />
      </TemplateShell>
    `,
  }),
}

export const CanvasAtivo: Story = {
  name: 'Aba Canvas em destaque',
  render: () => ({
    components: { TemplateShell, ReaderTabsCanvasDemo },
    setup: () => ({ initialTab: 'canvas' }),
    template: `
      <TemplateShell title="Abra a aba Canvas para editar visualmente" height="720px">
        <ReaderTabsCanvasDemo />
      </TemplateShell>
    `,
  }),
}
