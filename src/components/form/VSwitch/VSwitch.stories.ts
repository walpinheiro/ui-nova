import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VSwitch from './VSwitch.vue'

const meta = {
  title: 'form/VSwitch',
  component: VSwitch,
  args: {
    size: 'md',
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:420px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const On: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Em**. Props: `modelValue=true`.' } },
  },
  args: {
    modelValue: true,
  },
}

export const Labeled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Labeled**. Props: `modelValue=true`, `label="Enable notifications"`, `description="Get product updates and tip…"`.' } },
  },
  args: {
    modelValue: true,
    label: 'Enable notifications',
    description: 'Get product updates and tips.',
  },
}

export const SettingsRow: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Settings Row**. Props: `modelValue=true`, `label="Dark mode"`, `description="A more comfortable viewing …"`, `showIcon=true`.' } },
  },
  args: {
    modelValue: true,
    label: 'Dark mode',
    description: 'A more comfortable viewing experience.',
    showIcon: true,
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `modelValue=true`, `disabled=true`, `label="Disabled switch"`, `description="Cannot be changed."`.' } },
  },
  args: {
    modelValue: true,
    disabled: true,
    label: 'Disabled switch',
    description: 'Cannot be changed.',
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VSwitch },
    setup() {
      const sm = ref(true)
      const md = ref(false)
      const lg = ref(true)
      return { sm, md, lg }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <VSwitch v-model="sm" size="sm" label="Small switch" />
        <VSwitch v-model="md" size="md" label="Medium switch" />
        <VSwitch v-model="lg" size="lg" label="Large switch" />
      </div>
    `,
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VSwitch },
    setup() {
      const off = ref(false)
      const on = ref(true)
      return { off, on }
    },
    template: `
      <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
        <VSwitch v-model="off" aria-label="Switch off" />
        <VSwitch v-model="on" aria-label="Switch on" />
        <VSwitch :model-value="false" disabled aria-label="Disabled off" />
        <VSwitch :model-value="true" disabled aria-label="Disabled on" />
      </div>
    `,
  }),
}
