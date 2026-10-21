import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CustomizeGuide from '../_shared/CustomizeGuide.vue'
import FunctionalClassTable from '../_shared/FunctionalClassTable.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'
import { SPACING_FUNCTIONAL_CLASSES } from '../_shared/functionalClasses'
import SpacingExamples from './SpacingExamples.vue'

const meta = {
  title: 'Foundations/Spacing',
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
    setup: () => ({ SPACING_FUNCTIONAL_CLASSES }),
    template: '<FunctionalClassTable title="Escala de espaçamento (Tailwind spacing)" :rows="SPACING_FUNCTIONAL_CLASSES" />',
  }),
}

export const Examples: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Examples**.' } },
  },
  name: 'Exemplos visuais',
  render: () => ({
    components: { SpacingExamples },
    template: '<SpacingExamples />',
  }),
}

export const Customize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Customize**.' } },
  },
  name: 'Como customizar',
  render: () => ({
    components: { CustomizeGuide, SpacingExamples },
    template: `
      <CustomizeGuide
        title="Escala global — afecta padding, margin, gap e inset"
        css=":root {
  --v-space-1: 0.25rem;   /* 4px default */
  --v-space-4: 1.25rem;   /* 16px → 20px */
  --v-space-6: 2rem;      /* 24px → 32px */
  --v-field-height-md: 2.75rem;
}"
      >
        <div style="--v-space-4:1.25rem;--v-space-6:2rem;">
          <SpacingExamples />
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
        <TokenCatalog prefix="--v-space-" placeholder="Buscar espaçamento — ex.: space-4, 16px" />
      </div>
    `,
  }),
}
