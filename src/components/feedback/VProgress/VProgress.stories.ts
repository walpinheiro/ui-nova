import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VProgress from './VProgress.vue'

const meta = {
  title: 'feedback/VProgress',
  component: VProgress,
  args: {
    variant: 'linear',
    size: 'md',
    value: 72,
    state: 'determinate',
    label: true,
  },
  decorators: [
    () => ({
      template: '<div style="width: 320px; padding: 16px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Linear: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Linear**.' } },
  },
}

export const Circular: Story = { parameters: { docs: { description: { story: 'Variação **Circular**. Props: `variant="circular"`.' } } }, args: { variant: 'circular' } }

export const CircularSmall: Story = { parameters: { docs: { description: { story: 'Variação **Circular pequeno**. Props: `variant="circular"`, `size="sm"`.' } } }, args: { variant: 'circular', size: 'sm' } }

export const CircularLarge: Story = { parameters: { docs: { description: { story: 'Variação **Circular grande**. Props: `variant="circular"`, `size="lg"`.' } } }, args: { variant: 'circular', size: 'lg' } }

export const Indeterminate: Story = { parameters: { docs: { description: { story: 'Variação **Indeterminado**. Props: `state="indeterminate"`, `label=false`.' } } }, args: { state: 'indeterminate', label: false } }

export const Success: Story = { parameters: { docs: { description: { story: 'Variação **Sucesso**. Props: `state="success"`.' } } }, args: { state: 'success' } }

export const Error: Story = { parameters: { docs: { description: { story: 'Variação **Erro**. Props: `state="error"`, `value=72`.' } } }, args: { state: 'error', value: 72 } }

export const Small: Story = { parameters: { docs: { description: { story: 'Variação **Pequeno**. Props: `size="sm"`.' } } }, args: { size: 'sm' } }

export const Large: Story = { parameters: { docs: { description: { story: 'Variação **Grande**. Props: `size="lg"`.' } } }, args: { size: 'lg' } }
