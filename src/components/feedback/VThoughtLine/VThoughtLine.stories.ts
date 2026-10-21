import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VThoughtLine from './VThoughtLine.vue'

const meta = {
  title: 'feedback/VThoughtLine',
  component: VThoughtLine,
  args: {
    label: 'Reasoning',
    steps: () => [],
    duration: 0,
    defaultExpanded: false,
  },
  decorators: [
    () => ({
      template: '<div style="width:min(420px,100%);padding:8px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VThoughtLine>

export default meta
type Story = StoryObj<typeof meta>

export const Thinking: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Thinking**. Props: `label="Reasoning"`.' } },
  },
  args: {
    label: 'Reasoning',
    steps: [
      { id: 'scan', label: 'Scanning documentation' },
      { id: 'rank', label: 'Ranking candidate answers' },
    ],
  },
}

export const Complete: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Complete**. Props: `label="Reasoning"`, `duration=3600`.' } },
  },
  args: {
    label: 'Reasoning',
    duration: 3600,
    steps: [
      { id: 'scan', label: 'Scanning documentation' },
      { id: 'rank', label: 'Ranking candidate answers' },
      { id: 'draft', label: 'Drafting response outline' },
    ],
  },
}

export const Expanded: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Expandido**. Props: `label="Reasoning"`, `defaultExpanded=true`.' } },
  },
  args: {
    label: 'Reasoning',
    defaultExpanded: true,
    steps: [
      { id: 'scan', label: 'Scanning documentation' },
      { id: 'rank', label: 'Ranking candidate answers' },
    ],
  },
}

export const CollapsedTrace: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Recolhido Trace**. Props: `label="Reasoning"`, `duration=2100`.' } },
  },
  args: {
    label: 'Reasoning',
    duration: 2100,
    steps: [{ id: 'only', label: 'Validated release notes against changelog' }],
  },
}
