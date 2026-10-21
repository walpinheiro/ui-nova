import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CustomizeGuide from '../_shared/CustomizeGuide.vue'
import FunctionalClassTable from '../_shared/FunctionalClassTable.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'
import { BORDER_CSS_VARS, BORDER_FUNCTIONAL_CLASSES } from '../_shared/functionalClasses'
import BorderExamples from './BorderExamples.vue'

const meta = {
  title: 'Foundations/Border',
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
    setup: () => ({ BORDER_FUNCTIONAL_CLASSES, BORDER_CSS_VARS }),
    template: `
      <div style="display:grid;gap:32px;">
        <FunctionalClassTable title="Tailwind border" :rows="BORDER_FUNCTIONAL_CLASSES" show-preview />
        <FunctionalClassTable title="Focus ring e tokens de componente" :rows="BORDER_CSS_VARS" />
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
    components: { BorderExamples },
    template: '<BorderExamples />',
  }),
}

export const Customize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Customize**.' } },
  },
  name: 'Como customizar',
  render: () => ({
    components: { CustomizeGuide, BorderExamples },
    template: `
      <CustomizeGuide
        title="Largura, cor e anel de foco"
        css=":root {
  --v-border-width: 1px;
  --v-border-width-focus: 3px;
  --v-color-border: #cbd5e1;
  --v-focus-ring-width: 3px;
  --v-focus-ring-offset: 2px;
}"
      >
        <div style="--v-border-width-focus:3px;--v-focus-ring-width:3px;--v-color-border:#94a3b8;">
          <BorderExamples />
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
        <TokenCatalog :prefix="['--v-border-', '--v-color-border', '--v-focus-ring', '--v-field-border']" placeholder="Buscar borda — ex.: border-width, focus" />
      </div>
    `,
  }),
}
