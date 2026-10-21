import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CustomizeGuide from '../_shared/CustomizeGuide.vue'
import FunctionalClassTable from '../_shared/FunctionalClassTable.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'
import { COLOR_FUNCTIONAL_CLASSES, CUSTOM_THEME_PRESET } from '../_shared/functionalClasses'
import ColorPaletteDemo from './ColorPaletteDemo.vue'

const meta = {
  title: 'Foundations/Colors',
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
    setup: () => ({ COLOR_FUNCTIONAL_CLASSES }),
    template: '<FunctionalClassTable title="Cores semânticas (Tailwind colors)" :rows="COLOR_FUNCTIONAL_CLASSES" show-preview />',
  }),
}

export const DefaultPalette: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão Palette**.' } },
  },
  name: 'Paleta default',
  render: () => ({
    components: { ColorPaletteDemo },
    template: '<ColorPaletteDemo />',
  }),
}

export const Customize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Customize**.' } },
  },
  name: 'Como customizar',
  render: () => ({
    components: { CustomizeGuide, ColorPaletteDemo },
    setup: () => ({ CUSTOM_THEME_PRESET }),
    template: `
      <CustomizeGuide
        title="White-label: sobrescreva aliases semânticos primeiro"
        css=":root {
  --v-color-primary: #0d9488;
  --v-color-primary-hover: #0f766e;
  --v-color-primary-500: #14b8a6;
  --v-color-primary-600: #0d9488;
  --v-color-focus: #2dd4bf;
  --v-color-success-base: #059669;
}"
      >
        <div :style="CUSTOM_THEME_PRESET.vars">
          <ColorPaletteDemo />
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
        <TokenCatalog prefix="--v-color-" placeholder="Buscar cor — ex.: primary-500, success, border" />
      </div>
    `,
  }),
}
