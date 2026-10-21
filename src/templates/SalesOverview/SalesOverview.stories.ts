import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SalesOverview from './SalesOverview.vue'

const meta = {
  title: 'Templates/Sales Overview',
  component: SalesOverview,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SalesOverview>

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {}
