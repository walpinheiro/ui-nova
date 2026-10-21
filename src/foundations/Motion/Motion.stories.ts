import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CustomizeGuide from '../_shared/CustomizeGuide.vue'
import FunctionalClassTable from '../_shared/FunctionalClassTable.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'
import { MOTION_FUNCTIONAL_CLASSES } from '../_shared/functionalClasses'
import MotionExamples from './MotionExamples.vue'

const meta = {
  title: 'Foundations/Motion',
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
    setup: () => ({ MOTION_FUNCTIONAL_CLASSES }),
    template: '<FunctionalClassTable title="Duração, easing e estado" :rows="MOTION_FUNCTIONAL_CLASSES" />',
  }),
}

export const Examples: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Examples**.' } },
  },
  name: 'Exemplos visuais',
  render: () => ({
    components: { MotionExamples },
    template: '<MotionExamples />',
  }),
}

export const Customize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Customize**.' } },
  },
  name: 'Como customizar',
  render: () => ({
    components: { CustomizeGuide, MotionExamples },
    template: `
      <CustomizeGuide
        title="Ritmo de interacção"
        css=":root {
  --v-motion-fast: 120ms;
  --v-motion-normal: 220ms;
  --v-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --v-state-press-scale: 0.97;
}"
      >
        <div style="--v-motion-normal:280ms;--v-state-press-scale:0.96;">
          <MotionExamples />
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
        <TokenCatalog :prefix="['--v-motion-', '--v-ease-', '--v-state-', '--v-gesture-']" placeholder="Buscar motion — ease-spring, press-scale" />
      </div>
    `,
  }),
}
