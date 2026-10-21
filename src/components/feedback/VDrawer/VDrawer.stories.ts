import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VButton from '../../form/VButton/VButton.vue'
import VDrawer from './VDrawer.vue'

const meta = {
  title: 'feedback/VDrawer',
  component: VDrawer,
  args: {
    modelValue: false,
    title: 'Project details',
    placement: 'right',
    size: 'md',
  },
  argTypes: {
    modelValue: { control: 'boolean' },
    open: { control: 'boolean' },
    placement: { control: 'inline-radio', options: ['right', 'left', 'top', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof VDrawer>

export default meta
type Story = StoryObj<typeof meta>

const drawerStory = (args: Partial<Story['args']> = {}): Story => ({
  args: { modelValue: false, ...args },
  render: (storyArgs) => ({
    components: { VButton, VDrawer },
    setup() {
      const isOpen = ref(Boolean(storyArgs.modelValue))
      return { args: storyArgs, isOpen }
    },
    template: `
      <VButton data-test-id="drawer-trigger-open" @click="isOpen = true">Open drawer</VButton>
      <VDrawer v-bind="args" v-model="isOpen">
        <p>A modern marketing website for Acme Inc.</p>
        <template #footer>
          <VButton variant="ghost" data-test-id="drawer-action-cancel" @click="isOpen = false">Cancel</VButton>
          <VButton data-test-id="drawer-action-save" @click="isOpen = false">Save</VButton>
        </template>
      </VDrawer>
    `,
  }),
})

export const Default: Story = drawerStory()
export const Left: Story = drawerStory({ placement: 'left', title: 'Filters' })
export const Top: Story = drawerStory({ placement: 'top', title: 'Notifications' })
export const Bottom: Story = drawerStory({ placement: 'bottom', title: 'Quick actions' })
export const Small: Story = drawerStory({ size: 'sm', title: 'Compact drawer' })
export const Large: Story = drawerStory({ size: 'lg', title: 'Complex drawer' })
export const Closed: Story = { parameters: { docs: { description: { story: 'Variação **Fechado**. Props: `modelValue=false`.' } } }, args: { modelValue: false } }
export const Disabled: Story = drawerStory({ disabled: true })
export const Loading: Story = drawerStory({ loading: true })

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`). Slots usados: `#footer`.' } },
  },
  render: () => ({
    components: { VButton, VDrawer },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <VButton data-test-id="drawer-trigger-open" @click="isOpen = true">Try Drawer</VButton>
      <VDrawer v-model="isOpen" title="Project details" placement="right" size="md">
        <p>Reveal details without leaving context.</p>
        <template #footer>
          <VButton variant="ghost" data-test-id="drawer-action-cancel" @click="isOpen = false">Cancel</VButton>
          <VButton data-test-id="drawer-action-save" @click="isOpen = false">Save</VButton>
        </template>
      </VDrawer>
    `,
  }),
}

export const PlacementLeftViaSide: Story = { parameters: { docs: { description: { story: 'Variação **Placement Left Via Side**. Props: `open=true`, `side="left"`, `title="Drawer à esquerda"`.' } } }, args: { open: true, side: 'left', title: 'Drawer à esquerda' } }

export const PlacementTop: Story = { parameters: { docs: { description: { story: 'Variação **Placement Top**. Props: `open=true`, `placement="top"`, `title="Drawer no topo"`.' } } }, args: { open: true, placement: 'top', title: 'Drawer no topo' } }

export const WidthLarge: Story = { parameters: { docs: { description: { story: 'Variação **Largura grande**. Props: `open=true`, `width="lg"`, `title="Largura lg"`.' } } }, args: { open: true, width: 'lg', title: 'Largura lg' } }

export const NoCloseButton: Story = { parameters: { docs: { description: { story: 'Variação **Sem Close Button**. Props: `open=true`, `showClose=false`, `title="Sem botão de fechar"`.' } } }, args: { open: true, showClose: false, title: 'Sem botão de fechar' } }

export const NotDismissible: Story = { parameters: { docs: { description: { story: 'Variação **Not Dismissible**. Props: `open=true`, `dismissible=false`, `title="Não dispensável"`.' } } }, args: { open: true, dismissible: false, title: 'Não dispensável' } }
