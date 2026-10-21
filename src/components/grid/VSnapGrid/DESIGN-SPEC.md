# VSnapGrid — DESIGN-SPEC (fonte: doc/Ui/VSnapGrid.png)

> Página de documentação do componente VSnapGrid (VueUI Nova › Components › VSnapGrid, v1.0.0).
> Tagline da página: "A snapping grid primitive for editors, builders, and drag-and-drop workspaces."
> Três pilares no topo: **Precise** (Pixel-perfect snapping for confident layouts.) · **Aligned** (Keep elements visually and spatially consistent.) · **Builder-friendly** (Designed for editors, builders, and no-code tools.).
> Header da página: breadcrumb "VueUI Nova › Components › VSnapGrid", título "Components / VSnapGrid", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VSnapGrid ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito: "Snap together. Build anything."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." + "Thoughtful components for modern products."

## 1) Objetivo do componente

Primitivo de grelha com snapping para editores, builders e workspaces de drag-and-drop. É o canvas de construção do sistema: grelha de pontos/linhas com atracção magnética, réguas e guias de alinhamento para posicionar objectos com precisão de pixel. O exemplo "In context — A real editor using VSnapGrid" mostra um editor completo: painel "Layers" (Hero Section, **Card** seleccionado, Button, Image, Text — cada um com checkbox/`⋮⋮`/`…` e botão `+`), canvas com réguas (0–800 horizontal, 0–300 vertical), tooltip "Snap to grid x: 400 y: 120", objecto "Image" placeholder + cartão "Product Card" seleccionado (título, barras skeleton, botão "Get Started") com handles, e painel "Grid" (toggle Grid ligado, Size `24px`, Style `Visible`, checks: Show rulers, Show guides, Magnetic snapping, Snap to Objects, Snap to Guides).

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of VSnapGrid." (quadrado azul sobre grelha pontilhada):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Ruler (optional) | não | Régua de medição (0, 50, 100… no topo/lateral) |
| Grid line | sim | Linha da grelha (pontilhada/sólida) |
| Snap point | sim | Ponto de atracção (cruzamentos da grelha) |
| Object bounds | sim | Limites do objecto (rectângulo do conteúdo) |
| Guide line (alignment) | sim | Linha de alinhamento (ciano, entre objectos) |
| Selection box | estado | Caixa de selecção com handles nos cantos/pontos médios |

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different grid styles for different workflows.", 4 exemplares)

| Variante | Aparência na imagem | Uso literal |
|---|---|---|
| Visible grid | Grelha pontilhada azul densa com anel de selecção | Clear and structured for precise design. |
| Subtle grid | Grelha clara quase invisível | Minimal, elegant guides. |
| Magnetic only | Só cruzes `+` espaçadas, sem linhas | Hidden grid, snap points only. |
| Ruler + grid | Grelha com réguas numeradas (100, 200, 300) no topo | With measurement rulers for precision. |

### Tamanhos ("Sizes — Grid density presets.", 3 exemplares)

| Tamanho | Observado | Passo |
|---|---|---|
| Fine | Grelha densa | 8px |
| Medium (default) | Grelha destacada com anel azul | 24px |
| Coarse | Grelha larga | 48px |

## 4) Estados ("States — Common states for snap interactions.", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Quadrado cinza-claro neutro |
| Hover object | Quadrado azul com anel |
| Snapping | Mira/crosshair tracejado (linhas de atracção horizontal + vertical) |
| Selected | Quadrado azul com handles quadrados nos 8 pontos |
| Disabled | Quadrado cinzento tracejado dessaturado |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Drag object | Objecto move-se fluidamente; ao aproximar-se de snap point/guia, sofre atracção ("Snap to grid x: 400 y: 120") |
| Snapping | Mira + guide lines fazem fade-in perto de objectos/guias; posição encaixa no ponto |
| Hover object | Destaque do objecto; cursor move/grab |
| Select | Click aplica Selection box com handles; `…`/Layers reflectem selecção (Card destacado) |
| Arrow key nudge | Setas deslocam o objecto pixel a pixel (ou ao passo da grelha com modificador) |
| Toggle Grid / Show rulers / Show guides / Magnetic snapping | Liga/desliga camadas do canvas (painel Grid) |
| Layers panel | Click selecciona objecto no canvas; `+` adiciona camada |
| Objecto Disabled | Sem snapping/selecção; aparência tracejada dessaturada |

