import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VCommandItem from './VCommandItem.vue'

const meta = {
  title: 'navigation/VCommandItem',
  component: VCommandItem,
  args: {
    id: 'open-settings',
    label: 'Open settings',
    icon: 'settings',
    shortcut: '⌘,',
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'primary', 'subtle'] },
  },
} satisfies Meta<typeof VCommandItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Selected: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Selected**. Props: `selected=true`.' } },
  },
  args: { selected: true },
}

export const WithoutShortcut: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sem Shortcut**. Props: `label="View documentation"`, `icon="document"`.' } },
  },
  args: { label: 'View documentation', icon: 'document', shortcut: undefined },
}

export const WithoutIcon: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sem ícone**. Props: `label="Plain command"`, `shortcut="↵"`.' } },
  },
  args: { label: 'Plain command', icon: undefined, shortcut: '↵' },
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

export const PaletteList: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Palette List**.' } },
  },
  render: () => ({
    components: { VCommandItem },
    template: `
      <div role="listbox" style="width:360px;padding:8px;border:1px solid var(--v-color-border);border-radius:12px;background:var(--v-color-surface);">
        <VCommandItem id="settings" label="Open settings" icon="settings" shortcut="⌘," selected />
        <VCommandItem id="docs" label="View documentation" icon="document" shortcut="⌘D" />
        <VCommandItem id="home" label="Go to dashboard" icon="home" shortcut="⌘H" />
        <VCommandItem id="disabled" label="Disabled action" icon="moon" disabled />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VCommandItem },
    template: `
      <div style="display:flex;flex-direction:column;gap:4px;width:360px;">
        <VCommandItem size="sm" label="Small command" icon="search" shortcut="⌘K" />
        <VCommandItem size="md" label="Medium command" icon="search" shortcut="⌘K" selected />
        <VCommandItem size="lg" label="Large command" icon="search" shortcut="⌘K" />
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VCommandItem },
    template: `
      <div style="display:flex;flex-direction:column;gap:4px;width:360px;">
        <VCommandItem variant="default" label="Default item" icon="bolt" shortcut="⌘1" />
        <VCommandItem variant="primary" label="Primary accent" icon="plus" shortcut="⌘2" selected />
        <VCommandItem variant="subtle" label="Subtle item" icon="clock" shortcut="⌘3" />
      </div>
    `,
  }),
}
