import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CustomizeGuide from '../_shared/CustomizeGuide.vue'
import FunctionalClassTable from '../_shared/FunctionalClassTable.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'
import { SHADOW_FUNCTIONAL_CLASSES } from '../_shared/functionalClasses'
import ShadowExamples from './ShadowExamples.vue'

const meta = {
  title: 'Foundations/Shadow',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const FunctionalClasses: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Functional Classes**.' } },
  },
  name: 'Classes funcionais',
  render: () => ({
    components: { FunctionalClassTable },
    setup: () => ({ SHADOW_FUNCTIONAL_CLASSES }),
    template: '<FunctionalClassTable title="Sombras Tailwind → tokens" :rows="SHADOW_FUNCTIONAL_CLASSES" show-preview />',
  }),
}

export const Examples: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Examples**.' } },
  },
  name: 'Exemplos visuais',
  render: () => ({
    components: { ShadowExamples },
    template: '<ShadowExamples />',
  }),
}

export const Customize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Customize**.' } },
  },
  name: 'Como customizar',
  render: () => ({
    components: { CustomizeGuide, ShadowExamples },
    template: `
      <CustomizeGuide
        title="Elevação e profundidade"
        css=":root {
  --v-shadow-sm: 0 1px 2px rgb(15 23 42 / 0.08);
  --v-shadow-md: 0 8px 24px rgb(15 23 42 / 0.12);
  --v-shadow-lg: 0 16px 40px rgb(15 23 42 / 0.16);
}"
      >
        <div style="--v-shadow-md:0 12px 32px rgb(13 148 136 / 0.2);">
          <ShadowExamples />
        </div>
      </CustomizeGuide>
    `,
  }),
}

export const TokenCatalogStory: Story = {
  name: 'Tokens (busca)',
  parameters: { docs: { description: { story: 'Variação **Token Catalog Story**.' } }, layout: 'fullscreen' },
  render: () => ({
    components: { TokenCatalog },
    template: `
      <div style="padding:var(--v-space-6);max-width:960px;margin:0 auto;">
        <TokenCatalog prefix="--v-shadow-" placeholder="Buscar sombra — shadow-md" />
      </div>
    `,
  }),
}
