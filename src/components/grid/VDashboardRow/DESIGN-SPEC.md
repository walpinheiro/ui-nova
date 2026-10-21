# VDashboardRow — DESIGN-SPEC (fonte: doc/Ui/VDashboardRow.png)

> Página de documentação do componente VDashboardRow (VueUI Nova › Components › VDashboardRow, v1.0.0).
> Tagline da página: "A flexible row primitive for arranging dashboard sections horizontally with responsive wrapping."
> Quatro pilares no topo: **Responsive** (Automatically wraps on smaller screens.) · **Flexible** (Align, justify, and space content with ease.) · **Composable** (Works with any components and content types.) · **Consistent** (Built for modern dashboard layouts.).
> Header da página: breadcrumb "VueUI Nova › Components › VDashboardRow", título "Components / VDashboardRow", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Footer da página: logo VueUI Nova + "Build beautiful, faster." + "Thoughtful components for modern products."

## 1) Objetivo do componente

Primitivo de fileira flexível para organizar secções de dashboard horizontalmente com wrap responsivo. É o contentor horizontal que alinha, justifica e espaça filhos arbitrários (KPIs, filtros, acções) e quebra automaticamente em ecrãs pequenos. O exemplo "In context — A typical dashboard header row using VDashboardRow" mostra o header "Product analytics" ("Track performance and user engagement across your product.") com controlos à direita (selector "Last 30 days", botão "Filters", botão primary "Export") e, abaixo, 4 cartões KPI: Total users 12,568 ↗+12% vs. previous period, Active sessions 4,320 ↗+8%, Conversion rate 3.24% ↗+2%, Total revenue $28,430 ↗+16% — cada um com ícone em tile tintado.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of a VDashboardRow." (fileira com 4 rectângulos + célula `…`):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Row container | sim | `<v-dashboard-row>` (rectângulo exterior) |
| Gap | sim | Spacing between items (espaçamento entre filhos) |
| Alignment | sim | Justify / align (alinhamento horizontal/vertical) |
| Child slot | sim | Any component (cada filho: cartão, filtro, botão) |
| Wrap behavior | sim | Auto-wrap on smaller screens (quebra automática) |
| Optional divider | não | Bottom border (separador inferior opcional) |

Elementos do "In context": título + subtítulo à esquerda, grupo de acções à direita (padrão Split row), fileira de KPIs com valor grande, delta verde e legenda "vs. previous period".

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different layouts for different dashboard needs.", 4 exemplares)

| Variante | Aparência na imagem | Uso literal |
|---|---|---|
| Standard row | Fileira de 4 rectângulos + `…` espaçados | Even spacing, aligned items. |
| Dense row | Fileira de rectângulos compactos | Reduced spacing for compact layouts. |
| Split row | Conteúdo à esquerda, `…` (acções) à direita | Content on the left, actions on the right. |
| Wrap row | Duas fileiras empilhadas (quebra) | Items automatically wrap on smaller screens. |

### Tamanhos ("Sizes — Predefined spacing between row items.", 3 exemplares)

| Tamanho | Observado | Token |
|---|---|---|
| Compact | Mini-fileira apertada | gap-2 (8px) |
| Medium (default) | Mini-fileira destacada com anel azul | gap-4 (16px) |
| Spacious | Mini-fileira arejada | gap-6 (24px) |

## 4) Estados ("States — Visual states for interactive rows.", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Rectângulo neutro; Normal state |
| Hover region | Rectângulo com anel azul; Hover highlight |
| Selected | Rectângulo sólido azul; Active state |
| Drag target | Rectângulo tracejado azul; Drop indicator |
| Disabled | Rectângulo cinzento dessaturado; Muted appearance |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Resize do viewport | Itens fazem reflow horizontal; com `wrap` quebram para nova linha |
| Expand / collapse | Fileira expande ou colapsa com transição suave |
| Hover (linha interactiva) | Highlight da região; controlos de acção (`…`) fazem fade-in |
| Click (Selected) | Activa estado Selected; `aria-current`/`aria-selected` quando aplicável |
| Drag sobre a fileira | Revela Drag target (indicador tracejado de largada) |
| Teclado Tab | Ordem de tabulação segue ordem visual dos filhos |
| Filtros / Export | Controlos do exemplo abrem dropdown/menu (Last 30 days, Filters, Export) |
| Linha Disabled | Sem hover/selecção; sem acção via pointer/teclado |

## 6) Motion ("Motion — Smooth interactions for a dynamic experience.", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Horizontal reflow | **(sem valor literal; "Items smoothly reflow when space changes.")** | `--v-motion-normal: 200ms` + `cubic-bezier(0.4, 0, 0.2, 1)` (token da página `--vdashboardrow--transition`; `transform`) |
| Expand / collapse | **(sem valor literal; "Row expands or collapses with a smooth transition.")** | `--v-motion-normal: 200ms` + `cubic-bezier(0.4, 0, 0.2, 1)` (`height`/`transform`/`opacity`) |
| Hover reveal | **(sem valor literal; "Action controls fade in on hover.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`opacity` dos controlos) |

Regras gerais: animar apenas `transform`/`opacity` (altura só no expand/collapse); `prefers-reduced-motion: reduce` desliga reflow e reveals (mudança instantânea).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-dashboard-row {
  display: flex;
  align-items: var(--v-dashboard-row-align, center);
  justify-content: var(--v-dashboard-row-justify, space-between);
  gap: var(--v-dashboard-row-gap-medium, 16px); // compact 8px, spacious 24px
  background: transparent;
  border-bottom: var(--v-dashboard-row-border-width, 1px) solid rgba(99, 102, 241, 0.1);
  transition: 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &[data-gap="compact"] { gap: 8px; }
  &[data-gap="spacious"] { gap: 24px; }
  &[data-wrap="true"] { flex-wrap: wrap; }
  &[data-selected="true"] { background: var(--v-color-primary); color: #fff; }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default.", 7 checks literais)

1. **Supports keyboard navigation** — filhos focáveis alcançáveis por Tab.
2. **Maintains logical tab order** — ordem de tab = ordem visual da fileira.
3. **Visible focus indicator** — anel de foco visível via `:focus-visible`.
4. **Works with screen readers** — ordem de leitura = ordem DOM/visual.
5. **Uses semantic container (div/section)** — `<div>` ou `<section>` com heading quando a fileira for secção.
6. **Sufficient color contrast for interactive states** — estados Hover/Selected/Drag target com contraste suficiente.
7. **Responsive and readable at 200% zoom** — legível e utilizável com zoom de 200% (wrap evita corte horizontal).

## 8) data-test-ids sugeridos

- `v-dashboard-row` (root; `data-variant="standard|dense|split|wrap"`, `data-gap="compact|medium|spacious"`, `data-state`)
- `v-dashboard-row-title` ("Product analytics") / `v-dashboard-row-subtitle`
- `v-dashboard-row-actions` (grupo Last 30 days / Filters / Export)
- `v-dashboard-row-item` / `v-dashboard-row-item-{total-users,active-sessions,conversion-rate,total-revenue}` (KPIs do contexto)
- `v-dashboard-row-overflow` (célula `…`)
- `v-dashboard-row-drop-target` (indicador tracejado)
- `docs-dashboard-row-variant-{standard,dense,split,wrap}` (fileira de variantes)
- `docs-dashboard-row-size-{compact,medium,spacious}` (fileira de tamanhos)
- `docs-dashboard-row-state-{default,hover-region,selected,drag-target,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization.")

| Token | Valor |
|---|---|
| `--vdashboardrow-gap-compact` | `8px` |
| `--vdashboardrow-gap-medium` | `16px` |
| `--vdashboardrow-gap-spacious` | `24px` |
| `--vdashboardrow-align-default` | `center` |
| `--vdashboardrow-justify-default` | `space-between` |
| `--vdashboardrow-border-width` | `1px` |
| `--vdashboardrow-border-color` | `rgba(99, 102, 241, 0.1)` |
| `--vdashboardrow-background` | `transparent` |
| `--vdashboardrow-transition` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` |

No repo equivalem a `--v-space-2/4/6`, `--v-color-primary` (a 10%), `--v-motion-normal` + curva de easing padrão.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components.")

```vue
<template>
  <DashboardRow align="between" wrap>
    <div class="text-lg font-semibold">
      Product analytics
    </div>
    <div>
      <VButton variant="secondary">Filters</VButton>
      <VButton>Export</VButton>
    </div>
  </DashboardRow>
</template>
```

**Pro tip (literal):** "Use wrap on sections that may contain many cards or filters to ensure a graceful layout on smaller screens."
