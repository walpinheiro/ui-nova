import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VPagination from './VPagination.vue'

const meta = {
  title: 'navigation/VPagination',
  component: VPagination,
  args: {
    total: 240,
    pageSize: 10,
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    modelValue: { control: { type: 'number', min: 1 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'compact', 'ellipsis'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  decorators: [
    () => ({
      template: '<div class="stage" style="width:100%;max-width:720px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VPagination>

export default meta
type Story = StoryObj<typeof meta>

const boundStory = (args: Partial<Story['args']> = {}): Story => ({
  args: { modelValue: 3, ...args },
  render: (storyArgs) => ({
    components: { VPagination },
    setup() {
      const page = ref(storyArgs.modelValue ?? 3)
      const pageSize = ref(storyArgs.pageSize ?? 10)
      return { page, pageSize, storyArgs }
    },
    template: `
      <VPagination
        v-model="page"
        :total="storyArgs.total ?? 240"
        :page-size="pageSize"
        :size="storyArgs.size ?? 'md'"
        :variant="storyArgs.variant ?? 'default'"
        :disabled="Boolean(storyArgs.disabled)"
        :loading="Boolean(storyArgs.loading)"
        :show-page-size="Boolean(storyArgs.showPageSize)"
        :show-result-count="Boolean(storyArgs.showResultCount)"
        @update:page-size="pageSize = $event"
      />
    `,
  }),
})

export const Default: Story = boundStory()

export const Ellipsis: Story = boundStory({
  modelValue: 9,
  variant: 'ellipsis',
})

export const Compact: Story = boundStory({ variant: 'compact' })

export const WithPageSize: Story = boundStory({
  showPageSize: true,
  showResultCount: true,
})

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPagination },
    setup() {
      const page = ref(3)
      return { page }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:100%;">
        <VPagination v-model="page" :total="240" :page-size="10" size="sm" />
        <VPagination v-model="page" :total="240" :page-size="10" size="md" />
        <VPagination v-model="page" :total="240" :page-size="10" size="lg" />
      </div>
    `,
  }),
}

export const FirstPage: Story = boundStory({ modelValue: 1 })

export const LastPage: Story = boundStory({ modelValue: 24 })

export const Disabled: Story = boundStory({
  disabled: true,
  showPageSize: true,
  showResultCount: true,
})

export const Loading: Story = boundStory({
  loading: true,
  showPageSize: true,
  showResultCount: true,
})

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPagination },
    setup() {
      const page = ref(3)
      const pageSize = ref(10)
      const disabled = ref(false)
      const loading = ref(false)
      const stateLabel = () => {
        if (loading.value) return 'loading'
        if (disabled.value) return 'disabled'
        return 'default'
      }
      return { page, pageSize, disabled, loading, stateLabel }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:100%;">
        <p style="margin:0;color:var(--v-color-text-muted);font-size:14px;">
          Página {{ page }} · {{ pageSize }} itens/página · estado: {{ stateLabel() }}
        </p>
        <VPagination
          v-model="page"
          :total="240"
          :page-size="pageSize"
          :disabled="disabled"
          :loading="loading"
          show-page-size
          show-result-count
          @update:page-size="pageSize = $event"
        />
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" @click="disabled = !disabled">
            {{ disabled ? 'Habilitar' : 'Desabilitar' }}
          </button>
          <button type="button" @click="loading = !loading">
            {{ loading ? 'Parar loading' : 'Simular loading' }}
          </button>
        </div>
      </div>
    `,
  }),
}

export const SiblingAndBoundaryCount: Story = { parameters: { docs: { description: { story: 'Variação **Sibling e Boundary Count**. Props: `total=500`, `pageSize=10`, `modelValue=25`, `siblingCount=2`, `boundaryCount=2`.' } } }, args: { total: 500, pageSize: 10, modelValue: 25, siblingCount: 2, boundaryCount: 2 } }

export const PageCount: Story = { parameters: { docs: { description: { story: 'Variação **Page Count**. Props: `pageCount=12`, `modelValue=6`.' } } }, args: { pageCount: 12, modelValue: 6 } }

export const PageSizeOptions: Story = { parameters: { docs: { description: { story: 'Variação **Page tamanho Options**. Props: `total=240`, `showPageSize=true`, `showResultCount=true`.' } } }, args: { total: 240, showPageSize: true, pageSizeOptions: [10, 25, 50, 100], showResultCount: true } }

export const CustomLabels: Story = { parameters: { docs: { description: { story: 'Variação **Personalizado Labels**. Props: `prevLabel="Anterior"`, `nextLabel="Próxima"`, `pageSizeLabel="Itens por página"`, `showPageSize=true`.' } } }, args: { prevLabel: 'Anterior', nextLabel: 'Próxima', pageSizeLabel: 'Itens por página', showPageSize: true } }
