import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import VSidebar from './VSidebar.vue'
import VNavItem from '../VNavItem/VNavItem.vue'
import VButton from '../../form/VButton/VButton.vue'
import VDropdownMenu from '../VDropdownMenu/VDropdownMenu.vue'
import VAvatar from '../../images/VAvatar/VAvatar.vue'
import VTooltip from '../../feedback/VTooltip/VTooltip.vue'
import ThemeToggle from '../../../templates/_shared/ThemeToggle.vue'
import { NAV_ITEMS as SALES_NAV_ITEMS, RAIL_ITEMS as SALES_RAIL_ITEMS } from '../../../templates/SalesOverview/data'
import '../../../templates/_shared/sidebarPatterns.scss'
import { VIcon } from '../../primitives/VIcon'
import collapseIcon from '@iconify-icons/keyline-icons/chevrons-left'
import logoutIcon from '@iconify-icons/keyline-icons/door-open'
import helpCircleIcon from '@iconify-icons/keyline-icons/circle-question'
import homeIcon from '@iconify-icons/keyline-icons/home'
import inboxIcon from '@iconify-icons/keyline-icons/inbox'
import searchIcon from '@iconify-icons/keyline-icons/search'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import bellIcon from '@iconify-icons/keyline-icons/bell'
import panelLeftIcon from '@iconify-icons/keyline-icons/panel-left'
import chevronsUpDownIcon from '@iconify-icons/keyline-icons/chevrons-up-down'
import moreIcon from '@iconify-icons/keyline-icons/more-horizontal'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import helpIcon from '@iconify-icons/keyline-icons/book-open'
import type { VSidebarItem } from './VSidebar.types'

const meta = {
  title: 'navigation/VSidebar',
  component: VSidebar,
  args: {
    size: 'md',
    brandName: 'VueUI Nova',
    userName: 'Alex Chen',
    userEmail: 'alex@nova.dev',
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'card', 'workspace', 'icons', 'floating'] },
    heading: { control: 'text' },
    position: { control: 'text' },
    locked: { control: 'boolean' },
  },
} satisfies Meta<typeof VSidebar>
export default meta
type Story = StoryObj<typeof meta>

type BoundArgs = {
  activeItem?: string
  expandedSections?: string[]
  collapsed?: boolean
} & Record<string, unknown>

/**
 * Local v-model state for activeItem / expandedSections / collapsed so clicking in Storybook
 * really updates the sidebar (args are read-only for the component otherwise).
 */
function useBoundState(args: BoundArgs, fallbackActive?: string) {
  const active = ref<string | undefined>(args.activeItem ?? fallbackActive)
  const expanded = ref<string[] | undefined>(args.expandedSections ? [...args.expandedSections] : undefined)
  const collapsed = ref<boolean>(Boolean(args.collapsed))
  watch(() => args.activeItem, (v) => { active.value = v })
  watch(() => args.expandedSections, (v) => { expanded.value = v ? [...v] : undefined }, { deep: true })
  watch(() => args.collapsed, (v) => { collapsed.value = Boolean(v) })
  return { active, expanded, collapsed }
}

const BOUND = 'v-model:activeItem="active" v-model:expandedSections="expanded" v-model:collapsed="collapsed"'

/** Render function: one sidebar with local v-model bindings, optionally wrapped in a styled frame. */
const bound = (wrapStyle = '', fallbackActive?: string) => (args: BoundArgs) => ({
  components: { VSidebar },
  setup: () => ({ args, ...useBoundState(args, fallbackActive), wrapStyle }),
  template: `<div :style="wrapStyle"><VSidebar v-bind="args" ${BOUND} /></div>`,
})

export const Default: Story = { parameters: { docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } } }, render: bound('display:flex;', 'dashboard') }

export const Collapsed: Story = { parameters: { docs: { description: { story: 'Variação **Recolhido**. Props: `collapsed=true`.' } } }, args: { collapsed: true }, render: bound('display:flex;', 'dashboard') }

export const Icons: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ícones**. Props: `variant="icons"`, `showSearch=false`, `showFooter=false`, `activeItem="dashboard"`.' } },
  },
  args: { variant: 'icons', showSearch: false, showFooter: false, activeItem: 'dashboard' },
  render: bound('display:flex;align-items:flex-start;min-height:640px;padding:16px;background:var(--v-color-neutral-50);'),
}

export const IconsNoToggle: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ícones sem alternador**. Props: `variant="icons"`, `showSearch=false`, `showFooter=false`, `showCollapseToggle=false`, `activeItem="portfolio"`.' } },
  },
  args: {
    variant: 'icons',
    showSearch: false,
    showFooter: false,
    showCollapseToggle: false,
    activeItem: 'portfolio',
    items: [
      { value: 'portfolio', label: 'Portfolio', icon: 'pie-chart' },
      { value: 'wallet', label: 'Wallet', icon: 'wallet' },
      { value: 'activity', label: 'Activity', icon: 'chart-line' },
      { value: 'billing', label: 'Billing', icon: 'receipt' },
      { value: 'prefs', label: 'Preferences', icon: 'sliders' },
      { value: 'help', label: 'Help', icon: 'help-circle' },
    ],
  },
  render: bound('display:flex;align-items:flex-start;min-height:420px;padding:16px;background:var(--v-color-neutral-50);'),
}

export const Floating: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Flutuante**. Props: `variant="floating"`, `showSearch=false`, `heading="Canvas"`, `position="Alex Chen · Workspace"`, `brandName="Current"`. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  args: {
    variant: 'floating',
    showSearch: false,
    heading: 'Canvas',
    position: 'Alex Chen · Workspace',
    brandName: 'Current',
  },
  render: (args) => ({
    components: { VSidebar },
    setup: () => {
      const collapsed = ref(false)
      const locked = ref(false)
      const active = ref('dashboard')
      return { args, collapsed, locked, active }
    },
    template: `<div style="display:flex;align-items:flex-start;height:720px;padding:24px;background:var(--v-color-neutral-100);"><VSidebar v-bind="args" v-model:activeItem="active" v-model:collapsed="collapsed" v-model:locked="locked" /></div>`,
  }),
}

