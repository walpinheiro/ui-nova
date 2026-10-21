import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VPopover from './VPopover.vue'
import VButton from '../../form/VButton/VButton.vue'

const meta = {
  title: 'navigation/VPopover',
  component: VPopover,
  args: {
    size: 'md',
    placement: 'bottom',
    trigger: 'click',
    closable: true,
    showArrow: true,
    title: 'Quick tip',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    trigger: { control: 'select', options: ['click', 'hover', 'focus'] },
  },
} satisfies Meta<typeof VPopover>
export default meta
type Story = StoryObj<typeof meta>

const content = `
  <p style="margin:0 0 16px;font-size:14px;color:#64748b">
    Popovers are perfect for short, contextual content, actions, or forms.
  </p>
  <div style="display:flex;justify-content:flex-end;gap:8px">
    <button type="button" style="padding:6px 12px;border:0;background:transparent;color:#475569;border-radius:8px">Learn more</button>
    <button type="button" style="padding:6px 12px;border:0;background:#4f46e5;color:#fff;border-radius:8px">Got it</button>
  </div>
`

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Slots usados: `#trigger`.' } },
  },
  render: (args) => ({
    components: { VPopover, VButton },
    setup: () => ({ args }),
    template: `
      <div style="padding:80px;display:flex;justify-content:center">
        <VPopover v-bind="args">
          <template #trigger>
            <VButton variant="primary">Show popover</VButton>
          </template>
          ${content}
        </VPopover>
      </div>`,
  }),
}

export const Hover: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Hover**. Props: `trigger="hover"`, `placement="top"`. Slots usados: `#trigger`.' } },
  },
  args: { trigger: 'hover', placement: 'top' },
  render: (args) => ({
    components: { VPopover, VButton },
    setup: () => ({ args }),
    template: `
      <div style="padding:80px;display:flex;justify-content:center">
        <VPopover v-bind="args">
          <template #trigger><VButton variant="secondary">Hover me</VButton></template>
          <p style="margin:0">Hover trigger opens the popover.</p>
        </VPopover>
      </div>`,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**. Slots usados: `#trigger`.' } },
  },
  render: () => ({
    components: { VPopover, VButton },
    template: `
      <div style="padding:80px;display:flex;gap:24px;justify-content:center;flex-wrap:wrap">
        <VPopover size="sm" title="Small"><template #trigger><VButton size="sm">Small</VButton></template><p style="margin:0">Compact popover.</p></VPopover>
        <VPopover size="md" title="Medium"><template #trigger><VButton>Medium</VButton></template><p style="margin:0">Default popover.</p></VPopover>
        <VPopover size="lg" title="Large"><template #trigger><VButton size="lg">Large</VButton></template><p style="margin:0">Spacious popover.</p></VPopover>
      </div>`,
  }),
}

export const Placements: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Placements**. Slots usados: `#trigger`.' } },
  },
  render: () => ({
    components: { VPopover, VButton },
    template: `
      <div style="padding:120px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:48px;justify-items:center">
        <VPopover placement="top" title="Top"><template #trigger><VButton variant="secondary">Top</VButton></template><p style="margin:0">Placement top.</p></VPopover>
        <VPopover placement="bottom" title="Bottom"><template #trigger><VButton variant="secondary">Bottom</VButton></template><p style="margin:0">Placement bottom.</p></VPopover>
        <VPopover placement="left" title="Left"><template #trigger><VButton variant="secondary">Left</VButton></template><p style="margin:0">Placement left.</p></VPopover>
        <VPopover placement="right" title="Right"><template #trigger><VButton variant="secondary">Right</VButton></template><p style="margin:0">Placement right.</p></VPopover>
      </div>`,
  }),
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`. Slots usados: `#trigger`.' } },
  },
  args: { disabled: true },
  render: (args) => ({
    components: { VPopover, VButton },
    setup: () => ({ args }),
    template: `
      <div style="padding:80px;display:flex;justify-content:center">
        <VPopover v-bind="args">
          <template #trigger><VButton disabled>Show popover</VButton></template>
          <p style="margin:0">Should not open.</p>
        </VPopover>
      </div>`,
  }),
}

export const AriaLabelledby: Story = { parameters: { docs: { description: { story: 'Variação **Aria Labelledby**. Props: `title="Rotulado por aria-labelledby"`, `ariaLabelledby="popover-title"`.' } } }, args: { title: 'Rotulado por aria-labelledby', ariaLabelledby: 'popover-title' } }

export const ControlledOpen: Story = {
  parameters: { docs: { description: { story: 'Abertura controlada com `v-model:open` ligado a um `ref`.' } } },
  render: (args) => ({
    components: { VPopover },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: '<div style="display:grid;gap:12px;padding:8px 0 140px"><VPopover v-bind="args" v-model:open="open"><template #trigger><button type="button">Gatilho</button></template>Conteúdo do popover</VPopover><code>open = {{ open }}</code><button type="button" @click="open = !open">Alternar por código</button></div>',
  }),
}
