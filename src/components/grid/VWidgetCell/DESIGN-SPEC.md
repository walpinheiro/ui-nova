# VWidgetCell — DESIGN-SPEC (fonte: doc/Ui/VWidgetCell.png)

> Página de documentação do componente VWidgetCell (VueUI Nova › Components › VWidgetCell, v1.0.0).
> Tagline da página: "A versatile dashboard/widget tile container for building informative, interactive boards."
> Quatro pilares no topo: **Flexible** (Support any content — KPIs, charts, lists, or actions.) · **Composable** (Works inside grids, dashboards, and boards.) · **Customizable** (Header, footer, actions, and variants to fit your use case.) · **Production ready** (Accessible, responsive, and designed for scale.).
> Header da página: breadcrumb "VueUI Nova › Components › VWidgetCell", título "Components / VWidgetCell", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VWidgetCell ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Footer da página: logo VueUI Nova + "Build beautiful, faster." + "Thoughtful components for modern products."

## 1) Objetivo do componente

Contentor-tile versátil de dashboard/widget para construir boards informativos e interactivos. É a célula unitária do dashboard: envolve qualquer conteúdo (KPI, gráfico, lista, CTA) com header, área de conteúdo, footer e acções padronizados. O exemplo "In context — VWidgetCell in a real dashboard" mostra 4 células: Total Revenue / This month $24,780 ↑12% (barras azuis), Active Users / Live 2,419 ↑8% (área), Recent Activity (Olivia Chen Updated project settings 2m, Marco Diaz Added a new member 12m, Priya Shah Completed a milestone 1h), Build faster together (Invite your team and get more done. + botão primary "Invite team →" e `×` de fechar) — todas com ícone em tile + menu `…`.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a VWidgetCell." (célula com gráfico de área):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Drag handle (optional) | não | Grip `⋮⋮` no canto superior esquerdo (para builders) |
| Header (icon, title, subtitle) | sim | Ícone + Title + Subtitle (ex.: "Title / Subtitle") |
| Actions (menu, more) | não | Botão `…` no header |
| Cell surface (container) | sim | Superfície contentora da célula |
| Content area (any content) | sim | Área livre (gráfico de área no exemplo) |
| Footer (links, meta, actions) | não | Rodapé com "View details →" + "Updated 2m ago" |

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different content for different use cases.", 5 exemplares)

| Variante | Aparência na imagem | Uso literal |
|---|---|---|
| Stat card | Total Orders 1,284 ↑12% (KPI grande + delta) | KPI and metric display. |
| Chart cell | Sales Trend / This week (barras azuis) | Mini chart or visualization. |
| List cell | Top Products: 1. VueUI Pro 482, 2. Nova Icons 320, 3. UI Templates 287 | Compact list or table. |
| Action cell | Share Report (avião de papel) "Send this dashboard to your team." + botão "Share" | Call-to-action content. |
| Placeholder cell | Tile tracejado com `+` "Add a widget / Choose a widget to get started." | Empty state for builders. |

### Tamanhos ("Sizes — Multiple sizes for different layouts.", 4 exemplares)

| Tamanho | Observado | Medida literal |
|---|---|---|
| Small (literal "Stnall" na imagem — gralha do poster) | Tile pequeno | 280 × 180 |
| Medium (default) | Tile destacado | 320 × 220 |
| Large | Tile grande | 360 × 280 |
| Wide | Tile panorâmico | 560 × 220 |

## 4) Estados ("States — Interactive states and feedback.", 6 células: 3 no topo + Selected/Loading/Disabled)

| Estado | Aparência na imagem |
|---|---|
| Default | Célula neutra com ícone de imagem |
| Hover | Célula elevada (hover lift + sombra) |
| Focus | Célula com anel de foco |
| Selected | Célula com anel + ponto/check azul; estado de selecção |
| Loading | Célula com spinner circular (a carregar novos dados) |
| Disabled | Célula cinzenta dessaturada, sem interacção |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Hover | Hover lift: elevação subtil + sombra `--widget-hover-shadow`; cursor adequado |
| Click / selecção | Aplica estado Selected (anel `--widget-selected-ring`); `aria-selected` quando seleccionável |
| Content refresh | Shimmer/skeleton enquanto carrega novos dados; depois estado Loading → conteúdo |
| Drag / reorder | Reorder feedback: lift + sombra durante o arrasto (via Drag handle opcional) |
| Accções do header | Botão `…` abre menu (menu, more); `×` fecha/dispensa a célula (ex.: Build faster together) |
| Footer links | "View details →" navega para detalhe; "Share"/"Invite team →" disparam CTA |
| Placeholder | Click/`+` em "Add a widget" abre picker de widgets |
| Teclado Tab / Enter / Space | Foco sequencial header → conteúdo → acções → footer; Enter/Space activa |

