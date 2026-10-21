import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import moreIcon from '@iconify-icons/keyline-icons/more-horizontal'
import VButton from '../../form/VButton/VButton.vue'
import VTextInput from '../../form/VTextInput/VTextInput.vue'
import VTextarea from '../../form/VTextarea/VTextarea.vue'
import VSwitch from '../../form/VSwitch/VSwitch.vue'
import { VIcon } from '../../primitives/VIcon'
import VSheet from './VSheet.vue'

/**
 * The sheet covers its positioned ancestor inside the Storybook stage, so every story
 * renders inside a fixed-height "screen" to show the overlay and the panel in context.
 */
const SCREEN =
  'position:relative;height:600px;overflow:hidden;border:1px solid var(--v-color-border);border-radius:12px;background:var(--v-color-bg);'

const meta = {
  title: 'containment/VSheet',
  component: VSheet,
  parameters: { layout: 'padded' },
  args: { open: true, side: 'right', size: 'md', title: 'Project settings', description: 'Manage your project details.' },
  argTypes: {
    side: { control: 'select', options: ['right', 'left', 'bottom', 'top'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
  decorators: [() => ({ setup: () => ({ screen: SCREEN }), template: '<div :style="screen"><story /></div>' })],
} satisfies Meta<typeof VSheet>
export default meta
type Story = StoryObj<typeof meta>

const settingsForm = `
  <VTextInput v-model="name" label="Project name" />
  <VTextarea v-model="about" label="Description" placeholder="What is this project about?" />
  <VSwitch v-model="isPublic" label="Visible to everyone in the workspace" />`

const formSetup = () => ({ name: ref('Design System'), about: ref(''), isPublic: ref(true) })

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Painel lateral sobre a página, para editar ou detalhar algo sem sair do contexto. Cabeçalho com título, descrição e fechar; ações principais no `#footer`.',
      },
    },
  },
  render: (args) => ({
    components: { VSheet, VButton, VTextInput, VTextarea, VSwitch },
    setup: () => ({ args, ...formSetup() }),
    template: `
      <VSheet v-bind="args">
        ${settingsForm}
        <template #footer>
          <VButton variant="ghost">Cancel</VButton>
          <VButton>Save changes</VButton>
        </template>
      </VSheet>`,
  }),
}

export const Sides: Story = {
  parameters: { docs: { description: { story: '`side`: `right` (padrão), `left`, `bottom` e `top`. Escolha um lado para abrir.' } } },
  render: () => ({
    components: { VSheet, VButton },
    setup() {
      const open = ref(false)
      const side = ref<'right' | 'left' | 'bottom' | 'top'>('right')
      const show = (s: 'right' | 'left' | 'bottom' | 'top') => {
        side.value = s
        open.value = true
      }
      return { open, side, show }
    },
    template: `
      <div style="display:flex;gap:8px;padding:24px;flex-wrap:wrap">
        <VButton variant="outline" @click="show('right')">Right</VButton>
        <VButton variant="outline" @click="show('left')">Left</VButton>
        <VButton variant="outline" @click="show('bottom')">Bottom</VButton>
        <VButton variant="outline" @click="show('top')">Top</VButton>
      </div>
      <VSheet v-model:open="open" :side="side" title="Filters" description="Narrow down the results.">
        <p style="margin:0;color:var(--v-color-text-muted)">Sheet content.</p>
      </VSheet>`,
  }),
}

export const Sizes: Story = {
  parameters: { docs: { description: { story: '`size`: `sm` 320px, `md` 480px, `lg` 640px e `xl` 800px. Escolha um tamanho para abrir.' } } },
  render: () => ({
    components: { VSheet, VButton },
    setup() {
      const open = ref(false)
      const size = ref<'sm' | 'md' | 'lg' | 'xl'>('md')
      const show = (s: 'sm' | 'md' | 'lg' | 'xl') => {
        size.value = s
        open.value = true
      }
      return { open, size, show }
    },
    template: `
      <div style="display:flex;gap:8px;padding:24px;flex-wrap:wrap">
        <VButton variant="outline" @click="show('sm')">Small · 320</VButton>
        <VButton variant="outline" @click="show('md')">Medium · 480</VButton>
        <VButton variant="outline" @click="show('lg')">Large · 640</VButton>
        <VButton variant="outline" @click="show('xl')">Extra large · 800</VButton>
      </div>
      <VSheet v-model:open="open" :size="size" title="Sheet size" :description="'size=&quot;' + size + '&quot;'">
        <p style="margin:0;color:var(--v-color-text-muted)">Sheet content.</p>
      </VSheet>`,
  }),
}

export const WithHeaderActions: Story = {
  parameters: { docs: { description: { story: 'Slot `#actions`: ações extras no cabeçalho, ao lado do fechar (aqui, um `VButton` de ícone).' } } },
  render: (args) => ({
    components: { VSheet, VButton, VIcon, VTextInput, VTextarea, VSwitch },
    setup: () => ({ args, moreIcon, ...formSetup() }),
    template: `
      <VSheet v-bind="args">
        <template #actions>
          <VButton variant="icon" size="sm" aria-label="More options"><template #icon><VIcon :icon="moreIcon" size="sm" /></template></VButton>
        </template>
        ${settingsForm}
        <template #footer>
          <VButton variant="ghost">Cancel</VButton>
          <VButton>Save changes</VButton>
        </template>
      </VSheet>`,
  }),
}

export const FullHeight: Story = {
  parameters: { docs: { description: { story: '`fullHeight` com `side="bottom"`: ocupa a altura toda, para fluxos imersivos.' } } },
  args: { side: 'bottom', fullHeight: true, title: 'Import data', description: 'Map your columns before importing.' },
  render: (args) => ({
    components: { VSheet },
    setup: () => ({ args }),
    template: `<VSheet v-bind="args"><p style="margin:0;color:var(--v-color-text-muted)">Sheet content.</p></VSheet>`,
  }),
}

export const Loading: Story = { parameters: { docs: { description: { story: '`loading=true`.' } } }, args: { loading: true } }
export const Disabled: Story = { parameters: { docs: { description: { story: '`disabled=true`.' } } }, args: { disabled: true } }
export const NoCloseButton: Story = { parameters: { docs: { description: { story: '`showClose=false`: feche por Esc, pelo backdrop ou por uma ação do rodapé.' } } }, args: { showClose: false } }
export const NotDismissible: Story = { parameters: { docs: { description: { story: '`dismissible=false`: backdrop e Esc não fecham; só o botão de fechar ou uma ação.' } } }, args: { dismissible: false } }

export const ControlledOpen: Story = {
  parameters: { docs: { description: { story: 'Abertura controlada com `v-model:open`; fecha por Esc, backdrop ou pelo botão.' } } },
  render: (args) => ({
    components: { VSheet, VButton },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div style="padding:24px"><VButton @click="open = true">Open sheet</VButton></div>
      <VSheet v-bind="args" v-model:open="open">
        <p style="margin:0;color:var(--v-color-text-muted)">Sheet content.</p>
        <template #footer><VButton @click="open = false">Done</VButton></template>
      </VSheet>`,
  }),
}
