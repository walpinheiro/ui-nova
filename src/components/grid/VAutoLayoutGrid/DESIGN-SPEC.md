# VAutoLayoutGrid — DESIGN-SPEC (fonte: doc/Ui/VAutoLayoutGrid.png)

> Página de documentação do componente VAutoLayoutGrid (VueUI Nova › Components › VAutoLayoutGrid, v1.0.0).
> Tagline da página: "A flexible auto-flow layout grid for arranging responsive cards and content blocks."
> Três pilares no topo: **Flexible** (Automatically places items and adapts to your content.) · **Responsive** (Looks great on any screen with minimal configuration.) · **Productive** (Build dashboards, galleries and lists in minutes.).
> Header da página: breadcrumb "VueUI Nova › Components › VAutoLayoutGrid", título "Components / VAutoLayoutGrid", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VAutoLayoutGrid ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito: "Flexible layouts. Happier products."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." + "Thoughtful components for modern products."

## 1) Objetivo do componente

Grelha de layout com auto-flow flexível para organizar cartões responsivos e blocos de conteúdo. É o primitivo de composição automática do sistema: distribui itens sem posicionamento manual, adapta-se ao conteúdo e ao viewport, e serve dashboards, galerias e listas com configuração mínima. O exemplo "In context — A real-world dashboard using VAutoLayoutGrid" mostra 8 cartões (2 fileiras × 4): Design System (24 items), Brand Assets (143 items), Team (8 members), Analytics (Last 30 days), Documentation (56 articles), Components (112 files), Projects (12 active), Settings (Manage your preferences) — cada um com ícone em quadrado tintado + menu `…`.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of VAutoLayoutGrid" (grelha tracejada com 2 fileiras de rectângulos):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Container | sim | Grid wrapper (rectângulo tracejado exterior) |
| Columns | sim | Modos Auto-fit / auto-fill |
| Gap | sim | Row & column gap (espaçamento entre células) |
| Item | sim | Grid item (card) — cada célula de conteúdo |
| Min item width | sim | Minimum card width (largura mínima que força o wrap) |
| Auto-flow | sim | Places items automatically (colocação automática, sem coordenadas) |

Elementos do cartão "In context" (cada item da grelha real): ícone em tile arredondado (pasta, imagem, pessoas, gráfico, doc, `</>`, cubo, engrenagem), título (ex.: "Design System"), subtítulo/meta (ex.: "24 items"), botão `…` de mais acções no canto superior direito.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different auto-flow behaviors for different needs.", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Auto-fit | Mini-grelha preenchida, sem buracos | Fills the row and collapses empty tracks. Estica itens para preencher a fileira |
| Auto-fill | Mini-grelha com última célula tracejada vazia | Keeps empty tracks to maintain the grid structure. Preserva estrutura com tracks vazios |
| Dense | Células de larguras irregulares compactadas | Packs items efficiently with minimal gaps. Empacotamento denso |
| Equal-height cards | Três cartões verticais altos e iguais | Makes all items the same height for a balanced layout. Alturas equalizadas |

### Tamanhos / presets ("Sizes / presets — Predefined spacing and sizing options.", 3 exemplares)

| Tamanho | Observado | Uso literal |
|---|---|---|
| Compact | Mini-grelha 3×2 apertada | Tight spacing for dense content. |
| Medium (default) | Mini-grelha 3×2 destacada com anel azul | Balanced for most use cases. |
| Spacious | Mini-grelha 2×2 arejada | More breathing room for visual content. |

## 4) Estados ("States — Different states for interactive scenarios.", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Célula neutra com ícone de imagem; Normal state. |
| Hover | Célula elevada com sombra; Elevated on hover. |
| Selected | Célula com anel azul + badge ✓ circular; Shows selection state. |
| Dragging | Célula dentro de contentor tracejado deslocado; Visual feedback during reorder. |
| Disabled | Célula cinzenta dessaturada com ícone de pessoas; Reduced interaction. |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Reflow / resize do viewport | Recalcula colunas a partir de `min-item-width`; itens animam para novas posições |
| Hover num item | Elevação subtil + sombra; cursor pointer se clicável |
| Click / selecção | Aplica estado Selected (anel + badge ✓); `aria-selected` quando grelha for seleccionável |
| Drag / reorder | Contentor de inserção tracejado + sombra de arrasto; largar reordena e dispara reflow |
| Teclado Tab / Arrow keys | Navegação sequencial + por setas entre itens; ver acessibilidade |
| Item Disabled | Sem hover/elevação; sem acção via pointer/teclado |

## 6) Motion ("Motion — Smooth, natural interactions.", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Reflow animation | **(sem valor literal; "Smoothly animates when items change.")** | `--v-motion-normal: 200ms` + `--v-ease-out` (transição de `transform` do reflow; token da página `--grid-transition: all 200ms ease`) |
| Card hover elevation | **100ms ease-out** | `--v-motion-fast: 100ms` + `--v-ease-out` (`box-shadow`/`transform`) |
| Drag feedback | **(sem valor literal; "Smooth transform and shadow.")** | `--v-motion-normal: 200ms` + `--v-ease-out` (`transform`/`box-shadow`) |

Regras gerais: animar apenas `transform`/`opacity` (e `box-shadow` barato no hover); `prefers-reduced-motion: reduce` desliga reflow/elevação/arrasto (mudança instantânea).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-auto-layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--v-grid-min-item-width, 280px), 1fr));
  gap: var(--v-space-4); // 16px
  transition: all 200ms ease;

  &[data-behavior="auto-fill"] { grid-template-columns: repeat(auto-fill, minmax(var(--v-grid-min-item-width, 280px), 1fr)); }
  &[data-behavior="dense"] { grid-auto-flow: dense; }
  &[data-equal-height] { grid-auto-rows: 1fr; }

  .v-auto-layout-grid__item {
    border-radius: var(--v-radius-md); // 12px
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
    transition:
      transform var(--v-motion-fast) var(--v-ease-out),
      box-shadow var(--v-motion-fast) var(--v-ease-out);

    &:hover { transform: translateY(-2px); }
    &[data-selected="true"] { box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3); }
  }

  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none; } }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default.", 7 checks literais)

1. **Keyboard navigation (Tab, Arrow keys)** — navegação sequencial e por setas (roving tabindex) entre itens.
2. **Semantic list/grid structure** — usar `<ul>`/`<li>` ou `role="grid"` + `role="gridcell"` conforme interactividade.
3. **Proper focus indicators** — anel de foco visível via `:focus-visible`, nunca removido sem substituto.
4. **ARIA roles and labels** — `aria-label` da grelha e `aria-selected` nos itens seleccionáveis.
5. **Supports reduced motion preference** — `prefers-reduced-motion: reduce` desliga reflow e elevações.
6. **Sufficient color contrast** — texto/meta dos cartões dentro do mínimo WCAG AA.
7. **Works with screen readers** — ordem de leitura = ordem visual/DOM; anunciar mudanças de layout quando relevantes.

## 8) data-test-ids sugeridos

- `v-auto-layout-grid` (root; `data-behavior="auto-fit|auto-fill|dense|equal-height"`, `data-size="compact|medium|spacious"`)
- `v-auto-layout-grid-item` / `v-auto-layout-grid-item-{design-system,brand-assets,team,analytics,documentation,components,projects,settings}` (contexto dashboard)
- `v-auto-layout-grid-item-menu` (botão `…` de cada cartão)
- `v-auto-layout-grid-drop-preview` (contentor tracejado do dragging)
- `v-auto-layout-grid-selection-badge` (badge ✓ do Selected)
- `docs-auto-layout-grid-variant-{auto-fit,auto-fill,dense,equal-height}` (fileira de variantes)
- `docs-auto-layout-grid-size-{compact,medium,spacious}` (fileira de presets)
- `docs-auto-layout-grid-state-{default,hover,selected,dragging,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization.")

| Token | Valor |
|---|---|
| `--grid-gap` | `16px` |
| `--grid-row-gap` | `16px` |
| `--grid-column-gap` | `16px` |
| `--grid-min-item-width` | `280px` |
| `--grid-item-radius` | `12px` |
| `--grid-item-shadow` | `0 2px 8px rgba(99, 102, 241, 0.08)` |
| `--grid-transition` | `all 200ms ease` |

No repo equivalem a `--v-space-4`, `--v-grid-min-item-width`, `--v-radius-md`, `--v-shadow-*`, `--v-motion-normal` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components.")

```vue
<template>
  <VAutoLayoutGrid
    :min-item-width="280"
    :gap="16"
  >
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
    />
  </VAutoLayoutGrid>
</template>
```

**Pro tip (literal):** "Use auto-fit with a sensible min-item-width (e.g. 280px) for the most responsive results."
