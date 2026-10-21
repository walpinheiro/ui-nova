import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VSpinner from './VSpinner.vue'

const meta = {
    title: 'feedback/VSpinner',
    component: VSpinner,
    args: {
        size: 'md',
        variant: 'circular',
        color: 'primary',
        label: 'Loading',
    },
    argTypes: {
        variant: { control: 'select', options: ['circular', 'dots', 'ring', 'inline'] },
        color: { control: 'select', options: ['default', 'primary'] },
        size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    },
} satisfies Meta<typeof VSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `color="default"`.' } },
  },
  args: { color: 'default' },
}

export const Primary: Story = {
    parameters: {
    docs: { description: { story: 'Variação **Primária**. Props: `color="primary"`.' } },
  },
  args: { color: 'primary' },
}

export const Dots: Story = {
    parameters: {
    docs: { description: { story: 'Variação **Dots**. Props: `variant="dots"`.' } },
  },
  args: { variant: 'dots' },
}

export const Ring: Story = {
    parameters: {
    docs: { description: { story: 'Variação **Ring**. Props: `variant="ring"`.' } },
  },
  args: { variant: 'ring' },
}

export const Inline: Story = {
    parameters: {
    docs: { description: { story: 'Variação **Inline**. Props: `variant="inline"`, `size="sm"`, `label="Loading data…"`.' } },
  },
  args: { variant: 'inline', size: 'sm', label: 'Loading data…' },
}

export const Paused: Story = { parameters: { docs: { description: { story: 'Variação **Paused**. Props: `paused=true`.' } } }, args: { paused: true } }

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }

export const LatticeResolvedSuccess: Story = { parameters: { docs: { description: { story: 'Variação **Lattice Resolved sucesso**. Props: `variant="lattice"`, `latticeSize=4`, `verb="Pensando"`, `resolved="success"`.' } } }, args: { variant: 'lattice', latticeSize: 4, verb: 'Pensando', resolved: 'success' } }

export const LatticeResolvedError: Story = { parameters: { docs: { description: { story: 'Variação **Lattice Resolved erro**. Props: `variant="lattice"`, `latticeSize=3`, `verb="Falhou"`, `resolved="error"`.' } } }, args: { variant: 'lattice', latticeSize: 3, verb: 'Falhou', resolved: 'error' } }
