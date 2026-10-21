import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VTopBar from './VTopBar.vue'

const meta = {
  title: 'navigation/VTopBar',
  component: VTopBar,
  args: {
    size: 'md',
    variant: 'default',
    bordered: true,
    ariaLabel: 'Application header',
  },
} satisfies Meta<typeof VTopBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Slots usados: `#leading`, `#actions`.' } },
  },
  render: (args) => ({
    components: { VTopBar },
    setup: () => ({ args }),
    template: `
      <VTopBar v-bind="args">
        <template #leading>
          <span style="display:inline-flex;align-items:center;gap:8px;font-weight:600;">
            <span style="width:24px;height:24px;border-radius:6px;background:var(--v-color-primary);display:inline-block;"></span>
            Acme
          </span>
        </template>
        <nav style="display:flex;gap:16px;color:var(--v-color-text-muted);font-size:14px;">
          <span style="color:var(--v-color-primary);font-weight:600;">Dashboard</span>
          <span>Projects</span>
          <span>Settings</span>
        </nav>
        <template #actions>
          <button type="button" style="padding:6px 12px;border:1px solid var(--v-color-border);border-radius:8px;background:var(--v-color-surface);">Help</button>
          <span style="width:32px;height:32px;border-radius:var(--v-radius-circle);background:var(--v-color-neutral-200);display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">AC</span>
        </template>
      </VTopBar>
    `,
  }),
}

export const TitleOnly: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Título somente**. Props: `title="Projects"`.' } },
  },
  args: {
    title: 'Projects',
  },
}

export const Subtle: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Subtle**. Props: `variant="subtle"`, `bordered=false`. Slots usados: `#actions`.' } },
  },
  args: { variant: 'subtle', bordered: false },
  render: (args) => ({
    components: { VTopBar },
    setup: () => ({ args }),
    template: `
      <VTopBar v-bind="args" title="Editor workspace">
        <template #actions>
          <button type="button">Share</button>
        </template>
      </VTopBar>
    `,
  }),
}

const appItems = [
  { value: 'overview', label: 'Overview' },
  { value: 'workflows', label: 'Workflows' },
  { value: 'map', label: 'Live Map' },
  { value: 'traces', label: 'Traces' },
  { value: 'incidents', label: 'Incidents' },
  { value: 'insights', label: 'Insights' },
]

export const App: Story = {
  parameters: {
    docs: { description: { story: 'Variação **App**. Props: `variant="app"`, `activeItem="traces"`, `bordered=true`. Slots usados: `#leading`, `#actions`.' } },
  },
  args: { variant: 'app', items: appItems, activeItem: 'traces', bordered: true },
  render: (args) => ({
    components: { VTopBar },
    setup: () => ({ args }),
    template: `
      <VTopBar v-bind="args">
        <template #leading>
          <span style="display:inline-flex;align-items:center;gap:8px;font-weight:600;">
            <span style="width:28px;height:28px;border-radius:8px;background:var(--v-color-primary-500);display:inline-block;"></span>
            OrchestrateIQ
          </span>
        </template>
        <template #actions>
          <span style="padding:4px 10px;border-radius:999px;background:var(--v-color-success-soft);color:var(--v-color-success-strong);font-size:12px;font-weight:600;">Live</span>
          <span style="width:32px;height:32px;border-radius:999px;background:var(--v-color-neutral-200);display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">PT</span>
        </template>
      </VTopBar>
    `,
  }),
}

export const Primary: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Primária**. Props: `variant="primary"`. Slots usados: `#actions`.' } },
  },
  args: { variant: 'primary' },
  render: (args) => ({
    components: { VTopBar },
    setup: () => ({ args }),
    template: `
      <VTopBar v-bind="args" title="Marketing dashboard">
        <template #actions>
          <button type="button" style="padding:6px 12px;border-radius:8px;border:0;background:rgba(255,255,255,0.16);color:inherit;">Upgrade</button>
        </template>
      </VTopBar>
    `,
  }),
}

export const Sticky: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sticky**. Props: `sticky=true`. Slots usados: `#actions`.' } },
  },
  args: { sticky: true },
  render: (args) => ({
    components: { VTopBar },
    setup: () => ({ args }),
    template: `
      <div style="height:240px;overflow:auto;border:1px solid var(--v-color-border);border-radius:8px;">
        <VTopBar v-bind="args" title="Scrollable page">
          <template #actions><button type="button">Action</button></template>
        </VTopBar>
        <div style="padding:24px;">Conteúdo longo para demonstrar sticky header…</div>
        <div style="height:480px;padding:24px;">Mais conteúdo</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`, `title="Disabled header"`.' } },
  },
  args: { disabled: true, title: 'Disabled header' },
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`, `title="Loading header"`.' } },
  },
  args: { loading: true, title: 'Loading header' },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VTopBar },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <VTopBar size="sm" title="Small top bar" />
        <VTopBar size="md" title="Medium top bar" />
        <VTopBar size="lg" title="Large top bar" />
      </div>
    `,
  }),
}

export const NarrowOverflow: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estreito overflow**. Props: `variant="app"`, `activeItem="settings"`, `bordered=true`. Slots usados: `#leading`.' } },
  },
  args: { variant: 'app', items: [...appItems, { value: 'alerts', label: 'Alerts' }, { value: 'settings', label: 'Settings' }], activeItem: 'settings', bordered: true },
  render: (args) => ({
    components: { VTopBar },
    setup: () => ({ args }),
    template: '<div style="width:360px;border:1px dashed var(--v-color-border)"><VTopBar v-bind="args"><template #leading><strong>Acme</strong></template></VTopBar></div>',
  }),
}
