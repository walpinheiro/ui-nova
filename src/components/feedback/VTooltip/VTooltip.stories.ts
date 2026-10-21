import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VTooltip from './VTooltip.vue'

const meta = {
  title: 'feedback/VTooltip',
  component: VTooltip,
  args: {
    content: 'This is a helpful tooltip',
    size: 'md',
    variant: 'default',
    placement: 'top',
  },
} satisfies Meta<typeof VTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  render: (args) => ({
    components: { VTooltip },
    setup: () => ({ args }),
    template: `
      <VTooltip v-bind="args">
        <button type="button">Hover me</button>
      </VTooltip>
    `,
  }),
}

export const Placements: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Placements**.' } },
  },
  render: () => ({
    components: { VTooltip },
    template: `
      <div style="display:grid;gap:24px;place-items:center;padding:80px;">
        <VTooltip content="Top tooltip" placement="top"><button type="button">Top</button></VTooltip>
        <div style="display:flex;gap:48px;align-items:center;">
          <VTooltip content="Left tooltip" placement="left"><button type="button">Left</button></VTooltip>
          <VTooltip content="Right tooltip" placement="right"><button type="button">Right</button></VTooltip>
        </div>
        <VTooltip content="Bottom tooltip" placement="bottom"><button type="button">Bottom</button></VTooltip>
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VTooltip },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:16px;padding:48px;">
        <VTooltip content="Supports text only." variant="default"><button type="button">?</button></VTooltip>
        <VTooltip content="With an icon" variant="with-icon"><button type="button">?</button></VTooltip>
        <VTooltip content="Success saved!" variant="success"><button type="button">?</button></VTooltip>
        <VTooltip content="Action unavailable" variant="error"><button type="button">?</button></VTooltip>
        <VTooltip content="Pro tip!" variant="brand"><button type="button">?</button></VTooltip>
        <VTooltip content="Light tooltip" variant="light"><button type="button">?</button></VTooltip>
      </div>
    `,
  }),
}

export const NoArrow: Story = { parameters: { docs: { description: { story: 'Variação **Sem Arrow**. Props: `showArrow=false`, `content="Sem seta"`.' } } }, args: { showArrow: false, content: 'Sem seta' } }

export const HideDelay: Story = { parameters: { docs: { description: { story: 'Variação **Hide Delay**. Props: `hideDelay=800`, `content="Some após 800ms"`.' } } }, args: { hideDelay: 800, content: 'Some após 800ms' } }

export const WarmGroup: Story = { parameters: { docs: { description: { story: 'Variação **Warm grupo**. Props: `warmGroup="toolbar"`, `content="Grupo aquecido"`.' } } }, args: { warmGroup: 'toolbar', content: 'Grupo aquecido' } }

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`, `content="Desabilitado"`.' } } }, args: { disabled: true, content: 'Desabilitado' } }
