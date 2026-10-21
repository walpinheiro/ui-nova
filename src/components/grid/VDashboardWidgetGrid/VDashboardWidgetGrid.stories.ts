import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import dollarSign from '@iconify-icons/keyline-icons/dollar-sign'
import usersIcon from '@iconify-icons/keyline-icons/users'
import checkIcon from '@iconify-icons/keyline-icons/circle-check'
import VDashboardWidgetGrid from './VDashboardWidgetGrid.vue'
import VDashboardWidget from './VDashboardWidget.vue'
import { VIcon } from '../../primitives/VIcon'
import { VBadge } from '../../feedback/VBadge'
import { VProgress } from '../../feedback/VProgress'
import { VAvatar, VGroupAvatar } from '../../images/VAvatar'
import { VButton } from '../../form/VButton'

type Kind = 'revenue' | 'users' | 'traffic' | 'activity' | 'tasks' | 'goal' | 'status'
interface DemoWidget {
  id: string
  title: string
  kind: Kind
  x: number
  y: number
  w: number
  h: number
  locked?: boolean
}

const DASHBOARD: DemoWidget[] = [
  { id: 'revenue', title: 'Receita total', kind: 'revenue', x: 0, y: 0, w: 4, h: 2 },
  { id: 'users', title: 'Usuários ativos', kind: 'users', x: 4, y: 0, w: 4, h: 2 },
  { id: 'activity', title: 'Atividade recente', kind: 'activity', x: 8, y: 0, w: 4, h: 4 },
  { id: 'tasks', title: 'Tarefas', kind: 'tasks', x: 0, y: 2, w: 4, h: 2 },
  { id: 'traffic', title: 'Tráfego do site', kind: 'traffic', x: 4, y: 2, w: 4, h: 2 },
]

/** Shared widget bodies, composed only from library components. */
const CONTENT = `
  <template v-if="w.kind === 'revenue'">
    <div class="demo-kpi">
      <span class="demo-kpi__icon"><VIcon :icon="icons.dollar" /></span>
      <div>
        <div class="demo-kpi__value">€24.780</div>
        <VBadge variant="success" size="sm">+12% vs. mês anterior</VBadge>
      </div>
    </div>
    <svg class="demo-spark" viewBox="0 0 120 32" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="0,26 14,22 28,24 42,16 56,18 70,10 84,14 98,6 120,3" fill="none" stroke="var(--v-color-primary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />
    </svg>
  </template>
  <template v-else-if="w.kind === 'users'">
    <div class="demo-kpi">
      <span class="demo-kpi__icon"><VIcon :icon="icons.users" /></span>
      <div>
        <div class="demo-kpi__value">8.421</div>
        <VBadge variant="success" size="sm">+8%</VBadge>
      </div>
    </div>
    <VGroupAvatar :members="[{ initials: 'SC' }, { initials: 'AL' }, { initials: 'JP' }, { initials: 'MR' }, { initials: 'TK' }]" :max="4" size="sm" />
  </template>
  <template v-else-if="w.kind === 'traffic'">
    <div class="demo-list">
      <div v-for="s in [['Pesquisa orgânica', 64], ['Direto', 22], ['Redes sociais', 14]]" :key="s[0]">
        <VProgress :value="s[1]" size="sm" :label="s[0] + ' · ' + s[1] + '%'" />
      </div>
    </div>
  </template>
  <template v-else-if="w.kind === 'activity'">
    <ul class="demo-feed">
      <li v-for="a in [['Sarah Chen', 'criou um projeto', '2 min'], ['Alex Lima', 'atualizou o design system', '12 min'], ['João Pires', 'se cadastrou', '28 min'], ['Marta Reis', 'concluiu o backup', '1 h'], ['Tiago Kane', 'publicou a v1.2.0', '2 h']]" :key="a[0]">
        <VAvatar :initials="a[0].split(' ').map((n) => n[0]).join('')" size="sm" />
        <span class="demo-feed__text"><strong>{{ a[0] }}</strong> {{ a[1] }}</span>
        <span class="demo-feed__time">{{ a[2] }}</span>
      </li>
    </ul>
  </template>
  <template v-else-if="w.kind === 'tasks'">
    <VProgress :value="60" size="md" label="3 de 5 concluídas" />
    <ul class="demo-tasks">
      <li v-for="t in [['Finalizar design', true], ['Implementar a grade', true], ['Escrever documentação', true], ['Adicionar testes', false]]" :key="t[0]" :data-done="t[1]">
        <VIcon :icon="icons.check" size="sm" /> {{ t[0] }}
      </li>
    </ul>
  </template>
  <template v-else-if="w.kind === 'goal'">
    <div class="demo-center"><VProgress variant="circular" :value="78" label="78%" /></div>
  </template>
  <template v-else-if="w.kind === 'status'">
    <div class="demo-badges">
      <VBadge variant="success" dot>API operacional</VBadge>
      <VBadge variant="warning" dot>Fila de e-mails lenta</VBadge>
      <VBadge variant="primary" dot>Deploy em curso</VBadge>
      <VBadge variant="danger" dot>Webhook falhou</VBadge>
    </div>
  </template>
`