export const Modes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Modes**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VSidebar },
    setup: () => {
      const collapsed = ref(true)
      const locked = ref(false)
      const shared = {
        showSearch: false,
        heading: 'Canvas',
        position: 'Alex Chen · Workspace',
        brandName: 'Current',
      }
      const active = ref('dashboard')
      return { collapsed, locked, shared, active }
    },
    template: `
      <div style="display:flex;gap:24px;align-items:stretch;height:720px;padding:24px;background:var(--v-color-neutral-100);">
        <VSidebar variant="floating" v-bind="shared" v-model:activeItem="active" v-model:collapsed="collapsed" v-model:locked="locked" />
        <VSidebar v-bind="shared" v-model:activeItem="active" />
        <VSidebar variant="floating" v-bind="shared" v-model:activeItem="active" locked />
        <VSidebar variant="floating" v-bind="shared" v-model:activeItem="active" :collapsed="false" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: (args) => ({
    components: { VSidebar },
    setup: () => ({ args, active: ref('dashboard') }),
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start; min-height: 520px;">
        <VSidebar v-bind="args" v-model:activeItem="active" size="sm" />
        <VSidebar v-bind="args" v-model:activeItem="active" size="md" />
        <VSidebar v-bind="args" v-model:activeItem="active" size="lg" />
      </div>
    `,
  }),
}

export const Nested: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Aninhado**. Props: `activeItem="overview"`.' } },
  },
  args: { activeItem: 'overview', expandedSections: ['team'] },
  render: bound('display:flex;', 'overview'),
}

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }

const cardItems = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'agent', label: 'lemAgent', icon: 'bot' },
  { value: 'find', label: 'Find & Manage', type: 'heading' as const },
  { value: 'people', label: 'People database', icon: 'users' },
  { value: 'signals', label: 'Signal agents', icon: 'radar' },
  { value: 'contacts', label: 'Contacts', icon: 'contact' },
  { value: 'companies', label: 'Companies', icon: 'building' },
  { value: 'engage', label: 'Engage', type: 'heading' as const },
  { value: 'campaigns', label: 'Campaigns', icon: 'send' },
  { value: 'tasks', label: 'Tasks', icon: 'check' },
  { value: 'inbox', label: 'Inbox', icon: 'inbox' },
]

const workspaceItems = [
  { value: 'workspace', label: 'Workspace', type: 'heading' as const },
  { value: 'overview', label: 'Overview', icon: 'overview' },
  { value: 'templates', label: 'Templates', icon: 'templates' },
  { value: 'workflow', label: 'Workflow Builder', icon: 'workflow' },
  { value: 'ai', label: 'AI Configuration', icon: 'ai' },
  { value: 'test', label: 'Test Run', icon: 'play' },
  { value: 'review', label: 'Review Queue', icon: 'inbox' },
  { value: 'analytics', label: 'Analytics', icon: 'analytics' },
  { value: 'operations', label: 'Operations', type: 'heading' as const },
  { value: 'runs', label: 'Runs & Logs', icon: 'play' },
  { value: 'exceptions', label: 'Exceptions', icon: 'exceptions' },
  { value: 'connectors', label: 'Connectors', icon: 'connectors' },
  { value: 'sources', label: 'Data Sources', icon: 'database' },
  { value: 'admin', label: 'Administration', type: 'heading' as const },
  { value: 'team', label: 'Team & Permissions', icon: 'team' },
  { value: 'notifications', label: 'Notifications', icon: 'notifications', badge: 78 },
  { value: 'billing', label: 'Usage & Billing', icon: 'billing' },
  { value: 'audit', label: 'Audit Log', icon: 'file' },
  { value: 'settings', label: 'System Settings', icon: 'settings' },
]

export const CardMenu: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Card menu**. Props: `variant="card"`, `brandName="Current"`, `showSearch=false`, `showFooter=false`, `activeItem="home"`.' } },
  },
  args: {
    variant: 'card',
    brandName: 'Current',
    showSearch: false,
    showFooter: false,
    activeItem: 'home',
    items: cardItems,
  },
  render: bound('display:flex;height:640px;background:var(--v-color-neutral-50);'),
}

export const Workspace: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Workspace**. Props: `variant="workspace"`, `showSearch=false`, `showFooter=false`, `brandName="FlowPilot AI"`, `activeItem="templates"`.' } },
  },
  args: {
    variant: 'workspace',
    showSearch: false,
    showFooter: false,
    brandName: 'FlowPilot AI',
    activeItem: 'templates',
    items: workspaceItems,
  },
  render: bound('display:flex;align-items:flex-start;height:720px;background:var(--v-color-neutral-100);'),
}

