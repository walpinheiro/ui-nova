import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VToolbar from './VToolbar.vue'
import VToolbarButton from './VToolbarButton.vue'
import VToolbarGroup from './VToolbarGroup.vue'
import VToolbarDivider from './VToolbarDivider.vue'
import VToolbarSpacer from './VToolbarSpacer.vue'

const overflowMenu = [
  { value: 'share', label: 'Share', icon: 'share' },
  { value: 'download', label: 'Download', icon: 'download' },
  { value: 'duplicate', label: 'Duplicate', icon: 'duplicate' },
  { value: 'move-to', label: 'Move to…', icon: 'move-to' },
]

const meta = {
  title: 'navigation/VToolbar',
  component: VToolbar,
  args: {
    size: 'md',
    variant: 'default',
    ariaLabel: 'Document actions',
  },
} satisfies Meta<typeof VToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  render: (args) => ({
    components: { VToolbar, VToolbarButton, VToolbarGroup, VToolbarDivider, VToolbarSpacer },
    setup: () => ({ args, overflowMenu }),
    template: `
      <VToolbar v-bind="args">
        <VToolbarGroup aria-label="File actions">
          <VToolbarButton icon="plus" aria-label="New" />
          <VToolbarButton icon="folder" aria-label="Open" />
          <VToolbarButton icon="delete" aria-label="Delete" />
        </VToolbarGroup>
        <VToolbarDivider />
        <VToolbarButton icon="undo" aria-label="Undo" />
        <VToolbarButton icon="redo" aria-label="Redo" />
        <VToolbarSpacer />
        <VToolbarButton variant="primary" icon="save" label="Save" />
        <VToolbarButton icon="more-h" aria-label="More actions" :menu="overflowMenu" />
      </VToolbar>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VToolbar, VToolbarButton, VToolbarGroup, VToolbarDivider, VToolbarSpacer },
    setup: () => ({ overflowMenu }),
    template: `
      <div style="display:grid;gap:16px;">
        <VToolbar data-test-id="docs-toolbar-variant-default" aria-label="Default toolbar">
          <VToolbarGroup><VToolbarButton icon="plus" aria-label="New" /><VToolbarButton icon="folder" aria-label="Open" /></VToolbarGroup>
          <VToolbarDivider />
          <VToolbarButton icon="undo" aria-label="Undo" />
          <VToolbarSpacer />
          <VToolbarButton variant="primary" icon="save" label="Save" />
        </VToolbar>
        <VToolbar variant="compact" data-test-id="docs-toolbar-variant-compact" aria-label="Compact toolbar">
          <VToolbarButton icon="bold" variant="toggle" aria-label="Bold" />
          <VToolbarButton icon="italic" variant="toggle" aria-label="Italic" />
          <VToolbarButton icon="link" aria-label="Link" />
        </VToolbar>
        <VToolbar variant="floating" data-test-id="docs-toolbar-variant-floating" aria-label="Floating toolbar">
          <VToolbarButton icon="link" aria-label="Link" />
          <VToolbarButton icon="image" variant="toggle" active aria-label="Image" />
          <VToolbarButton icon="duplicate" aria-label="Duplicate" />
        </VToolbar>
        <VToolbar variant="editor" data-test-id="docs-toolbar-variant-editor" aria-label="Editor toolbar">
          <VToolbarButton icon="bold" variant="toggle" aria-label="Bold" />
          <VToolbarButton icon="italic" variant="toggle" aria-label="Italic" />
          <VToolbarButton icon="underline" variant="toggle" aria-label="Underline" />
          <VToolbarDivider />
          <VToolbarButton icon="list" aria-label="List" />
        </VToolbar>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VToolbar, VToolbarButton, VToolbarSpacer },
    template: `
      <div style="display:grid;gap:16px;">
        <VToolbar size="sm" aria-label="Small toolbar"><VToolbarButton icon="save" aria-label="Save" /><VToolbarSpacer /><VToolbarButton variant="primary" icon="save" label="Save" /></VToolbar>
        <VToolbar size="md" aria-label="Medium toolbar"><VToolbarButton icon="save" aria-label="Save" /><VToolbarSpacer /><VToolbarButton variant="primary" icon="save" label="Save" /></VToolbar>
        <VToolbar size="lg" aria-label="Large toolbar"><VToolbarButton icon="save" aria-label="Save" /><VToolbarSpacer /><VToolbarButton variant="primary" icon="save" label="Save" /></VToolbar>
      </div>
    `,
  }),
}

export const Segmented: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Segmented**. Props: `variant="segmented"`, `ariaLabel="Canvas tools"`.' } },
  },
  args: { variant: 'segmented', ariaLabel: 'Canvas tools' },
  render: (args) => ({
    components: { VToolbar, VToolbarButton, VToolbarGroup, VToolbarDivider },
    setup: () => ({ args }),
    template: `
      <div style="padding:32px;background:var(--v-color-neutral-100);border-radius:16px;">
        <VToolbar v-bind="args">
          <VToolbarGroup aria-label="Pointer tools">
            <VToolbarButton icon="select" variant="toggle" active aria-label="Select" />
            <VToolbarButton icon="pan" variant="toggle" aria-label="Pan" />
            <VToolbarButton icon="zoom" variant="toggle" aria-label="Zoom" />
          </VToolbarGroup>
          <VToolbarDivider />
          <VToolbarGroup aria-label="History">
            <VToolbarButton icon="undo" aria-label="Undo" />
            <VToolbarButton icon="redo" aria-label="Redo" />
          </VToolbarGroup>
          <VToolbarDivider />
          <VToolbarGroup aria-label="Insert">
            <VToolbarButton icon="plus" aria-label="Add node" />
            <VToolbarButton icon="scan" aria-label="Frame selection" />
          </VToolbarGroup>
        </VToolbar>
      </div>
    `,
  }),
}

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }
export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }
