# VDashboardColumn — DESIGN-SPEC (fonte: doc/Ui/VDashboardColumn.png)

> Página de documentação do componente VDashboardColumn (VueUI Nova › Components › VDashboardColumn, v1.0.0).
> Tagline da página: "A column primitive for dashboard composition and responsive widget stacking."
> Sem pilares de três colunas nesta página (layout directo para o "In context").
> Header da página: breadcrumb "VueUI Nova › Components › VDashboardColumn", título "Components / VDashboardColumn", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito: "Flexible dashboards. Endless possibilities."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." + "Thoughtful components for modern products."

## 1) Objetivo do componente

Primitivo de coluna para composição de dashboards e empilhamento responsivo de widgets. É o contentor vertical que agrupa widgets empilhados (KPI, gráficos, listas) dentro de um dashboard maior. O exemplo "In context — Real-world dashboard using VDashboardColumn" mostra um dashboard "Product Analytics" ("Track performance and grow your product.") com selector "Last 30 days" + botão "+ Add widget", e três colunas lado a lado — Overview (Total Users 12,486 ↑12% from last month; Sessions 8,421 ↑8% com barras), Engagement (Daily Active Users 4,329 ↑16% com linha; Top Pages /dashboard 42%, /products 28%, /docs 18%), Conversions (Conversion Rate 3.6% ↑0.8%; Signups 892 ↑20% com barras) — cada coluna com drag-handle `⋮⋮` + título + menu `…`.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a dashboard column." (coluna "Team" com widgets empilhados):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Header (optional) | não | Cabeçalho da coluna (ex.: "Team" com ícone) |
| More actions (optional) | não | Botão `…` de acções no header |
| Widget stack | sim | Pilha vertical de widgets (cartões empilhados) |
| Drop zone (insertion preview) | estado | Pré-visualização tracejada de inserção com botão `+` (onde o widget será largado) |
| Resize edge | variante/estado | Borda lateral de redimensionamento |
| Gap between widgets | sim | Espaçamento vertical entre widgets da pilha |
| Container | sim | Contentor exterior da coluna |

Elementos do "In context": drag-handle `⋮⋮` à esquerda de cada título de coluna ("Product Analytics", "Overview", "Engagement", "Conversions"), selector de período "Last 30 days", botão primary "+ Add widget", widgets KPI com ícone em tile, valor grande, delta verde (`↑ 12%`), sparkline/barras.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different column behaviors for various dashboard layouts.", 4 exemplares)

| Variante | Aparência na imagem | Uso literal |
|---|---|---|
| Fixed width | Coluna estreita fixa com header | Fixed pixel width. |
| Fluid | Coluna larga que preenche | Expands to fill space. |
| Collapsible | Coluna colapsada a um rail com botão `›` | Can be collapsed. |
| Sticky | Coluna com topo azul destacado/preso | Stays visible while scrolling. |

### Tamanhos ("Sizes — Common column widths for different layouts.", 3 exemplares)

| Tamanho | Observado | Token |
|---|---|---|
| Narrow | Mini-coluna estreita | `240px` |
| Medium (default) | Mini-coluna destacada com anel azul | `300px` |
| Wide | Mini-coluna larga | `400px` |

## 4) Estados ("States — Interactive states during drag, resize and collapse.", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Coluna neutra; estado normal |
| Hover (drop zone) | Coluna com overlay azul + botão circular `+`; zona de largada activa |
| Selected | Coluna com anel azul + topo destacado |
| Resizing | Coluna com borda/handle lateral azul de resize |
| Collapsed | Rail estreito com botão `›` para expandir |
| Disabled | Coluna cinzenta dessaturada; sem interacção |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Drag widget sobre a coluna | Revela Drop zone (overlay `#E6EDFF` + `+`); indicador animado mostra onde o widget será colocado |
| Drop | Insere o widget na pilha na posição indicada; anuncia ao screen reader |
| Resize (rato) | Arrastar a Resize edge ajusta a largura em tempo real com animação suave |
| Resize (teclado) | Arrow keys redimensionam quando o handle tem foco (ver acessibilidade) |
| Collapse / expand | Click no botão `›`/chevron colapsa para rail e vice-versa; largura anima |
| Hover | Revela drop zone / handles; cursor adequado (grab/grabbing/col-resize) |
| Teclado Tab / Arrow keys | Navegação entre coluna, header, widgets e handles |
| Add widget | Botão "+ Add widget" acrescenta widget à coluna |

