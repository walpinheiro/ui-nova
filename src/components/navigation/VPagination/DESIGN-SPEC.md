# VPagination — DESIGN-SPEC (fonte: doc/ui/VPagination.png)

> Status: ✅ Concluído e validado  
> Data: 2026-09-20  
> Testes: `pnpm build` — OK; `pnpm exec vitest run src/components/navigation/VPagination/_tests/VPagination.spec.ts` — 19/19; Playwright e2e — specs e harness prontos em `.val-harness/VPagination.html`.  
> Validação visual: inspeção de `doc/ui/VPagination.png`, harness `.val-harness/VPagination.html` e asserções Playwright para variantes (default/compact/ellipsis/page-size), tamanhos SM/MD/LG, estados (hover, focus-visible, disabled prev/next, loading), tokens `--v-*` e motion hover/pressed/active.

## 1) Objetivo do componente

Controle de navegação página a página ("Page-to-page navigation control"):
divide grandes volumes em páginas discretas, mantendo a experiência focada,
rápida e acessível. Hero: "PRIMARY ACTION — Help users move through content.
Simple, flexible pagination for any dataset." Atributos: **Clear**
("Obvious navigation and current state"), **Flexible** ("Multiple variants
and page sizes"), **Accessible** ("Keyboard friendly and screen reader
ready"). Anotação: "Small interactions. Big progress."

## 2) Anatomia (partes, cada elemento visível na imagem)

Hero (2 cards):

- Card 1 "Page 3 of 24": botões `<`, `1`, `2`, **`3`** (ativo azul), `4`,
  `5`, `…`, `24`, `>`.
- Card 2: "Compact navigation" `< Prev | Next >`; "Items per page" select
  "10 ⌄" + texto "Showing 21–30 of 240 results".

Anatomy ("The building blocks of a pagination control"):

- **Previous button (32×36px)** — seta "<".
- **Page item (32×36px)** — célula clicável.
- **Page number (text)** — número (ex. "2").
- **Active state (background + text)** — página atual (ex. "3" branca sobre
  azul).
- **Next button (32×36px)** — seta ">".

Código do pôster:

```vue
<VTagsPagination
  v-model="page"
  :total="240"
  :page-size="10"
  @update:page="onPageChange" />
```

API: `v-model` (página), `total`, `page-size`, evento `update:page`;
"Supports variants, page size, binding, and more." Link vueui.dev.

## 3) Variantes e tamanhos visíveis

Variantes ("Different styles for different contexts", 4):

- **Default** — "Numbered pages with prev/next" (`< 1 2 [3] 4 5 >`).
- **Compact** — "Previous and next only" (`< Prev | Next >`).
- **With ellipsis** — "For large page ranges"
  (`< 1 … 8 [9] 10 … 24 >`).
- **Page size** — "Select number of items per page" ("Items per page" + select
  "10 ⌄").

Tamanhos ("Consistent sizing"):

- **SM** — Height 28px · **MD (Default)** — Height 36px ·
  **LG** — Height 44px (mesma fileira `< 1 [2] 3 >`, só escala).
- Largura do item 32px (anatomy 32×36px no MD); gap horizontal 8px;
  radius 8px; borda 1px; fonte 14px (ver tokens).

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Tabela States (8 linhas × Previous/Page item/Next + Description):

- **Default** — "Normal appearance."
- **Hover** — "Pointer over element." (fundo tintado no `<`).
- **Focus** — "Keyboard focused." (anel azul no `<` e na página 3).
- **Active** — "Currently selected page." (página 3 azul + texto branco).
- **Pressed** — "Mouse/touch press." (fundo mais escuro no `<`).
- **Disabled (prev)** — "First page, previous disabled." (`<` apagado).
- **Disabled (next)** — "Last page, next disabled." (`>` apagado).
- **Overflow** — "Ellipsis for large ranges."
  (`< 1 … 8 [9] 10 … 24 >`, "…" não-clicável).
- Sem `loading` (troca de página pode usar skeleton da tabela, fora da imagem).

## 5) Micro-interações (click, hover, teclado, overlays)

- Click na página/Prev/Next troca a página (controlado por `v-model`).
- Hover: fade de fundo sutil; Pressed: leve scale down.
- "Active change": transição suave ao mover o destaque (ver §6).
- Select de page size (10 ⌄): abre dropdown 10/20/50…, recalcula total e
  texto "Showing 21–30 of 240 results", volta à página 1.
- Ellipsis "…" é indicador, não botão (pode virar input jump-to-page — fora
  da imagem, não especificar).
- Teclado: Tab entre controles, setas movem, Enter ativa; foco visível.
- Desabilitados usam atributo `disabled` (não focáveis).

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Faixa Motion ("Subtle, purposeful motion", 4 estágios `< 1 2 3 >`):

- **Default** — "Resting state."
- **Hover** — "Subtle background fade. 120ms ease-out."
- **Pressed** — "Slight scale down. 80ms ease-in."
- **Active change** — "Smooth transition. 200ms ease-in-out."

Mapeamento (DESIGN.md §10/§20):

- 120ms hover → `var(--v-motion-normal) (160ms)` (aproximação; sem token
  120ms) ou `fast` 100ms — documentar a escolha, nunca hardcodar.
- 80ms pressed → `var(--v-motion-fast) (100ms)` + `var(--v-ease-in)`;
  `transform: scale(<1)` dentro da faixa 0.98–1.02.
- 200ms active → `var(--v-motion-slow) (300ms)` é o mais próximo, ou compor
  com `normal`; easing `var(--v-ease-in-out)`.
- Hover usa `var(--v-ease-out)` (entrada).
- Só `transform`/`opacity` (+ `background-color` no hover).
- `prefers-reduced-motion`: troca de ativo instantânea.

## 7) Acessibilidade observada

Painel Accessibility (7 checks):

- Keyboard navigation — "Use Tab, Arrow keys, Enter".
- Screen reader support — "Proper labels and aria-current"
  (`aria-current="page"` no ativo, `aria-label` "Go to page N",
  "Previous/Next page").
- Focus visible — "Clear focus indicator" (anel 2px
  `solid var(--color-primary-400)`).
- Sufficient contrast — "Meets WCAG 2.1 AA (≥ 4.5:1)" (texto
  `var(--color-text-primary)`, ativo #FFFFFF sobre primary-600).
- Disabled semantics — "Uses disabled attribute".
- Responsive — "Works across screen sizes" (Compact em mobile).
- ARIA labels — 'aria-label and aria-current="page"'.
- Envolver em `<nav aria-label="Pagination">`; "…" com `aria-hidden`.

## 8) data-test-ids sugeridos (lista)

- `pagination` (nav root)
- `pagination-prev`
- `pagination-next`
- `pagination-page` / `pagination-page-{n}`
- `pagination-page-active`
- `pagination-ellipsis`
- `pagination-page-size` (select)
- `pagination-result-count` ("Showing 21–30 of 240 results")
- `pagination-variant-compact` / `pagination-variant-ellipsis`
- `pagination-size-sm` / `pagination-size-md` / `pagination-size-lg`
