import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VAutoLayoutGrid from './VAutoLayoutGrid.vue'
import VAutoLayoutGridItem from './VAutoLayoutGridItem.vue'
import { VCard } from '../../containment/VCard'
import { VBadge } from '../../feedback/VBadge'
import { VAvatar } from '../../images/VAvatar'
import { VButton } from '../../form/VButton'

const meta = {
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Grelha que decide sozinha quantas colunas cabem: cada coluna tem no mínimo `minItemWidth` px e cresce para ocupar o espaço livre. Ao redimensionar o container, os itens reorganizam-se sem media queries. `behavior` escolhe auto-fit (colunas vazias colapsam), auto-fill (mantém colunas vazias), dense (preenche buracos deixados por itens com `colSpan`/`rowSpan`) ou equal-height (linhas com a mesma altura).' } },
  },
  title: 'grid/VAutoLayoutGrid',
  component: VAutoLayoutGrid,
  tags: ['autodocs'],
  args: { minItemWidth: 220, behavior: 'auto-fit', size: 'medium' },
} satisfies Meta<typeof VAutoLayoutGrid>

export default meta
type Story = StoryObj<typeof meta>

const projects = [
  { id: 'design-system', title: 'Design System', meta: '24 componentes', tag: 'Ativo', variant: 'success', who: 'AM' },
  { id: 'brand-assets', title: 'Brand Assets', meta: '143 ficheiros', tag: 'Revisão', variant: 'warning', who: 'JP' },
  { id: 'team', title: 'Equipa', meta: '8 membros', tag: 'Novo', variant: 'primary', who: 'LS' },
  { id: 'analytics', title: 'Analytics', meta: 'Últimos 30 dias', tag: 'Ativo', variant: 'success', who: 'RC' },
  { id: 'documentation', title: 'Documentação', meta: '56 artigos', tag: 'Rascunho', variant: 'neutral', who: 'MB' },
  { id: 'components', title: 'Componentes', meta: '112 ficheiros', tag: 'Ativo', variant: 'success', who: 'TF' },
  { id: 'projects', title: 'Projetos', meta: '12 em curso', tag: 'Atraso', variant: 'danger', who: 'CN' },
  { id: 'settings', title: 'Definições', meta: 'Preferências da conta', tag: 'Roxo', variant: 'purple', who: 'PV' },
]

const components = { VAutoLayoutGrid, VAutoLayoutGridItem, VCard, VBadge, VAvatar, VButton }

const projectItem = `
  <VAutoLayoutGridItem v-for="p in projects" :key="p.id" :id="p.id" :interactive="false">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <VAvatar :initials="p.who" size="sm" />
      <VBadge :variant="p.variant" size="sm">{{ p.tag }}</VBadge>
    </div>
    <div style="margin-top:12px"><strong>{{ p.title }}</strong></div>
    <div style="color:var(--v-color-text-muted);font-size:13px;margin-top:4px">{{ p.meta }}</div>
  </VAutoLayoutGridItem>`

const simpleItems = `
  <VAutoLayoutGridItem v-for="p in projects.slice(0, 6)" :key="p.id" :interactive="false">
    <strong>{{ p.title }}</strong>
    <div style="color:var(--v-color-text-muted);font-size:13px;margin-top:4px">{{ p.meta }}</div>
  </VAutoLayoutGridItem>`

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Grelha com `minItemWidth=220`. Use a aba **Controls** para alterar largura mínima, gap, `behavior` e `size` ao vivo; as colunas recalculam-se de imediato.' } },
  },
  render: (args) => ({
    components,
    setup: () => ({ args, projects }),
    template: `<VAutoLayoutGrid v-bind="args">${projectItem}</VAutoLayoutGrid>`,
  }),
}

export const ResponsiveReflow: Story = {
  name: 'Reflow responsivo',
  parameters: {
    docs: { description: { story: 'A mesma grade em containers de 300, 520 e 860 px. O número de colunas muda sem nenhuma media query: o navegador divide o espaço disponível por `minItemWidth`. Cada container também é redimensionável arrastando o canto.' } },
  },
  render: () => ({
    components,
    setup: () => ({ projects, widths: [300, 520, 860] }),
    template: `
      <div style="display:flex;flex-direction:column;gap:24px">
        <div v-for="w in widths" :key="w" :style="{ width: w + 'px', maxWidth: '100%', resize: 'horizontal', overflow: 'auto', padding: '12px', border: '1px dashed var(--v-color-border)', borderRadius: '8px' }">
          <VAutoLayoutGrid :min-item-width="200" :gap="12">${projectItem}</VAutoLayoutGrid>
        </div>
      </div>`,
  }),
}

export const MinItemWidth: Story = {
  name: 'Largura mínima',
  parameters: {
    docs: { description: { story: 'Contentor fixo de 720 px com `minItemWidth` de 140, 240 e 360. Quanto maior o mínimo, menos colunas e itens mais largos.' } },
  },
  render: () => ({
    components,
    setup: () => ({ projects, mins: [140, 240, 360] }),
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;max-width:720px">
        <VAutoLayoutGrid v-for="m in mins" :key="m" :min-item-width="m" :gap="12">${simpleItems}</VAutoLayoutGrid>
      </div>`,
  }),
}

export const AutoFitVsAutoFill: Story = {
  name: 'Auto-fit vs auto-fill',
  parameters: {
    docs: { description: { story: 'Com apenas 2 itens num container largo: **auto-fit** estica os itens para ocupar toda a linha; **auto-fill** mantém as colunas vazias e os itens ficam com a largura de uma coluna.' } },
  },
  render: () => ({
    components,
    setup: () => ({ projects }),
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;max-width:900px">
        <VAutoLayoutGrid v-for="b in ['auto-fit','auto-fill']" :key="b" :behavior="b" :min-item-width="200">
          <VAutoLayoutGridItem v-for="p in projects.slice(0, 2)" :key="p.id" :interactive="false">
            <VBadge :variant="b === 'auto-fit' ? 'primary' : 'purple'" size="sm">{{ b }}</VBadge>
            <div style="margin-top:8px"><strong>{{ p.title }}</strong></div>
          </VAutoLayoutGridItem>
        </VAutoLayoutGrid>
      </div>`,
  }),
}

export const Gaps: Story = {
  name: 'Gaps e tamanhos',
  parameters: {
    docs: { description: { story: 'Linhas 1 a 3: `size` compact, medium e spacious (sem `gap`). Linha 4: `gap=32`. Linha 5: `rowGap=32` com `columnGap=8`.' } },
  },
  render: () => ({
    components,
    setup: () => ({ projects, sizes: ['compact', 'medium', 'spacious'] }),
    template: `
      <div style="display:flex;flex-direction:column;gap:28px;max-width:760px">
        <VAutoLayoutGrid v-for="s in sizes" :key="s" :size="s" :min-item-width="160">${simpleItems}</VAutoLayoutGrid>
        <VAutoLayoutGrid :gap="32" :min-item-width="160">${simpleItems}</VAutoLayoutGrid>
        <VAutoLayoutGrid :row-gap="32" :column-gap="8" :min-item-width="160">${simpleItems}</VAutoLayoutGrid>
      </div>`,
  }),
}

