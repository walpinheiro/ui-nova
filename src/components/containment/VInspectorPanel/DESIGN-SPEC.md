# VInspectorPanel — DESIGN-SPEC ✅ (fonte: doc/ui/VInspectorPanel.png)

> **Status:** ✅ Concluído e validado  
> **Data:** 2026-09-20  
> **Testes:** `pnpm build` ok; `pnpm exec vitest run src/components/containment/VInspectorPanel/_tests/VInspectorPanel.spec.ts` — **12/12**; e2e pendente de `pnpm exec playwright install chromium` neste ambiente.

> Página de documentação do componente VInspectorPanel (VueUI Nova › Components › VInspectorPanel, v1.0.0).
> Tagline da página: "A flexible side panel for inspecting and editing content, properties, and settings."
> Três pilares no topo: **Contextual** (Shows relevant details for the current selection) · **Flexible** (Organize content with tabs and collapsible sections) · **Productive** (Streamline workflows with a focused, distraction-free panel).
> Header da página: breadcrumb "VueUI Nova › Components › VInspectorPanel", título "VInspectorPanel", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, Window, **VInspectorPanel ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Details bring ideas to life."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." · "Open source · Customizable · Production ready".

## 1) Objetivo do componente

Painel lateral flexível para inspecionar e editar conteúdo, propriedades e definições do item atualmente selecionado. É o painel contextual do sistema: mostra definições sensíveis ao contexto (ex.: botão "Get Started" selecionado no canvas do Design Studio), organiza controlos com abas (tabs) e secções colapsáveis, e mantém um fluxo focado e sem distrações. Diretriz de uso (Pro tip): mostrar definições contextuais conforme a seleção atual e combinar abas com secções colapsáveis para manter UIs complexas organizadas e fáceis de navegar.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the VInspectorPanel" (8 partes numeradas):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| 1. Panel container | sim | Invólucro principal do painel (The main panel wrapper); superfície branca, `radius 16px`, sombra `0 10px 30px rgba(0,0,0,0.06)`, largura 360px (default) |
| 2. Header | sim | Título e ações (Title and actions); ex.: "Inspector" + botão fechar `×` |
| 3. Tabs | sim | Alternância entre categorias (Switch between categories); ex.: Properties (ativa, sublinhado accent) / Styles / Interactions |
| 4. Section group | sim | Grupo de conteúdo colapsável (Collapsible content group); ex.: "General" expandida, "Layout", "Appearance", "Advanced" colapsadas com `›` |
| 5. Field label | sim | Etiqueta descritiva de um campo (Descriptive label for a field); ex.: "Label", "Variant", "Size", "Icon", "Full width" |
| 6. Value / input | sim | Controlo de entrada ou valor (Input control or value); ex.: input "Get Started", selects "Primary"/"Large", token "✦ Sparkles ×", toggle off |
| 7. Divider | não | Separação visual entre secções (Visual separation between sections); linha `#EEF2F7` |
| 8. Close / collapse action | sim | Fecha o painel ou colapsa uma secção (Close the panel or collapse a section); `×` no header, `˅/›` nas secções |

Elementos da secção "In context" (janela Design Studio com semáforo vermelho/amarelo/verde, título "Design Studio"):

- Barra de ferramentas do canvas: undo, copy, layout, grid, redo, `+`, zoom `100%`.
- Sidebar "Layers" com `+`: Page, Header, Hero Section, **Button selecionado** (destaque azul), Feature List, Footer; rail de ícones à esquerda.
- Canvas ponteado com botão "Get Started" (primary) selecionado com 8 handles de seleção.
- Inspector à direita: tabs Properties/Styles/Interactions; secção General com Label `Get Started`, Variant `Primary ▾`, Size `Large ▾`, Icon `✦ Sparkles ×`, Full width toggle desligado; secções colapsadas Layout, Appearance, Advanced.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different variants for different use cases", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Default | Inspector completo com tabs Properties/Styles e secções General/Layout/Appearance | Standard inspector with tabs and sections |
| Minimal | Inspector simplificado só com Properties/Styles e General/Layout/Appearance, sem terceira tab | Simplified layout for compact spaces |
| Tabs | Inspector com três tabs Properties/Styles/Meta e secções General/Layout/Appearance | Multiple tabs for organized content |
| Floating | Painel destacado (detached) só com ícones de ação no header e General/Appearance | Detached panel for flexible workflows |

