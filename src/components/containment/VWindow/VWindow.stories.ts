import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VWindow from './VWindow.vue'

const meta = {
  title: 'containment/VWindow',
  component: VWindow,
  args: { size: 'md', variant: 'default', title: 'Project Notes', active: true, resizable: true, width: 960, height: 640 },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'minimal', 'borderless', 'modal'] },
    width: { control: 'number' },
    height: { control: 'number' },
  },
} satisfies Meta<typeof VWindow>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}
export const ProjectNotes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Project Notes**. Props: `title="Project Notes"`, `active=true`, `resizable=true`, `width=960`, `height=640`.' } },
  },
  args: { title: 'Project Notes', active: true, resizable: true, width: 960, height: 640 },
}
export const Minimal: Story = { parameters: { docs: { description: { story: 'Variação **Minimal**. Props: `variant="minimal"`.' } } }, args: { variant: 'minimal' } }
export const Borderless: Story = { parameters: { docs: { description: { story: 'Variação **Borderless**. Props: `variant="borderless"`.' } } }, args: { variant: 'borderless' } }
export const Modal: Story = { parameters: { docs: { description: { story: 'Variação **Modal**. Props: `variant="modal"`.' } } }, args: { variant: 'modal' } }
export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: (args) => ({
    components: { VWindow },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; gap: 16px;">
        <VWindow v-bind="args" size="sm" title="Small — 640 × 480" :width="640" :height="480" />
        <VWindow v-bind="args" size="md" title="Medium (default) — 960 × 640" :width="960" :height="640" />
        <VWindow v-bind="args" size="lg" title="Large — 1280 × 800" :width="1280" :height="800" />
      </div>
    `,
  }),
}
export const Active: Story = { parameters: { docs: { description: { story: 'Variação **Ativo**. Props: `active=true`.' } } }, args: { active: true } }
export const Inactive: Story = { parameters: { docs: { description: { story: 'Variação **Inactive**. Props: `active=false`.' } } }, args: { active: false } }
export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }
export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }
export const WithSidebar: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Sidebar**. Props: `title="Project Notes"`, `active=true`, `resizable=true`.' } },
  },
  args: { title: 'Project Notes', active: true, resizable: true },
}
export const ModalDismiss: Story = { parameters: { docs: { description: { story: 'Variação **Modal Dismiss**. Props: `variant="modal"`, `title="Project Notes"`.' } } }, args: { variant: 'modal', title: 'Project Notes' } }

export const NoActions: Story = { parameters: { docs: { description: { story: 'Variação **Sem ações**. Props: `showActions=false`.' } } }, args: { showActions: false } }

export const NoTrafficLights: Story = { parameters: { docs: { description: { story: 'Variação **Sem Traffic Lights**. Props: `showTrafficLights=false`.' } } }, args: { showTrafficLights: false } }

export const NoAppIcon: Story = { parameters: { docs: { description: { story: 'Variação **Sem App ícone**. Props: `showAppIcon=false`.' } } }, args: { showAppIcon: false } }

export const NoMinimize: Story = { parameters: { docs: { description: { story: 'Variação **Sem Minimize**. Props: `showMinimize=false`.' } } }, args: { showMinimize: false } }

export const NoSidebar: Story = { parameters: { docs: { description: { story: 'Variação **Sem Sidebar**. Props: `showSidebar=false`.' } } }, args: { showSidebar: false } }

export const ControlledOpen: Story = {
  parameters: { docs: { description: { story: 'Visibilidade controlada com `v-model`: o botão fechar da janela atualiza o `ref`.' } } },
  render: (args) => ({
    components: { VWindow },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: '<div style="display:grid;gap:12px"><VWindow v-bind="args" v-model="open">Conteúdo da janela</VWindow><button type="button" @click="open = true">Reabrir (open = {{ open }})</button></div>',
  }),
}
