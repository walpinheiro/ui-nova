import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VNumberInput from './VNumberInput.vue'

const meta = {
  title: 'form/VNumberInput',
  component: VNumberInput,
  args: {
    size: 'md',
    label: 'Quantity',
    modelValue: 42,
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:320px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VNumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `label="Quantity"`, `modelValue=42`.' } },
  },
  args: {
    label: 'Quantity',
    modelValue: 42,
  },
}

export const Currency: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Currency**. Props: `label="Price"`, `modelValue=99`, `prefix="$"`, `placeholder="0.00"`, `helperText="Base product price"`.' } },
  },
  args: {
    label: 'Price',
    modelValue: 99,
    prefix: '$',
    placeholder: '0.00',
    helperText: 'Base product price',
  },
}

export const Percentage: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Percentage**. Props: `label="Discount"`, `modelValue=25`, `suffix="%"`, `helperText="Applied at checkout"`.' } },
  },
  args: {
    label: 'Discount',
    modelValue: 25,
    suffix: '%',
    helperText: 'Applied at checkout',
  },
}

export const MinMax: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Min Max**. Props: `label="Inventory"`, `modelValue=10`, `min=0`, `max=1000`, `helperText="Minimum of 0, maximum of 10…"`.' } },
  },
  args: {
    label: 'Inventory',
    modelValue: 10,
    min: 0,
    max: 1000,
    helperText: 'Minimum of 0, maximum of 1000',
  },
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Erro**. Props: `label="Discount"`, `min=0`, `errorMessage="Must be ≥ 0"`.' } },
  },
  args: {
    label: 'Discount',
    modelValue: -1,
    min: 0,
    errorMessage: 'Must be ≥ 0',
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `label="Quantity"`, `modelValue=42`, `disabled=true`.' } },
  },
  args: {
    label: 'Quantity',
    modelValue: 42,
    disabled: true,
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VNumberInput },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:320px">
        <VNumberInput size="sm" label="Small" :model-value="12" />
        <VNumberInput size="md" label="Medium" :model-value="42" />
        <VNumberInput size="lg" label="Large" :model-value="100" />
      </div>
    `,
  }),
}

export const ProductPricing: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Product Pricing**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VNumberInput },
    setup() {
      const price = ref(29.99)
      const discount = ref(10)
      const inventory = ref(100)
      return { price, discount, inventory }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:320px">
        <VNumberInput v-model="price" label="Price" prefix="$" helper-text="Base product price" :min="0" />
        <VNumberInput v-model="discount" label="Discount" suffix="%" helper-text="Applied at checkout" :min="0" :max="100" />
        <VNumberInput v-model="inventory" label="Inventory" helper-text="Units in stock" :min="0" />
      </div>
    `,
  }),
}

export const ReadonlyRequired: Story = { parameters: { docs: { description: { story: 'Variação **Somente leitura obrigatório**. Props: `label="Quantidade"`, `modelValue=5`, `readonly=true`, `required=true`.' } } }, args: { label: 'Quantidade', modelValue: 5, readonly: true, required: true } }

export const Step: Story = { parameters: { docs: { description: { story: 'Variação **Step**. Props: `label="Passo de 5"`, `modelValue=10`, `step=5`, `min=0`, `max=100`.' } } }, args: { label: 'Passo de 5', modelValue: 10, step: 5, min: 0, max: 100, variant: 'stepper' } }

export const ScrubInteraction: Story = { parameters: { docs: { description: { story: 'Variação **Scrub Interaction**. Props: `label="Arraste para alterar"`, `modelValue=50`, `interaction="scrub"`.' } } }, args: { label: 'Arraste para alterar', modelValue: 50, interaction: 'scrub' } }
