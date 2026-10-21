import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CustomizeGuide from '../_shared/CustomizeGuide.vue'
import FunctionalClassTable from '../_shared/FunctionalClassTable.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'
import { RADIUS_CSS_VARS, RADIUS_FUNCTIONAL_CLASSES } from '../_shared/functionalClasses'
import RadiusExamples from './RadiusExamples.vue'

const meta = {
  title: 'Foundations/Radius',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const RADIUS_PREFIX = ['--v-radius-', '--v-chip-radius', '--v-tag-radius', '--v-card-radius', '--v-tabs-pill']

export const FunctionalClasses: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Functional Classes**.' } },
  },
  name: 'Classes funcionais',
  render: () => ({
    components: { FunctionalClassTable },
    setup: () => ({ RADIUS_FUNCTIONAL_CLASSES, RADIUS_CSS_VARS }),
    template: `
      <div style="display:grid;gap:32px;">
        <FunctionalClassTable title="Tailwind (borderRadius)" :rows="RADIUS_FUNCTIONAL_CLASSES" show-preview />
        <FunctionalClassTable title="CSS var directo (componentes)" :rows="RADIUS_CSS_VARS" />
      </div>
    `,
  }),
}

export const Examples: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Examples**.' } },
  },
  name: 'Exemplos visuais',
  render: () => ({
    components: { RadiusExamples },
    template: '<RadiusExamples />',
  }),
}

export const Customize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Customize**.' } },
  },
  name: 'Como customizar',
  render: () => ({
    components: { CustomizeGuide, RadiusExamples },
    template: `
      <CustomizeGuide
        title="Sobrescreva tokens base — propagam para chips, cards e tabs"
        css=":root {
  --v-radius-md: 10px;
  --v-radius-pill: 9999px;   /* cápsulas */
  --v-radius-circle: 50%;    /* só quadrados */
  --v-card-radius: 20px;
}"
      >
        <div style="--v-radius-md:10px;--v-radius-pill:8px;--v-card-radius:20px;display:grid;gap:16px;max-width:520px;">
          <RadiusExamples />
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
        <TokenCatalog :prefix="['--v-radius-', '--v-chip-radius', '--v-tag-radius', '--v-card-radius', '--v-tabs-pill']" placeholder="Buscar radius — ex.: pill, md, card" />
      </div>
    `,
  }),
}
