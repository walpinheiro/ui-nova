import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TemplateShell from '../_shared/TemplateShell.vue'
import AppShellEditorDemo from './AppShellEditorDemo.vue'

const meta = {
  title: 'Templates/App Shell Editor',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`VAppShell` variant editor com slot `#sidebar` customizado (`VSidebar`) e abas Leitor/Canvas no conteúdo principal.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Editor: Story = {
  name: 'App shell + sidebar + abas',
  render: () => ({
    components: { TemplateShell, AppShellEditorDemo },
    template: `
      <TemplateShell title="VAppShell variant=&quot;editor&quot;" height="720px">
        <AppShellEditorDemo />
      </TemplateShell>
    `,
  }),
}
