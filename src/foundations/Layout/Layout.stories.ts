import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CustomizeGuide from '../_shared/CustomizeGuide.vue'
import FunctionalClassTable from '../_shared/FunctionalClassTable.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'
import { LAYOUT_FUNCTIONAL_CLASSES } from '../_shared/functionalClasses'
import LayoutExamples from './LayoutExamples.vue'

const meta = {
  title: 'Foundations/Layout',
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
    setup: () => ({ LAYOUT_FUNCTIONAL_CLASSES }),
    template: '<FunctionalClassTable title="Flex, stack, z-index e breakpoints" :rows="LAYOUT_FUNCTIONAL_CLASSES" />',
  }),
}

export const Examples: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Examples**.' } },
  },
  name: 'Exemplos visuais',
  render: () => ({
    components: { LayoutExamples },
    template: '<LayoutExamples />',
  }),
}

export const Customize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Customize**.' } },
  },
  name: 'Como customizar',
  render: () => ({
    components: { CustomizeGuide, LayoutExamples },
    template: `
      <CustomizeGuide
        title="Gaps semânticos e camadas de overlay"
        css=":root {
  --v-flex-gap-md: 1.25rem;
  --v-stack-gap-md: 1rem;
  --v-z-index-modal: 2000;
  --v-z-index-tooltip: 2500;
}"
      >
        <div style="--v-flex-gap-md:1.25rem;--v-stack-gap-md:1rem;">
          <LayoutExamples />
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
        <TokenCatalog :prefix="['--v-flex-', '--v-stack-', '--v-z-index-', '--v-breakpoint-', '--v-grid-']" placeholder="Buscar layout — flex-gap, z-index, breakpoint" />
      </div>
    `,
  }),
}
