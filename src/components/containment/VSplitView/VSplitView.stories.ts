import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VSplitView from './VSplitView.vue'

const meta = {
  title: 'containment/VSplitView',
  component: VSplitView,
  args: { orientation: 'vertical', mode: 'resizable', collapsible: false, sizes: [280, 1, 320], minSize: 200, maxSize: 600 },
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    mode: { control: 'select', options: ['fixed', 'resizable', 'collapsible'] },
  },
} satisfies Meta<typeof VSplitView>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}
export const TwoPanes: Story = { parameters: { docs: { description: { story: 'Variação **Two Panes**.' } } }, args: { sizes: [280, 1] } }
export const ThreePanes: Story = { parameters: { docs: { description: { story: 'Variação **Three Panes**.' } } }, args: { sizes: [280, 1, 320] } }
export const Horizontal: Story = { parameters: { docs: { description: { story: 'Variação **Horizontal**. Props: `orientation="horizontal"`.' } } }, args: { orientation: 'horizontal', sizes: [1, 1] } }
export const Fixed: Story = { parameters: { docs: { description: { story: 'Variação **Fixed**. Props: `mode="fixed"`, `collapsible=false`.' } } }, args: { mode: 'fixed', collapsible: false, sizes: [280, 1] } }
export const Resizable: Story = { parameters: { docs: { description: { story: 'Variação **Resizable**. Props: `mode="resizable"`.' } } }, args: { mode: 'resizable', sizes: [280, 1] } }
export const Collapsible: Story = { parameters: { docs: { description: { story: 'Variação **Recolhível**. Props: `mode="collapsible"`, `collapsible=true`.' } } }, args: { mode: 'collapsible', collapsible: true, sizes: [280, 1, 320] } }
export const Persisted: Story = { parameters: { docs: { description: { story: 'Variação **Persisted**. Props: `persistKey="ide-layout"`.' } } }, args: { sizes: [280, 1, 320], persistKey: 'ide-layout' } }
export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }

export const DefaultSize: Story = { parameters: { docs: { description: { story: 'Variação **Padrão tamanho**. Props: `defaultSize=320`.' } } }, args: { sizes: [1, 1], defaultSize: 320 } }
