import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CustomizeGuide from '../_shared/CustomizeGuide.vue'
import FunctionalClassTable from '../_shared/FunctionalClassTable.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'
import { TYPOGRAPHY_FUNCTIONAL_CLASSES } from '../_shared/functionalClasses'
import TypographyExamples from './TypographyExamples.vue'

const meta = {
  title: 'Foundations/Typography',
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
    setup: () => ({ TYPOGRAPHY_FUNCTIONAL_CLASSES }),
    template: '<FunctionalClassTable title="Tipografia Tailwind → tokens" :rows="TYPOGRAPHY_FUNCTIONAL_CLASSES" />',
  }),
}

export const Examples: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Examples**.' } },
  },
  name: 'Exemplos visuais',
  render: () => ({
    components: { TypographyExamples },
    template: '<TypographyExamples />',
  }),
}

export const Customize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Customize**.' } },
  },
  name: 'Como customizar',
  render: () => ({
    components: { CustomizeGuide, TypographyExamples },
    template: `
      <CustomizeGuide
        title="Escala tipográfica global"
        css=":root {
  --v-font-family-sans: 'Inter', system-ui, sans-serif;
  --v-font-size-text-medium: 1rem;
  --v-line-height-text-medium: 1.6;
  --v-font-weight-semibold: 600;
}"
      >
        <div style="--v-font-size-h1:2.75rem;--v-line-height-h1:1.1;">
          <TypographyExamples />
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
        <TokenCatalog :prefix="['--v-font-', '--v-line-height-']" placeholder="Buscar tipografia — font-size-h1, line-height" />
      </div>
    `,
  }),
}
