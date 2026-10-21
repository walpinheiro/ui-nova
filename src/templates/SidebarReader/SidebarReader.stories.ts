import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import TemplateShell from '../_shared/TemplateShell.vue'
import SidebarReaderDemo from './SidebarReaderDemo.vue'

const meta = {
  title: 'Templates/Menu lateral + Reader',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`VSplitView` com árvore de documentos (`VTreeNavigation`) à esquerda e reader com `VTabs` (Leitura / Sumário) à direita.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ComMenuCategorizado: Story = {
  name: 'Com menu categorizado',
  render: () => ({
    components: { TemplateShell, SidebarReaderDemo },
    setup() {
      const layoutMode = ref<'sidebar' | 'split'>('sidebar')
      return { layoutMode }
    },
    template: `
      <TemplateShell title="VSidebar com categorias + reader com abas" height="720px">
        <SidebarReaderDemo v-model:layout-mode="layoutMode" />
      </TemplateShell>
    `,
  }),
}

export const ArvoreDocumentacao: Story = {
  name: 'Árvore + reader',
  render: () => ({
    components: { TemplateShell, SidebarReaderDemo },
    template: `
      <TemplateShell title="Split view: navegação + leitura" height="720px">
        <SidebarReaderDemo />
      </TemplateShell>
    `,
  }),
}

export const TelaCheia: Story = {
  name: 'Tela cheia',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { TemplateShell, SidebarReaderDemo },
    template: `
      <TemplateShell title="Menu + reader em viewport completo" height="100vh">
        <SidebarReaderDemo />
      </TemplateShell>
    `,
  }),
}
