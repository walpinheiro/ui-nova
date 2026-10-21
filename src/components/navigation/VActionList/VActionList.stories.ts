import type { Meta, StoryObj } from '@storybook/vue3-vite'
import diffIcon from '@iconify-icons/keyline-icons/square-plus'
import worktreeIcon from '@iconify-icons/keyline-icons/git-branch-plus'
import branchIcon from '@iconify-icons/keyline-icons/git-branch'
import cloudIcon from '@iconify-icons/keyline-icons/cloud'
import globeIcon from '@iconify-icons/keyline-icons/globe'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import shareIcon from '@iconify-icons/keyline-icons/share'
import layoutIcon from '@iconify-icons/keyline-icons/layout-dashboard'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import VActionList from './VActionList.vue'
import VDiffStat from '../../data/VDiffStat/VDiffStat.vue'
import type { VActionListSection } from './VActionList.types'

const environmentSections: VActionListSection[] = [
  {
    id: 'environment',
    label: 'Environment',
    actionIcon: settingsIcon,
    actionLabel: 'Environment settings',
    items: [
      { value: 'changes', label: 'Changes', icon: diffIcon },
      { value: 'worktree', label: 'Worktree', icon: worktreeIcon },
      { value: 'branch', label: 'synara/include-merged-pull-requests', icon: branchIcon, trailing: 'chevron' },
      { value: 'push', label: 'Commit & push', icon: cloudIcon, trailing: 'chevron' },
      { value: 'servers', label: 'Local Servers', icon: globeIcon, hint: '0', trailing: 'chevron' },
    ],
  },
  { id: 'usage', label: 'Usage', items: [{ value: 'claude', label: 'Claude', icon: sparklesIcon, trailing: 'chevron' }] },
  { id: 'repository', label: 'Repository', items: [{ value: 'repo', label: 'acme/synara', icon: shareIcon, href: 'https://example.com' }] },
  {
    id: 'editor',
    label: 'Editor',
    items: [
      { value: 'editor', label: 'Editor view', icon: layoutIcon },
      { value: 'finder', label: 'Open in Finder', icon: folderIcon, trailing: 'chevron' },
    ],
  },
  { id: 'recap', label: 'Recap' },
]

const meta = {
  title: 'navigation/VActionList',
  component: VActionList,
  tags: ['autodocs'],
  args: { sections: environmentSections, variant: 'card', size: 'md', dividers: true, ariaLabel: 'Environment' },
  argTypes: {
    sections: { description: 'Seções `{ id, label?, actionIcon?, actionLabel?, items? }`. Itens: `{ value, label, icon?, hint?, trailing?, href?, disabled?, active? }`.', control: 'object' },
    variant: { description: '`card` (painel flutuante) ou `plain`.', control: 'inline-radio', options: ['card', 'plain'] },
    size: { description: 'Altura das linhas.', control: 'inline-radio', options: ['sm', 'md'] },
    dividers: { description: 'Linha entre seções.', control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Lista de ações/propriedades em seções rotuladas — o painel "Environment" de apps de agentes/IDE. Itens com `href` viram links externos (↗); `trailing="chevron"` indica submenu. Slots: `trailing-{value}` (ex.: `VDiffStat`), `section-{id}` (conteúdo livre), `label`.',
          '',
          '```vue',
          '<VActionList :sections="sections" @select="onSelect">',
          '  <template #trailing-changes><VDiffStat :additions="193" :deletions="130" /></template>',
          '</VActionList>',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:360px;"><story /></div>' })],
  render: (args) => ({
    components: { VActionList, VDiffStat },
    setup: () => ({ args }),
    template: `<VActionList v-bind="args">
      <template #trailing-changes><VDiffStat :additions="193" :deletions="130" /></template>
      <template #trailing-claude>
        <span style="display:grid;grid-template-columns:auto auto;column-gap:10px;font-size:11px;line-height:1.3;text-align:right;">
          <span>5h</span><span>79%</span><span>Weekly</span><span>22%</span>
        </span>
      </template>
      <template #section-recap>
        Filtro Status da Code review: adicionada a opção Merged, com persistência e ?state=merged. Restam testes manuais no app.
      </template>
    </VActionList>`,
  }),
} satisfies Meta<typeof VActionList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Painel Environment** com `VDiffStat`, uso e recap.' } } },
}

export const Plain: Story = {
  parameters: { docs: { description: { story: 'Variação **Plain** compacta (sem cartão).' } } },
  args: { variant: 'plain', size: 'sm', sections: environmentSections.slice(0, 1) },
}

export const ActiveAndDisabled: Story = {
  parameters: { docs: { description: { story: 'Variação **Ativo / desabilitado**.' } } },
  args: {
    sections: [
      {
        id: 'view',
        label: 'View',
        items: [
          { value: 'board', label: 'Board', icon: layoutIcon, active: true },
          { value: 'list', label: 'List', icon: folderIcon },
          { value: 'timeline', label: 'Timeline (soon)', icon: branchIcon, disabled: true },
        ],
      },
    ],
  },
}