## 6) Motion ("Motion — Smooth interactions for a natural experience.", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Drop insertion preview | **(sem valor literal; "Animated indicator shows where the widget will be placed.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`opacity`/`transform` do indicador) |
| Resize feedback | **(sem valor literal; "Real-time width adjustment with smooth animation.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`width` durante arrasto; idealmente só `transform` quando possível) |
| Collapse transition | **(sem valor literal; "Smooth width animation when collapsing or expanding.")** | `--v-motion-normal: 200ms` + `--v-ease-out` (transição de `width`/`transform`) |

Regras gerais: animar `transform`/`opacity` (largura só no collapse/resize); `prefers-reduced-motion: reduce` desliga pré-visualizações e transições (mudança instantânea).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-dashboard-column {
  width: var(--v-column-width-medium, 300px); // narrow 240px, wide 400px
  padding: var(--v-space-4); // 16px
  display: flex;
  flex-direction: column;
  gap: var(--v-space-6); // 24px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: width var(--v-motion-normal) var(--v-ease-out);

  &[data-variant="fluid"] { flex: 1; width: auto; }
  &[data-variant="sticky"] { position: sticky; top: 0; }
  &[data-state="collapsed"] { width: var(--v-space-12); overflow: hidden; }
  &[data-state="selected"] { box-shadow: 0 0 0 2px var(--v-color-focus); }

  &__drop-zone { background: #e6edff; border-radius: var(--v-radius-md); }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default.", 8 checks literais)

1. **Keyboard navigation (Tab, Arrow keys)** — foco sequencial e por setas entre coluna e widgets.
2. **Resizable via keyboard (Arrow keys)** — handle de resize operável por setas com foco visível.
3. **Proper ARIA labels and roles** — `role="region"`/`aria-label` da coluna, `aria-grabbed`/`aria-dropeffect` ou padrão DnD equivalente.
4. **Drop zone announced to screen readers** — zona de largada anunciada via `aria-live`.
5. **Focus visible on interactive elements** — anel de foco em header, handles, botão de collapse e `+`.
6. **Works with screen readers (NVDA, VoiceOver)** — compatível com leitores citados.
7. **Maintains logical tab order** — ordem de tab = ordem visual (header → widgets → handles).
8. **Sufficient color contrast for indicators** — indicadores de drop/resize/selecção com contraste suficiente.

## 8) data-test-ids sugeridos

- `v-dashboard-column` (root; `data-variant="fixed|fluid|collapsible|sticky"`, `data-size="narrow|medium|wide"`, `data-state`)
- `v-dashboard-column-header` / `v-dashboard-column-title` (ex.: Overview/Engagement/Conversions)
- `v-dashboard-column-drag-handle` (grip `⋮⋮`)
- `v-dashboard-column-menu` (botão `…`)
- `v-dashboard-column-drop-zone` (overlay de inserção + botão `+`)
- `v-dashboard-column-resize-handle` (borda de resize)
- `v-dashboard-column-collapse-toggle` (botão `›`)
- `v-dashboard-column-add-widget` (botão "+ Add widget")
- `docs-dashboard-column-variant-{fixed,fluid,collapsible,sticky}` (fileira de variantes)
- `docs-dashboard-column-size-{narrow,medium,wide}` (fileira de tamanhos)
- `docs-dashboard-column-state-{default,hover-drop-zone,selected,resizing,collapsed,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization.")

| Token | Valor |
|---|---|
| `--column-width-narrow` | `240px` |
| `--column-width-medium` | `300px` |
| `--column-width-wide` | `400px` |
| `--column-gap` | `24px` |
| `--column-padding` | `16px` |
| `--column-drop-zone` | `#E6EDFF` (swatch azul-claro) |
| `--column-resize-handle` | `#6366F1` (swatch azul) |
| `--column-shadow` | `0 2px 8px rgba(0, 0, 0, 0.06)` |

No repo equivalem a `--v-space-*` (gap/padding), `--v-color-primary` (`#6366F1`), `--v-shadow-*`, `--v-motion-*`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components.")

```vue
<template>
  <VDashboardColumn
    :width="300"
    :collapsible="true"
    :sticky="false"
  >
    <DashboardWidget title="Overview" />
    <DashboardWidget title="Sessions" />
  </VDashboardColumn>
</template>
```

**Pro tip (literal):** "Combine VDashboardColumn with a responsive grid and drag-and-drop to build fully customizable dashboards."
