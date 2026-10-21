import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VTagInput from './VTagInput.vue'

const meta = {
  title: 'form/VTagInput',
  component: VTagInput,
  args: {
    placeholder: 'Add a tag…',
    size: 'md',
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:420px;padding:8px;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VTagInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  args: { modelValue: ['Design', 'UI'] },
}

export const WithSuggestions: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Suggestions**.' } },
  },
  args: {
    modelValue: ['vue'],
    suggestions: ['vue', 'vue3', 'vue-router', 'vuex', 'vueuse'],
  },
}

export const Readonly: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Somente leitura**. Props: `readonly=true`.' } },
  },
  args: { modelValue: ['Vue', 'Components'], readonly: true },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } },
  },
  args: { modelValue: ['Tag'], disabled: true },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VTagInput },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <VTagInput size="sm" :model-value="['Tag']" />
        <VTagInput size="md" :model-value="['Tag']" />
        <VTagInput size="lg" :model-value="['Tag']" />
      </div>
    `,
  }),
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VTagInput },
    setup() {
      const tags = ref(['design', 'component', 'ui'])
      const suggestions = ['vue', 'vue3', 'vue-router', 'vuex', 'vueuse', 'component', 'composable', 'configuration']
      return { tags, suggestions }
    },
    template: `
      <VTagInput
        v-model="tags"
        :suggestions="suggestions"
        placeholder="Add a tag…"
      />
    `,
  }),
}

export const MaxTags: Story = { parameters: { docs: { description: { story: 'Variação **Max Tags**. Props: `maxTags=3`, `placeholder="Máx. 3 tags"`.' } } }, args: { modelValue: ['vue', 'ui'], maxTags: 3, placeholder: 'Máx. 3 tags' } }

export const Delimiters: Story = { parameters: { docs: { description: { story: 'Variação **Delimiters**. Props: `placeholder="Enter, vírgula ou Tab"`.' } } }, args: { modelValue: [], delimiters: ['enter', 'comma', 'tab'], placeholder: 'Enter, vírgula ou Tab' } }

export const AllowDuplicates: Story = { parameters: { docs: { description: { story: 'Variação **Allow Duplicates**. Props: `allowDuplicates=true`.' } } }, args: { modelValue: ['vue', 'vue'], allowDuplicates: true } }

export const ValidateTag: Story = { parameters: { docs: { description: { story: 'Variação **Validate Tag**. Props: `placeholder="Somente e-mails"`.' } } }, args: { modelValue: ['a@b.com'], validateTag: (t: string) => /.+@.+\..+/.test(t), placeholder: 'Somente e-mails' } }

export const EmptyText: Story = { parameters: { docs: { description: { story: 'Variação **Vazio texto**. Props: `readonly=true`, `emptyText="Nenhuma tag"`.' } } }, args: { modelValue: [], readonly: true, emptyText: 'Nenhuma tag' } }

export const Closable: Story = { parameters: { docs: { description: { story: 'Variação **Closable**. Props: `closable=true`.' } } }, args: { modelValue: ['vue', 'storybook'], closable: true } }

export const Multiline: Story = { parameters: { docs: { description: { story: 'Variação **Multiline**. Props: `multiline=true`.' } } }, args: { modelValue: ['um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito'], multiline: true } }