const STYLES = `
  .demo-kpi { display:flex; align-items:center; gap:var(--v-space-3); }
  .demo-kpi__icon { display:inline-grid; place-items:center; width:40px; height:40px; border-radius:var(--v-radius-md); background:var(--v-color-surface-muted); color:var(--v-color-primary); }
  .demo-kpi__value { font-size:var(--v-font-size-h2); font-weight:var(--v-font-weight-semibold); line-height:1.1; margin-bottom:var(--v-space-1); }
  .demo-spark { width:100%; height:40px; margin-top:var(--v-space-3); }
  .demo-list { display:flex; flex-direction:column; gap:var(--v-space-3); }
  .demo-feed, .demo-tasks { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:var(--v-space-3); font-size:var(--v-font-size-text-small); }
  .demo-feed li { display:flex; align-items:center; gap:var(--v-space-3); }
  .demo-feed__text { flex:1; min-width:0; }
  .demo-feed__time { color:var(--v-color-text-muted); white-space:nowrap; }
  .demo-tasks { margin-top:var(--v-space-3); gap:var(--v-space-2); }
  .demo-tasks li { display:flex; align-items:center; gap:var(--v-space-2); }
  .demo-tasks li[data-done='true'] { color:var(--v-color-text-muted); text-decoration:line-through; }
  .demo-center { display:grid; place-items:center; height:100%; }
  .demo-badges { display:flex; flex-wrap:wrap; gap:var(--v-space-2); }
  .demo-page { padding:var(--v-space-4); }
`

const SHARED = {
  components: { VDashboardWidgetGrid, VDashboardWidget, VIcon, VBadge, VProgress, VAvatar, VGroupAvatar, VButton },
}
const icons = { dollar: dollarSign, users: usersIcon, check: checkIcon }

const meta = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Grelha de dashboard de 2 dimensões. Cada `VDashboardWidget` ocupa uma célula (`x`, `y`) com um span (`w` × `h`) e a grade resolve colisões e compactação vertical por si. No **modo de edição** os widgets podem ser arrastados pelo ícone de pega, redimensionados pelo canto inferior direito e movidos/redimensionados pelo teclado (setas movem; Shift + setas redimensionam). Use `v-model:layout` para persistir o layout, `@close` para remover widgets e `@add` para inserir novos. `cols` aceita um número ou um mapa por breakpoint, medido pela largura da própria grade.',
      },
    },
  },
  title: 'grid/VDashboardWidgetGrid',
  component: VDashboardWidgetGrid,
  tags: ['autodocs'],
  args: { cols: 12, rowHeight: 128, gap: 4, editMode: false },
} satisfies Meta<typeof VDashboardWidgetGrid>

export default meta
type Story = StoryObj<typeof meta>

function dashboardTemplate() {
  return `
    <div class="demo-page">
      <component :is="'style'">${STYLES}</component>
      <VDashboardWidgetGrid v-bind="args">
        <VDashboardWidget v-for="w in widgets" :key="w.id" :id="w.id" :title="w.title" :x="w.x" :y="w.y" :w="w.w" :h="w.h" :locked="w.locked">
          ${CONTENT}
        </VDashboardWidget>
      </VDashboardWidgetGrid>
    </div>
  `
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard analítico em uma grade de 12 colunas. Cada widget declara a posição (`x`, `y`) e o tamanho (`w` × `h`) em unidades de célula; a altura da célula vem de `rowHeight`. Clique em **Edit layout** para ativar o arrasto e o redimensionamento.',
      },
    },
  },
  render: (args) => ({
    ...SHARED,
    setup: () => ({ args, widgets: DASHBOARD, icons }),
    template: dashboardTemplate(),
  }),
}

