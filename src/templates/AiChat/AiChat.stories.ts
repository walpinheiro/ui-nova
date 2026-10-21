import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TemplateShell from '../_shared/TemplateShell.vue'
import AiChatDemo from './AiChatDemo.vue'

const meta = {
  title: 'Templates/Chat IA',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Conversa com `VPromptBar`, `VAgentChip`, `VThoughtLine` e `VSpinner` (motion expressive) — baseado em motion/Expressive · AiSurface.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Conversa: Story = {
  name: 'Chat com animações',
  render: () => ({
    components: { TemplateShell, AiChatDemo },
    template: `
      <TemplateShell title="Assistente IA — envie uma mensagem para ver chip, raciocínio e resposta" height="720px">
        <AiChatDemo />
      </TemplateShell>
    `,
  }),
}

export const TelaCheia: Story = {
  name: 'Tela cheia',
  render: () => ({
    components: { TemplateShell, AiChatDemo },
    template: `
      <TemplateShell title="Assistente IA em viewport completo" height="100vh">
        <AiChatDemo />
      </TemplateShell>
    `,
  }),
}
