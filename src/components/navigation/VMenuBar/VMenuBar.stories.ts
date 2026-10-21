import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VMenuBar from './VMenuBar.vue'
import { DEFAULT_MENU_BAR_ITEMS } from './mountVMenuBar'

const meta = {
  title: 'navigation/VMenuBar',
  component: VMenuBar,
  args: {
    size: 'md',
    variant: 'default',
    items: DEFAULT_MENU_BAR_ITEMS,
    ariaLabel: 'Application menu',
  },
} satisfies Meta<typeof VMenuBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const WithShortcuts: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Shortcuts**.' } },
  },
  args: {
    items: DEFAULT_MENU_BAR_ITEMS,
  },
}

export const Subtle: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Subtle**. Props: `variant="subtle"`.' } },
  },
  args: { variant: 'subtle' },
}

export const Small: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Pequeno**. Props: `size="sm"`.' } },
  },
  args: { size: 'sm' },
}

export const Large: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Grande**. Props: `size="lg"`.' } },
  },
  args: { size: 'lg' },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } },
  },
  args: { disabled: true },
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } },
  },
  args: { loading: true },
}

export const HoverOpen: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Hover aberto**. Props: `openOnHover=true`.' } },
  },
  args: { openOnHover: true },
}

export const OpenOnHover: Story = { parameters: { docs: { description: { story: 'Variação **Aberto em hover**. Props: `openOnHover=true`, `hoverDelay=150`.' } } }, args: { openOnHover: true, hoverDelay: 150 } }