export const CustomFooter: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Rodapé personalizado**. O slot `#footer` recebe `{ collapsed }`: aberto mostra avatar + nome e cargo; recolhido, só o avatar centralizado no rail.' } },
  },
  render: (args) => ({
    components: { VSidebar, VAvatar },
    setup: () => ({ args, ...useBoundState(args, 'dashboard') }),
    template: `
      <VSidebar v-bind="args" ${BOUND}>
        <template #footer="{ collapsed: isCollapsed }">
          <div style="display:flex;align-items:center;gap:8px;min-height:var(--v-sidebar-item-height)">
            <VAvatar initials="JD" size="sm" decorative />
            <span v-if="!isCollapsed" style="display:grid;min-width:0;line-height:1.25">
              <strong style="font-size:13px;font-weight:600;color:var(--v-color-text)">Jane Doe</strong>
              <span style="font-size:12px;color:var(--v-color-text-muted)">Product designer</span>
            </span>
          </div>
        </template>
      </VSidebar>
    `,
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// Multi-level, accordion, search, groups — modern SaaS sidebars
// ─────────────────────────────────────────────────────────────────────────────

const frame = (height = 640) =>
  `display:flex;height:${height}px;background:var(--v-color-bg);overflow:hidden;`

/** 3 levels + headings inside submenus + groups (~40 entries) so the nav scrolls. */
const multiLevelItems: VSidebarItem[] = [
  {
    value: 'g-main',
    label: 'Main',
    type: 'group',
    children: [
      { value: 'dashboard', label: 'Dashboard', icon: 'home' },
      {
        value: 'analytics',
        label: 'Analytics',
        icon: 'analytics',
        children: [
          { value: 'h-reports', label: 'Reports', type: 'heading' },
          { value: 'revenue', label: 'Revenue' },
          { value: 'retention', label: 'Retention' },
          { value: 'h-funnels', label: 'Funnels', type: 'heading' },
          {
            value: 'acquisition',
            label: 'Acquisition',
            children: [
              { value: 'signup', label: 'Sign-up flow' },
              { value: 'checkout', label: 'Checkout flow' },
              { value: 'onboarding', label: 'Onboarding', badge: 4 },
            ],
          },
          { value: 'cohorts', label: 'Cohorts' },
        ],
      },
      {
        value: 'projects',
        label: 'Projects',
        icon: 'projects',
        children: [
          { value: 'h-active', label: 'Active', type: 'heading' },
          { value: 'atlas', label: 'Atlas redesign' },
          { value: 'nova', label: 'Nova kit', badge: 12 },
          { value: 'h-archived', label: 'Archived', type: 'heading' },
          {
            value: 'legacy',
            label: 'Legacy',
            children: [
              { value: 'portal-v1', label: 'Portal v1' },
              { value: 'portal-v2', label: 'Portal v2' },
            ],
          },
        ],
      },
      { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: 8 },
    ],
  },
  {
    value: 'g-team',
    label: 'Team',
    type: 'group',
    children: [
      {
        value: 'team',
        label: 'People',
        icon: 'team',
        children: [
          { value: 'members', label: 'Members' },
          { value: 'roles', label: 'Roles' },
          {
            value: 'permissions',
            label: 'Permissions',
            children: [
              { value: 'perm-read', label: 'Read access' },
              { value: 'perm-write', label: 'Write access' },
              { value: 'perm-admin', label: 'Admin access' },
            ],
          },
          { value: 'invites', label: 'Invitations' },
        ],
      },
      { value: 'calendar', label: 'Calendar', icon: 'calendar' },
      { value: 'tasks', label: 'My tasks', icon: 'tasks', badge: 3 },
    ],
  },
  {
    value: 'g-system',
    label: 'System',
    type: 'group',
    children: [
      {
        value: 'integrations',
        label: 'Integrations',
        icon: 'integrations',
        children: [
          { value: 'slack', label: 'Slack' },
          { value: 'github', label: 'GitHub' },
          { value: 'figma', label: 'Figma' },
        ],
      },
      { value: 'billing', label: 'Billing', icon: 'billing' },
      { value: 'security', label: 'Security', icon: 'shield' },
      { value: 'audit', label: 'Audit log', icon: 'file' },
      { value: 'settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

export const MultiLevel: Story = {
  parameters: { docs: { description: { story: 'Variação **Multi nível**. Props: `activeItem="perm-write"`, `userName="Alex Chen"`.' } }, layout: 'fullscreen' },
  args: { items: multiLevelItems, activeItem: 'perm-write', userName: 'Alex Chen' },
  render: bound(frame(640)),
}

const accordionItems: VSidebarItem[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  {
    value: 'products', label: 'Products', icon: 'folder', children: [
      { value: 'catalog', label: 'Catalog' },
      { value: 'pricing', label: 'Pricing' },
      { value: 'variants', label: 'Variants', children: [{ value: 'sizes', label: 'Sizes' }, { value: 'colors', label: 'Colors' }] },
    ],
  },
  {
    value: 'orders', label: 'Orders', icon: 'send', children: [
      { value: 'open', label: 'Open' },
      { value: 'shipped', label: 'Shipped' },
      { value: 'returns', label: 'Returns' },
    ],
  },
  {
    value: 'customers', label: 'Customers', icon: 'users', children: [
      { value: 'segments', label: 'Segments' },
      { value: 'reviews', label: 'Reviews' },
    ],
  },
  {
    value: 'reports', label: 'Reports', icon: 'chart', children: [
      { value: 'sales', label: 'Sales' },
      { value: 'traffic', label: 'Traffic' },
    ],
  },
]

export const Accordion: Story = {
  parameters: { docs: { description: { story: 'Variação **Acordeão**. Esquerda: `accordion` (padrão), abrir uma seção fecha as irmãs. Direita: `:accordion="false"`, as seções abrem de forma independente. Inclui interação automatizada (`play`).' } }, layout: 'fullscreen' },
  // Opens "Orders" in both sidebars: the left one closes "Products", the right one keeps it open.
  play: async ({ canvasElement }) => {
    canvasElement
      .querySelectorAll<HTMLElement>('[data-test-id="v-sidebar-nav-item-orders"]')
      .forEach((el) => el.click())
  },
  render: () => ({
    components: { VSidebar },
    setup: () => ({ items: accordionItems, frame: frame(520), activeA: ref('catalog'), activeB: ref('catalog'), expA: ref(['products']), expB: ref(['products']) }),
    template: `
      <div :style="frame + 'gap:24px;padding:0 24px;background:var(--v-color-neutral-100)'">
        <VSidebar :items="items" :show-footer="false" :show-search="false" v-model:expandedSections="expA" v-model:activeItem="activeA" />
        <VSidebar :items="items" :accordion="false" :show-footer="false" :show-search="false" v-model:expandedSections="expB" v-model:activeItem="activeB" />
      </div>`,
  }),
}

export const SearchFilter: Story = {
  parameters: { docs: { description: { story: 'Variação **Busca filtro**. Props: `activeItem="dashboard"`, `searchPlaceholder="Search menu…"`, `searchShortcut="/"`. Inclui interação automatizada (`play`).' } }, layout: 'fullscreen' },
  args: { items: multiLevelItems, activeItem: 'dashboard', searchPlaceholder: 'Search menu…', searchShortcut: '/' },
  render: bound(frame(640)),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('[data-test-id="v-sidebar-search-field"]')
    if (!input) return
    input.value = 'perm'
    input.dispatchEvent(new Event('input', { bubbles: true }))
  },
}

const darkItems: VSidebarItem[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'updates', label: 'Updates', icon: 'bell', badge: 44 },
  { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: 20 },
  { value: 'my-tasks', label: 'My tasks', icon: 'tasks', badge: '+' },
  {
    value: 'g-workspace',
    label: 'Workspace',
    type: 'group',
    children: [
      {
        value: 'roadmap',
        label: 'Roadmap',
        icon: 'chart',
        children: [
          { value: 'q1', label: 'Q1 planning' },
          { value: 'q2', label: 'Q2 planning' },
        ],
      },
      { value: 'cycles', label: 'Cycles', icon: 'activity' },
    ],
  },
  {
    value: 'g-projects',
    label: 'Projects',
    type: 'group',
    children: [
      {
        value: 'p-atlas',
        label: 'Atlas',
        iconColor: 'var(--v-color-primary-500)',
        children: [
          { value: 'atlas-mar', label: 'March', badge: 23 },
          { value: 'atlas-apr', label: 'April', badge: 99 },
        ],
      },
      {
        value: 'p-orbit',
        label: 'Orbit',
        iconColor: 'var(--v-color-success-base)',
        children: [
          { value: 'orbit-mar', label: 'March', badge: 7 },
          { value: 'orbit-apr', label: 'April', badge: 12 },
        ],
      },
      {
        value: 'p-lumen',
        label: 'Lumen',
        iconColor: 'var(--v-color-orange-base)',
        children: [{ value: 'lumen-all', label: 'All issues', badge: 31 }],
      },
      { value: 'p-pulse', label: 'Pulse', iconColor: 'var(--v-color-pink-base)', badge: 5 },
    ],
  },
]

const railBtn =
  'width:32px;height:32px;display:grid;place-items:center;border:0;border-radius:8px;background:transparent;color:var(--v-color-text-muted);cursor:pointer'

export const DarkWorkspace: Story = {
  name: 'Workspace Starline',
  parameters: { docs: { description: { story: 'Workspace completo (Starline): segue o tema claro/escuro da página. Slots usados: `#group-actions`, `#header`, `#after-nav`, `#footer`. Recolhido, o `#header` mostra só a marca (escopo `{ collapsed }`) e o rodapé empilha os atalhos no eixo do rail.' } }, layout: 'fullscreen' },
  render: () => ({
    components: { VSidebar, VIcon },
    setup: () => ({
      items: darkItems,
      railBtn,
      actionBtn: railBtn.replace('width:32px;height:32px', 'width:20px;height:20px'),
      icons: { moreIcon, plusIcon, homeIcon, inboxIcon, searchIcon, folderIcon, settingsIcon, sparklesIcon, bellIcon, panelLeftIcon, chevronsUpDownIcon, helpIcon },
      frame: frame(800),
      active: ref('atlas-mar'),
      expanded: ref(['g-workspace', 'g-projects', 'p-atlas']),
      collapsed: ref(false),
    }),
    template: `
      <div :style="frame + 'color:var(--v-color-text)'">
        <nav aria-label="Apps" style="width:44px;flex:none;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 0;border-right:1px solid var(--v-color-divider);background:var(--v-color-bg)">
          <span style="width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--v-color-primary-400),var(--v-color-primary-700));margin-bottom:8px"></span>
          <button v-for="i in [icons.homeIcon, icons.folderIcon, icons.inboxIcon, icons.sparklesIcon]" :key="i.body" type="button" :style="railBtn"><VIcon :icon="i" size="sm" /></button>
          <span style="flex:1"></span>
          <button type="button" :style="railBtn"><VIcon :icon="icons.settingsIcon" size="sm" /></button>
        </nav>
        <VSidebar :items="items" :width="216" group-chevron="start" group-dividers chevron="updown" v-model:activeItem="active" v-model:expandedSections="expanded" v-model:collapsed="collapsed" search-placeholder="Command" search-shortcut="/" show-footer>
          <template #group-actions="{ group }">
            <button type="button" :aria-label="'More options for ' + group.label" :style="actionBtn"><VIcon :icon="icons.moreIcon" size="sm" /></button>
            <button type="button" :aria-label="'Add to ' + group.label" :style="actionBtn"><VIcon :icon="icons.plusIcon" size="sm" /></button>
          </template>
          <template #header="{ collapsed: isCollapsed, toggle }">
            <span style="width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,var(--v-color-primary-400),var(--v-color-primary-700));flex:none"></span>
            <template v-if="!isCollapsed">
              <span style="flex:1;font-size:13px;font-weight:600;color:var(--v-color-text)">Starline AI</span>
              <VIcon :icon="icons.chevronsUpDownIcon" size="sm" style="color:var(--v-color-text-muted)" />
              <button type="button" aria-label="Collapse sidebar" :style="railBtn" @click="toggle"><VIcon :icon="icons.panelLeftIcon" size="sm" /></button>
            </template>
          </template>
          <template #after-nav>
            <div style="border:1px solid var(--v-color-divider);border-radius:12px;overflow:hidden;background:var(--v-color-neutral-50)">
              <div style="height:48px;background:linear-gradient(120deg,var(--v-color-primary-700),var(--v-color-primary-500) 60%,var(--v-color-primary-300))"></div>
              <div style="padding:10px 12px 12px;display:grid;gap:8px">
                <span style="font-size:12px;color:var(--v-color-text-muted);line-height:16px">Unlock unlimited projects and AI triage.</span>
                <button type="button" style="height:30px;border:0;border-radius:8px;background:var(--v-color-text);color:var(--v-color-bg);font:600 12px var(--v-font-family-sans);cursor:pointer">Upgrade Plan</button>
              </div>
            </div>
          </template>
          <template #footer="{ collapsed: isCollapsed }">
            <div :style="{ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', alignItems: 'center', gap: '4px' }">
              <button v-for="i in [icons.helpIcon, icons.bellIcon, icons.settingsIcon]" :key="i.body" type="button" :style="railBtn"><VIcon :icon="i" size="sm" /></button>
            </div>
          </template>
        </VSidebar>
        <main style="flex:1"></main>
      </div>`,
  }),
}

const portfolioItems: VSidebarItem[] = [
  {
    value: 'g-portfolio',
    label: 'Portfolio',
    type: 'group',
    collapsible: false,
    children: [
      { value: 'overview', label: 'Overview', icon: 'overview' },
      { value: 'holdings', label: 'Holdings', icon: 'folder' },
      {
        value: 'performance',
        label: 'Performance',
        icon: 'trending',
        children: [
          { value: 'returns', label: 'Returns' },
          { value: 'benchmarks', label: 'Benchmarks' },
        ],
      },
    ],
  },
  {
    value: 'g-operations',
    label: 'Operations',
    type: 'group',
    collapsible: false,
    children: [
      { value: 'rebalancing', label: 'Rebalancing', icon: 'workflow' },
      { value: 'orders', label: 'Orders', icon: 'send' },
      { value: 'compliance', label: 'Compliance', icon: 'shield', tag: 'Soon', disabled: true },
      { value: 'tax', label: 'Tax harvesting', icon: 'wallet', tag: 'Soon', disabled: true },
    ],
  },
  {
    value: 'g-queue',
    label: 'Execution queue',
    type: 'group',
    collapsible: false,
    children: [
      { value: 'pending', label: 'Pending', icon: 'clock', badge: 6 },
      { value: 'scheduled', label: 'Scheduled', icon: 'calendar' },
      { value: 'failed', label: 'Failed', icon: 'alert', tag: 'Soon', disabled: true },
    ],
  },
]

export const LightPortfolio: Story = {
  name: 'Portfólio',
  parameters: { docs: { description: { story: 'Variação **Portfólio** (segue o tema da página). Interativo: o estado é mantido na própria story (`v-model`). Slots usados: `#after-nav`.' } }, layout: 'fullscreen' },
  render: () => ({
    components: { VSidebar },
    setup: () => ({ items: portfolioItems, frame: frame(720), active: ref('rebalancing'), expanded: ref(['performance']) }),
    template: `
      <div :style="frame">
        <VSidebar :width="216" style="--v-sidebar-item-active-bg:var(--v-color-neutral-100);--v-sidebar-item-active-color:var(--v-color-text);--v-sidebar-accent:var(--v-color-text)" :items="items" v-model:activeItem="active" v-model:expandedSections="expanded" brand-name="Locally inc." search-placeholder="Search" search-shortcut="⌘K" user-name="Marta Silva" user-email="marta@locally.io" user-avatar="MS">
          <template #after-nav>
            <div style="border:1px solid var(--v-sidebar-border);border-radius:12px;padding:12px;display:grid;gap:8px;background:var(--v-color-neutral-50)">
              <strong style="font-size:13px;color:var(--v-color-text)">AI Rebalancer</strong>
              <span style="font-size:11px;line-height:16px;color:var(--v-color-text-muted)">3 drift alerts are ready to review before market open.</span>
              <button type="button" style="height:30px;border:0;border-radius:8px;background:var(--v-color-text);color:var(--v-color-bg);font:600 12px var(--v-font-family-sans);cursor:pointer">Review</button>
            </div>
          </template>
        </VSidebar>
        <main style="flex:1"></main>
      </div>`,
  }),
}

const careOpsItems: VSidebarItem[] = [
  {
    value: 'g-menu',
    label: 'Menu',
    type: 'group',
    children: [
      { value: 'dash', label: 'Dashboard', icon: 'home' },
      { value: 'appointments', label: 'Appointments', icon: 'calendar', badge: 10, badgeTone: 'primary' },
      { value: 'patients', label: 'Patients', icon: 'users' },
      { value: 'messages', label: 'Messages', icon: 'message', badge: 3, badgeTone: 'primary' },
    ],
  },
  {
    value: 'g-business',
    label: 'Business',
    type: 'group',
    children: [
      {
        value: 'finance',
        label: 'Finance',
        icon: 'wallet',
        children: [
          { value: 'invoices', label: 'Invoices' },
          { value: 'payouts', label: 'Payouts' },
        ],
      },
      { value: 'staff', label: 'Staff', icon: 'team' },
      { value: 'reports', label: 'Reports', icon: 'chart' },
    ],
  },
  {
    value: 'g-support',
    label: 'Support',
    type: 'group',
    defaultOpen: false,
    children: [
      { value: 'help', label: 'Help center', icon: 'book' },
      { value: 'status', label: 'System status', icon: 'activity' },
    ],
  },
]

export const CollapsibleGroups: Story = {
  parameters: { docs: { description: { story: 'Variação **Recolhível grupos**. Props: `activeItem="appointments"`, `brandName="CareOps"`, `size="lg"`.' } }, layout: 'fullscreen' },
  args: { items: careOpsItems, activeItem: 'appointments', brandName: 'CareOps', size: 'lg' },
  render: (args) => ({
    components: { VSidebar },
    setup: () => ({ args: { ...args, showSearch: false }, ...useBoundState(args), wrapStyle: frame(640) }),
    template: `<div :style="wrapStyle"><VSidebar v-bind="args" ${BOUND} group-chevron-open="up" /></div>`,
  }),
}

export const ChevronStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Estilos de chevron, da esquerda para a direita: `chevron="rotate"` + `groupChevron="end"` (padrão); `chevron="updown"` + `groupChevronOpen="up"` ("v" fechado, "^" aberto); `groupChevron="start"` (chevron do grupo antes da legenda).',
      },
    },
    layout: 'fullscreen',
  },
  render: () => ({
    components: { VSidebar },
    setup: () => ({
      careOpsItems,
      accordionItems,
      frame: frame(460),
      combos: [
        { id: 'rotate-end', chevron: 'rotate', groupChevron: 'end', groupChevronOpen: 'down' },
        { id: 'updown-up', chevron: 'updown', groupChevron: 'end', groupChevronOpen: 'up' },
        { id: 'group-start', chevron: 'rotate', groupChevron: 'start', groupChevronOpen: 'down' },
      ],
    }),
    template: `<div :style="frame + 'gap:16px;padding:0 16px;overflow-x:auto;background:var(--v-color-neutral-100)'">
      <VSidebar v-for="c in combos" :key="c.id" :items="careOpsItems" :show-footer="false" :show-search="false" :chevron="c.chevron" :group-chevron="c.groupChevron" :group-chevron-open="c.groupChevronOpen" active-item="appointments" />
    </div>`,
  }),
}

