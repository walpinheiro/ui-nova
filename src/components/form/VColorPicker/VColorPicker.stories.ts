import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VColorPicker from './VColorPicker.vue'
import { V_COLOR_PICKER_DEFAULT_PRESETS } from './mountVColorPicker'

const meta = {
  title: 'form/VColorPicker',
  component: VColorPicker,
  args: { size: 'md', modelValue: '#6366F1' },
  decorators: [
    () => ({
      template: '<div style="padding:24px;min-height:420px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { parameters: { docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `variant="popover"`, `showAlpha=true`.' } } }, args: { variant: 'popover', showAlpha: true } }

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VColorPicker },
    setup() {
      const color = ref('#6366F1')
      return { color, presets: V_COLOR_PICKER_DEFAULT_PRESETS }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <VColorPicker v-model="color" variant="popover" :show-alpha="true" />
        <VColorPicker v-model="color" variant="inline" />
        <VColorPicker v-model="color" variant="hex" />
        <VColorPicker v-model="color" variant="opacity" :show-alpha="true" />
        <VColorPicker v-model="color" variant="preset" :presets="presets" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VColorPicker },
    setup() {
      const color = ref('#6366F1')
      return { color }
    },
    template: `
      <div style="display:flex;gap:16px;align-items:center;">
        <VColorPicker v-model="color" size="sm" />
        <VColorPicker v-model="color" size="md" />
        <VColorPicker v-model="color" size="lg" />
      </div>
    `,
  }),
}

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }

export const RecentColors: Story = { parameters: { docs: { description: { story: 'Variação **Recent Colors**. Props: `variant="popover"`, `label="Cor"`.' } } }, args: { variant: 'popover', recentColors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'], label: 'Cor' } }

export const InlineSwatches: Story = { parameters: { docs: { description: { story: 'Variação **Inline Swatches**. Props: `variant="inline"`, `label="Cor"`.' } } }, args: { variant: 'inline', inlineSwatches: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'], label: 'Cor' } }
