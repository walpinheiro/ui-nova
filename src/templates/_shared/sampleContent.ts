export interface TemplateDocument {
  title: string
  breadcrumb: Array<{ label: string; href?: string }>
  summary: string
  body: string[]
}

export const TEMPLATE_DOCUMENTS: Record<string, TemplateDocument> = {
  'getting-started': {
    title: 'Getting Started',
    breadcrumb: [
      { label: 'Documentation' },
      { label: 'Getting Started' },
    ],
    summary: 'Configure tokens, importe a lib e monte o primeiro layout com menu lateral.',
    body: [
      'Comece importando os tokens CSS no entry do seu app. Todos os componentes consomem `--v-*` — nunca valores fixos.',
      'Para um layout com menu lateral, combine `VSidebar` ou `VTreeNavigation` no painel inicial de um `VSplitView`.',
      'O painel central pode usar `VTabs` para alternar entre leitura, canvas e pré-visualização.',
    ],
  },
  components: {
    title: 'Components',
    breadcrumb: [
      { label: 'Documentation' },
      { label: 'Components' },
    ],
    summary: 'Catálogo de primitivos, formulários, navegação e contenção.',
    body: [
      'Cada componente expõe tokens próprios (`--v-button-*`, `--v-card-*`, etc.) além dos tokens globais.',
      'Use o Storybook para ver variantes, estados e padrões de composição como estes templates.',
      'Prefira sobrescrever tokens base (`--v-color-primary`, `--v-radius-pill`) antes de tokens de componente.',
    ],
  },
  guides: {
    title: 'Guides',
    breadcrumb: [
      { label: 'Documentation' },
      { label: 'Guides' },
    ],
    summary: 'Receitas para temas, acessibilidade e layouts responsivos.',
    body: [
      'White-label: defina `:root { --v-color-primary: … }` e toda a lib acompanha.',
      'Layouts IDE: `VSplitView` com três painéis — árvore, conteúdo e inspector.',
      'Reader + canvas: `VTabs` com abas Leitor e Canvas no painel central.',
    ],
  },
  'design-system': {
    title: 'Design System',
    breadcrumb: [
      { label: 'Workspace' },
      { label: 'design-system' },
    ],
    summary: 'Foundations — radius, spacing, cores, motion e layout.',
    body: [
      'Consulte Foundations no Storybook para classes Tailwind ligadas a tokens.',
      'O catálogo com busca lista todos os `--v-*` emitidos em `:root`.',
      'Customização runtime: `setToken(\'--v-space-4\', \'1.25rem\')` em playbooks e testes.',
    ],
  },
}

export function getDocument(key: string): TemplateDocument {
  return TEMPLATE_DOCUMENTS[key] ?? {
    title: 'Documento',
    breadcrumb: [{ label: 'Workspace' }, { label: key }],
    summary: 'Selecione um item na árvore para carregar o conteúdo.',
    body: ['Este template demonstra navegação lateral com área de leitura.'],
  }
}
