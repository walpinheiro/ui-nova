import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VDiffStat from './VDiffStat.vue'

const meta = {
  title: 'data/VDiffStat',
  component: VDiffStat,
  tags: ['autodocs'],
  args: { additions: 193, deletions: 130, size: 'md', blocks: false, blockCount: 5 },
  argTypes: {
    additions: { description: 'Linhas adicionadas.', control: 'number' },
    deletions: { description: 'Linhas removidas.', control: 'number' },
    size: { description: 'Tamanho do texto.', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    blocks: { description: 'Blocos de proporção estilo GitHub.', control: 'boolean' },
    blockCount: { description: 'Quantidade de blocos.', control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Resumo de diff `+193 −130` com rótulo acessível e blocos de proporção opcionais.',
          '',
          '```vue',
          '<VDiffStat :additions="193" :deletions="130" />',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof VDiffStat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão**.' } } },
}

export const WithBlocks: Story = {
  parameters: { docs: { description: { story: 'Variação **Com blocos**. Props: `blocks`.' } } },
  args: { blocks: true },
}

export const FileList: Story = {
  parameters: { docs: { description: { story: 'Variação **Lista de arquivos** (`size="sm"`).' } } },
  render: () => ({
    components: { VDiffStat },
    setup: () => ({
      files: [
        { name: 'src/review/StatusFilter.tsx', a: 5, d: 1 },
        { name: 'src/review/useReviewQuery.ts', a: 37, d: 1 },
        { name: 'src/api/pulls.ts', a: 25, d: 12 },
        { name: 'src/store/persist.ts', a: 7, d: 10 },
      ],
    }),
    template: `<ul style="list-style:none;margin:0;padding:0;max-width:420px;font:13px var(--v-font-family-sans);">
      <li v-for="f in files" :key="f.name" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--v-color-border)">
        <span>{{ f.name }}</span><VDiffStat size="sm" :additions="f.a" :deletions="f.d" />
      </li></ul>`,
  }),
}
