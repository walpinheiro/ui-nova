import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VSearchField from './VSearchField.vue'

const suggestions = [
  { value: 'vue', label: 'vue', category: 'Search suggestion' },
  { value: 'Vue components', label: 'Vue components', category: 'Documentation' },
  { value: 'vue-router', label: 'vue-router', category: 'Package' },
  { value: 'Vue CLI', label: 'Vue CLI', category: 'Command' },
]

const meta = {
  title: 'form/VSearchField',
  component: VSearchField,
  args: {
    size: 'md',
    placeholder: 'Search products, docs, or anything...',
    clearable: true,
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:480px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VSearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `label="Search"`, `placeholder="Search for anything..."`.' } },
  },
  args: {
    label: 'Search',
    placeholder: 'Search for anything...',
  },
}

export const WithShortcut: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Shortcut**. Props: `variant="shortcut"`, `shortcut=true`, `placeholder="Search or jump to..."`.' } },
  },
  args: {
    variant: 'shortcut',
    shortcut: true,
    placeholder: 'Search or jump to...',
  },
}

export const Command: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Command**. Props: `variant="command"`, `shortcut=true`, `placeholder="Type a command or search..."`.' } },
  },
  args: {
    variant: 'command',
    shortcut: true,
    placeholder: 'Type a command or search...',
  },
}

export const WithSuggestions: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Suggestions**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VSearchField },
    setup() {
      const query = ref('Vue')
      return { query, suggestions }
    },
    template: `
      <VSearchField
        v-model="query"
        label="Search"
        placeholder="Search products, docs, or anything..."
        :suggestions="suggestions"
      />
    `,
  }),
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `label="Search"`, `modelValue="Vue"`, `loading=true`, `placeholder="Searching..."`.' } },
  },
  args: {
    label: 'Search',
    modelValue: 'Vue',
    loading: true,
    placeholder: 'Searching...',
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `label="Search"`, `placeholder="Search for anything..."`, `disabled=true`.' } },
  },
  args: {
    label: 'Search',
    placeholder: 'Search for anything...',
    disabled: true,
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VSearchField },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:480px">
        <VSearchField size="sm" label="Small" placeholder="Search..." />
        <VSearchField size="md" label="Medium" placeholder="Search..." />
        <VSearchField size="lg" label="Large" placeholder="Search..." />
      </div>
    `,
  }),
}

export const CustomShortcutKeys: Story = { parameters: { docs: { description: { story: 'Variação **Personalizado Shortcut Keys**. Props: `variant="shortcut"`, `shortcut=true`, `shortcutKeys="Ctrl K"`.' } } }, args: { variant: 'shortcut', shortcut: true, shortcutKeys: 'Ctrl K' } }
