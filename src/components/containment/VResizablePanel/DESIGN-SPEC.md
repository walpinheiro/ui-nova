# VResizablePanel — DESIGN-SPEC (fonte: doc/Ui/VResizablePanel.png)

> Página de documentação do componente VResizablePanel (VueUI Nova › Components › VResizablePanel, v1.0.0).
> Tagline da página: "A flexible, accessible, and performant resizable panel for modern layouts."
> Três pilares no topo: **Flexible** (Resize in any direction with mouse, touch, or keyboard) · **Composable** (Works with any content — sidebars, inspectors, or panels) · **Accessible** (Keyboard support, ARIA roles, and thoughtful interactions).
> Header da página: breadcrumb "VueUI Nova › Components › VResizablePanel", título "VResizablePanel", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VResizablePanel ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`.
> Texto decorativo manuscrito no fundo: "Flexible layouts. Happier users."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." · "Thoughtful components for modern products."

## 1) Objetivo do componente

Painel redimensionável flexível, acessível e performante para layouts modernos. Permite ao utilizador ajustar a largura/altura de sidebars, inspectors e painéis por rato, toque ou teclado, com limites mínimo/máximo e opção de colapso. Funciona com qualquer conteúdo (navegação, inspector, drawer inferior). Diretriz de uso (Pro tip): persistir o tamanho do painel em `localStorage` para uma experiência consistente entre sessões.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the resizable panel" (6 partes numeradas, exemplo com navegação Home/Projects/Tasks/Settings):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| 1. Panel surface | sim | O elemento contentor (The container element); superfície branca `#FFFFFF`, borda `#E5E7EB` |
| 2. Content area | sim | Contém o conteúdo (Holds your content); ex.: lista de navegação Home / Projects / Tasks / Settings |
| 3. Resize handle | sim | Arrastar para redimensionar (Drag to resize); barra vertical azul com grip, `4px` de largura |
| 4. Min size | config | Tamanho mínimo permitido (Minimum allowed size); seta vertical de limite superior |
| 5. Max size | config | Tamanho máximo permitido (Maximum allowed size); seta vertical de limite inferior |
| 6. Collapsed trigger | não | Alterna entre colapsado e expandido (Toggles between collapsed and expanded); botão `‹`/`›` no bordo |

Elementos da secção "Interactive preview — Drag the handle to resize the panel" (janela com semáforo vermelho/amarelo/verde):

- Sidebar "Acme ▾" com busca `Search… ⌘K` e nav Dashboard, **Projects ativo**, Tasks, Analytics, Settings; handle vertical com tooltip "Drag to resize".
- Área "Product Roadmap — Plan, build, and ship amazing products." com botão `+ New` (primary).
- 4 stat cards: `12 Active projects`, `8 Team members`, `24 Open tasks`, `98% On track`.
- "Recent activity": Design system update (2m ago), New component added (12m ago), Task completed (1h ago).
- Card "Build together — A more productive tomorrow." com ilustração e ícone de expandir.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different panel configurations for common use cases", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Left panel | Painel fino à esquerda com trigger `‹` (destaque azul, default) | Common sidebar pattern |
| Right panel | Painel fino à direita com trigger `›` | Right side inspector |
| Bottom panel | Painel horizontal inferior, handle horizontal no topo | Bottom drawer or console |
| Collapsible panel | Painel central com botão de colapso `↕`/chevron à direita | Can be collapsed and expanded |

Legenda do grupo: "Fits any layout. Horizontal, vertical, and collapsible."

### Tamanhos ("Sizes — Common size presets and custom sizing", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | Bloco `240px` (destaque azul) | `240px` |
| Medium (default) | Bloco `320px` | `320px` |
| Large | Bloco `480px` | `480px` |

Tamanhos customizados via `v-model:size` + props `min`/`max` (ver Uso Vue).

## 4) Estados ("States — Visual states for the resize handle and panel", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Handle cinzento fino vertical (Normal state) |
| Hover handle | Handle azul realçado (On hover) |
| Focus handle | Handle azul espesso com anel de foco visível (Keyboard focus) |
| Dragging | Handle azul ativo + linha guia vertical durante o arrasto (While resizing) |
| Collapsed | Painel recolhido a faixa estreita com trigger `›` (Collapsed state) |
| Disabled | Handle cinzento claro esmaecido, sem interação (Non-interactive) |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Drag (handle, rato/toque) | Redimensiona o painel em tempo real com transições subtis; tooltip "Drag to resize"; respeita `min`/`max`; anuncia novo tamanho ao screen reader |
| Hover (handle) | Realce azul do handle + `cursor: col-resize` (ou `row-resize` no bottom panel) |
| Focus / Tab | Anel de foco visível no handle via `:focus-visible`; ordem: painel → handle → trigger de colapso |
| Teclado (setas) | `←/→` (horizontal) ou `↑/↓` (vertical) ajustam o tamanho por incrementos; `Home/End` saltam para min/max; `Enter` confirma |
| Click (collapsed trigger `‹/›`) | Colapsa/expande com animação suave open/close; `aria-expanded` atualizado |
| Click (expand em card "Build together") | Exemplo de conteúdo, não parte do painel |
| Disabled | Sem pointer/keyboard; `aria-disabled="true"`, handle esmaecido |
| Resize persistido | Ao largar (pointerup), emite `update:size`; app grava em `localStorage` (Pro tip) |

