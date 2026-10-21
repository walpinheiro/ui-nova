import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VDateRangePicker from './VDateRangePicker.vue'

const meta = {
  title: 'form/VDateRangePicker',
  component: VDateRangePicker,
  args: { size: 'md', placeholder: 'Select date range' },
  decorators: [
    () => ({
      template: '<div style="padding:24px;min-height:560px;max-width:720px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VDateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  args: {
    modelValue: { start: new Date(2024, 3, 1), end: new Date(2024, 3, 30) },
  },
}

export const WithPresets: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com presets**. Props: `variant="presets"`.' } },
  },
  args: { variant: 'presets' },
}

export const Compact: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Compact**. Props: `variant="compact"`.' } },
  },
  args: {
    variant: 'compact',
    modelValue: { start: new Date(2024, 3, 1), end: new Date(2024, 3, 30) },
  },
}

export const WithTime: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Time**. Props: `variant="with-time"`, `enableTime=true`.' } },
  },
  args: {
    variant: 'with-time',
    enableTime: true,
    modelValue: {
      start: new Date(2024, 3, 1, 10, 0),
      end: new Date(2024, 3, 5, 18, 0),
    },
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VDateRangePicker },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <VDateRangePicker size="sm" />
        <VDateRangePicker size="md" />
        <VDateRangePicker size="lg" />
      </div>
    `,
  }),
}

export const FormatCompact: Story = { parameters: { docs: { description: { story: 'Variação **Format Compact**. Props: `variant="compact"`, `format="DD/MM/YYYY"`, `compactFormat="DD/MM"`, `label="Período"`.' } } }, args: { variant: 'compact', format: 'DD/MM/YYYY', compactFormat: 'DD/MM', label: 'Período' } }

export const MinMaxDisabledDates: Story = { parameters: { docs: { description: { story: 'Variação **Min Max desabilitado Dates**. Props: `label="Período"`.' } } }, args: { label: 'Período', min: new Date(2026, 5, 5), max: new Date(2026, 5, 25), disabledDates: [new Date(2026, 5, 10)] } }

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`, `label="Período"`.' } } }, args: { disabled: true, label: 'Período' } }
