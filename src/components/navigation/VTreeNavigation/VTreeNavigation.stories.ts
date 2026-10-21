import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VTreeNavigation from './VTreeNavigation.vue'
import { HERO_TREE_ITEMS, VARIANT_TREE_ITEMS } from './mountVTreeNavigation'

const meta = {
  title: 'navigation/VTreeNavigation',
  component: VTreeNavigation,
  args: {
    size: 'md',
    variant: 'file',
    showCounts: true,
    items: HERO_TREE_ITEMS,
    active: 'vueui-nova',
  },
} satisfies Meta<typeof VTreeNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const FileTree: Story = {
  parameters: {
    docs: { description: { story: 'Variação **File Tree**. Props: `variant="file"`, `active="work"`.' } },
  },
  args: {
    variant: 'file',
    items: VARIANT_TREE_ITEMS.file,
    active: 'work',
    expandedKeys: ['documents'],
  },
}

export const SettingsTree: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Settings Tree**. Props: `variant="settings"`, `active="appearance"`, `showCounts=false`.' } },
  },
  args: {
    variant: 'settings',
    items: VARIANT_TREE_ITEMS.settings,
    active: 'appearance',
    showCounts: false,
  },
}

export const DocumentationTree: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Documentation Tree**. Props: `variant="documentation"`, `active="components"`, `showCounts=false`.' } },
  },
  args: {
    variant: 'documentation',
    items: VARIANT_TREE_ITEMS.documentation,
    active: 'components',
    showCounts: false,
  },
}

export const SimpleTree: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Simple Tree**. Props: `variant="simple"`, `active="home"`, `showCounts=false`.' } },
  },
  args: {
    variant: 'simple',
    items: VARIANT_TREE_ITEMS.simple,
    active: 'home',
    showCounts: false,
  },
}

export const Small: Story = { parameters: { docs: { description: { story: 'Variação **Pequeno**. Props: `size="sm"`.' } } }, args: { size: 'sm' } }
export const Large: Story = { parameters: { docs: { description: { story: 'Variação **Grande**. Props: `size="lg"`.' } } }, args: { size: 'lg' } }
export const Multiple: Story = { parameters: { docs: { description: { story: 'Variação **Múltiplo**. Props: `multiple=true`.' } } }, args: { multiple: true, active: ['vueui-nova', 'components'] } }
export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }
export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }

export const LazyChildren: Story = { parameters: { docs: { description: { story: 'Variação **Lazy Children**. Props: `lazy=true`, `active="root"`.' } } }, args: { lazy: true, items: [{ key: 'root', label: 'Raiz (carrega filhos ao expandir)', lazy: true, children: [] }], loadChildren: async () => { await new Promise((r) => setTimeout(r, 600)); return [{ key: 'c1', label: 'Filho 1' }, { key: 'c2', label: 'Filho 2' }] }, active: 'root' } }