### Tamanhos ("Sizes — Common sizes for different contexts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Compact | Painel estreito `320px` | `--inspector-width: 320px`; for sidebars |
| Default | Painel intermédio `360px` (destaque azul, "(default)") | `--inspector-width: 360px`; uso geral |
| Wide | Painel largo `440px` | `--inspector-width: 440px`; for complex forms |

## 4) Estados ("States — Key states for common scenarios", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Inspector neutro, secção General colapsada (`› General`) |
| Hover row | Linha "General" com fundo azul-claro de hover |
| Focus field | Input "Get Started" com anel de foco azul visível |
| Collapsed group | Inspector só com `› General` colapsado (conteúdo oculto) |
| Loading | Inspector comGPU skeletons cinzentos (linhas e blocos) a simular carregamento |
| Disabled | Inspector esmaecido (opacidade reduzida), texto "Properties" claro, sem interação |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click (tab Properties/Styles/Interactions/Meta) | Alterna a categoria de conteúdo com fade subtil (ver Motion: Tab switch); manter `aria-selected` e navegação por setas |
| Click (secção General/Layout/Appearance/Advanced) | Expande/colapsa com animação suave de altura (ver Motion: Collapse); chevron roda `›↔˅`; `aria-expanded` atualizado |
| Click (fechar `×`) | Fecha o painel com Slide out para a direita (inverso do Slide in); tecla `Esc` também fecha e devolve o foco ao canvas/seleção |
| Edição (input Label "Get Started") | Atualiza a propriedade em tempo real no canvas; Focus mostra anel accent; Enter confirma, Esc reverte/blur |
| Change (selects Variant/Size) | Abre dropdown (Primary, Large); seleção aplica-se imediatamente ao objeto selecionado |
| Remoção (token Icon `×`) | Remove o ícone "Sparkles" do botão inspecionado |
| Toggle (Full width) | Liga/desliga largura total; animação de deslizamento do thumb 100–150ms |
| Hover (linha de campo) | Fundo subtil de destaque na linha (estado Hover row) |
| Teclado Tab / Shift+Tab | Percorre header → tabs → secções → campos; foco sempre visível |
| Loading | Skeletons estáticos (sem ação); `aria-busy="true"` até o conteúdo chegar |

## 6) Motion ("Motion — Smooth and intentional interactions", 3 especificações do poster)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Slide in | **Slides in from the right with a smooth ease-out** (sem valor numérico no poster) | `--v-motion-normal: 160ms` ou `--v-motion-slow: 300ms` + `--v-ease-out` (`transform: translateX(100%) → 0`) |
| Collapse | **Sections expand and collapse smoothly** (sem valor numérico) | `--v-motion-normal: 160ms` + `--v-ease-out` (altura/opacidade da secção) |
| Tab switch | **Tabs transition with a subtle fade** (sem valor numérico) | `--v-motion-fast: 100ms` + `--v-ease-out` (`opacity`) |

