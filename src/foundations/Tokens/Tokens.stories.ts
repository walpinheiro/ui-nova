import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VBadge from '../../components/feedback/VBadge/VBadge.vue'
import VProgress from '../../components/feedback/VProgress/VProgress.vue'
import VTag from '../../components/primitives/VTag/VTag.vue'
import TokenCatalog from '../_shared/TokenCatalog.vue'

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Catalog: Story = {
  name: 'Catálogo completo (busca)',
  parameters: {
    docs: { description: { story: 'Variação **Catalog**.' } },
    layout: 'fullscreen',
  },
  render: () => ({
    components: { TokenCatalog },
    template: '<div style="padding:var(--v-space-6);max-width:1200px;margin:0 auto;"><TokenCatalog show-category-filter placeholder="Buscar entre todos os tokens…" /></div>',
  }),
}

export const RadiusCircleVsPill: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Radius Circle Vs pill**.' } },
  },
  name: 'Radius: circle vs pill',
  render: () => ({
    template: `
      <div style="display:grid;gap:24px;max-width:520px;font-family:var(--v-font-family-sans);">
        <div>
          <p style="margin:0 0 8px;font-size:var(--v-font-size-text-small);color:var(--v-color-text-muted);">
            <code>--v-radius-circle</code> (50%) num retângulo vira elipse — use só em quadrados/círculos.
          </p>
          <div style="width:120px;height:32px;border-radius:var(--v-radius-circle);background:var(--v-color-primary-100);border:var(--v-border-width) solid var(--v-color-primary-200);" />
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:var(--v-font-size-text-small);color:var(--v-color-text-muted);">
            <code>--v-radius-pill</code> mantém cápsula em chips, tags e tabs pill.
          </p>
          <div style="width:120px;height:32px;border-radius:var(--v-radius-pill);background:var(--v-color-primary-100);border:var(--v-border-width) solid var(--v-color-primary-200);" />
        </div>
      </div>
    `,
  }),
}

export const ChipAndTagTokens: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Chip e Tag Tokens**.' } },
  },
  name: 'Chip / Tag',
  render: () => ({
    components: { VTag, VBadge },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
        <VTag variant="soft">Filter</VTag>
        <VTag variant="outline" removable>Removable</VTag>
        <VBadge removable count="3">Inbox</VBadge>
      </div>
    `,
  }),
}

export const FieldAndProgressTokens: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Field e Progress Tokens**.' } },
  },
  name: 'Field / Progress',
  render: () => ({
    components: { VProgress },
    template: `
      <div style="display:grid;gap:24px;max-width:360px;">
        <VProgress :value="62" label="Upload" />
        <VProgress :value="45" variant="circular" size="md" />
      </div>
    `,
  }),
}

export const ThemeOverridePreview: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Theme Override Preview**.' } },
  },
  name: 'Theme override',
  render: () => ({
    components: { VTag },
    template: `
      <div
        style="
          --v-radius-pill: 8px;
          --v-tag-height-md: 2rem;
          --v-color-primary: #0d9488;
          --v-color-primary-hover: #0f766e;
          display:flex;flex-wrap:wrap;gap:12px;padding:16px;
          border:var(--v-border-width) dashed var(--v-color-border);border-radius:var(--v-radius-md);
        "
      >
        <VTag>Custom pill radius</VTag>
        <VTag variant="soft">Custom brand</VTag>
      </div>
    `,
  }),
}