export const CustomWidth: Story = {
  parameters: {
    docs: { description: { story: '`width` define a largura do painel (número = px; string = qualquer comprimento CSS) via `--v-sidebar-width`. Esquerda: `240`; direita: `"22rem"`.' } },
    layout: 'fullscreen',
  },
  render: () => ({
    components: { VSidebar },
    setup: () => ({ accordionItems, frame: frame(420) }),
    template: `<div :style="frame + 'gap:24px;padding:0 16px;background:var(--v-color-neutral-100)'">
      <VSidebar :items="accordionItems" :show-footer="false" :show-search="false" :width="240" />
      <VSidebar :items="accordionItems" :show-footer="false" :show-search="false" width="22rem" />
    </div>`,
  }),
}

export const GroupDividers: Story = {
  parameters: {
    docs: { description: { story: '`groupDividers` adiciona uma linha fina acima de cada grupo, exceto o primeiro.' } },
    layout: 'fullscreen',
  },
  args: { items: careOpsItems, groupDividers: true, showSearch: false, showFooter: false, activeItem: 'appointments' },
  render: bound(frame(480)),
}

export const ItemTrailingSlot: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Slot `#item-trailing="{ item }"`: conteúdo à direita de cada item (aqui, ação de adicionar nos itens com filhos). Também é possível trocar `#header`, `#before-nav`, `#after-nav` e `#footer`.',
      },
    },
    layout: 'fullscreen',
  },
  render: () => ({
    components: { VSidebar },
    setup: () => ({ accordionItems, frame: frame(420), active: ref('catalog'), expanded: ref(['products']) }),
    template: `<div :style="frame + 'gap:16px;padding:0 16px;background:var(--v-color-neutral-100)'">
      <VSidebar :items="accordionItems" :show-footer="false" :show-search="false" v-model:activeItem="active" v-model:expandedSections="expanded">
        <template #item-trailing="{ item }">
          <button v-if="item.hasChildren" type="button" aria-label="Adicionar" style="border:0;background:transparent;color:inherit;cursor:pointer" @click.stop>+</button>
        </template>
      </VSidebar>
    </div>`,
  }),
}

