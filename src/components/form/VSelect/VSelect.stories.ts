import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VSelect from './VSelect.vue'
import { DEFAULT_VSELECT_OPTIONS } from './mountVSelect'

const meta = {
  title: 'form/VSelect',
  component: VSelect,
  args: {
    size: 'md',
    label: 'Product',
    placeholder: 'Select option',
    options: DEFAULT_VSELECT_OPTIONS,
  },
  decorators: [
    () => ({
      template:
        '<div style="width:100%;max-width:420px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `modelValue="product"`, `label="Product"`.' } },
  },
  args: {
    modelValue: 'product',
    label: 'Product',
  },
}

export const WithIcon: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com ícone**. Props: `label="Category"`, `placeholder="All categories"`, `leadingIcon="layers"`.' } },
  },
  args: {
    label: 'Category',
    placeholder: 'All categories',
    leadingIcon: 'layers',
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VSelect },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <VSelect size="sm" label="Small" model-value="product" />
        <VSelect size="md" label="Medium" model-value="product" />
        <VSelect size="lg" label="Large" model-value="product" />
      </div>
    `,
  }),
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Erro**. Props: `label="Product"`, `modelValue="product"`, `errorMessage="Please choose a valid optio…"`.' } },
  },
  args: {
    label: 'Product',
    modelValue: 'product',
    errorMessage: 'Please choose a valid option.',
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `label="Product"`, `modelValue="product"`, `disabled=true`.' } },
  },
  args: {
    label: 'Product',
    modelValue: 'product',
    disabled: true,
  },
}

export const Open: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Aberto**. Interativo: o estado é mantido na própria story (`v-model`). Inclui interação automatizada (`play`).' } },
  },
  render: () => ({
    components: { VSelect },
    setup() {
      const value = ref('product')
      const open = ref(true)
      return { value, open, options: DEFAULT_VSELECT_OPTIONS }
    },
    template: `
      <VSelect
        v-model="value"
        label="Product"
        :options="options"
        @open-change="open = $event"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-test-id="v-select-trigger"]') as HTMLButtonElement | null
    trigger?.click()
  },
}

export const Clearable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Variação **Limpável**. Interativo: permite selecionar e limpar a seleção com o botão de limpeza (`clearable`).',
      },
    },
  },
  render: () => ({
    components: { VSelect },
    setup() {
      const value = ref('product')
      return { value, options: DEFAULT_VSELECT_OPTIONS }
    },
    template: `
      <VSelect
        v-model="value"
        label="Product"
        :options="options"
        clearable
      />
    `,
  }),
}
