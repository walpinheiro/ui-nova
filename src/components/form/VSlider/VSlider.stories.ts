import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VSlider from './VSlider.vue'

const meta = {
  title: 'form/VSlider',
  component: VSlider,
  args: {
    modelValue: 40,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:420px;padding:8px;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `modelValue=40`, `ariaLabel="Volume"`.' } },
  },
  args: { modelValue: 40, ariaLabel: 'Volume' },
}

export const Range: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Range**. Props: `range=true`.' } },
  },
  args: { range: true, modelValue: [20, 80] },
}

export const WithMarks: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Marks**. Props: `modelValue=50`.' } },
  },
  args: { modelValue: 50, marks: [0, 25, 50, 75, 100] },
}

export const Vertical: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Vertical**. Props: `orientation="vertical"`, `modelValue=75`, `ariaLabel="Brightness"`.' } },
  },
  args: { orientation: 'vertical', modelValue: 75, ariaLabel: 'Brightness' },
  decorators: [
    () => ({
      template: '<div style="height:240px;padding:8px;"><story /></div>',
    }),
  ],
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`, `modelValue=30`.' } },
  },
  args: { disabled: true, modelValue: 30 },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VSlider },
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;max-width:420px">
        <VSlider size="sm" :model-value="40" aria-label="Small slider" />
        <VSlider size="md" :model-value="40" aria-label="Medium slider" />
        <VSlider size="lg" :model-value="40" aria-label="Large slider" />
      </div>
    `,
  }),
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VSlider },
    setup() {
      const value = ref(80)
      const range = ref([20, 80])
      return { value, range }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;max-width:420px">
        <VSlider v-model="value" aria-label="Volume" />
        <VSlider v-model="range" range aria-label="Price range" />
      </div>
    `,
  }),
}

export const ShowValueTooltip: Story = { parameters: { docs: { description: { story: 'Variação **Show Value Tooltip**. Props: `modelValue=40`, `showValue=true`, `showTooltip=true`.' } } }, args: { modelValue: 40, showValue: true, showTooltip: true } }

export const SnapToMarks: Story = { parameters: { docs: { description: { story: 'Variação **Snap para Marks**. Props: `modelValue=50`, `snapToMarks=true`, `step=1`.' } } }, args: { modelValue: 50, marks: [0, 25, 50, 75, 100], snapToMarks: true, step: 1 } }