## 6) Motion ("Motion — Smooth, natural interactions", 2 especificações do poster)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Resize | **Fluid resizing with subtle transitions** (sem valor; token `--vp-transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)`) | `--v-motion-normal: 160ms` ≈ 200ms + `--v-ease-out` (largura/altura; durante o drag usar `transition: none` e animar só no programático/colapso) |
| Collapse / Expand | **Smooth open and close animation** (sem valor; mesmo token de transição) | `--v-motion-normal` + `--v-ease-out` (`width`/`transform`/`opacity`) |

Regras gerais: durante o arrasto contínuo desativar transição para 60fps (só `transform`/tamanho direto); animar apenas mudanças programáticas (colapso, presets, teclado); `prefers-reduced-motion: reduce` torna resize/colapso instantâneos.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-resizable-panel {
  background: var(--v-color-surface, #ffffff); // --vp-panel-bg
  border: 1px solid var(--v-color-border, #e5e7eb); // --vp-panel-border
  transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1); // --vp-transition

  &--dragging { transition: none; }

  .v-resizable-panel__handle {
    width: 4px; // --vp-handle-size
    background: var(--v-color-border-strong, #1f5fff); // --vp-handle-bg
    cursor: col-resize;

    &:hover { background: var(--v-color-primary-hover, #3882f6); } // --vp-handle-hover
    &:focus-visible {
      outline: 2px solid var(--v-color-focus);
      outline-offset: 2px;
    }
    &:active { background: var(--v-color-primary-active, #2563eb); } // --vp-handle-active
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 7 checks literais)

1. **Keyboard accessible (Tab, Arrow keys)** — foco no handle via Tab, redimensionamento via setas, Home/End para min/max.
2. **ARIA role="separator" on handle** — o handle expõe `role="separator"` com `aria-orientation="horizontal|vertical"`, `aria-valuenow/min/max`.
3. **Supports aria-orientation** — orientação anunciada conforme direção do painel.
4. **Announces size changes to screen readers** — novo tamanho anunciado via `aria-valuetext`/`aria-live` durante setas e drag.
5. **Sufficient color contrast** — handle `#1F5FFF` sobre fundo claro dentro do mínimo WCAG AA.
6. **Works with reduced motion** — com `prefers-reduced-motion`, resize/colapso sem animação.
7. **Follows WAI-ARIA best practices** — padrão de `separator` redimensionável conforme APG (foco visível, nomes acessíveis, ordem lógica).

## 8) data-test-ids sugeridos

- `v-resizable-panel` (root; `data-variant="left|right|bottom|collapsible"`, `data-state`, `data-orientation="vertical|horizontal"`)
- `v-resizable-panel-surface`
- `v-resizable-panel-content`
- `v-resizable-panel-handle` (`aria-valuenow` reflete o tamanho)
- `v-resizable-panel-collapse-trigger`
- `v-resizable-panel-drag-tooltip` (tooltip "Drag to resize")
- `v-resizable-panel-live` (região `aria-live` para anunciar mudanças de tamanho)
- `docs-resizable-variant-{left,right,bottom,collapsible}` (fileira de variantes)
- `docs-resizable-size-{240,320,480}` (fileira de tamanhos)
- `docs-resizable-state-{default,hover,focus,dragging,collapsed,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--vp-panel-bg` | `#FFFFFF` |
| `--vp-panel-border` | `#E5E7EB` |
| `--vp-handle-bg` | `#1F5FFF` |
| `--vp-handle-hover` | `#3882F6` |
| `--vp-handle-active` | `#2563EB` |
| `--vp-handle-size` | `4px` |
| `--vp-collapsed-size` | `48px` |
| `--vp-transition` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` |

No repo equivalem a `--v-color-surface`, `--v-color-border`, `--v-color-primary` (+ hover/active), `--v-space-1` (aprox. 4px), `--v-motion-normal` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VResizablePanel
    v-model:size="sidebarWidth"
    orientation="vertical"
    :min="200"
    :max="480"
    collapsible
  >
    <SidebarContent />
  </VResizablePanel>
</template>
```

**Pro tip (literal):** "Persist the panel size in local storage so users get a consistent experience across sessions."

## 12) Validação

Status: ✅ Concluído e validado

Data: `2026-09-20`

Testes executados:

- `pnpm build` ok; `pnpm exec vitest run src/components/containment/VResizablePanel/_tests/VResizablePanel.spec.ts` — **19/19** (contrato, presets, variantes, ARIA, teclado, drag por variante, colapso e `aria-live`).
- e2e pendente de `pnpm exec playwright install chromium` neste ambiente — harness `.val-harness/VResizablePanel.html` em `:8321`.
- Comparação visual com `doc/ui/VResizablePanel.png`: anatomia (surface/content/handle/limits/collapse), estados do handle, presets 240/320/480, variantes left/right/bottom/collapsible, tooltip "Drag to resize", tokens via `--v-*`.

Correções aplicadas nesta validação:

- Sinal de drag corrigido para `bottom` (altura aumenta ao arrastar para baixo) e `right` (largura diminui ao arrastar para a direita).
- Trigger de colapso visível sempre que `collapsible`/`data-has-collapse`, não só na variante `collapsible`.
- Chevron orientado por variante (`‹`/`›`) conforme sidebar esquerda vs inspector direita.
- Região `aria-live` para anunciar mudanças de tamanho a screen readers.
- Story/harness com fileira `docs-resizable-state-*` e estados visuais estáticos (hover/focus/dragging).
