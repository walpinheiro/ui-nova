import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VAgentChip from './VAgentChip.vue'

const meta = {
  title: 'feedback/VAgentChip',
  component: VAgentChip,
  args: {
    label: 'search_docs',
    status: 'pending',
    durationMs: 0,
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof VAgentChip>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Pending**. Props: `label="search_docs"`, `status="pending"`.' } },
  },
  args: {
    label: 'search_docs',
    status: 'pending',
  },
}

export const Success: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sucesso**. Props: `label="search_docs"`, `status="success"`, `durationMs=1240`.' } },
  },
  args: {
    label: 'search_docs',
    status: 'success',
    durationMs: 1240,
  },
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Erro**. Props: `label="fetch_metrics"`, `status="error"`, `durationMs=890`.' } },
  },
  args: {
    label: 'fetch_metrics',
    status: 'error',
    durationMs: 890,
  },
}

export const ToolSequence: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tool Sequence**.' } },
  },
  render: () => ({
    components: { VAgentChip },
    template: `
      <div style="display:flex;flex-direction:column;gap:10px;min-width:280px">
        <VAgentChip label="search_docs" status="success" :duration-ms="1240" />
        <VAgentChip label="rank_results" status="success" :duration-ms="640" />
        <VAgentChip label="fetch_metrics" status="pending" />
      </div>
    `,
  }),
}
