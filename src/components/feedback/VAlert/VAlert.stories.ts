import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import VButton from '../../form/VButton/VButton.vue'
import { VIcon } from '../../primitives/VIcon'
import VAlert from './VAlert.vue'

const meta = {
  title: 'feedback/VAlert',
  component: VAlert,
  args: {
    variant: 'info',
    size: 'md',
    title: 'New update available',
    description: 'Version 2.4 includes performance improvements and bug fixes.',
    dismissible: true,
  },
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'danger', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    layout: { table: { disable: true } },
  },
  decorators: [() => ({ template: '<div style="max-width:560px"><story /></div>' })],
} satisfies Meta<typeof VAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mensagem **dentro do conteúdo** (formulário, card, seção): ocupa a largura do container, ícone na cor da variante e fundo suave. Para um aviso da página inteira use o `VBanner`.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: { docs: { description: { story: '`info`, `success`, `warning`, `danger` e `neutral`. Título curto e, quando precisa, uma descrição.' } } },
  render: () => ({
    components: { VAlert },
    template: `
      <div style="display:grid;gap:12px">
        <VAlert variant="info" title="New update available" description="Version 2.4 includes performance improvements." />
        <VAlert variant="success" title="Changes saved" description="Your profile is up to date." />
        <VAlert variant="warning" title="Your trial ends in 3 days" description="Add a payment method to keep your projects." />
        <VAlert variant="danger" title="Payment failed" description="We couldn't charge the card ending in 4242." />
        <VAlert variant="neutral" title="Read-only workspace" description="Ask an owner for edit access." />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: { docs: { description: { story: '`sm` (12px, compacto), `md` (14px, padrão) e `lg` (mais respiro).' } } },
  render: () => ({
    components: { VAlert },
    template: `
      <div style="display:grid;gap:12px">
        <VAlert size="sm" title="Small alert" description="Compact density for dense forms and tables." dismissible />
        <VAlert size="md" title="Medium alert" description="Default density for most content." dismissible />
        <VAlert size="lg" title="Large alert" description="More room for prominent, page-section messages." dismissible />
      </div>
    `,
  }),
}

export const TitleOnly: Story = {
  parameters: { docs: { description: { story: 'Só o título, para mensagens de uma linha.' } } },
  args: { variant: 'success', title: 'Your changes have been saved.', description: undefined },
}

export const WithAction: Story = {
  parameters: { docs: { description: { story: 'Slot `#action` com um `VButton` pequeno, alinhado ao centro do alerta.' } } },
  render: (args) => ({
    components: { VAlert, VButton },
    setup: () => ({ args }),
    template: `
      <VAlert v-bind="args" variant="warning" title="Your trial ends in 3 days" description="Add a payment method to keep your projects.">
        <template #action><VButton size="sm" variant="outline">Add payment</VButton></template>
      </VAlert>
    `,
  }),
}

export const CustomIcon: Story = {
  parameters: { docs: { description: { story: 'Slot `#icon` para trocar o ícone padrão da variante.' } } },
  render: (args) => ({
    components: { VAlert, VIcon },
    setup: () => ({ args, sparklesIcon }),
    template: `
      <VAlert v-bind="args" title="AI summaries are on" description="New threads get a summary automatically.">
        <template #icon><VIcon :icon="sparklesIcon" size="sm" /></template>
      </VAlert>
    `,
  }),
}

export const Loading: Story = { parameters: { docs: { description: { story: '`loading=true`: o ícone vira um indicador de progresso.' } } }, args: { loading: true, title: 'Syncing your workspace', description: 'This usually takes a few seconds.' } }
export const Disabled: Story = { parameters: { docs: { description: { story: '`disabled=true`.' } } }, args: { disabled: true } }

export const ControlledVModel: Story = {
  parameters: { docs: { description: { story: 'Visibilidade controlada com `v-model`: fechar o alerta atualiza o `ref`; o botão o reabre.' } } },
  render: () => ({
    components: { VAlert, VButton },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <div style="display:grid;gap:12px;justify-items:start">
        <VAlert v-model="open" dismissible title="Controlled alert" description="Dismiss it and bring it back with the button." />
        <VButton v-if="!open" size="sm" variant="outline" @click="open = true">Show alert again</VButton>
      </div>
    `,
  }),
}
