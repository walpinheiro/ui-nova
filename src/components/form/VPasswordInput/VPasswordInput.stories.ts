import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VPasswordInput from './VPasswordInput.vue'

const meta = {
  title: 'form/VPasswordInput',
  component: VPasswordInput,
  args: {
    size: 'md',
    label: 'Password',
    placeholder: 'Create a strong password',
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:420px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VPasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `label="Password"`, `placeholder="Password"`.' } },
  },
  args: {
    label: 'Password',
    placeholder: 'Password',
  },
}

export const WithStrength: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Strength**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPasswordInput },
    setup() {
      const password = ref('VueNova2024')
      return { password }
    },
    template: `
      <VPasswordInput
        v-model="password"
        label="Password"
        placeholder="Create a strong password"
        :show-strength="true"
        helper-text="Use at least 8 characters."
      />
    `,
  }),
}

export const WithRequirements: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Requirements**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPasswordInput },
    setup() {
      const password = ref('Vue')
      return { password }
    },
    template: `
      <VPasswordInput
        v-model="password"
        label="Password"
        placeholder="Create a strong password"
        :show-strength="true"
        :requirements="true"
      />
    `,
  }),
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Erro**. Props: `label="Password"`, `modelValue="123"`, `errorMessage="Password is too weak"`.' } },
  },
  args: {
    label: 'Password',
    modelValue: '123',
    errorMessage: 'Password is too weak',
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `label="Password"`, `modelValue="••••••••"`, `disabled=true`.' } },
  },
  args: {
    label: 'Password',
    modelValue: '••••••••',
    disabled: true,
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VPasswordInput },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <VPasswordInput size="sm" label="Small" placeholder="Password" />
        <VPasswordInput size="md" label="Medium" placeholder="Password" />
        <VPasswordInput size="lg" label="Large" placeholder="Password" />
      </div>
    `,
  }),
}

export const ReadonlyRequired: Story = { parameters: { docs: { description: { story: 'Variação **Somente leitura obrigatório**. Props: `label="Senha"`, `modelValue="segredo123"`, `readonly=true`, `required=true`.' } } }, args: { label: 'Senha', modelValue: 'segredo123', readonly: true, required: true } }
