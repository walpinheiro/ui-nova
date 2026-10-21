# VAppShell — DESIGN-SPEC (fonte: doc/Ui/documentação_do_template_app_shell.png)

## 1) Objetivo do componente

`VAppShell` é o **core application layout**: um shell de aplicação pronto para produção com navegação, cabeçalho e painéis utilitários. Texto guia: "A production-ready application shell with navigation, header, and utility panels. Provides a consistent foundation for modern apps with flexible layout options and responsive behavior."
Pilares: **Structured** (everything in its place — navigation, content, utilities), **Adaptable** (works across devices and use cases), **Productive** (kickstart your app with best practices built in).
Hero (nota "A solid foundation for great apps"): mock completo — top bar (logo VueUI Nova, busca "Search anything..." + ⌘K, sino, sol, avatar "JD"); sidebar (Dashboard ativo, Projects, Documents, Team, Analytics, Settings); conteúdo ("Welcome back, Alex", "Here's what's happening with your projects today.", botão "+ New project", cards Total Projects 24 ↑12%, Active Users 1,280 ↑8%, Deployments 12 ↑33%, Recent activity com 4 itens + "View all →"); painel utilitário (Quick actions: New project, Import data, Invite team, View analytics; Shortcuts: ⌘K Search, ⌘N New item, ⌘/ Command menu, ⌘? Help; botão fechar ×).
Uso Vue: `<VAppShell> <template #sidebar> <AppNavigation /> </template> <template #default> <RouterView /> </template> </VAppShell>` + slot de utilitário (`<template #utility> <AppQuickActions /> </template>`); Pro tip: "You can start with a pre-built variant and customize it to match your app." (`<AppShell variant="dashboard"> <!-- Your content --> </AppShell>`).

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomia numerada ("Key parts of the app shell template"):

- **(1) Top bar** — "Brand, search, actions, user menu": logo/marca, campo de busca com atalho ⌘K, ações (notificações/sino, tema/sol), avatar do usuário.
- **(2) Sidebar** — "Primary navigation": navegação primária com ícones + rótulos (Dashboard, Projects, Documents, Team, Analytics, Settings), item ativo destacado.
- **(3) Content area** — "Your page content": saudação, botão de ação primária, cards de métricas (valor + delta verde + ícone), lista de atividade recente (ícone, texto, tempo relativo).
- **(4) Utility panel** — "Contextual tools and actions": Quick actions (4 ações com ícones) + Shortcuts (4 atalhos de teclado) + fechar.

## 3) Variantes e tamanhos visíveis

Variantes pré-configuradas ("Variants — Pre-configured shells for common use cases"):

- **Dashboard** — "Analytics and overview layout" (mock com gráfico de linhas).
- **Editor** — "Content creation and editing".
- **Settings** — "Preferences and account management".
- **Content management** — "List, filter and manage content".

Modos de layout ("Layout modes — Optimized for different screen sizes and workflows"):

- **Desktop** — "Full navigation and utilities".
- **Compact desktop** — "Space-efficient layout".
- **Tablet** — "Touch-optimized layout".

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Seção "States — Common states for better interaction feedback" (5 mini-mocks):

- **Default** — shell completo padrão.
- **Collapsed sidebar** — sidebar recolhida (só ícones).
- **Focused search** — busca focada com texto ("Design system...") + botão limpar × + anel de foco.
- **Active navigation** — item de navegação ativo destacado.
- **Open utility panel** — painel utilitário aberto/visível.
- Disabled/loading de shell inteiro não são exibidos (aplicam-se aos componentes internos, não ao template).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Colapsar sidebar**: alterna entre navegação completa e só-ícones com animação suave.
- **Busca focada**: anel de foco + botão × limpa a query.
- **Navegação ativa**: item corrente destacado; navegável por Tab/Enter/Space.
- **Painel utilitário**: abre/fecha (botão ×); quick actions disparam comandos; atalhos ⌘K/⌘N/⌘//⌘? executam Search, New item, Command menu, Help.
- **Focus management**: foco gerenciado entre topbar/sidebar/conteúdo/painel.
- Sem overlays modais próprios — o painel utilitário é o overlay contextual.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Valor literal da seção "Motion — Smooth and subtle by default": "Sidebar collapses with a smooth 200ms ease-out animation." (ilustração em 3 quadros: shell → sidebar estreitando → sidebar colapsada). Cruzamento com tokens: 200ms fica entre `--v-motion-normal: 160ms` e `--v-motion-slow: 300ms` (usar `--v-motion-slow` ou token dedicado ~200ms) + `--v-ease-out`; animar `width`/`transform` da sidebar (preferir `transform` + `opacity` do conteúdo) e respeitar `prefers-reduced-motion` (colapso instantâneo).

## 7) Acessibilidade observada

Checklist literal ("Accessibility — Built with accessibility in mind"):

- ARIA landmarks (banner, navigation, main).
- Keyboard navigation (Tab, Enter, Space).
- Screen reader friendly.
- Focus management.
- High contrast support.
- Responsive and touch friendly.

## 8) data-test-ids sugeridos (lista)

- `v-appshell` (root)
- `v-appshell-topbar`
- `v-appshell-search`
- `v-appshell-sidebar`
- `v-appshell-nav-{item}` (cada item de navegação)
- `v-appshell-content`
- `v-appshell-utility`
- `v-appshell-quickaction-{name}`
- Rodapé: "VueUI Nova — Beautiful components for modern web apps. Open source · Customizable · Production ready".