Regras gerais: motion apenas em `transform`/`opacity` (e altura de secção com `grid-template-rows` ou `max-height`); saída usa `ease-in`; `prefers-reduced-motion: reduce` desativa slide/fade/colapso animado (mudança instantânea).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-inspector-panel {
  width: var(--v-inspector-width, 360px); // --inspector-width: 360px
  background: var(--v-color-surface, #ffffff);
  border-left: 1px solid var(--v-color-border, #e5e7eb);
  border-radius: var(--v-radius-lg, 16px);
  box-shadow: var(--v-shadow-lg);
  transition:
    transform var(--v-motion-normal) var(--v-ease-out),
    opacity var(--v-motion-fast) var(--v-ease-out);

  &--entering { transform: translateX(100%); }
  &--open { transform: translateX(0); }

  .v-inspector-panel__tabs { height: 40px; } // --inspector-tab-h
  .v-inspector-panel__section {
    border-top: 1px solid var(--v-color-divider, #eef2f7);
    transition: opacity var(--v-motion-normal) var(--v-ease-out);
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Built with accessibility in mind", 8 checks literais)

1. **ARIA role="complementary"** — o painel usa o landmark complementar (aside) com `aria-label="Inspector"`.
2. **Focusable interactive elements** — todos os controlos (tabs, secções, inputs, selects, toggles, fechar) aceitam foco.
3. **Keyboard navigation (Tab, Shift+Tab)** — navegação completa por teclado; tabs com setas `←/→`, secções com Enter/Space.
4. **Proper labels and form associations** — cada campo tem `<label for>` associado (Label, Variant, Size, Icon, Full width).
5. **Visible focus indicators** — anel de foco accent sempre visível via `:focus-visible`, nunca removido sem substituto.
6. **Supports screen readers** — mudanças de aba/secção/valor anunciadas (`aria-selected`, `aria-expanded`, `aria-live` onde aplicável).
7. **Sufficient color contrast** — texto `#0F172A` sobre `#FFFFFF` e muted `#64748B` dentro do mínimo WCAG AA.
8. **Esc key closes the panel** — `Esc` fecha o painel e devolve o foco ao elemento que o abriu / seleção do canvas.

## 8) data-test-ids sugeridos

- `v-inspector-panel` (root; `data-variant="default|minimal|tabs|floating"`, `data-size="compact|default|wide"`, `data-state`, `data-open`)
- `v-inspector-panel-header`
- `v-inspector-panel-close` (botão `×`)
- `v-inspector-panel-tabs`
- `v-inspector-panel-tab-{properties,styles,interactions,meta}`
- `v-inspector-panel-section-{general,layout,appearance,advanced}` (com `data-expanded`)
- `v-inspector-panel-field-label` (input "Get Started")
- `v-inspector-panel-field-variant` / `v-inspector-panel-field-size` (selects)
- `v-inspector-panel-field-icon` / `v-inspector-panel-field-icon-clear` (token `×`)
- `v-inspector-panel-field-full-width` (toggle)
- `v-inspector-panel-divider`
- `docs-inspector-variant-{default,minimal,tabs,floating}` (fileira de variantes)
- `docs-inspector-size-{compact,default,wide}` (fileira de tamanhos)
- `docs-inspector-state-{default,hover-row,focus-field,collapsed-group,loading,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--inspector-width` | `360px` |
| `--inspector-bg` | `#FFFFFF` |
| `--inspector-border` | `#E5E7EB` |
| `--inspector-tab-h` | `36px` (legível como ~36–40px no poster) |
| `--inspector-tab-active` | `accent` (tab ativa com sublinhado `#6366F1`) |
| `--inspector-radius` | `16px` |
| `--inspector-shadow` | `0 10px 30px rgba(0, 0, 0, 0.06)` |
| `--inspector-divider` | `#EEF2F7` |
| `--inspector-text` | `#0F172A` |
| `--inspector-muted` | `#64748B` |
| `--inspector-accent` | `#6366F1` |

No repo equivalem a `--v-inspector-width`, `--v-color-surface`, `--v-color-border`, `--v-radius-lg`, `--v-shadow-lg`, `--v-color-divider`, `--v-color-text`, `--v-color-text-muted`, `--v-color-primary`.

## Uso Vue (transcrição literal do card "Vue usage — A simple example to get you started")

```vue
<template>
  <VInspectorPanel v-model:open="showInspector">
    <template #header>
      <h2>Inspector</h2>
    </template>
    <template #default>
      <!-- Your inspector content -->
    </template>
  </VInspectorPanel>
</template>
```

**Pro tip (literal):** "Use the inspector panel to show context-aware settings based on the current selection. Combine it with tabs and collapsible sections to keep complex UIs organized and easy to navigate."
