# VFilterBar — DESIGN-SPEC (fonte: doc/Ui/guia_de_design_do_filter_bar.png + doc/Ui/guia_visual_do_filter_bar.png)

> Lote E, item 5. Guia de design (Components / Filter Bar, "Filter and find what matters") + Guia visual (Components / Table / Filter Bar, "Inline filtering controls for data views"). Divergências marcadas (Design) / (Visual).

## 1) Objetivo do componente

Conjunto de controles inline para buscar, filtrar e refinar data views: ajuda a estreitar conteúdo rapidamente com interface limpa, consistente e flexível. (Design) valores: Flexible (search, selects, date ranges, chips…), Composable (mix-and-match p/ qualquer caso), Clean & Consistent. (Visual) valores: Discoverable (filtros comuns fáceis de achar/entender), Flexible, Fast (estreita resultados em segundos). Hero (Design): "Project Tasks", search "Search tasks, owners, or keywords…", selects Status/All e Assignee/All, date range Jan 1 2026–Jan 31 2026, chips Design ×/High Priority ×/Alex Chen × + "Clear all", "Showing 243 of 1,284 results". Hero (Visual): search "Search products, orders, or anything…" com atalho ⌘K, pill "3 active", selects Status/All e Category/All, date range Jan 1 2024–Jan 31 2024, chips Active × (com dot verde)/Electronics ×/Jan 1–Jan 31 × + "Clear all" (com ícone refresh), "Showing 1,482 results". Anotações: "Combine search, filters and chips for powerful data views." / "Refine in seconds". Persistência via `v-model` (+ `:persist-in-url="true"` no Pro tip Visual; `v-model:search/filters/date-range`, `:results-count`, `:chips`, `@clear`/`@change`).

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomy numerada (6 partes, idênticas):

1. **Container** — barra que envolve todos os controles.
2. **Search input** — campo com ícone de lupa + placeholder ("Search…" / textos completos acima); no Visual com atalho ⌘K.
3. **Filter chip** — filtro ativo removível: label + × (ex.: Design/Marketing/+2; Active com dot verde/Draft; Electronics; Jan 1–Jan 31; High Priority; Alex Chen).
4. **Select control** — dropdown de filtro (Status/All, Category/All, Assignee/All) com chevron; label pequeno acima do valor no hero.
5. **Clear action** — "Clear all" (texto ou com ícone refresh) que limpa todos os filtros.
6. **Results count** — "243 results" / "Showing 243 of 1,284 results" / "Showing 1,482 results" / pill "3 active" / "2 active" (sticky).
- Extras: date-range picker com ícone de calendário; ícone de filtro/funil (Advanced); botão "+ Filter" (diagrama Motion Visual); badge "+2" (chips colapsados); título "Project Tasks"; Pro tips (Design: `v-model` + persist na URL p/ views compartilháveis/bookmarkable; Visual: sync com tabela + persist na URL); footer padrão.

## 3) Variantes e tamanhos visíveis

Variantes (4, mesmas nas duas):

| Variante | (Design) | (Visual) | Descrição |
|---|---|---|---|
| Basic filters | search + select + calendário | search + All | Controles essenciais |
| Chip filters | Design ×/Marketing ×/+2 | Active ×/Draft × + dropdown | Filtros ativos como chips removíveis |
| Advanced filters | search + select + calendário + funil | Status + Date range | Conjunto completo / múltiplos tipos |
| Sticky filter bar | search + "243 results" | search + "2 active" | Permanece visível ao rolar |

Tamanhos (3): Compact/SM 32px (dense), Default/MD 40px (recommended/default, everyday), Comfortable/LG 48px (touch-friendly).

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira States (6 células):

| Estado | Aparência |
|---|---|
| Default | Search neutro |
| Hover | Borda/fundo realçados |
| Focus | Anel de foco azul 2px (`--vf-focus-ring`) |
| Active filter | Chip ativo (fundo brand-soft, texto brand; Active com dot verde) |
| Loading | (Design) campo com spinner/placeholder à direita; (Visual) search com spinner azul | 
| Disabled | Search esmaecido (fundo `--vf-disabled-bg`), sem interação |

Pressed: sem célula (feedback no chip/botão). Tokens: `--vf-bg/surface/border/input-bg/primary/primary-hover/chip-bg/chip-text/text-primary/text-muted/focus-ring/disabled-bg` (Design); Visual acrescenta `--vf-text/success/warning/danger/chip-bg/chip-text` (cores de severidade dos chips).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Click**: selects abrem dropdown; chips removidos via ×; "Clear all" limpa tudo; "+ Filter" adiciona chip; date-range abre picker; Esc limpa (atalho documentado no Design).
- **Hover**: realce de borda/fundo nos inputs e chips.
- **Teclado**: ordem lógica de Tab; ⌘K foca a busca (Visual); Esc limpa; anúncios de filtros ativos ao screen reader.
- **Overlays**: dropdowns dos selects, date-range picker, menu de filtros avançados.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

- Chip add: "Fades in with a subtle scale (150ms)" (Design) / "Chip add animation" (Visual). Chip remove: "Fades out and scales down (150ms)" (Design) / "Chip remove animation" (Visual). Diagramas: Design ×→✓ Design ×; Marketing ×→× Marketing; Visual +Filter→Active ×; Active ×→Active(esmaecido).
- Cruzamento DESIGN.md: 150ms ≈ `--v-motion-normal: 160ms`; easing implícito ease-out → `--v-ease-out` (Visual explicita "150ms ease-out animation" para fade+scale); animar `opacity` + `transform: scale(.98–1.02)`; `prefers-reduced-motion` zera.

## 7) Acessibilidade observada

- Labels claros e descritivos; ordem lógica de Tab; indicadores de foco visíveis; anúncios de filtros ativos/mudanças ao screen reader; cor não é o único indicador (chips + texto; dot + label); atalhos de teclado (Esc p/ limpar; ⌘K p/ buscar); roles/atributos ARIA adequados; alto contraste e estados acessíveis; (Visual) funciona em light e dark mode.

## 8) data-test-ids sugeridos (lista)

- `filter-bar` (root; `--sticky` quando fixa), `filter-bar-search`, `filter-bar-select` (+ `--status/category/assignee`), `filter-bar-date-range`
- `filter-bar-chip` (+ `--design/marketing/active/electronics/...`), `filter-bar-chip-remove`, `filter-bar-overflow-count` (+2)
- `filter-bar-clear` (Clear all), `filter-bar-results-count`, `filter-bar-active-count` (pill "3 active")
