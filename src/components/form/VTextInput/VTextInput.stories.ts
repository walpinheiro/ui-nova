import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VTextInput from './VTextInput.vue'

const meta = {
  title: 'form/VTextInput',
  component: VTextInput,
  args: {
    size: 'md',
    placeholder: 'Enter text',
    label: 'Label',
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:420px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VTextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `label="Label"`, `placeholder="Enter text"`.' } },
  },
  args: {
    label: 'Label',
    placeholder: 'Enter text',
  },
}

export const WithIcon: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com ícone**. Props: `label="Search"`, `placeholder="Search products..."`, `leadingIcon="search"`, `clearable=true`, `helperText="Find products, documentatio…"`.' } },
  },
  args: {
    label: 'Search',
    placeholder: 'Search products...',
    leadingIcon: 'search',
    clearable: true,
    helperText: 'Find products, documentation, and more…',
  },
}

export const WithPrefixSuffix: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Prefix Suffix**. Props: `label="Amount"`, `modelValue="0.00"`, `prefix="$"`, `suffix="USD"`, `placeholder="0.00"`.' } },
  },
  args: {
    label: 'Amount',
    modelValue: '0.00',
    prefix: '$',
    suffix: 'USD',
    placeholder: '0.00',
  },
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Erro**. Props: `label="Email address"`, `modelValue="invalid"`, `leadingIcon="mail"`, `errorMessage="Please enter a valid email …"`.' } },
  },
  args: {
    label: 'Email address',
    modelValue: 'invalid',
    leadingIcon: 'mail',
    errorMessage: 'Please enter a valid email address.',
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `label="Disabled input"`, `modelValue="Cannot edit"`, `disabled=true`.' } },
  },
  args: {
    label: 'Disabled input',
    modelValue: 'Cannot edit',
    disabled: true,
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VTextInput },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <VTextInput size="sm" label="Small" placeholder="Small input" />
        <VTextInput size="md" label="Medium" placeholder="Medium input" />
        <VTextInput size="lg" label="Large" placeholder="Large input" />
      </div>
    `,
  }),
}

export const Clearable: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Limpável**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VTextInput },
    setup() {
      const search = ref('Product')
      return { search }
    },
    template: `
      <VTextInput
        v-model="search"
        label="Search"
        placeholder="Search products..."
        leading-icon="search"
        clearable
        helper-text="Use clearable for search inputs to help users quickly reset their input."
      />
    `,
  }),
}

export const SuccessMessage: Story = { parameters: { docs: { description: { story: 'Variação **Sucesso Message**. Props: `label="Usuário"`, `modelValue="walder"`, `successMessage="Nome disponível"`.' } } }, args: { label: 'Usuário', modelValue: 'walder', successMessage: 'Nome disponível' } }

export const ReadonlyRequired: Story = { parameters: { docs: { description: { story: 'Variação **Somente leitura obrigatório**. Props: `label="ID"`, `modelValue="ABC-123"`, `readonly=true`, `required=true`.' } } }, args: { label: 'ID', modelValue: 'ABC-123', readonly: true, required: true } }

export const TypeEmail: Story = { parameters: { docs: { description: { story: 'Variação **Type Email**. Props: `label="E-mail"`, `type="email"`, `placeholder="voce@empresa.com"`.' } } }, args: { label: 'E-mail', type: 'email', placeholder: 'voce@empresa.com' } }

export const TypeUrlTel: Story = { parameters: { docs: { description: { story: 'Variação **Type Url Tel**. Props: `label="Site"`, `type="url"`, `placeholder="https://"`.' } } }, args: { label: 'Site', type: 'url', placeholder: 'https://' } }