export const ControlledExpandedSections: Story = {
  parameters: {
    docs: { description: { story: 'Com `expandedSections` controlado (`v-model:expandedSections`), liste **todos** os ids de grupos/itens abertos; aqui começam abertos `products` e `orders`. Cada abertura/fechamento também emite `section-toggle(value, expanded)`.' } },
    layout: 'fullscreen',
  },
  render: () => ({
    components: { VSidebar },
    setup: () => ({ accordionItems, frame: frame(460), expanded: ref(['products', 'orders']), active: ref('open') }),
    template: `<div :style="frame + 'gap:16px;padding:0 16px;background:var(--v-color-neutral-100)'">
      <VSidebar :items="accordionItems" :accordion="false" :show-footer="false" :show-search="false" v-model:activeItem="active" v-model:expandedSections="expanded" />
    </div>`,
  }),
}

/* ────────────────────────────────────────────────────────────────────────────
 * Montagem — cada parte do menu lateral montada separadamente, com os mesmos
 * dados (`templates/SalesOverview/data.ts`) e o mesmo CSS
 * (`templates/_shared/sidebarPatterns.scss`) dos templates Sales Overview e
 * Insights Detail. O que aparece aqui é exatamente o que aparece nos templates.
 * ──────────────────────────────────────────────────────────────────────────── */
