import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VBadge from './VBadge.vue'

const meta = {
  title: 'feedback/VBadge',
  component: VBadge,
  args: { size: 'md', variant: 'neutral' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['neutral', 'success', 'warning', 'danger', 'count', 'dot', 'outlined', 'primary', 'purple'] },
    interactive: { control: 'boolean' },
    removable: { control: 'boolean' },
    selected: { control: 'boolean' },
    count: { control: 'text' },
    icon: { control: 'text' },
  },
} satisfies Meta<typeof VBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `variant="neutral"`.' } },
  },
  args: { variant: 'neutral' },
  render: (args) => ({ components: { VBadge }, setup: () => ({ args }), template: '<VBadge v-bind="args">New</VBadge>' }),
}

export const Hero: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Hero**.' } },
  },
  render: () => ({
    components: { VBadge },
    template: `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <VBadge dataTestId="badge-status-new">New</VBadge>
        <VBadge dataTestId="badge-status-beta" variant="purple">Beta</VBadge>
        <VBadge dataTestId="badge-status-active" variant="success">Active</VBadge>
        <VBadge dataTestId="badge-status-warning" variant="warning">Warning</VBadge>
        <VBadge dataTestId="badge-status-count" :count="12" />
        <VBadge dataTestId="badge-status-online" dot>Online</VBadge>
        <VBadge dataTestId="badge-status-pro" variant="primary" icon="crown">Pro</VBadge>
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VBadge },
    template: `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <VBadge variant="neutral">Badge</VBadge>
        <VBadge variant="success">Success</VBadge>
        <VBadge variant="warning">Warning</VBadge>
        <VBadge variant="danger">Danger</VBadge>
        <VBadge :count="12" />
        <VBadge variant="dot">Online</VBadge>
        <VBadge variant="outlined">Outlined</VBadge>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VBadge },
    template: `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <VBadge size="xs">XS</VBadge>
        <VBadge size="sm">SM</VBadge>
        <VBadge size="md">Medium</VBadge>
        <VBadge size="lg">Large</VBadge>
      </div>
    `,
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**.' } },
  },
  render: () => ({
    components: { VBadge },
    template: `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <VBadge interactive>Default</VBadge>
        <VBadge interactive selected>Selected</VBadge>
      </div>
    `,
  }),
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Props: `interactive=true`, `ariaLabel="Toggle new status"`.' } },
  },
  args: { interactive: true, ariaLabel: 'Toggle new status' },
  render: (args) => ({ components: { VBadge }, setup: () => ({ args }), template: '<VBadge v-bind="args">New</VBadge>' }),
}

export const Removable: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Removable**.' } },
  },
  render: () => ({
    components: { VBadge },
    template: `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <VBadge removable removeLabel="Remove Design">Design</VBadge>
        <VBadge removable variant="success" removeLabel="Remove Active">Active</VBadge>
        <VBadge removable variant="warning" removeLabel="Remove Warning">Warning</VBadge>
        <VBadge removable variant="danger" removeLabel="Remove Critical">Critical</VBadge>
      </div>
    `,
  }),
}

export const Count: Story = { parameters: { docs: { description: { story: 'Variação **Count**. Props: `count=12`.' } } }, args: { count: 12 } }
export const Dot: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ponto**. Props: `dot=true`.' } },
  },
  args: { dot: true },
  render: (args) => ({ components: { VBadge }, setup: () => ({ args }), template: '<VBadge v-bind="args">Online</VBadge>' }),
}
export const Primary: Story = { parameters: { docs: { description: { story: 'Variação **Primária**. Props: `variant="primary"`, `icon="crown"`.' } } }, args: { variant: 'primary', icon: 'crown' } }
export const Outlined: Story = { parameters: { docs: { description: { story: 'Variação **Outlined**. Props: `variant="outlined"`.' } } }, args: { variant: 'outlined' } }

export const DotTones: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ponto tons**.' } },
  },
  render: () => ({
    components: { VBadge },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        <VBadge dot variant="success">Online</VBadge>
        <VBadge dot variant="danger">Failed</VBadge>
        <VBadge dot variant="warning">Pending</VBadge>
        <VBadge dot variant="primary">Active</VBadge>
        <VBadge dot variant="neutral">Idle</VBadge>
        <VBadge dot variant="neutral" dotColor="#8b5cf6">Custom color</VBadge>
      </div>
    `,
  }),
}

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }

export const Live: Story = { parameters: { docs: { description: { story: 'Variação **Live**. Props: `live=true`, `count=3`.' } } }, args: { live: true, count: 3 } }

export const Leaving: Story = { parameters: { docs: { description: { story: 'Variação **Leaving**. Props: `removable=true`, `leaving=true`.' } } }, args: { removable: true, leaving: true } }
