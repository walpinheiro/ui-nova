import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VBadge from '../../feedback/VBadge/VBadge.vue'
import { VIcon } from '../VIcon'
import { V_TAG_PLUS_ICON } from './mountVTag'
import VTag from './VTag.vue'

const meta = {
  title: 'primitives/VTag',
  component: VTag,
  args: { size: 'md', variant: 'default' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    variant: { control: 'select', options: ['default', 'outline', 'overlay', 'soft'] },
    interactive: { control: 'boolean' },
    removable: { control: 'boolean' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof VTag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  render: (args) => ({
    components: { VTag },
    setup: () => ({ args }),
    template: '<VTag v-bind="args">Filter</VTag>',
  }),
}

export const Action: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Action**. Slots usados: `#icon`.' } },
  },
  render: () => ({
    components: { VTag, VIcon },
    setup: () => ({ V_TAG_PLUS_ICON }),
    template: `
      <VTag>
        <template #icon><VIcon :icon="V_TAG_PLUS_ICON" size="sm" /></template>
        Add Goals
      </VTag>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**. Slots usados: `#icon`.' } },
  },
  render: () => ({
    components: { VTag, VIcon },
    setup: () => ({ V_TAG_PLUS_ICON }),
    template: `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <VTag variant="default">
          <template #icon><VIcon :icon="V_TAG_PLUS_ICON" size="sm" /></template>
          Add Goals
        </VTag>
        <VTag variant="outline">Filter</VTag>
        <VTag variant="overlay" :interactive="false">Product</VTag>
        <VTag variant="soft" removable>Design</VTag>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VTag },
    template: `
      <div style="display:flex;align-items:center;gap:12px">
        <VTag size="sm">Small</VTag>
        <VTag size="md">Medium</VTag>
      </div>
    `,
  }),
}

export const Removable: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Removable**.' } },
  },
  render: () => ({
    components: { VTag },
    template: '<VTag removable variant="soft">Design</VTag>',
  }),
}

export const Overlay: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Overlay**.' } },
  },
  render: () => ({
    components: { VTag },
    template: '<VTag variant="overlay" :interactive="false">Product</VTag>',
  }),
}

export const Selected: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Selected**. Props: `selected=true`, `interactive=true`.' } },
  },
  args: { selected: true, interactive: true },
  render: (args) => ({
    components: { VTag },
    setup: () => ({ args }),
    template: '<VTag v-bind="args">Selected</VTag>',
  }),
}

export const VsBadge: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Vs badge**. Slots usados: `#icon`.' } },
  },
  name: 'Tag vs Badge',
  render: () => ({
    components: { VTag, VBadge, VIcon },
    setup: () => ({ V_TAG_PLUS_ICON }),
    template: `
      <div style="display:grid;gap:16px">
        <div>
          <div style="font-size:12px;color:var(--v-color-text-muted);margin-bottom:8px">Tag — ação / token</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <VTag>
              <template #icon><VIcon :icon="V_TAG_PLUS_ICON" size="sm" /></template>
              Add Goals
            </VTag>
            <VTag variant="overlay" :interactive="false">Product</VTag>
            <VTag variant="soft" removable>Design</VTag>
          </div>
        </div>
        <div>
          <div style="font-size:12px;color:var(--v-color-text-muted);margin-bottom:8px">Badge — status / contagem</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <VBadge variant="success" size="sm" icon="check">Ready</VBadge>
            <VBadge variant="success" size="sm">Completed</VBadge>
            <VBadge :count="12" />
            <VBadge variant="primary" icon="crown">Pro</VBadge>
          </div>
        </div>
      </div>
    `,
  }),
}
