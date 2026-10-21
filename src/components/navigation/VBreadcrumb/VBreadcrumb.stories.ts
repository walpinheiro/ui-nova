import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VBreadcrumb from './VBreadcrumb.vue'
import { DEFAULT_BREADCRUMB_ITEMS, ICON_BREADCRUMB_ITEMS } from './mountVBreadcrumb'

const meta = {
  title: 'navigation/VBreadcrumb',
  component: VBreadcrumb,
  args: {
    size: 'md',
    variant: 'default',
    items: DEFAULT_BREADCRUMB_ITEMS,
  },
} satisfies Meta<typeof VBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Compact: Story = { parameters: { docs: { description: { story: 'Variação **Compact**. Props: `variant="compact"`.' } } }, args: { variant: 'compact' } }

export const WithIcons: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com ícones**. Props: `variant="icons"`.' } },
  },
  args: { variant: 'icons', items: ICON_BREADCRUMB_ITEMS },
}

export const Overflow: Story = { parameters: { docs: { description: { story: 'Variação **Overflow**. Props: `variant="overflow"`.' } } }, args: { variant: 'overflow' } }

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VBreadcrumb },
    setup: () => ({ items: DEFAULT_BREADCRUMB_ITEMS }),
    template: `
      <div style="display:grid;gap:16px;">
        <VBreadcrumb data-test-id="docs-breadcrumb-size-sm" size="sm" :items="items" />
        <VBreadcrumb data-test-id="docs-breadcrumb-size-md" size="md" :items="items" />
        <VBreadcrumb data-test-id="docs-breadcrumb-size-lg" size="lg" :items="items" />
      </div>
    `,
  }),
}

export const CustomSeparator: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Personalizado Separator**. Slots usados: `#separator`.' } },
  },
  render: (args) => ({
    components: { VBreadcrumb },
    setup: () => ({ args }),
    template: `
      <VBreadcrumb v-bind="args">
        <template #separator><span>/</span></template>
      </VBreadcrumb>
    `,
  }),
}

export const MaxItems: Story = { parameters: { docs: { description: { story: 'Variação **Max itens**. Props: `variant="overflow"`, `maxItems=3`.' } } }, args: { variant: 'overflow', maxItems: 3 } }
