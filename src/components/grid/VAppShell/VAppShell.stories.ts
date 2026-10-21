import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VCard from '../../containment/VCard/VCard.vue'
import VButton from '../../form/VButton/VButton.vue'
import VCardGrid from '../VCardGrid/VCardGrid.vue'
import VAppShell from './VAppShell.vue'

const meta = {
  parameters: {
    docs: { description: { component: '`VAppShell` é o **core application layout**: shell de aplicação com top bar, navegação lateral e painel utilitário. Tipografia densa: navegação em 14px, legendas de seção em 11px e itens de painel em 12px.' } },
  },
  title: 'grid/VAppShell',
  component: VAppShell,
  tags: ['autodocs'],
  args: { variant: 'dashboard', layoutMode: 'desktop', utilityOpen: true },
} satisfies Meta<typeof VAppShell>

export default meta
type Story = StoryObj<typeof meta>

const kpis = [
  { label: 'Total projects', value: '24', delta: '+12.04%' },
  { label: 'Active users', value: '1,280', delta: '+8.2%' },
  { label: 'Deployments', value: '12', delta: '+33.0%' },
]

const frame = (h: number) => `height:${h}px;border:1px solid var(--v-color-border);border-radius:12px;overflow:hidden;`
const titleStyle = 'margin:0;font-size:20px;line-height:1.3;font-weight:600;letter-spacing:-0.01em;'
const mutedStyle = 'margin:4px 0 0;font-size:14px;color:var(--v-color-text-muted);'
const captionStyle = 'margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--v-color-text-muted);'

const dashboard = (cols: number) => `
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;">
    <div><h1 style="${titleStyle}">Welcome back, Alex</h1><p style="${mutedStyle}">Here's what's happening with your projects today.</p></div>
    <VButton size="sm">New report</VButton>
  </div>
  <VCardGrid :cols="${cols}" :gap="4">
    <VCard v-for="k in kpis" :key="k.label" variant="outlined">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <span style="font-size:12px;color:var(--v-color-text-muted);">{{ k.label }}</span>
        <span style="font-size:24px;line-height:1.2;font-weight:600;letter-spacing:-0.02em;">{{ k.value }}</span>
        <span style="font-size:12px;font-weight:500;color:var(--v-color-success-strong);">{{ k.delta }}</span>
      </div>
    </VCard>
  </VCardGrid>`

const renderDashboard = (height = 640, cols = 3, wrapStyle = '') => (args: Record<string, unknown>) => ({
  components: { VAppShell, VCardGrid, VCard, VButton },
  setup: () => ({ args, kpis }),
  template: `<div style="${frame(height)}${wrapStyle}"><VAppShell v-bind="args">${dashboard(cols)}</VAppShell></div>`,
})

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Shell padrão (dashboard): top bar, navegação lateral de 14px, conteúdo com título de 20px e painel utilitário com ações rápidas e atalhos. Use **Controls** para experimentar as props.' } },
  },
  render: renderDashboard(),
}

export const CollapsedSidebar: Story = {
  parameters: {
    docs: { description: { story: '`sidebarCollapsed=true`: a navegação vira um rail de 72px apenas com ícones, liberando espaço para o conteúdo. O painel utilitário está fechado para destacar o rail.' } },
  },
  args: { sidebarCollapsed: true, utilityOpen: false },
  render: renderDashboard(),
}

export const TabletLayout: Story = {
  parameters: {
    docs: { description: { story: '`layoutMode="tablet"`: a navegação empilha acima do conteúdo e o painel utilitário vira um drawer lateral (`utilityOpen`). Aqui o drawer está aberto, em um container de 820px.' } },
  },
  args: { layoutMode: 'tablet', utilityOpen: true },
  render: renderDashboard(720, 2, 'max-width:820px;margin:0 auto;transform:translateZ(0);'),
}

