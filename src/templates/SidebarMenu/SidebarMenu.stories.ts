import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TemplateShell from '../_shared/TemplateShell.vue'
import SidebarMenuDemo from './SidebarMenuDemo.vue'
import SidebarMenuMultilevelDemo from './SidebarMenuMultilevelDemo.vue'
import { DEFAULT_TEMPLATE_THEME_ID, formatTemplateThemeCss } from '../_shared/templateThemes'

/** Token info lives in a collapsed <details> below the sidebar so the sidebar stays the hero. */
const tokensSnippet = formatTemplateThemeCss(DEFAULT_TEMPLATE_THEME_ID)
const tokensDetails = `
  <details data-test-id="sidebar-tokens-details" style="margin-top:var(--v-space-3);font-size:var(--v-font-size-caption);color:var(--v-color-text-muted)">
    <summary style="cursor:pointer">Variáveis CSS (tokens <code>--v-color-primary-*</code>)</summary>
    <pre style="overflow:auto;margin:var(--v-space-2) 0 0;padding:var(--v-space-3);border-radius:var(--v-radius-md);background:var(--v-color-neutral-100);color:var(--v-color-text)"><code>{{ tokensSnippet }}</code></pre>
  </details>`

const meta = {
  title: 'Templates/Menu lateral',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Padrão mínimo: `VSidebar` fixo à esquerda e área principal com conteúdo. Ideal para dashboards e apps com navegação primária.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Basico: Story = {
  name: 'Menu lateral básico',
  render: () => ({
    components: { TemplateShell, SidebarMenuDemo },
    setup: () => ({ tokensSnippet }),
    template: `
      <TemplateShell :show-theme-bar="false" title="VSidebar + conteúdo principal" height="720px">
        <SidebarMenuDemo />
      </TemplateShell>
      ${tokensDetails}
    `,
  }),
}

export const AlturaCompacta: Story = {
  name: 'Altura compacta (560px)',
  render: () => ({
    components: { TemplateShell, SidebarMenuDemo },
    setup: () => ({ tokensSnippet }),
    template: `
      <TemplateShell :show-theme-bar="false" title="Rail lateral em viewport menor" height="560px">
        <SidebarMenuDemo />
      </TemplateShell>
      ${tokensDetails}
    `,
  }),
}

export const MultinivelAcordeao: Story = {
  name: 'Multi-nível com acordeão e grupos',
  render: () => ({
    components: { TemplateShell, SidebarMenuMultilevelDemo },
    setup: () => ({ tokensSnippet }),
    template: `
      <TemplateShell :show-theme-bar="false" title="VSidebar multi-nível" height="560px">
        <SidebarMenuMultilevelDemo />
      </TemplateShell>
      ${tokensDetails}
    `,
  }),
}
