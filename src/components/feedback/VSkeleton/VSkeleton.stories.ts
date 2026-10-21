import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VSkeleton from './VSkeleton.vue'

const meta = {
  title: 'feedback/VSkeleton',
  component: VSkeleton,
  args: { size: 'md', variant: 'text', lines: 3, animated: true },
} satisfies Meta<typeof VSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}
export const Avatar: Story = { parameters: { docs: { description: { story: 'Variação **Avatar**. Props: `variant="avatar"`.' } } }, args: { variant: 'avatar' } }
export const Card: Story = { parameters: { docs: { description: { story: 'Variação **Card**. Props: `variant="card"`.' } } }, args: { variant: 'card' } }
export const TableRow: Story = { parameters: { docs: { description: { story: 'Variação **Table Row**. Props: `variant="table-row"`.' } } }, args: { variant: 'table-row' } }
export const Chart: Story = { parameters: { docs: { description: { story: 'Variação **Chart**. Props: `variant="chart"`.' } } }, args: { variant: 'chart' } }
export const Paused: Story = { parameters: { docs: { description: { story: 'Variação **Paused**. Props: `paused=true`.' } } }, args: { paused: true } }
export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }
