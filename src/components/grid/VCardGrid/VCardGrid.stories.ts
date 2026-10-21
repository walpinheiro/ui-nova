import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import walletIcon from '@iconify-icons/keyline-icons/wallet'
import arrowUpRightIcon from '@iconify-icons/keyline-icons/arrow-up-right'
import checkIcon from '@iconify-icons/keyline-icons/check'
import VCard from '../../containment/VCard/VCard.vue'
import VBadge from '../../feedback/VBadge/VBadge.vue'
import VButton from '../../form/VButton/VButton.vue'
import VAvatar from '../../images/VAvatar/VAvatar.vue'
import { VIcon } from '../../primitives/VIcon'
import VCardGrid from './VCardGrid.vue'

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          '`VCardGrid` organiza cards em uma grade CSS. Use `cols` para um número fixo de colunas (ou um mapa por breakpoint: `{ default, sm, md, lg, xl }`), `minCardWidth` para colunas automáticas que se adaptam à largura do container, e `gap` (escala de espaçamento) para o respiro entre cards.',
      },
    },
  },
  title: 'grid/VCardGrid',
  component: VCardGrid,
  tags: ['autodocs'],
  args: { cols: 3, gap: 6 },
} satisfies Meta<typeof VCardGrid>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { id: 'alps', title: 'Rota dos Alpes', description: 'Trilhas panorâmicas e vistas inesquecíveis.', icon: sparklesIcon, hue: 220, status: 'Aberto', person: 'MC' },
  { id: 'files', title: 'Arquivos do projeto', description: '24 itens · atualizado há 2 h', icon: folderIcon, hue: 160, status: 'Sincronizado', person: 'RL' },
  { id: 'meeting', title: 'Reunião de equipe', description: 'Amanhã, às 10:00', icon: checkIcon, hue: 30, status: 'Agendado', person: 'JP' },
  { id: 'analytics', title: 'Analytics', description: '12,4 mil visualizações, +12%', icon: arrowUpRightIcon, hue: 280, status: 'Em alta', person: 'BA' },
  { id: 'design', title: 'Design System', description: '142 componentes publicados', icon: walletIcon, hue: 340, status: 'Estável', person: 'CN' },
  { id: 'docs', title: 'Documentação', description: '56 artigos revisados', icon: fileTextIcon, hue: 190, status: 'Revisado', person: 'DS' },
  { id: 'billing', title: 'Faturamento', description: 'Próximo ciclo em 8 dias', icon: walletIcon, hue: 100, status: 'Ativo', person: 'AR' },
  { id: 'roadmap', title: 'Roadmap 2026', description: '3 marcos no próximo trimestre', icon: sparklesIcon, hue: 260, status: 'Rascunho', person: 'PM' },
]

const common = { VCardGrid, VCard, VBadge, VButton, VAvatar, VIcon }

const mediaStyle = (hue: number) =>
  `display:flex;align-items:center;justify-content:center;aspect-ratio:16/9;color:#fff;background:linear-gradient(135deg,hsl(${hue} 70% 55%),hsl(${(hue + 50) % 360} 70% 40%))`

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Grade padrão de **3 colunas** com `gap=6`. Cada card traz mídia, título, descrição, status (`VBadge`), responsável (`VAvatar`) e ação (`VButton`). Use **Controls** para alterar `cols` e `gap` ao vivo.' } },
  },
  render: (args) => ({
    components: common,
    setup: () => ({ args, items: items.slice(0, 6), mediaStyle }),
    template: `
      <VCardGrid v-bind="args" aria-label="Projetos">
        <VCard v-for="item in items" :key="item.id" :data-test-id="'v-cardgrid-card-' + item.id" :title="item.title" :description="item.description" variant="elevated">
          <template #media><div :style="mediaStyle(item.hue)"><VIcon :icon="item.icon" size="lg" /></div></template>
          <template #header-trailing><VBadge size="sm">{{ item.status }}</VBadge></template>
          <template #avatar-group><VAvatar :initials="item.person" size="sm" :alt="item.person" /></template>
          <template #actions><VButton size="sm" variant="ghost">Abrir</VButton></template>
        </VCard>
      </VCardGrid>
    `,
  }),
}

export const Columns: Story = {
  parameters: {
    docs: { description: { story: 'Mesma coleção com **2, 3 e 4 colunas** (`cols`), empilhadas para comparação. O número de colunas é fixo, independente da largura.' } },
  },
  render: () => ({
    components: common,
    setup: () => ({ items: items.slice(0, 4), counts: [2, 3, 4] }),
    template: `
      <div style="display:flex;flex-direction:column;gap:32px">
        <VCardGrid v-for="n in counts" :key="n" :cols="n" :gap="4" :aria-label="n + ' colunas'" :data-test-id="'docs-cardgrid-cols-' + n">
          <VCard v-for="item in items.slice(0, n)" :key="item.id" :title="item.title" :description="item.description" variant="outlined" size="sm" />
        </VCardGrid>
      </div>
    `,
  }),
}

export const Gaps: Story = {
  parameters: {
    docs: { description: { story: 'Efeito do `gap` na escala de espaçamento: `gap=1` (compacto), `gap=6` (padrão) e `gap=12` (arejado).' } },
  },
  render: () => ({
    components: common,
    setup: () => ({ items: items.slice(0, 3), gaps: [1, 6, 12] }),
    template: `
      <div style="display:flex;flex-direction:column;gap:32px">
        <VCardGrid v-for="g in gaps" :key="g" :cols="3" :gap="g" :aria-label="'gap ' + g" :data-test-id="'docs-cardgrid-gap-' + g">
          <VCard v-for="item in items" :key="item.id" :title="item.title" :description="item.description" variant="filled" size="sm" />
        </VCardGrid>
      </div>
    `,
  }),
}

export const ResponsiveBreakpoints: Story = {
  parameters: {
    docs: { description: { story: 'Colunas por breakpoint: `cols={ default: 1, sm: 2, lg: 4 }`. Redimensione a janela (ou use o viewport do Storybook): 1 coluna abaixo de 640px, 2 a partir de 640px e 4 a partir de 1024px. Os breakpoints seguem a largura da **janela**.' } },
  },
  args: { cols: { default: 1, sm: 2, lg: 4 }, gap: 4 },
  render: (args) => ({
    components: common,
    setup: () => ({ args, items, mediaStyle }),
    template: `
      <VCardGrid v-bind="args" aria-label="Responsivo por breakpoint">
        <VCard v-for="item in items" :key="item.id" :title="item.title" :description="item.description" variant="elevated" size="sm">
          <template #media><div :style="mediaStyle(item.hue)"><VIcon :icon="item.icon" /></div></template>
        </VCard>
      </VCardGrid>
    `,
  }),
}

export const AutoFillMinWidth: Story = {
  parameters: {
    docs: { description: { story: 'Com `minCardWidth=240` o número de colunas é calculado pela largura do **container**: cada card nunca fica menor que 240px e as colunas aumentam/diminuem sozinhas. O container abaixo é redimensionável (arraste o canto inferior direito).' } },
  },
  args: { minCardWidth: 240, gap: 4 },
  render: (args) => ({
    components: common,
    setup: () => ({ args, items, mediaStyle }),
    template: `
      <div style="resize:horizontal;overflow:auto;width:100%;min-width:260px;padding:12px;border:1px dashed var(--v-color-border, #8884)">
        <VCardGrid v-bind="args" aria-label="Auto-fill">
          <VCard v-for="item in items" :key="item.id" :title="item.title" :description="item.description" variant="elevated" size="sm">
            <template #media><div :style="mediaStyle(item.hue)"><VIcon :icon="item.icon" /></div></template>
          </VCard>
        </VCardGrid>
      </div>
    `,
  }),
}

export const SelectableCards: Story = {
  parameters: {
    docs: { description: { story: 'Cards selecionáveis: cada `VCard` usa `interactive` e `selected`; o estado vive no pai (clique alterna). Útil para escolha de planos, templates ou itens em lote.' } },
  },
  render: () => ({
    components: common,
    setup: () => {
      const selected = ref<string[]>(['files'])
      const toggle = (id: string) => {
        selected.value = selected.value.includes(id) ? selected.value.filter((i) => i !== id) : [...selected.value, id]
      }
      return { items: items.slice(0, 6), selected, toggle }
    },
    template: `
      <VCardGrid :cols="3" :gap="4" aria-label="Seleção de itens">
        <VCard v-for="item in items" :key="item.id" :data-test-id="'docs-cardgrid-select-' + item.id" :title="item.title" :description="item.description" variant="outlined" interactive :selected="selected.includes(item.id)" @click="toggle(item.id)">
          <template #icon><VIcon :icon="item.icon" /></template>
        </VCard>
      </VCardGrid>
    `,
  }),
}

export const LoadingState: Story = {
  parameters: {
    docs: { description: { story: 'Estado de carregamento: cada `VCard` com `loading` exibe skeletons e mantém a grade estável até o conteúdo chegar.' } },
  },
  render: () => ({
    components: common,
    setup: () => ({ items: items.slice(0, 6) }),
    template: `
      <VCardGrid :cols="3" :gap="4" aria-label="Carregando">
        <VCard v-for="item in items" :key="item.id" loading />
      </VCardGrid>
    `,
  }),
}
