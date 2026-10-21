import type { VSidebarItem } from '../../components/navigation/VSidebar/VSidebar.types'
import type { VTreeNavigationItem } from '../../components/navigation/VTreeNavigation/VTreeNavigation.types'

export type TemplateMenuKind = 'primary' | 'nested' | 'tree' | 'shell'

export interface TemplateSidebarCategory {
  id: string
  label: string
  icon: string
  menuKind: TemplateMenuKind
  items: Array<{
    value: string
    label: string
    icon?: string
    badge?: string | number
  }>
}

/** Categorias visíveis no menu lateral (secções expansíveis com ícone). */
export const TEMPLATE_SIDEBAR_CATEGORIES: TemplateSidebarCategory[] = [
  {
    id: 'overview',
    label: 'Visão geral',
    icon: 'home',
    menuKind: 'primary',
    items: [
      { value: 'dashboard', label: 'Dashboard', icon: 'home', badge: 3 },
      { value: 'analytics', label: 'Analytics', icon: 'analytics' },
    ],
  },
  {
    id: 'content',
    label: 'Conteúdo & layout',
    icon: 'folder',
    menuKind: 'nested',
    items: [
      { value: 'reader', label: 'Reader', icon: 'book' },
      { value: 'canvas', label: 'Canvas', icon: 'canvas' },
      { value: 'workbench', label: 'Workbench', icon: 'workbench' },
    ],
  },
  {
    id: 'ai',
    label: 'Inteligência',
    icon: 'sparkle',
    menuKind: 'primary',
    items: [
      { value: 'ai-chat', label: 'Assistente IA', icon: 'sparkle', badge: 'New' },
    ],
  },
  {
    id: 'system',
    label: 'Sistema',
    icon: 'settings',
    menuKind: 'nested',
    items: [
      { value: 'integrations', label: 'Integrações', icon: 'integrations' },
      { value: 'settings', label: 'Definições', icon: 'settings' },
    ],
  },
]

export function buildCategorizedSidebarItems(): VSidebarItem[] {
  return TEMPLATE_SIDEBAR_CATEGORIES.map((category) => ({
    value: `cat-${category.id}`,
    label: category.label,
    icon: category.icon,
    children: category.items.map(({ value, label, badge }) => ({
      value,
      label,
      badge,
    })),
  }))
}

export const TEMPLATE_SIDEBAR_EXPANDED = TEMPLATE_SIDEBAR_CATEGORIES.map((c) => `cat-${c.id}`)

export function getTemplateCategoryForItem(itemValue: string): TemplateSidebarCategory | undefined {
  return TEMPLATE_SIDEBAR_CATEGORIES.find((cat) =>
    cat.items.some((item) => item.value === itemValue),
  )
}

export function getTemplateMenuKindLabel(kind: TemplateMenuKind): string {
  const labels: Record<TemplateMenuKind, string> = {
    primary: 'Menu primário',
    nested: 'Menu aninhado',
    tree: 'Árvore de ficheiros',
    shell: 'App shell',
  }
  return labels[kind]
}

/** Árvore de documentação com ícones e contagens. */
export const TEMPLATE_DOC_TREE: VTreeNavigationItem[] = [
  {
    key: 'workspace',
    label: 'Workspace',
    icon: 'folder',
    count: 12,
    children: [
      {
        key: 'projects',
        label: 'Projects',
        icon: 'folder',
        count: 8,
        children: [
          { key: 'vueui-nova', label: 'vueui-nova', icon: 'file', count: 3 },
          { key: 'marketing', label: 'marketing', icon: 'file', count: 2 },
        ],
      },
      {
        key: 'documentation',
        label: 'Documentation',
        icon: 'book',
        children: [
          { key: 'getting-started', label: 'Getting Started', icon: 'doc' },
          { key: 'components', label: 'Components', icon: 'doc', count: 24 },
          { key: 'guides', label: 'Guides', icon: 'doc', count: 12 },
        ],
      },
    ],
  },
  { key: 'templates', label: 'Templates', icon: 'folder', count: 5 },
]

export const TEMPLATE_EXPLORER_TREE: VTreeNavigationItem[] = [
  {
    key: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        key: 'components',
        label: 'components',
        icon: 'folder',
        children: [
          { key: 'navigation', label: 'navigation', icon: 'folder' },
          { key: 'form', label: 'form', icon: 'folder' },
        ],
      },
      { key: 'tokens', label: 'tokens', icon: 'file' },
    ],
  },
  { key: 'package', label: 'package.json', icon: 'file' },
]

export const AI_CHAT_STEPS = [
  { id: 'scan', label: 'A analisar tokens e componentes' },
  { id: 'rank', label: 'A ordenar respostas candidatas' },
  { id: 'draft', label: 'A redigir resposta' },
]

export const AI_CHAT_SEED_MESSAGES = [
  {
    id: 'u1',
    role: 'user' as const,
    text: 'Como customizo o menu lateral com ícones e categorias?',
  },
  {
    id: 'a1',
    role: 'assistant' as const,
    text: 'Passe um array `items` ao `VSidebar` com secções expansíveis. Cada categoria vira um item pai com `children`; os pais mostram ícone Keyline via prop `icon`.',
  },
]
