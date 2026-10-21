# VSplitView — DESIGN-SPEC (fonte: doc/ui/VSplitView.png + complemento pôster_da_documentação_split_view_do_vueui_nova.png)

> Status: ✅ Concluído e validado  
> Data: 2026-09-20  
> Testes: `pnpm build` ok; `pnpm exec vitest run src/components/containment/VSplitView/_tests/VSplitView.spec.ts` — **20/20**; e2e (3 specs) pendente de `pnpm exec playwright install chromium` neste ambiente.  
> Validação visual: inspeção de `doc/ui/VSplitView.png`, harness `.val-harness/VSplitView.html` (vertical/horizontal, fixed/resizable/collapsible, collapsed, disabled) e asserções Playwright de teclado, drag, collapse e ARIA.  
> Correções aplicadas: drag com delta relativo ao início do pointerdown; remoção de `gap` duplicado no track; transição desativada durante drag; slots `start`/`default`/`end`; `data-test-id` semânticos `pane-start`/`pane-center`/`pane-end`; chevron contextual no collapse.

## 1) Objetivo do componente

O `VSplitView` cria workspaces multi-painel redimensionáveis com layouts flexíveis.
Poster principal: **"Split View — An adjustable multi-pane workspace."** — *"Split View lets you create resizable,
multi-pane interfaces with flexible layouts. Perfect for complex applications like IDEs, editors, dashboards,
and data exploration tools."*
Complemento: **"Split View — Resizable multi-pane workspace"** — *"organize content in adjustable panes, giving
users the flexibility to focus, compare, and work across multiple areas at once. Perfect for editors, dashboards,
and data-rich applications."*
Três pilares (principal): **Flexible** ("Support two or more panes with resizable dividers"), **Adaptable**
("Horizontal or vertical layouts, collapsible panes"), **Productive** ("Ideal for complex, content-rich applications").
Complemento: **Resizable** ("Drag dividers to adjust pane sizes"), **Productive** ("Keep related content open and
in context"), **Balanced** ("Flexible layouts that adapt to your workflow").
Hero do poster principal: IDE de 3 colunas — nav "Files/Search/Source Control/Extensions/Settings", "Project Files"
com árvore (src › components › Button.vue / SplitView.vue selecionado / DatePicker.vue / Window.vue, composables,
utils, assets, docs, package.json, README.md + search "Search files…") e "Component Inspector" com tabs
Props/Events/Slots e campos title="Split View", orientation="vertical" (dropdown), collapsible (toggle on),
default-size 280 px, min-size 200 px, max-size 600 px.
Hero do complemento: workspace "Project Overview" — coluna Workspace (Overview selecionado, Projects, Analytics,
Messages, Settings + FAVORITES: Design System, Documentation, Playground), centro (breadcrumb Projects › Nova App,
"Project Overview", subtítulo, ilustração, "Recent activity" com 3 linhas) e "Inspector" (tabs Details/Comments/
History, Name "Nova App", Description, Tags chips "vue × / ui × / productivity ×" + "+ Add tag", Created
"Jan 10, 2024" / Last updated "Mar 4, 2024").
Notas manuscritas: *"Multiple panes for complex workflows."* / *"Parallel focus"*.
Pro tip: combinar com Window ou Tabs para experiências tipo IDE; exemplo aninhado
`<Window title="Editor"><SplitView><template #pane-1><FileExplorer/></template>…`;
guardar/restaurar tamanhos (`v-model:sizes="savedSizes" persist-key="ide-layout"`) para workspace personalizado.

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomia do poster principal (5 partes, exemplo Sidebar/Content/Inspector):

1. **Pane** — "A resizable content panel." (ex.: Sidebar Pane / Navigation).
2. **Divider** — "Visual separator between panes." (linha vertical com handle).
3. **Content area** — "Holds your content." (Content Pane / Main content).
4. **Secondary pane** — "Optional pane (e.g., inspector)." (Inspector Pane / Properties).
5. **Resize handle** — "Drag to resize panes." (pega sobre o divider, com `↔` no dragging).

Anatomia do complemento (5 partes, 3 panes genéricos com ícones de ficheiro/pasta):

1. **Pane**, 2. **Divider**, 3. **Content area**, 4. **Divider**, 5. **Pane**.

Elementos visíveis nos heroes (todos cobertos): janela com semáforo macOS; nav lateral com ícones + item
selecionado em azul-claro; campo de pesquisa; árvore de ficheiros com setas de expansão, ícones de pasta/ficheiro
e linha selecionada; tabs Props/Events/Slots (ativa com contorno azul); labels de campo + inputs com sufixo "px";
toggle switch azul (collapsible on); dropdown "vertical"; breadcrumb; chips de tag com `×` e "+ Add tag";
bloco de ilustração em gradiente; linhas de atividade com ícone + texto + tempo; pares Created/Last updated.

## 3) Variantes e tamanhos visíveis

Variantes — configurações de painéis (3 cartões em ambos os posters):

| Variante | Descrição |
|---|---|
| **Two panes** | "A sidebar and main content area." / "Sidebar + content" |
| **Three panes** | "Sidebar, content, and inspector." / "Sidebar + content + inspector" |
| **Horizontal split** | "Top and bottom panes." / "Top + bottom panes" |

Layout modes — comportamento de dimensionamento (principal: Fixed / **Resizable (default)** / Collapsible;
complemento: Fixed "Static sizes" / **Resizable (default)** "User-controlled sizes" / Collapsible "Auto hide panes"):

| Modo | Descrição |
|---|---|
| **Fixed** | "Fixed pane sizes, no resizing." / "Static sizes" |
| **Resizable (default)** | "User can drag dividers to resize panes." / "User-controlled sizes" |
| **Collapsible** | "Panes can be collapsed to save space." / "Auto hide panes" |

"Tamanhos" não são S/M/L: cada pane tem `default-size` (ex. 280), `min-size` (200), `max-size` (600) em px
(hero do Inspector), e o exemplo Vue usa `v-model:sizes="[200, 1, 320]"` / `const sizes = ref([240, '1fr', 320])`.
Design tokens (principal, com valores):

`--split-divider-size: 4px`, `--split-divider-color: var(--color-border)`, `--split-divider-hover`,
`--split-handle-color: var(--color-text-muted)`, `--split-handle-hover: var(--color-primary)`,
`--split-pane-bg: var(--color-surface)`, `--split-pane-border: var(--color-border)`,
`--split-pane-muted: var(--color-surface-muted)`, `--split-collapsed-size: 48px`,
`--split-transition-duration: 120ms`, `--split-shadow: 0 1px 2px rgba(0,0,0,0.04)`.

Complemento lista: `--split-divider-size`, `--split-divider-hover`, `--split-divider-active`, `--split-pane-bg`,
`--split-pane-border`, `--split-pane-shadow`, `--split-collapse-size`, `--split-transition`,
`--split-handle-color`, `--split-handle-hover`.

Exemplo Vue (principal):

```vue
<template>
  <SplitView v-model:sizes="[200, 1, 320]" min-size="200">
    <template #pane-1><Sidebar /></template>
    <template #pane-2><MainContent /></template>
    <template #pane-3><Inspector /></template>
  </SplitView>
</template>
```

Complemento: `<SplitView v-model:sizes="sizes"><template #start><Sidebar/></template><template #default>
<ContentArea/></template><template #end><Inspector/></template></SplitView>`.

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Estados do divider/pane (5 cartões):

| Estado | Aparência |
|---|---|
| **Default** | "Normal divider appearance." — linha fina neutra |
| **Hover (divider)** | "Highlighted on hover." — divider destacado (azul) |
| **Dragging** | "Active while resizing." — barra azul espessa com `↔` |
| **Collapsed** | "Pane is collapsed to minimal size." / seta `›` (expandir) ou `‹` (painel fino de 48px com chevron) |
| **Disabled** | "Non-interactive divider." — divider apagado, sem interação |

Focus não tem cartão próprio mas é exigido pela a11y (dividers focáveis com indicadores de foco claros e
`role="separator"`). Loading não ilustrado: inferido — skeleton dentro dos panes durante carregamento, mantendo
dividers. Pressed equivale ao estado Dragging (handle ativo).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Hover no divider**: destaca (cor primária) e cursor `col-resize`/`row-resize`; handle `↔` fica visível.
- **Drag no resize handle**: redimensionamento em tempo real ("Live update — Content adapts instantly"),
  com feedback contínuo e "Smooth settle" ao soltar; respeita `min-size`/`max-size` por pane.
- **Click no chevron de collapse** (`›`/`‹`): colapsa o pane para 48px (`--split-collapsed-size`) ou restaura;
  estado anunciado às tecnologias de apoio.
- **Teclado**: com o divider focado, setas `Left/Right` (vertical) ou `Up/Down` (horizontal) redimensionam;
  `Tab` move o foco entre panes na ordem lógica; Enter/Espaço pode alternar collapse onde aplicável.
- **Overlays**: o SplitView não cria overlay próprio; panes podem conter dropdowns/menus que abrem acima do
  conteúdo; em modo modal (combinado com Window) o foco é contido.
- **Persistência**: tamanhos guardados/restaurados via `persist-key` (Pro tip) — o layout do utilizador sobrevive
  a reloads.

## 6) Motion (durações, easing, transições, cruzando com tokens do DESIGN.md)

Valores literais:

- Principal: **"Smooth settle — Eases to final size (120ms)."** / "Drag to resize — Real-time pane resizing
  with smooth easing." / "Live update — Content adapts instantly."
- Complemento: **"Panes resize in real time with a 150ms ease-out animation."**

Cruzamento com tokens `DESIGN.md`:

| Conceito | Token `--v-*` | Uso no SplitView |
|---|---|---|
| Settle 120ms | `--v-motion-normal: 160ms` (≈120–150ms; `--split-transition-duration: 120ms` do poster) | transição do tamanho final do pane/divider |
| Resize em tempo real | sem transição durante o drag (atualização direta) | largura via `flex-basis`/transform, só `transition` no settle |
| Easing | `--v-ease-out` (settle/entrada), `--v-ease-standard: cubic-bezier(.2,.8,.2,1)` | `transition: flex-basis/size 120ms var(--v-ease-out)` |
| Collapse/expand | `--v-motion-normal` + `--v-ease-in-out` | animação do colapso para 48px |

Regras: durante o drag, não animar (resposta 1:1 ao ponteiro); ao soltar, ease curto de assentamento;
`prefers-reduced-motion` remove o settle (mudança instantânea); sombra do divider `--split-shadow`
(`0 1px 2px rgba(0,0,0,0.04)` ≈ `--v-shadow-sm`).

## 7) Acessibilidade observada

Checklist combinada:

- Keyboard resizing with arrow keys (Left/Right or Up/Down) / Keyboard resize (Arrow keys).
- aria-orientations "vertical"/"horizontal" (principal) / ARIA roles for panes and dividers.
- aria-valuemin, aria-valuemax, aria-valuenow (principal).
- Focusable dividers with proper role (separator).
- Screen reader support with descriptive labels / Works with screen readers.
- Logical tab order between panes / Maintains logical tab order.
- Collapsed state announced to assistive technologies / Supports collapsed state announcements.
- Sufficient color contrast for dividers and handles / Clear focus indicators.
- Supports both horizontal and vertical orientations / Responsive and touch friendly.
- Follows WAI-ARIA best practices.

## 8) data-test-ids implementados (lista)

- `data-test-id="v-split-view"` — contentor raiz (`role="group"`)
- `data-test-id="v-split-view-track"` — trilha grid
- `data-test-id="v-split-view-pane-start"` / `v-split-view-pane-center` / `v-split-view-pane-end` — panes (sidebar/content/inspector); panes extras usam `v-split-view-pane-N`
- `data-pane-index="N"` — índice numérico estável do pane
- `data-test-id="v-split-view-divider-0"` / `v-split-view-divider-1` — dividers (`role="separator"`)
- `data-test-id="v-split-view-handle-0"` / `v-split-view-handle-1` — resize handles visuais
- `data-test-id="v-split-view-collapse-0"` / `v-split-view-collapse-1` — botões chevron de collapse

## 9) Contrato público implementado

Props: `sizes` (`v-model:sizes`), `orientation: vertical | horizontal` (default `vertical`), `mode: fixed | resizable | collapsible` (default `resizable`), `collapsible` (opt-in quando `mode !== collapsible`), `persistKey`, `defaultSize` (280), `minSize` (200), `maxSize` (600), `disabled`, `ariaLabel`.

Slots: `pane-1`/`pane-2`/`pane-3` ou aliases `start`/`default`/`end` (e `pane-N` para N>3).

Eventos: `update:sizes`, `resize`, `collapse`, `expand`.

Comportamento: drag em tempo real com settle via `--v-motion-normal`; teclado no divisor (setas filtradas por orientação, Home/End, Enter/Space para collapse); `persistKey` grava em `localStorage`; collapse reduz pane a `var(--v-space-12)` (48px).
