# VTable — DESIGN-SPEC (fonte: doc/Ui/pôster_de_documentação_do_sortable_header.png + doc/Ui/documentação_do_componente_tabela.png)

> Lote E, item 7. Foco na tabela; SortableHeader aparece como subparte (spec própria em `table/VSortableHeader/DESIGN-SPEC.md`). Fontes: (Sort = pôster_do_sortable_header) e (Tab = documentação_do_componente_tabela). Divergências marcadas.

## 1) Objetivo do componente

Exibição de dados estruturados para ver, entender e operar: suporta sorting, seleção, inline actions e progressive disclosure num design limpo, consistente e flexível. (Tab) título "Table — Structured data display", subtítulo "Turn rows into insight. A powerful table for every workflow.", valores Clear & Scannable (organiza dados complexos com clareza), Flexible (sorting, selection, actions), Modern (refinado, minimalista). (Sort) mostra a tabela como contexto do header ordenável. Preview (Tab): toolbar (search "Search users…", Filter, "+ Add user"), colunas Name/Role/Status/Last Active/Actions, linhas Alex Carter/Product Designer/Active(há 2h), Priya Shah/Frontend Engineer/In Review(1d), Marcus Lee/Product Manager/Active(5h), Elena Garcia/UX Researcher/Away(2d), Daniel Kim/DevOps Engineer/Inactive(1sem), avatar + status badge + `…`. Anotação: "Data that drives decisions." Uso: `<VDataTable :columns :rows :loading v-model:selected @row-click>` (Tab); no Sort: `<VTable>` + `<VTableColumn sortable :sort-priority>`.

## 2) Anatomia (partes, cada elemento visível na imagem)

Mapa de anatomia (Tab) + hero do Sort:

- **Table toolbar** (search, filter, actions): search input, botão Filter com chevron, botão primário "+ Add user", menu `…`. (Sort não tem toolbar no hero, só a grade.)
- **Column header** (sort, filter): label + indicador de sort (`↕` neutro / `↑`/`↓` ativo + badge de prioridade "2" no Sort); no Tab: Name/Role/Status/Last Active/Actions com ícone `↕`/`◇`.
- **Checkbox (selection)**: coluna de checkboxes (header + linhas; Selected row marcada em azul).
- **Row (container)**: linha com hover/focus/selected/sorted/expanded; altura por densidade (32/40/48px).
- **Avatar (optional)**: foto circular antes do nome (Alex Carter, Priya Shah…; no Sort o hero não tem avatar, só texto).
- **Status badge (indicator)**: pill com dot — Active (verde), In Review (azul), Away (âmbar), Inactive (cinza); cores via `var(--color-success/warning/danger/neutral)`.
- **Row actions (more menu)**: botão `…` por linha.
- **Pagination (navigation)**: "Rows per page 10" + `< 1 2 3 … >`.
- **Cell data**: Role (Product Designer…), Last Active (2 hours ago…), Joined dates no Sort (Jan 12 2024…).
- Extras: Variants (Default/Bordered/Striped/Minimal), Sizes (Compact 32px/Default 40px/Comfortable 48px), States table (9 linhas), Design tokens table (header/row heights, paddings 16/12px, radius 8px, cores), Motion (Default→Hover→Focus→Select), Accessibility, Code (`<VDataTable>` + "Learn more at vueui.dev →"), "Small components. A brighter tomorrow."

## 3) Variantes e tamanhos visíveis

Variantes (Tab; Sort mostra só default + compacta):

| Variante | Descrição |
|---|---|
| Default | Grade limpa, sem bordas externas pesadas |
| Bordered | Com bordas de célula/tabela |
| Striped | Linhas zebradas |
| Minimal | Sem divisórias pesadas, máximo respiro |

Tamanhos: Compact (row 32px), Default (header 40px + row 40px), Comfortable (row 48px). Sort confirma SM/MD(default)/LG para o header.

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Tabela States (Tab, 9 linhas) + header states (Sort):

| Estado | Aparência |
|---|---|
| Default row | Aparência normal |
| Hover row | Fundo `var(--color-neutral-50)` / `--table-sort-hover-bg` no header |
| Focus row | Anel + contorno brand (Marcus Lee com borda azul) |
| Selected row | Fundo `var(--color-primary-50)`, checkbox azul (Elena Garcia) |
| Sorted column | Coluna com fundo/direção ativa (Team ↑ + badge 2 no Sort) |
| Expanded row | Linha com conteúdo expandido (Sophia Chen/Data Analyst + chevron) |
| Empty state | Ícone + "No results found" |
| Loading state | Skeleton rows (avatar/células em shimmer + `…`) |
| Disabled action | Ação de linha desabilitada (James Park/Growth Lead, `…` esmaecido) |
| Header: Ascending/Descending/Disabled | Setas brand / item esmaecido (Sort) |

## 5) Micro-interações (click, hover, teclado, overlays)

- **Click**: header alterna sort (ciclo asc→desc→off; Shift = multi-sort com prioridade); checkbox seleciona linha (single/multiple, `aria-selected`); `…` abre row actions; paginação navega; "Rows per page" muda densidade; Filter abre filtros; "+ Add user" cria registro; row-click expande/detalha.
- **Hover**: realce de linha/célula (fade 120ms).
- **Teclado**: Tab/Shift+Tab + arrows navegam headers/linhas/checkboxes/actions; Enter/Space ativa; sort anunciado via `aria-sort`; loading/empty anunciados.
- **Overlays**: menus de row actions, Filter, Rows per page, expansão de linha.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

- (Tab): "Default Instant. Hover Fade in 120ms ease-out. Focus Ring scale 120ms ease-out. Select Background fade 120ms ease-out." (Sort): seta "150ms ease-out".
- Cruzamento DESIGN.md: 120ms ≈ entre `--v-motion-fast: 100ms` e `--v-motion-normal: 160ms`; 150ms ≈ normal; easing → `--v-ease-out` (standard `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`); só `transform`/`opacity`/`background-fade`; skeleton com shimmer respeitando `prefers-reduced-motion`.

## 7) Acessibilidade observada

- Navegação por teclado (Tab, Shift+Tab, arrows); semântica de tabela (`table/thead/tbody/th/td`); elementos focáveis (headers, rows, checkboxes, actions); colunas ordenáveis anunciam `aria-sort`; seleção com `aria-selected`; contraste WCAG 2.1 AA (4.5:1); loading & empty states anunciados; todas as ações via teclado/tecnologia assistiva.

## 8) data-test-ids sugeridos (lista)

- `table` (root; `--bordered/striped/minimal/compact/comfortable`), `table-toolbar`, `table-search`, `table-filter`, `table-add-user`
- `table-header-row`, `table-header-cell` (+ `--name/role/status/last-active/actions`), `table-body`, `table-row` (+ `--selected/expanded/focused`), `table-cell`, `table-checkbox` (+ `--select-all`), `table-avatar`, `table-status-badge` (+ `--active/in-review/away/inactive`), `table-row-actions`, `table-pagination`, `table-rows-per-page`, `table-empty-state`, `table-loading-skeleton`
