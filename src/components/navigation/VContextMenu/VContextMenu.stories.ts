import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VContextMenu from './VContextMenu.vue'
import { DEFAULT_CONTEXT_MENU_ITEMS } from './mountVContextMenu'

const meta = {
  title: 'navigation/VContextMenu',
  component: VContextMenu,
  args: {
    size: 'md',
    items: DEFAULT_CONTEXT_MENU_ITEMS,
  },
} satisfies Meta<typeof VContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  render: (args) => ({
    components: { VContextMenu },
    setup() {
      return { args }
    },
    template: `
      <VContextMenu v-bind="args">
        <div style="padding: 48px; border: 1px dashed #cbd5e1; border-radius: 8px; user-select: none;">
          Clique com o botão direito aqui
        </div>
      </VContextMenu>
    `,
  }),
}

export const WithIcons: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com ícones**.' } },
  },
  args: {
    items: [
      { value: 'view', label: 'View details', icon: 'eye' },
      { value: 'edit', label: 'Edit', icon: 'edit' },
      { value: 'share', label: 'Share', icon: 'share' },
      { value: 'divider', label: '', divider: true },
      { value: 'delete', label: 'Delete', icon: 'trash', destructive: true },
    ],
  },
  render: Default.render,
}

export const Nested: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Aninhado**.' } },
  },
  args: { items: DEFAULT_CONTEXT_MENU_ITEMS },
  render: Default.render,
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } },
  },
  args: { disabled: true },
  render: Default.render,
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } },
  },
  args: { loading: true },
  render: Default.render,
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: (args) => ({
    components: { VContextMenu },
    setup() {
      const open = ref(false)
      const x = ref(0)
      const y = ref(0)
      const lastAction = ref('—')
      const onSelect = (value: string) => {
        lastAction.value = `Selected: ${value}`
      }
      const openProgrammatically = () => {
        x.value = 120
        y.value = 120
        open.value = true
      }
      return { args, open, x, y, lastAction, onSelect, openProgrammatically }
    },
    template: `
      <div style="display: grid; gap: 16px;">
        <button type="button" @click="openProgrammatically">Abrir menu programaticamente</button>
        <p>Última ação: {{ lastAction }}</p>
        <VContextMenu
          v-bind="args"
          v-model="open"
          :x="x"
          :y="y"
          @select="onSelect"
        >
          <div style="padding: 48px; border: 1px dashed #cbd5e1; border-radius: 8px;">
            Área com clique direito ou use o botão acima
          </div>
        </VContextMenu>
      </div>
    `,
  }),
}
