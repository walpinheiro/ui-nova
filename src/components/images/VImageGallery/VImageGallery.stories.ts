import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VImageGallery from './VImageGallery.vue'

const images = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', alt: 'Mountain lake' },
  { src: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49c?w=400&h=400&fit=crop', alt: 'Santorini' },
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop', alt: 'Desert palm' },
  { src: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop', alt: 'Golden retriever' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', alt: 'Forest' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', alt: 'Beach' },
  { src: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=400&fit=crop', alt: 'Cherry blossom' },
  { src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=400&fit=crop', alt: 'City building' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop', alt: 'Mountain valley' },
]

const meta = {
  parameters: {
    docs: { description: { component: 'Exibir coleções de imagens num layout limpo e flexível, com apresentação por miniaturas, seleção (simples ou múltipla) e pré-visualização expandida (lightbox) com animações suaves. Casos de uso citados: portfólios, showcases de produto e media libraries. Combina três capacidades: apresentação visual, seleção e expansão.' } },
  },
  title: 'images/VImageGallery',
  component: VImageGallery,
  tags: ['autodocs'],
  args: { images, layout: 'grid', size: 'md', selectable: true, multiple: true },
} satisfies Meta<typeof VImageGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Hero: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Hero**. Props: `layout="grid"`, `selectable=true`, `multiple=true`.' } },
  },
  args: { images, layout: 'grid', selectable: true, multiple: true },
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VImageGallery },
    template: `
      <div style="display:grid;gap:24px">
        <VImageGallery :images="images" layout="grid" data-test-id="docs-image-gallery-variant-grid" />
        <VImageGallery :images="images.slice(0,6)" layout="masonry" data-test-id="docs-image-gallery-variant-masonry" />
        <VImageGallery :images="images" layout="carousel" data-test-id="docs-image-gallery-variant-carousel" />
        <VImageGallery :images="images" layout="grid" selectable multiple data-test-id="docs-image-gallery-variant-selectable" />
      </div>
    `,
    setup: () => ({ images }),
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VImageGallery },
    template: `
      <div style="display:grid;gap:24px">
        <VImageGallery :images="images.slice(0,3)" size="sm" data-test-id="docs-image-gallery-size-sm" />
        <VImageGallery :images="images.slice(0,3)" size="md" data-test-id="docs-image-gallery-size-md" />
        <VImageGallery :images="images.slice(0,3)" size="lg" data-test-id="docs-image-gallery-size-lg" />
      </div>
    `,
    setup: () => ({ images }),
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**.' } },
  },
  render: () => ({
    components: { VImageGallery },
    template: `
      <div style="display:grid;gap:24px;max-width:420px">
        <VImageGallery :images="images.slice(0,1)" data-test-id="docs-image-gallery-state-default" />
        <VImageGallery :images="images.slice(0,1)" selectable :model-value="[0]" data-test-id="docs-image-gallery-state-selected" />
        <VImageGallery :images="[]" data-test-id="docs-image-gallery-state-empty" />
      </div>
    `,
    setup: () => ({ images }),
  }),
}

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }

export const Columns: Story = { parameters: { docs: { description: { story: 'Variação **Columns**. Props: `columns=2`.' } } }, args: { columns: 2 } }