export const EditMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Modo de edição ativo (`editMode`). Arraste um widget pela alça do cabeçalho para reordená-lo: os demais widgets são empurrados e recompactados. Redimensione pelo canto inferior direito; o span encaixa na grade de pontos. Com um widget focado, as **setas** o movem e **Shift + setas** o redimensionam.',
      },
    },
  },
  args: { editMode: true },
  render: (args) => ({
    ...SHARED,
    setup: () => ({ args, widgets: DASHBOARD, icons }),
    template: dashboardTemplate(),
  }),
}

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard totalmente controlado: `v-model:layout` guarda o layout, `@close` remove o widget (×) e `@add` insere o próximo widget disponível no fim da grade. Em produção, persista o `layout` (por exemplo em `localStorage`) para restaurar as preferências do usuário.',
      },
    },
  },
  args: { editMode: true },
  render: (args) => ({
    ...SHARED,
    setup: () => {
      const widgets = ref<DemoWidget[]>(DASHBOARD.map((w) => ({ ...w })))
      const layout = ref(widgets.value.map(({ id, x, y, w, h }) => ({ id, x, y, w, h })))
      const catalog: DemoWidget[] = [
        { id: 'goal', title: 'Meta trimestral', kind: 'goal', x: 0, y: 99, w: 3, h: 2 },
        { id: 'status', title: 'Estado dos serviços', kind: 'status', x: 0, y: 99, w: 4, h: 2 },
      ]
      function add() {
        const next = catalog.find((c) => !widgets.value.some((w) => w.id === c.id))
        if (!next) return
        widgets.value = [...widgets.value, { ...next }]
        layout.value = [...layout.value, { id: next.id, x: next.x, y: next.y, w: next.w, h: next.h }]
      }
      function remove(id: string) {
        widgets.value = widgets.value.filter((w) => w.id !== id)
        layout.value = layout.value.filter((l) => l.id !== id)
      }
      return { args, widgets, layout, icons, add, remove }
    },
    template: `
      <div class="demo-page">
        <component :is="'style'">${STYLES}</component>
        <VDashboardWidgetGrid v-bind="args" v-model:layout="layout" @add="add">
          <VDashboardWidget v-for="w in widgets" :key="w.id" :id="w.id" :title="w.title" :x="w.x" :y="w.y" :w="w.w" :h="w.h" @close="remove(w.id)">
            ${CONTENT}
          </VDashboardWidget>
        </VDashboardWidgetGrid>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tamanhos de widget em unidades da grade: **SM** 3 × 1, **MD** 4 × 2 e **LG** 6 × 2. O corpo do widget rola quando o conteúdo excede a altura.',
      },
    },
  },
  render: (args) => ({
    ...SHARED,
    setup: () => ({
      args,
      icons,
      widgets: [
        { id: 'sm', title: 'SM · 3 × 1', kind: 'status', x: 0, y: 0, w: 3, h: 1 },
        { id: 'md', title: 'MD · 4 × 2', kind: 'revenue', x: 3, y: 0, w: 4, h: 2 },
        { id: 'lg', title: 'LG · 6 × 2', kind: 'activity', x: 6, y: 0, w: 6, h: 2 },
        { id: 'goal', title: 'SM · 3 × 1', kind: 'goal', x: 0, y: 1, w: 3, h: 1 },
      ] as DemoWidget[],
    }),
    template: dashboardTemplate(),
  }),
}

export const LockedWidget: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Um widget com `locked` mostra um cadeado, não tem pegas e não pode ser movido, redimensionado nem removido; os outros widgets reorganizam-se à sua volta. `disabled` desativa o widget por completo.',
      },
    },
  },
  args: { editMode: true },
  render: (args) => ({
    ...SHARED,
    setup: () => ({
      args,
      icons,
      widgets: [
        { id: 'goal', title: 'Progresso da equipe', kind: 'goal', x: 0, y: 0, w: 4, h: 3, locked: true },
        { id: 'revenue', title: 'Receita total', kind: 'revenue', x: 4, y: 0, w: 4, h: 2 },
        { id: 'status', title: 'Estado dos serviços', kind: 'status', x: 8, y: 0, w: 4, h: 2 },
      ] as DemoWidget[],
    }),
    template: dashboardTemplate(),
  }),
}

export const ResponsiveColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`cols` aceita um mapa por breakpoint (`{ default: 1, sm: 4, md: 8, lg: 12 }`) avaliado contra a **largura da própria grade**, não do tela. Arraste o canto inferior direito do container para estreitá-lo: os widgets são limitados às colunas disponíveis e se empilham.',
      },
    },
  },
  args: { cols: { default: 1, sm: 4, md: 8, lg: 12 } },
  render: (args) => ({
    ...SHARED,
    setup: () => ({ args, widgets: DASHBOARD, icons }),
    template: `
      <div class="demo-page">
        <component :is="'style'">${STYLES}</component>
        <div style="resize:horizontal;overflow:auto;width:100%;max-width:100%;min-width:280px;border-right:2px dashed var(--v-color-border)">
          <VDashboardWidgetGrid v-bind="args">
            <VDashboardWidget v-for="w in widgets" :key="w.id" :id="w.id" :title="w.title" :x="w.x" :y="w.y" :w="w.w" :h="w.h">
              ${CONTENT}
            </VDashboardWidget>
          </VDashboardWidgetGrid>
        </div>
      </div>
    `,
  }),
}

export const CompactVariant: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Variante `compact`: linhas mais baixas (`rowHeight=100`) e espaçamento reduzido para maior densidade de informação.',
      },
    },
  },
  args: { variant: 'compact', rowHeight: 100, gap: 2 },
  render: (args) => ({
    ...SHARED,
    setup: () => ({ args, widgets: DASHBOARD, icons }),
    template: dashboardTemplate(),
  }),
}
