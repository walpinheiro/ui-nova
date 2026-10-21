import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VNotificationCenter from './VNotificationCenter.vue'

const notifications = [
  {
    id: '1',
    title: 'Design file shared with you',
    preview: 'Sarah shared "Landing Page v2.fig" with you.',
    time: '2m ago',
    unread: true,
    group: 'Today',
    tab: 'mentions' as const,
  },
  {
    id: '2',
    title: 'Build completed',
    preview: 'Deploy preview is ready for review.',
    time: '5h ago',
    unread: false,
    group: 'Yesterday',
    tab: 'updates' as const,
  },
]

const meta = {
  title: 'feedback/VNotificationCenter',
  component: VNotificationCenter,
  args: { size: 'md', variant: 'default', notifications },
  decorators: [
    () => ({
      template: '<div style="min-height: 420px; padding: 24px; display:flex; align-items:flex-start; justify-content:flex-end;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VNotificationCenter>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Grouped: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Grouped**. Props: `variant="grouped"`.' } },
  },
  args: { variant: 'grouped' },
}

export const Feed: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Feed**. Props: `variant="feed"`.' } },
  },
  args: { variant: 'feed' },
  decorators: [
    () => ({
      template: '<div style="max-width: 420px; padding: 24px;"><story /></div>',
    }),
  ],
}

export const OpenByDefault: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Aberto por padrão**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: (args) => ({
    components: { VNotificationCenter },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: '<VNotificationCenter v-bind="args" v-model="open" variant="grouped" />',
  }),
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`, `variant="grouped"`. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  args: { loading: true, variant: 'grouped' },
  render: (args) => ({
    components: { VNotificationCenter },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: '<VNotificationCenter v-bind="args" v-model="open" />',
  }),
}
