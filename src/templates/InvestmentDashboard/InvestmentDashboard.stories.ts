import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InvestmentDashboard from './InvestmentDashboard.vue'

const meta = {
  title: 'Templates/Investment Dashboard',
  component: InvestmentDashboard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof InvestmentDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {}
