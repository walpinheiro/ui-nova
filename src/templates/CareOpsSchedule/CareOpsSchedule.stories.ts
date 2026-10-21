import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CareOpsSchedule from './CareOpsSchedule.vue'

const meta = {
  title: 'Templates/CareOps Schedule',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Agenda de home care: `VSidebar` com grupos colapsáveis, itens aninhados e badges, header com busca e uma timeline de visitas por cuidador (`TimelineGrid`, parte local) com scroll horizontal. Light/dark via `data-theme`.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Schedule',
  render: () => ({ components: { CareOpsSchedule }, template: '<CareOpsSchedule />' }),
}
