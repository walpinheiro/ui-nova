import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VPanel from './VPanel.vue'

const meta = {
  title: 'containment/VPanel',
  component: VPanel,
  args: { size: 'md', variant: 'default' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'bordered', 'elevated', 'filled'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof VPanel>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `title="Panel Title"`, `description="Brief description of the pa…"`.' } },
  },
  args: { title: 'Panel Title', description: 'Brief description of the panel.' },
  render: (args) => ({
    components: { VPanel },
    setup: () => ({ args }),
    template: `<VPanel v-bind="args"><p>Panel content goes here.</p></VPanel>`,
  }),
}

export const Bordered: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Bordered**. Props: `variant="bordered"`, `title="Panel Title"`, `description="Subtle border for separatio…"`.' } },
  },
  args: { variant: 'bordered', title: 'Panel Title', description: 'Subtle border for separation.' },
  render: (args) => ({
    components: { VPanel },
    setup: () => ({ args }),
    template: `<VPanel v-bind="args"><p>Content.</p></VPanel>`,
  }),
}

export const Elevated: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Elevated**. Props: `variant="elevated"`, `title="Panel Title"`, `description="Raised surface with shadow."`.' } },
  },
  args: { variant: 'elevated', title: 'Panel Title', description: 'Raised surface with shadow.' },
  render: (args) => ({
    components: { VPanel },
    setup: () => ({ args }),
    template: `<VPanel v-bind="args"><p>Content.</p></VPanel>`,
  }),
}

export const Filled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Preenchido**. Props: `variant="filled"`, `title="Panel Title"`, `description="Subtle background tint."`.' } },
  },
  args: { variant: 'filled', title: 'Panel Title', description: 'Subtle background tint.' },
  render: (args) => ({
    components: { VPanel },
    setup: () => ({ args }),
    template: `<VPanel v-bind="args"><p>Content.</p></VPanel>`,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VPanel },
    template: `
      <div style="display:flex;gap:16px;align-items:flex-start">
        <VPanel size="sm" title="Small"><p>Compact content.</p></VPanel>
        <VPanel size="md" title="Medium"><p>Everyday use.</p></VPanel>
        <VPanel size="lg" title="Large"><p>Content-heavy sections.</p></VPanel>
      </div>`,
  }),
}

export const WithActions: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com ações**. Props: `title="Project Overview"`, `description="Key information about your …"`. Slots usados: `#actions`, `#footer`.' } },
  },
  args: { title: 'Project Overview', description: 'Key information about your project.' },
  render: (args) => ({
    components: { VPanel },
    setup: () => ({ args }),
    template: `
      <VPanel v-bind="args">
        <template #actions><button>•••</button></template>
        <p>Panel content goes here.</p>
        <template #footer><button>Cancel</button><button>Save changes</button></template>
      </VPanel>`,
  }),
}

export const Interactive: Story = { parameters: { docs: { description: { story: 'Variação **Interativo**. Props: `interactive=true`, `title="Focusable panel"`.' } } }, args: { interactive: true, title: 'Focusable panel' } }

export const HeadingLevel3: Story = { parameters: { docs: { description: { story: 'Variação **Heading Level3**. Props: `headingLevel="3"`, `title="Painel com h3"`, `description="Use `headingLevel` para man…"`.' } } }, args: { headingLevel: '3', title: 'Painel com h3', description: 'Use `headingLevel` para manter a hierarquia de títulos da página.' } }

export const ControlledOpen: Story = {
  parameters: { docs: { description: { story: 'Visibilidade controlada com `v-model:open`.' } } },
  render: (args) => ({
    components: { VPanel },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: '<div style="display:grid;gap:12px"><VPanel v-bind="args" v-model:open="open" title="Painel controlado">Conteúdo</VPanel><button type="button" @click="open = !open">Alternar (open = {{ open }})</button></div>',
  }),
}
