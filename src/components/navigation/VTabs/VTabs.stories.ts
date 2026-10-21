import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VTabs from './VTabs.vue'

const overviewItems = [
  { value: 'overview', label: 'Overview', icon: 'home' },
  { value: 'features', label: 'Features' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'faq', label: 'FAQ' },
]

const meta = {
  title: 'navigation/VTabs',
  component: VTabs,
  args: {
    size: 'md',
    variant: 'underline',
    items: overviewItems,
  },
} satisfies Meta<typeof VTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Underline: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Underline**.' } },
  },
}
export const Pill: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Pill**. Props: `variant="pill"`.' } },
  },
  args: {
    variant: 'pill',
    items: [
      { value: 'general', label: 'General' },
      { value: 'team', label: 'Team' },
      { value: 'billing', label: 'Billing' },
      { value: 'integrations', label: 'Integrations' },
    ],
  },
}
export const Icon: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ícone**. Props: `variant="icon"`.' } },
  },
  args: {
    variant: 'icon',
    items: [
      { value: 'home', label: 'Home', icon: 'home' },
      { value: 'analytics', label: 'Analytics', icon: 'analytics' },
      { value: 'settings', label: 'Settings', icon: 'settings' },
      { value: 'security', label: 'Security', icon: 'security' },
    ],
  },
}
export const Small: Story = { parameters: { docs: { description: { story: 'Variação **Pequeno**. Props: `size="sm"`.' } } }, args: { size: 'sm' } }
export const Large: Story = { parameters: { docs: { description: { story: 'Variação **Grande**. Props: `size="lg"`.' } } }, args: { size: 'lg' } }
export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } },
  },
  args: {
    disabled: true,
    items: [
      { value: 'overview', label: 'Overview' },
      { value: 'features', label: 'Features', disabled: true },
    ],
  },
}

export const NavigationWithActions: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Navegação com ações**. Props: `variant="underline"`, `panels=false`, `modelValue="overview"`. Slots usados: `#actions`.' } },
  },
  args: {
    variant: 'underline',
    panels: false,
    items: [
      { value: 'overview', label: 'Overview' },
      { value: 'holdings', label: 'Holdings' },
      { value: 'activity', label: 'Activity' },
    ],
    modelValue: 'overview',
  },
  render: (args) => ({
    components: { VTabs },
    setup: () => ({ args }),
    template: `
      <VTabs v-bind="args">
        <template #actions>
          <span style="font-size:12px;color:var(--v-color-text-muted)">Updated 2m ago</span>
        </template>
      </VTabs>
    `,
  }),
}

export const Dividers: Story = { parameters: { docs: { description: { story: 'Variação **Dividers**. Props: `dividers=true`.' } } }, args: { dividers: true } }

export const ControlledVModel: Story = {
  parameters: { docs: { description: { story: 'Estado controlado: `v-model` ligado a um `ref` e exibido abaixo; as abas também podem ser trocadas por código.' } } },
  render: (args) => ({
    components: { VTabs },
    setup() {
      const tab = ref('features')
      return { args, tab }
    },
    template: '<div style="display:grid;gap:12px"><VTabs v-bind="args" v-model="tab" /><code>v-model = {{ tab }}</code><button type="button" @click="tab = \'pricing\'">Ir para Pricing</button></div>',
  }),
}