## 6) Motion ("Motion — Smooth, helpful interactions.", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Snap attraction | **(sem valor; "Object smoothly snaps into place.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`transform`) |
| Guide fade-in | **(sem valor; "Alignment guides fade in near objects.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`opacity`) |
| Selection movement | **(sem valor; "Fluid movement while dragging.")** | `--v-motion-fast: 100ms` + `--v-ease-out` (`transform`; seguir o cursor sem lag) |

Regras gerais: animar apenas `transform`/`opacity`; `prefers-reduced-motion: reduce` desliga atracção suave e fades (salto instantâneo para o snap point).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-snap-grid {
  --v-snap-grid-size: 24px; // fine 8px, coarse 48px
  background-image:
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
  background-size: var(--v-snap-grid-size) var(--v-snap-grid-size);

  .v-snap-grid__object {
    transition: transform var(--v-motion-fast) var(--v-ease-out);

    &[data-snapping="true"] { outline: 1px dashed #3b82f6; }
    &[data-selected="true"] { outline: 2px solid #3b82f6; }
  }

  .v-snap-grid__guide { color: #06b6d4; transition: opacity var(--v-motion-fast) var(--v-ease-out); }

  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none; } }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design.", 8 checks literais)

1. **Keyboard accessible (arrow key nudge)** — mover objectos com setas; canvas focável.
2. **Visible focus indicators** — foco visível em objectos, handles e controlos do painel Grid.
3. **ARIA labels for canvas region** — `role="application"`/`region` + `aria-label` do canvas e das réguas.
4. **Screen reader friendly descriptions** — descrições textuais da posição ("x: 400 y: 120") e do snapping.
5. **Sufficient color contrast for grid and guides** — grelha `#E5E7EB`/guias `#06B6D4`/selecção `#3B82F6` com contraste suficiente.
6. **Does not rely on color alone** — snapping/selecção também com forma (tracejado, handles, mira), não só cor.
7. **Works with zoom up to 200%** — utilizável com zoom até 200%.
8. (Implícito do painel) Controlos nativos: `toggle`, `select` (Size/Style) e `checkbox` (rulers/guides/snapping) com labels.

## 8) data-test-ids sugeridos

- `v-snap-grid` (root/canvas; `data-size="8|24|48"`, `data-style="visible|subtle|magnetic|rulers"`)
- `v-snap-grid-ruler-h` / `v-snap-grid-ruler-v` (réguas)
- `v-snap-grid-object` / `v-snap-grid-object-{hero-section,card,button,image,text}` (camadas do contexto)
- `v-snap-grid-object-product-card` (cartão "Product Card" + `v-snap-grid-object-get-started`)
- `v-snap-grid-snap-tooltip` (tooltip "Snap to grid x: 400 y: 120")
- `v-snap-grid-guide` (linhas de alinhamento)
- `v-snap-grid-layers` / `v-snap-grid-layers-add` (painel Layers + `+`)
- `v-snap-grid-panel-grid-toggle` / `v-snap-grid-panel-size` / `v-snap-grid-panel-style` / `v-snap-grid-panel-{show-rulers,show-guides,magnetic-snapping,snap-objects,snap-guides}`
- `docs-snap-grid-variant-{visible,subtle,magnetic-only,ruler-grid}` (fileira de variantes)
- `docs-snap-grid-size-{fine,medium,coarse}` (fileira de tamanhos)
- `docs-snap-grid-state-{default,hover-object,snapping,selected,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization.")

| Token | Valor |
|---|---|
| `--vsnapgrid-grid-color` | `#E5E7EB` |
| `--vsnapgrid-grid-color-subtle` | `#F3F4F6` |
| `--vsnapgrid-snap-color` | `#3B82F6` |
| `--vsnapgrid-guide-color` | `#06B6D4` |
| `--vsnapgrid-ruler-color` | `#9CA3AF` |
| `--vsnapgrid-selection` | `#3B82F6` |
| `--vsnapgrid-point-size` | `6px` |
| `--vsnapgrid-line-width` | `1px` |
| `--vsnapgrid-ruler-height` | `28px` |

No repo equivalem a `--v-color-primary`/`--v-color-info`, `--v-border-*`, `--v-space-*`, `--v-motion-fast` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components.")

```vue
<template>
  <VSnapGrid
    :size="24"
    :show-rulers="true"
    :magnetic="true"
    v-model:objects="elements"
  />
</template>
```

**Pro tip (literal):** "Use a grid size that matches your spacing system (e.g. 8px or 24px) for consistent layouts."