export const Dense: Story = {
  name: 'Dense com spans',
  parameters: {
    docs: { description: { story: 'Itens com `colSpan`/`rowSpan` deixam buracos. À esquerda, `auto-fit` mantém a ordem e deixa lacunas; à direita, `behavior="dense"` reordena visualmente para preencher os espaços.' } },
  },
  render: () => ({
    components,
    setup: () => ({
      tiles: [
        { id: 'a', t: 'Receita', c: 2, r: 1 }, { id: 'b', t: 'Usuários', c: 1, r: 1 },
        { id: 'c', t: 'Mapa de calor', c: 2, r: 2 }, { id: 'd', t: 'Erros', c: 1, r: 1 },
        { id: 'e', t: 'Latência', c: 1, r: 1 }, { id: 'f', t: 'Sessões', c: 1, r: 1 },
        { id: 'g', t: 'Conversão', c: 1, r: 1 },
      ],
    }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:24px">
        <VAutoLayoutGrid v-for="b in ['auto-fit','dense']" :key="b" :behavior="b" :min-item-width="90" :gap="8" style="grid-template-columns:repeat(4,1fr);grid-auto-rows:72px">
          <VAutoLayoutGridItem v-for="t in tiles" :key="t.id" :col-span="t.c" :row-span="t.r" :interactive="false" style="min-height:0">
            <strong>{{ t.t }}</strong>
          </VAutoLayoutGridItem>
        </VAutoLayoutGrid>
      </div>`,
  }),
}

export const EqualHeight: Story = {
  name: 'Altura igual',
  parameters: {
    docs: { description: { story: '`behavior="equal-height"`: todas as linhas têm a altura do item mais alto, por isso cartões com conteúdo curto e longo ficam alinhados e os botões no fundo.' } },
  },
  render: () => ({
    components,
    template: `
      <VAutoLayoutGrid behavior="equal-height" :min-item-width="220">
        <VAutoLayoutGridItem :interactive="false" style="display:flex;flex-direction:column;gap:8px"><strong>Starter</strong><span style="color:var(--v-color-text-muted)">Para projetos pessoais.</span><div style="margin-top:auto"><VButton size="sm">Escolher</VButton></div></VAutoLayoutGridItem>
        <VAutoLayoutGridItem :interactive="false" style="display:flex;flex-direction:column;gap:8px"><strong>Pro</strong><div><VBadge variant="primary" size="sm">Popular</VBadge></div><span style="color:var(--v-color-text-muted)">Para equipes em crescimento: SSO, auditoria, domínios personalizados, suporte prioritário e relatórios avançados de uso.</span><div style="margin-top:auto"><VButton size="sm">Escolher</VButton></div></VAutoLayoutGridItem>
        <VAutoLayoutGridItem :interactive="false" style="display:flex;flex-direction:column;gap:8px"><strong>Enterprise</strong><span style="color:var(--v-color-text-muted)">Contratos sob medida.</span><div style="margin-top:auto"><VButton size="sm" variant="secondary">Falar com vendas</VButton></div></VAutoLayoutGridItem>
      </VAutoLayoutGrid>`,
  }),
}

export const WithCards: Story = {
  name: 'Com cartões',
  parameters: {
    docs: { description: { story: 'Galeria de VCard dentro da grade, redimensionável arrastando o canto do container.' } },
  },
  render: () => ({
    components,
    setup: () => ({ projects }),
    template: `
      <div style="resize:horizontal;overflow:auto;width:760px;max-width:100%;padding:12px;border:1px dashed var(--v-color-border);border-radius:8px">
        <VAutoLayoutGrid :min-item-width="200">
          <VCard v-for="p in projects.slice(0, 6)" :key="p.id" :title="p.title" :description="p.meta" variant="outlined">
            <template #header-trailing><VBadge :variant="p.variant" size="sm">{{ p.tag }}</VBadge></template>
          </VCard>
        </VAutoLayoutGrid>
      </div>`,
  }),
}

export const Selectable: Story = {
  parameters: {
    docs: { description: { story: 'Itens interativos: clique ou Enter/Espaço emitem `select`. O primeiro mostra o estado selecionado.' } },
  },
  args: { selectable: true },
  render: (args) => ({
    components,
    setup: () => ({ args, projects }),
    template: `
      <VAutoLayoutGrid v-bind="args">
        <VAutoLayoutGridItem id="design-system" selected><strong>Design System</strong><div style="color:var(--v-color-text-muted)">Selecionado</div></VAutoLayoutGridItem>
        <VAutoLayoutGridItem v-for="p in projects.slice(1, 5)" :key="p.id" :id="p.id"><strong>{{ p.title }}</strong><div style="color:var(--v-color-text-muted)">{{ p.meta }}</div></VAutoLayoutGridItem>
      </VAutoLayoutGrid>`,
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Estados do item: normal, selecionado, a arrastar e desativado.' } },
  },
  render: () => ({
    components,
    template: `
      <VAutoLayoutGrid :min-item-width="180" :gap="12">
        <VAutoLayoutGridItem id="default"><strong>Normal</strong></VAutoLayoutGridItem>
        <VAutoLayoutGridItem id="selected" selected><strong>Selecionado</strong></VAutoLayoutGridItem>
        <VAutoLayoutGridItem id="dragging" dragging><strong>A arrastar</strong></VAutoLayoutGridItem>
        <VAutoLayoutGridItem id="disabled" disabled><strong>Desativado</strong></VAutoLayoutGridItem>
      </VAutoLayoutGrid>`,
  }),
}
