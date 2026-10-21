import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TemplateShell from '../_shared/TemplateShell.vue'
import EditorWorkbenchDemo from './EditorWorkbenchDemo.vue'

const meta = {
  title: 'Templates/Workbench IDE',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Layout IDE completo: explorador + centro com abas Documento/Canvas + `VInspectorPanel` redimensionável e colapsável.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TresPaineis: Story = {
  name: 'Split 3 painéis + Inspector',
  render: () => ({
    components: { TemplateShell, EditorWorkbenchDemo },
    template: `
      <TemplateShell title="VSplitView [240 | 1 | 320] — arraste os handles" height="720px">
        <EditorWorkbenchDemo />
      </TemplateShell>
    `,
  }),
}

export const Persistido: Story = {
  name: 'Layout persistido (localStorage)',
  render: () => ({
    components: { TemplateShell, EditorWorkbenchDemo },
    template: `
      <TemplateShell
        title="persist-key=&quot;template-editor-workbench&quot; — redimensione e recarregue a story"
        height="720px"
      >
        <EditorWorkbenchDemo />
      </TemplateShell>
    `,
  }),
}