const recipeWorkspaceRail: VSidebarItem[] = [
  { value: 'grid', label: 'Dashboard', icon: 'grid' },
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'cloud', label: 'Environments', icon: 'cloud' },
  { value: 'cost', label: 'Cost', icon: 'dollar' },
  { value: 'keys', label: 'API keys', icon: 'key' },
  { value: 'integrations', label: 'Integrations', icon: 'plug' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
const recipeFootItems = [
  { value: 'help', label: 'Help', icon: helpCircleIcon },
  { value: 'logout', label: 'Sign out', icon: logoutIcon },
]
const recipeOpen = ['g-pipeline', 'g-reports', 'g-workspace', 'g-settings', 'deals']
const recipeWorkspaces = [
  { value: 'sparkpixel', label: 'sparkpixel.studio', selected: true },
  { value: 'acme', label: 'acme.ai' },
  { value: 'new', label: 'Create workspace', icon: 'plus', divider: true },
]

/** Page canvas used by the templates (Sales Overview background). */
const SALES_PAGE = 'display:flex;min-height:100vh;background:var(--v-color-bg);color:var(--v-color-text);font-family:var(--v-font-family-sans);'
/** Insights Detail frame: rounded surface card on the page background. */
const INSIGHTS_PAGE = 'min-height:100vh;box-sizing:border-box;padding:16px;background:var(--v-color-bg);font-family:var(--v-font-family-sans);'
const INSIGHTS_FRAME = 'display:flex;min-height:calc(100vh - 32px);border:1px solid var(--v-color-border);border-radius:28px;background:var(--v-color-surface);overflow:hidden;box-shadow:var(--v-shadow-sm);'

const switcherTemplate = `
  <VDropdownMenu v-model:value="workspace" :items="workspaces" menu-align="start" aria-label="Switch workspace">
    <template #trigger>
      <button type="button" class="sp-switcher" aria-haspopup="menu">
        <span class="sp-switcher__mark" aria-hidden="true">s</span>
        <span class="sp-switcher__name">{{ workspaces.find((w) => w.value === workspace)?.label }}</span>
        <VIcon :icon="chevronsUpDownIcon" size="sm" />
      </button>
    </template>
  </VDropdownMenu>`

const recipeParams = (story: string, code: string, height = '680px') => ({
  layout: 'fullscreen',
  docs: { story: { inline: false, height }, description: { story }, source: { code, language: 'html' } },
})

export const RecipeIconsOnlyRail: Story = {
  name: 'Montagem · Rail de ícones',
  parameters: recipeParams(
    'Rail de apps do **Sales Overview**: `variant="icons"` (itens 40×40, raio 12, ativo em `primary` 14%; a classe `sp-app-rail` só adiciona espaçamento e `sticky`). `label` vira `title` + `aria-label`; `icon` é um nome do registro interno do `VSidebar`.',
    `<script setup lang="ts">
import '@/templates/_shared/sidebarPatterns.scss'
const rail = ref('chart')
const RAIL_ITEMS = [
  { value: 'globe', label: 'Sites', icon: 'globe' },
  { value: 'chart', label: 'Analytics', icon: 'chart' },
  { value: 'chat', label: 'Conversations', icon: 'chat' },
  { value: 'file', label: 'Documents', icon: 'file' },
  { value: 'nodes', label: 'Automations', icon: 'workflow' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <VSidebar
    v-model:active-item="rail"
    class="sp-app-rail"
    variant="icons"
    :items="RAIL_ITEMS"
    :show-search="false"
    :show-footer="false"
    :show-brand="false"
    :show-collapse-toggle="false"
    aria-label="Apps"
  />
</template>`,
    '320px',
  ),
  render: () => ({
    components: { VSidebar },
    setup: () => ({ items: SALES_RAIL_ITEMS, rail: ref('chart'), page: SALES_PAGE }),
    template: `<div :style="page"><VSidebar v-model:active-item="rail" class="sp-app-rail" variant="icons" :items="items" :show-search="false" :show-footer="false" :show-brand="false" :show-collapse-toggle="false" aria-label="Apps" /></div>`,
  }),
}

export const RecipeExpandableRail: Story = {
  name: 'Montagem · Rail expansível (ícones ⇄ textos)',
  parameters: recipeParams(
    'Rail do **Insights Detail**: `VSidebar` recolhido (`v-model:collapsed`) que expande para ícones + textos pelo botão do próprio componente. O `#header` **substitui a marca e o toggle inline**, por isso recebe `{ collapsed, toggle }` e traz o botão de recolher; o rodapé usa `VNavItem` (ícone no slot `#icon`) com `VTooltip` quando recolhido.',
    `<script setup lang="ts">
import '@/templates/_shared/sidebarPatterns.scss'
import collapseIcon from '@iconify-icons/keyline-icons/chevrons-left'
import helpIcon from '@iconify-icons/keyline-icons/circle-question'
import logoutIcon from '@iconify-icons/keyline-icons/door-open'

const collapsed = ref(true)
const active = ref('grid')
const items = [
  { value: 'grid', label: 'Dashboard', icon: 'grid' },
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'cloud', label: 'Environments', icon: 'cloud' },
  { value: 'cost', label: 'Cost', icon: 'dollar' },
  { value: 'keys', label: 'API keys', icon: 'key' },
  { value: 'integrations', label: 'Integrations', icon: 'plug' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
const footItems = [
  { value: 'help', label: 'Help', icon: helpIcon },
  { value: 'logout', label: 'Sign out', icon: logoutIcon },
]
</script>

<template>
  <VSidebar
    v-model:active-item="active"
    v-model:collapsed="collapsed"
    class="sp-rail"
    :items="items"
    :show-search="false"
    :show-brand="false"
    aria-label="Workspace"
  >
    <template #header="{ collapsed: isCollapsed, toggle }">
      <div class="sp-rail__head" :class="{ 'is-collapsed': isCollapsed }">
        <ThemeToggle :variant="isCollapsed ? 'icon' : 'segmented'" />
        <VButton v-if="!isCollapsed" variant="icon" size="sm" aria-label="Collapse sidebar" @click="toggle">
          <template #icon><VIcon :icon="collapseIcon" size="sm" /></template>
        </VButton>
      </div>
    </template>

    <template #footer>
      <div class="sp-rail__foot">
        <VTooltip v-for="f in footItems" :key="f.value" :content="f.label" placement="right" :disabled="!collapsed">
          <VNavItem :label="f.label" :collapsed="collapsed" :aria-label="f.label">
            <template #icon><VIcon :icon="f.icon" size="sm" /></template>
          </VNavItem>
        </VTooltip>
      </div>
    </template>
  </VSidebar>
</template>`,
  ),
  render: () => ({
    components: { VSidebar, VNavItem, VButton, VIcon, VTooltip, ThemeToggle },
    setup: () => ({
      items: recipeWorkspaceRail,
      footItems: recipeFootItems,
      active: ref('grid'),
      collapsed: ref(true),
      collapseIcon,
      page: INSIGHTS_PAGE,
      frame: INSIGHTS_FRAME,
    }),
    template: `<div :style="page"><div :style="frame">
      <VSidebar v-model:active-item="active" v-model:collapsed="collapsed" class="sp-rail" :items="items" :show-search="false" :show-brand="false" aria-label="Workspace">
        <template #header="{ collapsed: isCollapsed, toggle }">
          <div class="sp-rail__head" :class="{ 'is-collapsed': isCollapsed }">
            <ThemeToggle :variant="isCollapsed ? 'icon' : 'segmented'" />
            <VButton v-if="!isCollapsed" variant="icon" size="sm" aria-label="Collapse sidebar" @click="toggle">
              <template #icon><VIcon :icon="collapseIcon" size="sm" /></template>
            </VButton>
          </div>
        </template>
        <template #footer>
          <div class="sp-rail__foot">
            <VTooltip v-for="f in footItems" :key="f.value" :content="f.label" placement="right" :disabled="!collapsed">
              <VNavItem :label="f.label" :collapsed="collapsed" :aria-label="f.label">
                <template #icon><VIcon :icon="f.icon" size="sm" /></template>
              </VNavItem>
            </VTooltip>
          </div>
        </template>
      </VSidebar>
      <div style="flex:1"></div>
    </div></div>`,
  }),
}

export const RecipeMenuOnly: Story = {
  name: 'Montagem · Menu com grupos e submenus',
  parameters: recipeParams(
    'Menu do **Sales Overview** sem o seletor: `<aside class="sp-side">` (248px, bordas laterais) com `VSidebar.sp-side__nav`. `type: "group"` cria a seção; item com `children` vira submenu; `expandedSections` lista os `value` abertos.',
    `<script setup lang="ts">
import '@/templates/_shared/sidebarPatterns.scss'
import type { VSidebarItem } from 'vueui-nova-kit'

const nav = ref('overview')
const NAV_ITEMS: VSidebarItem[] = [
  { value: 'overview', label: 'Overview', icon: 'overview' },
  { value: 'g-pipeline', label: 'Pipeline', type: 'group', children: [
    { value: 'listings', label: 'Listings', icon: 'building' },
    { value: 'clients', label: 'Clients', icon: 'users' },
    { value: 'appointments', label: 'Appointments', icon: 'calendar' },
  ] },
  { value: 'g-reports', label: 'Reports', type: 'group', children: [
    { value: 'revenue', label: 'Revenue', icon: 'wallet' },
    { value: 'deals', label: 'Deals', icon: 'briefcase', children: [
      { value: 'deals-open', label: 'Open' },
      { value: 'deals-won', label: 'Won' },
      { value: 'deals-lost', label: 'Lost' },
    ] },
    { value: 'performance', label: 'Performance', icon: 'trending' },
  ] },
  // g-workspace, g-settings…
]
</script>

<template>
  <aside class="sp-side" aria-label="Workspace navigation">
    <VSidebar
      v-model:active-item="nav"
      class="sp-side__nav"
      :items="NAV_ITEMS"
      :expanded-sections="['g-pipeline', 'g-reports', 'g-workspace', 'g-settings', 'deals']"
      :show-search="false"
      :show-footer="false"
      :show-brand="false"
      aria-label="Workspace"
    />
  </aside>
</template>`,
  ),
  render: () => ({
    components: { VSidebar },
    setup: () => ({ items: SALES_NAV_ITEMS, nav: ref('overview'), open: recipeOpen, page: SALES_PAGE }),
    template: `<div :style="page"><aside class="sp-side" aria-label="Workspace navigation"><VSidebar v-model:active-item="nav" class="sp-side__nav" :items="items" :expanded-sections="open" :show-search="false" :show-footer="false" :show-brand="false" aria-label="Workspace" /></aside></div>`,
  }),
}

export const RecipeScopeHeader: Story = {
  name: 'Montagem · Seletor de workspace (header)',
  parameters: recipeParams(
    'Seletor de escopo/workspace do **Sales Overview**. O `VSidebar` não traz seletor: ele entra no slot `#header` (substitui a marca). O botão `sp-switcher` é o gatilho de um `VDropdownMenu`; ao trocar `workspace`, recarregue os `items` do menu.',
    `<script setup lang="ts">
import '@/templates/_shared/sidebarPatterns.scss'
import chevronsUpDownIcon from '@iconify-icons/keyline-icons/chevrons-up-down'

const workspace = ref('sparkpixel')
const workspaces = [
  { value: 'sparkpixel', label: 'sparkpixel.studio', selected: true },
  { value: 'acme', label: 'acme.ai' },
  { value: 'new', label: 'Create workspace', icon: 'plus', divider: true },
]
</script>

<template>
  <VSidebar class="sp-side__nav" :items="NAV_ITEMS" :show-search="false" :show-footer="false" aria-label="Workspace">
    <template #header>
      <VDropdownMenu v-model:value="workspace" :items="workspaces" menu-align="start" aria-label="Switch workspace">
        <template #trigger>
          <button type="button" class="sp-switcher" aria-haspopup="menu">
            <span class="sp-switcher__mark" aria-hidden="true">s</span>
            <span class="sp-switcher__name">sparkpixel.studio</span>
            <VIcon :icon="chevronsUpDownIcon" size="sm" />
          </button>
        </template>
      </VDropdownMenu>
    </template>
  </VSidebar>
</template>`,
    '120px',
  ),
  render: () => ({
    components: { VSidebar, VDropdownMenu, VIcon },
    setup: () => ({ items: [] as VSidebarItem[], workspace: ref('sparkpixel'), workspaces: recipeWorkspaces, chevronsUpDownIcon, page: SALES_PAGE }),
    template: `<div :style="page"><aside class="sp-side" style="height:auto" aria-label="Workspace navigation"><VSidebar class="sp-side__nav" :items="items" :show-search="false" :show-footer="false" aria-label="Workspace"><template #header>${switcherTemplate}</template></VSidebar></aside></div>`,
  }),
}

export const RecipeFullComposition: Story = {
  name: 'Montagem · Menu lateral completo',
  parameters: recipeParams(
    'O menu lateral inteiro do **Sales Overview**: rail de apps (`sp-app-rail`) + `<aside class="sp-side">` com o seletor no `#header` e o menu com grupos/submenu. Mesmos dados (`SalesOverview/data.ts`) e mesmo CSS (`_shared/sidebarPatterns.scss`) do template.',
    `<template>
  <div class="page" style="display: flex; min-height: 100vh">
    <VSidebar
      v-model:active-item="rail"
      class="sp-app-rail"
      variant="icons"
      :items="RAIL_ITEMS"
      :show-search="false"
      :show-footer="false"
      :show-brand="false"
      :show-collapse-toggle="false"
      aria-label="Apps"
    />

    <aside class="sp-side" aria-label="Workspace navigation">
      <VSidebar
        v-model:active-item="nav"
        class="sp-side__nav"
        :items="NAV_ITEMS"
        :expanded-sections="['g-pipeline', 'g-reports', 'g-workspace', 'g-settings', 'deals']"
        :show-search="false"
        :show-footer="false"
        aria-label="Workspace"
      >
        <template #header>
          <!-- seletor de workspace: ver "Montagem · Seletor de workspace" -->
        </template>
      </VSidebar>
    </aside>

    <main><!-- conteúdo --></main>
  </div>
</template>`,
  ),
  render: () => ({
    components: { VSidebar, VDropdownMenu, VIcon },
    setup: () => ({
      railItems: SALES_RAIL_ITEMS,
      navItems: SALES_NAV_ITEMS,
      open: recipeOpen,
      rail: ref('chart'),
      nav: ref('overview'),
      workspace: ref('sparkpixel'),
      workspaces: recipeWorkspaces,
      chevronsUpDownIcon,
      page: SALES_PAGE,
    }),
    template: `<div :style="page">
      <VSidebar v-model:active-item="rail" class="sp-app-rail" variant="icons" :items="railItems" :show-search="false" :show-footer="false" :show-brand="false" :show-collapse-toggle="false" aria-label="Apps" />
      <aside class="sp-side" aria-label="Workspace navigation">
        <VSidebar v-model:active-item="nav" class="sp-side__nav" :items="navItems" :expanded-sections="open" :show-search="false" :show-footer="false" aria-label="Workspace"><template #header>${switcherTemplate}</template></VSidebar>
      </aside>
      <main style="flex:1"></main>
    </div>`,
  }),
}
