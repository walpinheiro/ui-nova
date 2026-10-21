import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VEmptyState from './VEmptyState.vue'
const meta = {
  title: 'feedback/VEmptyState',
  component: VEmptyState,
  args: {
    size: 'md',
    variant: 'default',
    title: 'No projects yet',
    description: 'Get started by creating your first project.',
    action: { label: 'Create project', icon: 'plus' },
  },
} satisfies Meta<typeof VEmptyState>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}
export const NoResults: Story = { parameters: { docs: { description: { story: 'Variação **Sem Results**. Props: `variant="results"`.' } } }, args: { variant: 'results' } }
export const Compact: Story = { parameters: { docs: { description: { story: 'Variação **Compact**. Props: `compact=true`.' } } }, args: { compact: true } }

export const NoIllustration: Story = { parameters: { docs: { description: { story: 'Variação **Sem Illustration**. Props: `showIllustration=false`, `title="Sem ilustração"`.' } } }, args: { showIllustration: false, title: 'Sem ilustração' } }

export const HeadingLevel4: Story = { parameters: { docs: { description: { story: 'Variação **Heading Level4**. Props: `headingLevel=4`, `title="Título como h4"`.' } } }, args: { headingLevel: 4, title: 'Título como h4' } }

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }
