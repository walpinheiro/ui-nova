import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VSegmentedControl from './VSegmentedControl.vue'

const meta = {
  title: 'navigation/VSegmentedControl',
  component: VSegmentedControl,
  args: {
    size: 'md',
    variant: 'default',
    ariaLabel: 'Select view mode',
  },
} satisfies Meta<typeof VSegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const TextOnly: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Texto somente**. Props: `modelValue="week"`, `ariaLabel="Select time range"`.' } },
  },
  args: {
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
    modelValue: 'week',
    ariaLabel: 'Select time range',
  },
}

export const IconOnly: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ícone somente**. Props: `modelValue="list"`, `ariaLabel="Select view mode"`.' } },
  },
  args: {
    options: [
      { value: 'list', icon: 'list', ariaLabel: 'List view' },
      { value: 'grid', icon: 'grid', ariaLabel: 'Grid view' },
      { value: 'calendar', icon: 'calendar', ariaLabel: 'Calendar view' },
    ],
    modelValue: 'list',
    ariaLabel: 'Select view mode',
  },
}

export const IconAndText: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ícone e texto**. Props: `modelValue="list"`.' } },
  },
  args: {
    options: [
      { value: 'list', icon: 'list', label: 'List' },
      { value: 'grid', icon: 'grid', label: 'Grid' },
      { value: 'calendar', icon: 'calendar', label: 'Calendar' },
    ],
    modelValue: 'list',
  },
}

export const Pill: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Pill**. Props: `variant="pill"`, `modelValue="light"`, `ariaLabel="Select theme"`.' } },
  },
  args: {
    variant: 'pill',
    options: [
      { value: 'light', icon: 'sun', label: 'Light' },
      { value: 'dark', icon: 'moon', label: 'Dark' },
      { value: 'system', icon: 'monitor', label: 'System' },
    ],
    modelValue: 'light',
    ariaLabel: 'Select theme',
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VSegmentedControl },
    template: `
      <div style="display:grid;gap:16px;">
        <VSegmentedControl size="sm" :options="[{ value: '7d', label: '7D' }, { value: '30d', label: '30D' }, { value: '3m', label: '3M' }]" model-value="7d" aria-label="Time range small" />
        <VSegmentedControl size="md" :options="[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]" model-value="week" aria-label="Time range medium" />
        <VSegmentedControl size="lg" :options="[{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'popular', label: 'Popular' }]" model-value="newest" aria-label="Sort large" />
      </div>
    `,
  }),
}

export const IconSizes: Story = {
  parameters: { docs: { description: { story: 'Variação **Ícones por tamanho**: ícone e texto, e somente ícone.' } } },
  render: () => ({
    components: { VSegmentedControl },
    template: `
      <div style="display:grid;gap:16px;justify-items:start;">
        <VSegmentedControl size="sm" model-value="list" aria-label="View small" :options="[{ value: 'list', icon: 'list', label: 'List' }, { value: 'grid', icon: 'grid', label: 'Grid' }]" />
        <VSegmentedControl size="md" model-value="list" aria-label="View medium" :options="[{ value: 'list', icon: 'list', label: 'List' }, { value: 'grid', icon: 'grid', label: 'Grid' }]" />
        <VSegmentedControl size="lg" model-value="grid" aria-label="View large" :options="[{ value: 'list', icon: 'list', ariaLabel: 'List' }, { value: 'grid', icon: 'grid', ariaLabel: 'Grid' }, { value: 'calendar', icon: 'calendar', ariaLabel: 'Calendar' }]" />
      </div>
    `,
  }),
}

export const FullWidth: Story = {
  parameters: { docs: { description: { story: 'Variação **Largura total**. Props: `fullWidth`.' } } },
  args: {
    fullWidth: true,
    modelValue: 'week',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
  render: (args) => ({
    components: { VSegmentedControl },
    setup: () => ({ args }),
    template: '<div style="width:420px"><VSegmentedControl v-bind="args" /></div>',
  }),
}

export const DisabledOption: Story = {
  parameters: { docs: { description: { story: 'Variação **Opção desabilitada**. Uma opção com `disabled: true`.' } } },
  args: {
    modelValue: 'day',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week', disabled: true },
      { value: 'month', label: 'Month' },
    ],
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`, `modelValue="week"`.' } },
  },
  args: {
    disabled: true,
    modelValue: 'week',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
}

export const ControlledVModel: Story = {
  parameters: { docs: { description: { story: 'Estado controlado: `v-model` ligado a um `ref`.' } } },
  render: (args) => ({
    components: { VSegmentedControl },
    setup() {
      const value = ref('b')
      return { args, value }
    },
    template: '<div style="display:grid;gap:12px"><VSegmentedControl v-bind="args" v-model="value" :options="[{ value: \'a\', label: \'Dia\' }, { value: \'b\', label: \'Semana\' }, { value: \'c\', label: \'Mês\' }]" /></div>',
  }),
}