## 6) Motion ("Motion — Subtle, confident interactions.", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Hover lift | **(sem valor; "Subtle elevation and shadow.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`transform`/`box-shadow`) |
| Content refresh | **(sem valor; "Shimmer while loading new data.")** | `--v-motion-normal: 200ms` + `--v-ease-out` (shimmer `linear` em loop; respeitar reduced-motion) |
| Reorder feedback | **(sem valor; "Lift and shadow during drag.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`transform`/`box-shadow`) |

Regras gerais: animar apenas `transform`/`opacity` (shimmer com `opacity`/`background-position` barato); `prefers-reduced-motion: reduce` desliga lift, shimmer e drag-lift.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-widget-cell {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition:
    transform var(--v-motion-fast) var(--v-ease-out),
    box-shadow var(--v-motion-fast) var(--v-ease-out);

  &__header { min-height: 56px; }
  &__footer { min-height: 48px; }

  &:hover { box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12); transform: translateY(-2px); }
  &[data-selected="true"] { box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3); }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default.", 8 checks literais)

1. **Semantic container (section / article)** — usar `<section>`/`<article>` com heading para a célula.
2. **Keyboard accessible (Tab, Enter, Space)** — foco e activação por teclado de célula e acções.
3. **Clear focus indicator** — anel de foco visível via `:focus-visible`.
4. **Aria labels for interactive actions** — `aria-label` em `…`, `×`, Share, Invite team, View details.
5. **Supports drag and drop (ARIA)** — drag handle com semântica ARIA de DnD + alternativa por teclado.
6. **Sufficient color contrast** — texto, deltas e metas com contraste suficiente.
7. **Works with screen readers** — ordem header → conteúdo → footer anunciada correctamente.
8. **Responsive and readable content** — conteúdo legível e responsivo em qualquer tamanho (Small–Wide).

## 8) data-test-ids sugeridos

- `v-widget-cell` (root; `data-variant="stat|chart|list|action|placeholder"`, `data-size="small|medium|large|wide"`, `data-state`)
- `v-widget-cell-header` / `v-widget-cell-title` / `v-widget-cell-subtitle` (ex.: Total Revenue/This month)
- `v-widget-cell-icon` (tile de ícone do header)
- `v-widget-cell-menu` (botão `…`) / `v-widget-cell-close` (botão `×`)
- `v-widget-cell-content` (área livre: KPI/gráfico/lista/CTA)
- `v-widget-cell-footer` + `v-widget-cell-footer-link` ("View details →") + `v-widget-cell-updated` ("Updated 2m ago")
- `v-widget-cell-cta-share` / `v-widget-cell-cta-invite-team` (botões Share/Invite team)
- `v-widget-cell-add` (tile `+` "Add a widget")
- `docs-widget-cell-variant-{stat-card,chart-cell,list-cell,action-cell,placeholder-cell}` (fileira de variantes)
- `docs-widget-cell-size-{small,medium,large,wide}` (fileira de tamanhos)
- `docs-widget-cell-state-{default,hover,focus,selected,loading,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization.")

| Token | Valor |
|---|---|
| `--widget-bg` | `#FFFFFF` |
| `--widget-border` | `#E5E7EB` |
| `--widget-radius` | `16px` |
| `--widget-shadow` | `0 1px 3px rgba(0, 0, 0, 0.05)` |
| `--widget-padding` | `20px` |
| `--widget-header-h` | `56px` |
| `--widget-footer-h` | `48px` |
| `--widget-hover-shadow` | `0 8px 24px rgba(99, 102, 241, 0.12)` |
| `--widget-selected-ring` | `0 0 0 2px rgba(99, 102, 241, 0.3)` |

No repo equivalem a `--v-radius-lg`, `--v-space-5`, `--v-shadow-*`, `--v-color-focus`, `--v-motion-fast` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components.")

```vue
<template>
  <WidgetCell
    title="Total Revenue"
    subtitle="This month"
    icon="bar-chart"
  >
    <RevenueChart />
    <template #footer>
      <a class="text-primary"> View details → </a>
    </template>
  </WidgetCell>
</template>
```

**Pro tip (literal):** "Use VWidgetCell in a responsive grid with `VGrid` to build powerful dashboards."
