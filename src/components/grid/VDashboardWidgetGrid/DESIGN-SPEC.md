# VDashboardWidgetGrid — DESIGN-SPEC (fonte: doc/Ui/VDashboardWidgetGrid.png + VDashboardWidgetGrid-2.png)

> Página de documentação do componente VDashboardWidgetGrid (VueUI Nova › Components › VDashboardWidgetGrid, v1.0.0; segunda fonte: layout alternativo "Grid / Dashboard Widget Grid").
> Tagline da página principal: "A flexible layout grid for dashboard widgets with drag, resize, and responsive placement."
> Três pilares na página principal: **Drag & drop** (Rearrange widgets with smooth, intuitive interactions.) · **Resizable** (Flexible sizing with snap to grid.) · **Responsive** (Works beautifully across all screen sizes.).
> Página secundária (Dashboard Widget Grid — "Resizable widget dashboard layout"): "Dashboard Widget Grid provides a flexible, draggable and resizable layout for dashboard widgets. Perfect for analytics, admin panels, and personal workspaces with a clean, modern experience." Pilares: **Composable** (Use any content as a widget.) · **Resizable** (Drag to rearrange and resize freely.) · **Organized** (Responsive grid with smart layout.).
> Header da página principal: breadcrumb "VueUI Nova › Components › VDashboardWidgetGrid", título "Components / VDashboardWidgetGrid", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VDashboardWidgetGrid ativo**, Table) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito: "Dashboards that adapt. Ideas that grow." / na página 2: "Flexible by design".
> Footer: logo VueUI Nova + "Build beautiful, faster." + "Thoughtful components for modern products." (página 2: "Beautiful components for modern web apps. Open source · Customizable · Production ready").
> Fusão das duas fontes: a página principal detalha canvas/snap/drag-ghost; a secundária detalha tamanhos SM/MD/LG, anatomia numerada 1–5 e variante Locked.

## 1) Objetivo do componente

Grelha de layout flexível para widgets de dashboard com arrasto, redimensionamento e posicionamento responsivo. É o gestor de layout 2D do sistema: coloca widgets numa grelha de 12 colunas com snap, permite rearranjar e redimensionar livremente, e adapta-se a qualquer ecrã. Exemplo "In context — A real dashboard using VDashboardWidgetGrid" (página 1, com botão "Edit layout"): Total revenue $24,780 vs. last month ↑12% (barras), Active users 8,421 ↑8% (linha), Recent activity (Sarah Chen created a new project 2 minutes ago, Design system updated 12 minutes ago, New user signed up 28 minutes ago, Backup completed successfully 1 hour ago, Release v1.2.0 published 2 hours ago, View all), Tasks 3 of 5 completed (checkboxes: Finalize dashboard design, Implement widget grid, Write documentation, Add tests, Prepare release + botão `+` e `…`), Website traffic 12,482 ↑16% (área Apr 1–Apr 30 + selector "Last 30 days"). Página 2 ("My Dashboard — Welcome back! Here's what's happening today.", botão "+ Add widget"): Total Users 12,482 ↑+12%, Revenue $24,390 ↑+8%, Active Now 284 ↑+21%, Traffic Overview Jan–Jun, Calendar Apr 2024, Recent Activity (Alex Chen, Maria Lopez, James Park + `…`), Team Progress donut 78% (Done 78, In Progress 16, To Do 6) com resize-handle visível no canto.

## 2) Anatomia (partes)

Anatomia oficial da página 1 ("Anatomy — Key parts of a widget grid.", widget "Sales Overview" com área):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Grid canvas (snap cells) | sim | Fundo pontilhado de células de snap |
| Widget card (container) | sim | Cartão contentor do widget ("Sales Overview") |
| Drag handle (move widget) | sim | Grip `⋮⋮` no topo do widget |
| Row/column span | sim | Span de ocupação (e.g. 2 × 2) |
| Resize handle (resize widget) | sim | Pega no canto inferior direito |

Anatomia numerada da página 2 ("Anatomy — Key parts of the dashboard widget grid.", widget "Widget title" + `…` + imagem):

| Nº | Parte | Observado |
|---|---|---|
| 1 | Widget (content) | Conteúdo do widget |
| 2 | Header | Cabeçalho com "Widget title" + `…` |
| 3 | Resize handle | Pega de redimensionamento |
| 4 | Grid cell (container) | Célula da grelha (tracejado exterior) |
| 5 | Grid gap | Espaçamento entre células |

