import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VStepper from './VStepper.vue'
import { DEFAULT_STEPPER_STEPS } from './mountVStepper'

const meta = {
  title: 'navigation/VStepper',
  component: VStepper,
  args: {
    modelValue: 'profile',
    steps: DEFAULT_STEPPER_STEPS,
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'primary', 'subtle'] },
  },
} satisfies Meta<typeof VStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const FirstStep: Story = {
  parameters: {
    docs: { description: { story: 'Variação **First Step**. Props: `modelValue="account"`.' } },
  },
  args: { modelValue: 'account' },
}

export const LastStep: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Last Step**. Props: `modelValue="confirm"`.' } },
  },
  args: { modelValue: 'confirm' },
}

export const WithDescriptions: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Descriptions**. Props: `modelValue="profile"`.' } },
  },
  args: {
    modelValue: 'profile',
    steps: [
      { value: 'account', label: 'Account', description: 'Sign in details' },
      { value: 'profile', label: 'Profile', description: 'Personal info' },
      { value: 'review', label: 'Review', description: 'Verify data' },
      { value: 'confirm', label: 'Confirm', description: 'Finish setup' },
    ],
  },
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: (args) => ({
    components: { VStepper },
    setup() {
      const current = ref(args.modelValue ?? 'account')
      return { args, current }
    },
    template: `
      <div>
        <VStepper v-bind="args" v-model="current" />
        <p style="margin-top:12px;color:var(--v-color-text-muted);font-size:14px;">Current step: {{ current }}</p>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } },
  },
  args: { disabled: true },
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } },
  },
  args: { loading: true },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VStepper },
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <VStepper size="sm" model-value="profile" />
        <VStepper size="md" model-value="profile" />
        <VStepper size="lg" model-value="profile" />
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VStepper },
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <VStepper variant="default" model-value="review" />
        <VStepper variant="primary" model-value="review" />
        <VStepper variant="subtle" model-value="review" />
      </div>
    `,
  }),
}
