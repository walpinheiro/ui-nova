import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VMasonryGrid from './VMasonryGrid.vue'
import VMasonryItem from './VMasonryItem.vue'

const meta = {
  parameters: {
    docs: { description: { component: 'Layout de conteúdo de altura variável ("masonry"): organiza itens de alturas diferentes em colunas responsivas, sem espaços mortos ("gapless"), com fluxo visual natural. Ideal para galerias, feeds de artigos, portfólios e qualquer conteúdo onde alturas flexíveis criam uma navegação mais natural, estilo "magazine-like".' } },
  },
  title: 'grid/VMasonryGrid',
  component: VMasonryGrid,
  tags: ['autodocs'],
  args: { cols: 3, gap: 6 },
} satisfies Meta<typeof VMasonryGrid>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { id: 'mountains', title: 'Serene mountains', category: 'Nature', likes: 342, h: 220 },
  { id: 'mind', title: 'A calmer mind', category: 'Lifestyle', likes: 128, h: 120 },
  { id: 'village', title: 'Coastal village', category: 'Travel', likes: 521, h: 160 },
  { id: 'canyon', title: 'Into the canyon', category: 'Adventure', likes: 299, h: 240 },
  { id: 'workspace', title: 'Minimal workspace', category: 'Design', likes: 416, h: 160 },
  { id: 'cat', title: 'Curious friend', category: 'Animals', likes: 312, h: 160 },
]

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Slots usados: `#media`.' } },
  },
  render: (args) => ({
    components: { VMasonryGrid, VMasonryItem },
    setup: () => ({ args, items }),
    template: `
      <VMasonryGrid v-bind="args">
        <VMasonryItem
          v-for="item in items"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :category="item.category"
          :likes="item.likes"
        >
          <template #media>
            <div :style="{ height: item.h + 'px', background: 'linear-gradient(135deg,var(--v-color-primary-200),var(--v-color-info-soft))' }" />
          </template>
        </VMasonryItem>
      </VMasonryGrid>
    `,
  }),
}

export const TwoColumns: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Two Columns**. Props: `cols=2`.' } },
  },
  args: { cols: 2 },
  render: Default.render,
}

export const ResponsiveCols: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Responsive Cols**. Props: `gap=6`.' } },
  },
  args: { cols: { xs: 2, md: 3, lg: 4 }, gap: 6 },
  render: Default.render,
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } },
  },
  args: { loading: true },
}

export const Empty: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Vazio**. Props: `empty=true`.' } },
  },
  args: { empty: true },
}

export const SelectedTile: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Selected Tile**. Slots usados: `#media`.' } },
  },
  render: () => ({
    components: { VMasonryGrid, VMasonryItem },
    setup: () => ({ items }),
    template: `
      <VMasonryGrid :cols="3" :gap="6">
        <VMasonryItem id="selected" title="Selected item" category="Demo" :selected="true" :likes="42">
          <template #media><div style="height:140px;background:var(--v-color-primary-100)" /></template>
        </VMasonryItem>
        <VMasonryItem v-for="item in items.slice(1,4)" :key="item.id" v-bind="item">
          <template #media><div :style="{ height: item.h + 'px', background: 'var(--v-color-surface-muted)' }" /></template>
        </VMasonryItem>
      </VMasonryGrid>
    `,
  }),
}

export const VariantMagazine: Story = { parameters: { docs: { description: { story: 'Variação **Variante Magazine**. Props: `variant="magazine"`.' } } }, args: { variant: 'magazine' } }

export const VariantImageFirst: Story = { parameters: { docs: { description: { story: 'Variação **Variante imagem First**. Props: `variant="image-first"`.' } } }, args: { variant: 'image-first' } }