## 3) Variantes e tamanhos visíveis

### Variantes (fusão das duas páginas)

Página 1 ("Variants — Different layout styles for different use cases.", 4 exemplares):

| Variante | Aparência na imagem | Uso literal |
|---|---|---|
| Freeform widget grid | Widget arrastado com cursor de mão sobre células tracejadas | Flexible, user-customizable layout. |
| Analytics grid | Mini-dashboard com barras + cartões | Optimized for data dashboards. |
| Editorial grid | Mini-layout com imagem + texto | Content and media focused. |
| Compact grid | Mini-grelha densa com lista + donut | High density for more content. |

Página 2 ("Variants — Different dashboard layouts for different needs.", 4 boards):

| Variante | Uso |
|---|---|
| Analytics board | Layout de gráficos (linha + barras + donut) |
| Operations board | Layout operacional (lista + mapa de pontos) |
| Personal board | Layout pessoal (tarefas + calendário) |
| Compact board | Layout compacto denso |

### Tamanhos ("Sizes — Widget sizes based on grid units." + "Three widget sizes for different content.")

| Tamanho | Página 1 (grid units) | Página 2 (span) |
|---|---|---|
| Small | 1 × 1 | Small widget 2 × 2, SM |
| Medium (default) | 2 × 2 | Medium widget 4 × 2, MD (default, destacado a azul) |
| Large | 3 × 2 | Large widget 4 × 4, LG |
| XL (só página 1) | 4 × 3 | — |

## 4) Estados (fusão: 7 estados distintos)

| Estado | Aparência (página 1 / página 2) |
|---|---|
| Default | Widget neutro; "Widget" simples |
| Hover | Widget elevado; página 2 mostra `×` de fechar no hover |
| Focus / Focused | Anel azul de foco; página 2 com `×` visível |
| Dragging | Contentor tracejado + cursor de mover `✥`; ghost que segue o cursor |
| Resizing | Pega azul no canto; pré-visualização viva do novo tamanho |
| Locked | Cadeado 🔒, sem handles (só página 2) |
| Disabled | Widget cinzento dessaturado, sem interacção (só página 1) |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Drag widget | Ghost segue o cursor com sombra subtil; células de destino destacam; largar faz snap |
| Resize | Arrastar a pega mostra Resize preview em tempo real; largar confirma novo span |
| Hover | Elevação + revelar `×`/handles; cursor adequado |
| Focus | Anel de foco visível; `×`/handles operáveis por teclado |
| Edit layout | Botão "Edit layout" entra em modo de edição (drag/resize activos) |
| Add widget | Botão "+ Add widget" insere novo widget na grelha |
| Teclado Tab / Arrow keys | Navegação entre widgets; Shift + Arrow redimensiona (página 2) |
| Layout change | Emite `@update:layout="onLayoutChange"` / `v-model="layout"` (persistir preferências) |
| Locked | Sem drag/resize; cadeado indica bloqueado |

## 6) Motion ("Motion — Smooth, purposeful interactions." / "Smooth and natural interactions.")

