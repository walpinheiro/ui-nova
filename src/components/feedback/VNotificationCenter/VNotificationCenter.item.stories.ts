import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VNotificationItem from '../VNotificationItem/VNotificationItem.vue'

const meta = {
  parameters: {
    docs: {
      description: {
        component: [
          'Linha individual de notificação (`VNotificationItem`), usada dentro do `VNotificationCenter` mas também isolada: variantes `avatar`, `system`, `success`, `actionable` e `default`, com indicador de não-lida, tempo, pré-visualização e ações.',
          '',
          '```vue',
          '<VNotificationItem variant="avatar" title="Sarah Chen mentioned you" preview="@john take a look…" time="2m ago" unread />',
          '```',
        ].join('\n'),
      },
    },
  },
  title: 'feedback/VNotificationCenter/Item',
  component: VNotificationItem,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'avatar',
    title: 'Sarah Chen mentioned you',
    preview: '@john take a look at this design when you have a moment.',
    time: '2m ago',
    unread: true,
  },
  decorators: [
    () => ({
      template: '<div style="max-width: 420px; padding: 24px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VNotificationItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const SystemAlert: Story = { parameters: { docs: { description: { story: 'Variação **System Alert**. Props: `variant="system"`, `unread=false`.' } } }, args: { variant: 'system', unread: false } }

export const Actionable: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Actionable**. Props: `variant="actionable"`, `title="Connect Notion"`.' } },
  },
  args: {
    variant: 'actionable',
    title: 'Connect Notion',
    actions: [{ label: 'Set up', key: 'setup', variant: 'primary' }],
  },
}

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }
