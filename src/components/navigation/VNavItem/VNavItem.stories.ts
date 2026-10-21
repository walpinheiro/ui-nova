import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VNavItem from './VNavItem.vue'

const meta = {
  title: 'navigation/VNavItem',
  component: VNavItem,
  args: {
    label: 'Dashboard',
    icon: 'home',
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'primary', 'subtle'] },
  },
} satisfies Meta<typeof VNavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Active: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ativo**. Props: `active=true`, `label="Dashboard"`, `icon="home"`.' } },
  },
  args: { active: true, label: 'Dashboard', icon: 'home' },
}

export const WithBadge: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com badge**. Props: `label="Projects"`, `icon="projects"`, `badge=12`.' } },
  },
  args: { label: 'Projects', icon: 'projects', badge: 12 },
}

export const AsLink: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Como link**. Props: `label="Settings"`, `icon="settings"`, `href="#settings"`, `active=false`. Slots usados: `#settings`.' } },
  },
  args: { label: 'Settings', icon: 'settings', href: '#settings', active: false },
}

export const Collapsed: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Recolhido**. Props: `label="Dashboard"`, `icon="home"`, `collapsed=true`, `ariaLabel="Dashboard"`.' } },
  },
  args: { label: 'Dashboard', icon: 'home', collapsed: true, ariaLabel: 'Dashboard' },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `label="Analytics"`, `icon="analytics"`, `disabled=true`.' } },
  },
  args: { label: 'Analytics', icon: 'analytics', disabled: true },
}

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `label="Integrations"`, `icon="integrations"`, `loading=true`.' } },
  },
  args: { label: 'Integrations', icon: 'integrations', loading: true },
}

export const SidebarGroup: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sidebar grupo**.' } },
  },
  render: () => ({
    components: { VNavItem },
    template: `
      <nav style="display:flex;flex-direction:column;gap:4px;width:240px;padding:12px;background:var(--v-color-surface);border:1px solid var(--v-color-border);border-radius:12px;">
        <VNavItem label="Dashboard" icon="home" active />
        <VNavItem label="Analytics" icon="analytics" />
        <VNavItem label="Projects" icon="projects" badge="3" />
        <VNavItem label="Team" icon="team" />
        <VNavItem label="Settings" icon="settings" variant="subtle" />
      </nav>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VNavItem },
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;width:240px;">
        <VNavItem size="sm" label="Small item" icon="home" />
        <VNavItem size="md" label="Medium item" icon="home" active />
        <VNavItem size="lg" label="Large item" icon="home" />
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VNavItem },
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;width:240px;">
        <VNavItem variant="default" label="Default" icon="home" />
        <VNavItem variant="primary" label="Primary accent" icon="sparkle" />
        <VNavItem variant="subtle" label="Subtle muted" icon="settings" />
      </div>
    `,
  }),
}

export const BadgeTonePrimary: Story = { parameters: { docs: { description: { story: 'Variação **Badge Tone primária**. Props: `label="Inbox"`, `icon="inbox"`, `badge=8`, `badgeTone="primary"`.' } } }, args: { label: 'Inbox', icon: 'inbox', badge: 8, badgeTone: 'primary' } }

export const TagAndIconColor: Story = { parameters: { docs: { description: { story: 'Variação **Tag e ícone Color**. Props: `label="Projeto Atlas"`, `tag="Soon"`, `iconColor="var(--v-color-primary)"`.' } } }, args: { label: 'Projeto Atlas', tag: 'Soon', iconColor: 'var(--v-color-primary)' } }

export const ExpandableExpanded: Story = { parameters: { docs: { description: { story: 'Variação **Expandable expandido**. Props: `label="Produtos"`, `icon="folder"`, `expandable=true`, `expanded=true`, `ariaControls="submenu-produtos"`.' } } }, args: { label: 'Produtos', icon: 'folder', expandable: true, expanded: true, ariaControls: 'submenu-produtos' } }