| Movimento | Duração / easing (literal) | Token `--v-*` correspondente |
|---|---|---|
| Drag ghost | **(sem valor; "Follows cursor with subtle shadow.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`transform` do ghost; opacidade `--drag-ghost-opacity: 0.8`) |
| Resize preview | **(sem valor; "Live preview while resizing.")** | `--v-motion-fast: 100ms` + `--v-ease-out` |
| Snap animation | **(sem valor; "Snaps to grid with a smooth transition.")** | `--v-motion-normal: 200ms` + `--v-ease-out` |
| Drag, resize and snap (página 2) | **200ms ease-out** | `--v-motion-normal: 200ms` + `--v-ease-out` |

Regras gerais: animar apenas `transform`/`opacity`; `prefers-reduced-motion: reduce` desliga ghost/snap/resize-preview (posicionamento instantâneo).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-dashboard-widget-grid {
  display: grid;
  grid-template-columns: repeat(var(--v-grid-cols, 12), 1fr);
  grid-auto-rows: var(--v-grid-row-height, 128px); // 100–140px por conteúdo
  gap: var(--v-space-4); // 16px

  .v-widget {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: var(--v-radius-md); // 12px
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
    transition: transform var(--v-motion-normal) var(--v-ease-out),
      box-shadow var(--v-motion-normal) var(--v-ease-out);

    &[data-dragging="true"] { opacity: 0.8; }
    &[data-focused="true"] { box-shadow: 0 0 0 2px var(--v-color-focus); }
  }

  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none; } }
}
```

## 7) Acessibilidade observada (fusão, 9 checks distintos)

1. **Keyboard navigation (Tab, Arrow keys)** — (ambas as páginas) navegação sequencial e por setas entre widgets.
2. **ARIA roles for grid and widgets / ARIA roles and labels** — `role="grid"`, `role="gridcell"`/`article`, `aria-label` do widget.
3. **Focusable drag and resize handles** — pegas focáveis e operáveis por teclado.
4. **Resizable via keyboard (Shift + Arrow)** — (página 2) redimensionar com Shift + setas.
5. **Screen reader announcements / Screen reader friendly** — mudanças de layout anunciadas via `aria-live`.
6. **Visible focus states** — anel de foco sempre visível.
7. **Sufficient color contrast** — texto e indicadores com contraste suficiente.
8. **Works with assistive technologies** — compatível com tecnologias de apoio.
9. **Respects / Supports reduced motion preference** — `prefers-reduced-motion: reduce` desliga animações.

## 8) data-test-ids sugeridos

- `v-dashboard-widget-grid` (root; `data-cols="12"`, `data-row-height="128"`)
- `v-dashboard-widget` / `v-dashboard-widget-{total-revenue,active-users,recent-activity,tasks,website-traffic,traffic-overview,calendar,team-progress}` (contextos)
- `v-dashboard-widget-drag-handle` / `v-dashboard-widget-resize-handle`
- `v-dashboard-widget-drag-ghost` (fantasma de arrasto)
- `v-dashboard-widget-close` (botão `×` do hover/focus)
- `v-dashboard-widget-lock` (estado Locked 🔒)
- `v-dashboard-widget-grid-edit-layout` (botão "Edit layout")
- `v-dashboard-widget-grid-add-widget` (botão "+ Add widget")
- `docs-widget-grid-variant-{freeform,analytics,editorial,compact}` + `docs-widget-grid-board-{analytics,operations,personal,compact}` (página 2)
- `docs-widget-grid-size-{small,medium,large,xl}` (página 1) / `docs-widget-grid-size-{sm,md,lg}` (página 2)
- `docs-widget-grid-state-{default,hover,focused,dragging,resizing,locked,disabled}` (fusão)

## Tokens da página (transcrição literal — página 1, card "Design tokens")

| Token | Valor |
|---|---|
| `--grid-cell-size` | `24px` |
| `--grid-gap` | `16px` |
| `--widget-bg` | `#FFFFFF` |
| `--widget-border` | `#E5E7EB` |
| `--widget-radius` | `12px` |
| `--widget-shadow` | `0 2px 8px rgba(99, 102, 241, 0.08)` |
| `--drag-ghost-opacity` | `0.8` |
| `--resize-handle-size` | `12px` |

Tokens da página 2 (card "Design tokens — Customize with design tokens."): `--v-widget-bg`, `--v-widget-border`, `--v-widget-radius`, `--v-widget-header-bg`, `--v-widget-shadow`, `--v-widget-handle-color`, `--v-grid-gap`, `--v-grid-column-size` (sem valores literais, só lista com swatches).

No repo equivalem a `--v-space-4/6`, `--v-radius-md`, `--v-shadow-*`, `--v-motion-normal` + `--v-ease-out`.

## Uso Vue (transcrição literal — página 1, card "Vue usage")

```vue
<template>
  <VDashboardWidgetGrid
    :widgets="widgets"
    :cols="12"
    :row-height="128"
    @update:layout="onLayoutChange"
  />
</template>
```

**Pro tip (página 1, literal):** "Start with a 12-column grid and choose a row height that fits your content (e.g. 100–140px)."

Uso Vue — página 2 ("Vue usage — A simple example to get you started.", 10 linhas):

```vue
<template>
  <DashboardWidgetGrid :cols="12" :row-height="128">
    <DashboardWidget title="Total Users" :x="0" :y="0" :w="3" :h="2">
      <UserStatsChart />
    </DashboardWidget>
    <DashboardWidget title="Traffic Overview" :x="3" :y="0" :w="6" :h="4">
      <LineChart />
    </DashboardWidget>
  </DashboardWidgetGrid>
</template>
```

**Pro tip (página 2, literal):** "Save and restore user layouts with v-model to remember preferences." Exemplo do card: `<DashboardWidgetGrid v-model="layout" :cols="12" :row-height="128" />`.
