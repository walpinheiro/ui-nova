import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VDatePicker from './VDatePicker.vue'

const meta = {
  title: 'form/VDatePicker',
  component: VDatePicker,
  args: { size: 'md', placeholder: 'Select date' },
  decorators: [
    () => ({
      template: '<div style="padding:24px;min-height:480px;max-width:420px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const WithIcon: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com ícone**. Props: `variant="with-icon"`.' } },
  },
  args: { variant: 'with-icon', modelValue: new Date(2026, 0, 17) },
}

export const WithPreset: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com preset**. Props: `variant="with-preset"`, `range=true`.' } },
  },
  args: { variant: 'with-preset', range: true },
}

export const Range: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Range**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VDatePicker },
    setup() {
      const range = ref({ start: new Date(2026, 0, 10), end: new Date(2026, 0, 17) })
      return { range }
    },
    template: '<VDatePicker variant="range" v-model:range-value="range" range />',
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VDatePicker },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <VDatePicker size="sm" />
        <VDatePicker size="md" />
        <VDatePicker size="lg" />
      </div>
    `,
  }),
}

export const FormatAndToday: Story = { parameters: { docs: { description: { story: 'Variação **Format e Today**. Props: `format="DD/MM/YYYY"`, `showToday=true`, `label="Data"`.' } } }, args: { format: 'DD/MM/YYYY', showToday: true, label: 'Data' } }

export const Clearable: Story = { parameters: { docs: { description: { story: 'Variação **Limpável**. Props: `clearable=true`, `label="Data"`.' } } }, args: { clearable: true, modelValue: new Date(2026, 5, 15), label: 'Data' } }

export const LeadingIcon: Story = { parameters: { docs: { description: { story: 'Variação **Leading ícone**. Props: `showLeadingIcon=true`, `label="Data"`.' } } }, args: { showLeadingIcon: true, label: 'Data' } }

export const MinMaxDisabledEvents: Story = { parameters: { docs: { description: { story: 'Variação **Min Max desabilitado Events**. Props: `label="Data"`.' } } }, args: { label: 'Data', min: new Date(2026, 5, 5), max: new Date(2026, 5, 25), disabledDates: [new Date(2026, 5, 10), new Date(2026, 5, 11)], eventDates: [new Date(2026, 5, 15), new Date(2026, 5, 20)], modelValue: new Date(2026, 5, 15) } }

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`, `label="Data"`.' } } }, args: { disabled: true, label: 'Data' } }
