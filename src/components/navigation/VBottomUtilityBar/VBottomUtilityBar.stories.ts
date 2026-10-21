import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VBottomUtilityBar from './VBottomUtilityBar.vue'

const meta = {
  title: 'navigation/VBottomUtilityBar',
  component: VBottomUtilityBar,
  args: {
    size: 'md',
    variant: 'default',
    fixed: false,
    safeArea: true,
    bordered: true,
    ariaLabel: 'Editor utility bar',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'primary', 'subtle'] },
  },
} satisfies Meta<typeof VBottomUtilityBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Slots usados: `#status`, `#actions`.' } },
  },
  render: (args) => ({
    components: { VBottomUtilityBar },
    setup: () => ({ args }),
    template: `
      <VBottomUtilityBar v-bind="args">
        <template #status>3 items selected</template>
        <span>Draft saved · 2 min ago</span>
        <template #actions>
          <button type="button" style="padding:6px 12px;border:1px solid var(--v-color-border);border-radius:8px;background:var(--v-color-surface);">Cancel</button>
          <button type="button" style="padding:6px 12px;border-radius:8px;border:0;background:var(--v-color-primary);color:var(--v-color-on-primary);">Save</button>
        </template>
      </VBottomUtilityBar>
    `,
  }),
}

export const StatusOnly: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Status somente**. Slots usados: `#status`.' } },
  },
  render: (args) => ({
    components: { VBottomUtilityBar },
    setup: () => ({ args }),
    template: `
      <VBottomUtilityBar v-bind="args">
        <template #status>Syncing changes…</template>
      </VBottomUtilityBar>
    `,
  }),
}

export const ActionsOnly: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ações somente**. Slots usados: `#actions`.' } },
  },
  render: (args) => ({
    components: { VBottomUtilityBar },
    setup: () => ({ args }),
    template: `
      <VBottomUtilityBar v-bind="args">
        <span>Continue editing your document</span>
        <template #actions>
          <button type="button">Undo</button>
          <button type="button">Redo</button>
        </template>
      </VBottomUtilityBar>
    `,
  }),
}

export const Primary: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Primária**. Props: `variant="primary"`. Slots usados: `#actions`.' } },
  },
  args: { variant: 'primary' },
  render: (args) => ({
    components: { VBottomUtilityBar },
    setup: () => ({ args }),
    template: `
      <VBottomUtilityBar v-bind="args">
        <span>Ready to publish</span>
        <template #actions>
          <button type="button" style="padding:6px 12px;border-radius:8px;border:0;background:rgba(255,255,255,0.16);color:inherit;">Preview</button>
          <button type="button" style="padding:6px 12px;border-radius:8px;border:0;background:var(--v-color-surface);color:var(--v-color-text);">Publish</button>
        </template>
      </VBottomUtilityBar>
    `,
  }),
}

export const FixedPreview: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Fixed Preview**. Props: `fixed=true`. Slots usados: `#status`, `#actions`.' } },
  },
  args: { fixed: true },
  render: (args) => ({
    components: { VBottomUtilityBar },
    setup: () => ({ args }),
    template: `
      <div style="position:relative;height:180px;border:1px dashed var(--v-color-border);border-radius:12px;overflow:hidden;">
        <div style="padding:24px;color:var(--v-color-text-muted);">Scrollable content area…</div>
        <VBottomUtilityBar v-bind="args">
          <template #status>Fixed bar</template>
          <span>Bottom utility actions</span>
          <template #actions><button type="button">Action</button></template>
        </VBottomUtilityBar>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } },
  },
  args: { disabled: true },
  render: (args) => ({
    components: { VBottomUtilityBar },
    setup: () => ({ args }),
    template: `
      <VBottomUtilityBar v-bind="args">
        <span>Disabled utility bar</span>
      </VBottomUtilityBar>
    `,
  }),
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } },
  },
  args: { loading: true },
  render: (args) => ({
    components: { VBottomUtilityBar },
    setup: () => ({ args }),
    template: `
      <VBottomUtilityBar v-bind="args">
        <span>Loading utility bar</span>
      </VBottomUtilityBar>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VBottomUtilityBar },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <VBottomUtilityBar size="sm"><span>Small bar</span></VBottomUtilityBar>
        <VBottomUtilityBar size="md"><span>Medium bar</span></VBottomUtilityBar>
        <VBottomUtilityBar size="lg"><span>Large bar</span></VBottomUtilityBar>
      </div>
    `,
  }),
}
