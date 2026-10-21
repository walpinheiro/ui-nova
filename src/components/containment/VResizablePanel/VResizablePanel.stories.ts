import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VResizablePanel from './VResizablePanel.vue'
const meta = {
  title: 'containment/VResizablePanel',
  component: VResizablePanel,
  args: { size: 'md', variant: 'left', orientation: 'vertical', min: 200, max: 480 },
} satisfies Meta<typeof VResizablePanel>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  render: (args) => ({
    components: { VResizablePanel },
    setup: () => ({ args }),
    template: `
      <div style="height:320px;width:fit-content;max-width:100%">
        <VResizablePanel v-bind="args" style="height:100%">
          <div style="font-weight:600;margin-bottom:12px">Navigation</div>
          <div style="display:grid;gap:8px;color:var(--v-color-text-muted)">
            <div>Home</div>
            <div>Projects</div>
            <div>Tasks</div>
            <div>Settings</div>
          </div>
        </VResizablePanel>
      </div>
    `,
  }),
}
export const TwoPanels: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Two Panels**.' } },
  },
  render: () => ({
    components: { VResizablePanel },
    template: `
      <div
        style="display:flex;align-items:stretch;height:360px;width:100%;max-width:100%;overflow:hidden;border:1px solid var(--v-color-border);border-radius:var(--v-radius-md)"
        data-test-id="docs-resizable-two-row"
      >
        <VResizablePanel
          data-test-id="docs-resizable-two-left"
          variant="left"
          size="sm"
          style="height:100%;flex-shrink:0"
        >Left panel</VResizablePanel>
        <VResizablePanel
          data-test-id="docs-resizable-two-right"
          variant="right"
          size="sm"
          style="height:100%;flex:1;min-width:0"
        >Right panel</VResizablePanel>
      </div>
    `,
  }),
}
export const Left: Story = { parameters: { docs: { description: { story: 'Variação **Left**. Props: `variant="left"`, `size=320`.' } } }, args: { variant: 'left', size: 320 } }
export const Right: Story = { parameters: { docs: { description: { story: 'Variação **Right**. Props: `variant="right"`, `size=320`.' } } }, args: { variant: 'right', size: 320 } }
export const Bottom: Story = { parameters: { docs: { description: { story: 'Variação **Bottom**. Props: `variant="bottom"`, `orientation="horizontal"`, `size=240`.' } } }, args: { variant: 'bottom', orientation: 'horizontal', size: 240 } }
export const Collapsible: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Recolhível**. Props: `variant="collapsible"`, `collapsible=true`, `size=320`.' } },
  },
  render: (args) => ({
    components: { VResizablePanel },
    setup: () => ({ args }),
    template: `
      <div style="height:320px;width:fit-content;max-width:100%">
        <VResizablePanel v-bind="args" style="height:100%">
          <div style="font-weight:600;margin-bottom:12px">Navigation</div>
          <div style="display:grid;gap:8px;color:var(--v-color-text-muted)">
            <div>Home</div>
            <div>Projects</div>
            <div>Tasks</div>
            <div>Settings</div>
          </div>
        </VResizablePanel>
      </div>
    `,
  }),
  args: { variant: 'collapsible', collapsible: true, size: 320 },
}
export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }
export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: (args) => ({
    components: { VResizablePanel },
    setup: () => ({ args }),
    template:
      '<div style="display:flex;gap:12px;align-items:stretch" data-test-id="docs-resizable-size-row"><VResizablePanel data-test-id="docs-resizable-size-240" size="sm">Small 240</VResizablePanel><VResizablePanel data-test-id="docs-resizable-size-320" size="md">Medium 320</VResizablePanel><VResizablePanel data-test-id="docs-resizable-size-480" size="lg">Large 480</VResizablePanel></div>',
  }),
}
export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: (args) => ({
    components: { VResizablePanel },
    setup: () => ({ args }),
    template:
      '<div style="display:flex;gap:12px;align-items:stretch"><VResizablePanel data-test-id="docs-resizable-variant-left" variant="left" size="sm">Left</VResizablePanel><VResizablePanel data-test-id="docs-resizable-variant-right" variant="right" size="sm">Right</VResizablePanel><VResizablePanel data-test-id="docs-resizable-variant-bottom" variant="bottom" orientation="horizontal" size="sm">Bottom</VResizablePanel><VResizablePanel data-test-id="docs-resizable-variant-collapsible" variant="collapsible" collapsible size="sm">Collapsible</VResizablePanel></div>',
  }),
}
export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }
export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**.' } },
  },
  render: () => ({
    components: { VResizablePanel },
    template: `
      <div style="display:flex;gap:12px;align-items:stretch;flex-wrap:wrap;min-height:280px">
        <VResizablePanel data-test-id="docs-resizable-state-default" size="sm">Default</VResizablePanel>
        <VResizablePanel data-test-id="docs-resizable-state-hover" size="sm" class="v-resizable-panel--state-hover">Hover</VResizablePanel>
        <VResizablePanel data-test-id="docs-resizable-state-focus" size="sm" class="v-resizable-panel--state-focus">Focus</VResizablePanel>
        <VResizablePanel data-test-id="docs-resizable-state-dragging" size="sm" class="v-resizable-panel--state-dragging">Dragging</VResizablePanel>
        <VResizablePanel data-test-id="docs-resizable-state-collapsed" variant="collapsible" collapsible size="sm" class="v-resizable-panel--collapsed">Collapsed</VResizablePanel>
        <VResizablePanel data-test-id="docs-resizable-state-disabled" size="sm" disabled>Disabled</VResizablePanel>
      </div>
    `,
  }),
}