export const EditorVariant: Story = {
  parameters: {
    docs: { description: { story: '`variant="editor"`: conteúdo em tela cheia sem moldura de card, sidebar como explorador de arquivos (slot `sidebar`) e painel utilitário como inspetor (slot `utility`).' } },
  },
  args: { variant: 'editor', brandName: 'Studio', searchPlaceholder: 'Ir para arquivo…' },
  render: (args) => ({
    components: { VAppShell, VButton },
    setup: () => ({
      args,
      files: ['src', 'App.vue', 'main.ts', 'router.ts', 'styles.css'],
      lines: ['<script setup lang="ts">', "import { ref } from 'vue'", '', 'const count = ref(0)', '</script>', '', '<template>', '  <button @click="count++">', '    Count: {{ count }}', '  </button>', '</template>'],
      props: [['Language', 'Vue'], ['Lines', '11'], ['Encoding', 'UTF-8'], ['Indent', '2 spaces']],
    }),
    template: `
      <div style="${frame(640)}">
        <VAppShell v-bind="args">
          <template #sidebar>
            <div style="padding:12px 8px;font-size:14px;">
              <p style="${captionStyle}margin-left:8px;">Explorer</p>
              <div v-for="(f, i) in files" :key="f" :style="{padding:'6px 8px',borderRadius:'6px',color:i===1?'var(--v-color-primary-text)':'var(--v-color-text-muted)',background:i===1?'var(--v-color-primary-50)':'transparent',fontWeight:i===1?600:400}">{{ f }}</div>
            </div>
          </template>
          <div style="display:flex;flex-direction:column;height:100%;">
            <div style="display:flex;align-items:center;gap:8px;padding:8px 16px;border-bottom:1px solid var(--v-color-border);font-size:13px;">
              <span style="font-weight:600;">App.vue</span><span style="color:var(--v-color-text-muted);">Vue SFC</span>
              <span style="margin-left:auto;display:flex;gap:8px;"><VButton size="sm" variant="ghost">Format</VButton><VButton size="sm">Run</VButton></span>
            </div>
            <div style="flex:1;overflow:auto;padding:12px 0;font-family:var(--v-font-family-mono,monospace);font-size:13px;line-height:1.7;background:var(--v-color-surface);">
              <div v-for="(l, i) in lines" :key="i" style="display:flex;"><span style="width:44px;text-align:right;padding-right:16px;color:var(--v-color-text-muted);user-select:none;">{{ i + 1 }}</span><pre style="margin:0;font:inherit;">{{ l }}</pre></div>
            </div>
          </div>
          <template #utility>
            <div style="font-size:13px;">
              <p style="${captionStyle}">Inspector</p>
              <div v-for="r in props" :key="r[0]" style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--v-color-border);"><span style="color:var(--v-color-text-muted);">{{ r[0] }}</span><span>{{ r[1] }}</span></div>
            </div>
          </template>
        </VAppShell>
      </div>`,
  }),
}

export const UtilityPanelOpen: Story = {
  parameters: {
    docs: { description: { story: '`utilityOpen=true` com ações rápidas e atalhos de teclado padrão no painel direito, em linhas compactas de 32px.' } },
  },
  args: { utilityOpen: true, activeNavItem: 'projects' },
  render: renderDashboard(),
}

export const CustomBrandAndSearch: Story = {
  parameters: { docs: { description: { story: 'Marca e busca personalizadas: `brandName="Acme"`, `searchPlaceholder`, `searchShortcut="/"` e `searchQuery` preenchida (exibe o botão de limpar).' } } },
  args: { brandName: 'Acme', searchPlaceholder: 'Buscar no Acme…', searchShortcut: '/', searchQuery: 'relatório', userAvatar: 'AC', utilityOpen: false },
  render: renderDashboard(),
}

export const NavItemsAndShortcuts: Story = {
  parameters: { docs: { description: { story: 'Navegação, ações rápidas e atalhos customizados via `navItems`, `activeNavItem`, `quickActions` e `shortcuts`.' } } },
  args: {
    navItems: [
      { value: 'home', label: 'Início', icon: 'dashboard' },
      { value: 'docs', label: 'Documentos', icon: 'documents' },
      { value: 'team', label: 'Equipe', icon: 'team' },
      { value: 'settings', label: 'Configurações', icon: 'settings' },
    ],
    activeNavItem: 'docs',
    quickActions: [{ name: 'new', label: 'Novo documento', icon: 'plus' }, { name: 'invite', label: 'Convidar pessoa', icon: 'userPlus' }],
    shortcuts: [{ keys: 'G H', label: 'Ir para início' }, { keys: 'G D', label: 'Ir para documentos' }, { keys: 'Ctrl N', label: 'Novo documento' }],
  },
  render: renderDashboard(),
}

export const NoUtility: Story = {
  parameters: { docs: { description: { story: '`showUtility=false`: remove o painel direito e o conteúdo ocupa toda a largura restante.' } } },
  args: { showUtility: false },
  render: renderDashboard(),
}

export const NoBuiltInTopBar: Story = {
  parameters: { docs: { description: { story: '`showBuiltInTopBar=false` (ou slot `topbar`): o shell renderiza apenas corpo e navegação, útil quando o app fornece seu próprio cabeçalho.' } } },
  args: { showBuiltInTopBar: false },
  render: renderDashboard(),
}
