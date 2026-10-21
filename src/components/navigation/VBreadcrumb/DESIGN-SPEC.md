# VBreadcrumb — DESIGN-SPEC ✅ (fonte: doc/ui/VBreadcrumb.png)

> **Status:** ✅ Concluído e validado  
> **Data:** 2026-09-20  
> **Testes:** `pnpm build` ok; `pnpm exec vitest run src/components/navigation/VBreadcrumb/_tests/VBreadcrumb.spec.ts`; e2e via `.val-harness/VBreadcrumb.html` (`pnpm harness` + Playwright).

## 1) Objetivo do componente

Trilha de navegação hierárquica ("Hierarchical navigation trail"): mostra onde
o usuário está dentro de uma estrutura, permite voltar rápido aos níveis
anteriores e melhora a navegação em apps complexos. Três atributos:
**Navigable** ("Click to move to previous levels"), **Compact**
("Takes minimal space, fits any layout"), **Clear**
("Shows the current location at a glance"). Anotação: "Keep users oriented".
Cabeçalho: "Components / Breadcrumb", logo "VueUI Nova — Build beautiful,
faster."

## 2) Anatomia (partes, cada elemento visível na imagem)

Exemplos no topo (4 cards empilhados):

- **Basic breadcrumb**: ícone home + "Home" > "Projects" > "Marketing Site" >
  **"Assets"** (atual em negrito).
- **With icons**: cada nível com ícone (home, pasta Projects, doc
  Marketing Site) + "Assets" atual.
- **Compact style**: só textos, sem ícone home.
- **With overflow**: home + "Home" > "…" (elipse) > "Marketing Site" > "Assets".

Anatomy numerada ("Key parts of the breadcrumb component"):

1. **Home icon (optional)** — ícone de casa antes do primeiro item.
2. **Breadcrumb item (link)** — nível clicável (ex. "Projects").
3. **Separator** — chevron ">" entre itens (customizável via slot).
4. **Current page (non-clickable)** — último item em destaque, sem link
   (`aria-current="page"`).

Vue usage: `<VBreadcrumb :items="items" />` com
`items = [{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' },
{ label: 'Marketing Site', to: '/projects/marketing' },
{ label: 'Assets' }] // current page (no link)`.
Pro tip: "You can also use icon slots and custom separators" —
`<VBreadcrumb><template #separator><span>/</span></template></VBreadcrumb>`.

## 3) Variantes e tamanhos visíveis

Variantes ("Different styles for different use cases", 4 cards):

- **Default** — home + textos + atual em negrito.
- **Compact** — só textos, sem ícones.
- **With icons** — ícones por item; item longo trunca ("Marketing …").
- **Overflow** — níveis do meio colapsados em "…".

Tamanhos ("Three sizes for different densities", 3 pills):

- **SM** · **MD (default)** (pill destacada azul) · **LG** — mesma estrutura,
  variando `font-size` e `gap` (tokens `--v-breadcrumb-font-size`,
  `--v-breadcrumb-gap`).

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira States (6 pills "Home > Projects"):

- **Default** — texto muted, fundo transparente.
- **Hover** — fundo tintado (pill cinza-azulada) + cursor pointer; cursor
  customizado visível no pôster.
- **Focus** — anel/borda azul 2px + texto azul (`:focus-visible`).
- **Pressed** — fundo mais escuro (pill cinza).
- **Current page** — texto azul (link ativo), não-clicável.
- **Disabled** — texto apagado (opacidade reduzida), sem interação.
- Sem estado `loading` (navegação é síncrona; skeleton não se aplica).

## 5) Micro-interações (click, hover, teclado, overlays)

- Click num item: navega ao nível (router `to`).
- Hover: fundo tintado imediato no item.
- Teclado: Tab entre links, Enter ativa; foco sempre visível.
- Overflow "…": click abre menu dropdown com os níveis ocultos (diagrama
  Motion mostra chevron abrindo lista com 3 linhas + seta) e fecha ao escolher.
- Separador customizável via `#separator` (chevron default, "/" no exemplo).
- Ícones via slots; truncamento com ellipsis + `title`/tooltip do label cheio.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Painel Motion: "Smooth and subtle by default." / "Fades and slides with
150ms ease-out." Diagrama: pill ">" → abre dropdown com linhas → volta a ">".

- Abertura do overflow: fade (`0–100%`) + slide (4–24px) em **150ms ease-out**
  → mapear para `var(--v-motion-normal) (160ms)` + `var(--v-ease-out)`
  (150ms não existe como token; usar `normal` e documentar).
- Hover/focus dos itens: transição de `background-color`/`color` em
  `var(--v-motion-fast) (100ms) var(--v-ease-out)`.
- Pressed: `transform: scale(0.98)` (faixa 0.98–1.02 do DESIGN.md §10).
- `prefers-reduced-motion`: sem fade/slide (abertura instantânea).

## 7) Acessibilidade observada

Painel Accessibility (7 checks):

- ARIA navigation landmark (aria-label) — `<nav aria-label="Breadcrumb">`.
- Clear focus indicator.
- Keyboard navigation (Tab, Enter).
- Uses semantic `<nav>` element (lista `ol/li` dentro).
- Current page marked with `aria-current="page"`.
- Screen reader friendly.
- "Works in both single and multiple mode" (1 nível ou vários).
- Foco 2px `--v-color-focus`; contraste AA nos textos muted.

## 8) data-test-ids sugeridos (lista)

- `breadcrumb` (nav root)
- `breadcrumb-list`
- `breadcrumb-item` / `breadcrumb-item-{index}`
- `breadcrumb-link`
- `breadcrumb-current` (último item, `aria-current="page"`)
- `breadcrumb-separator`
- `breadcrumb-home-icon`
- `breadcrumb-overflow` (botão "…")
- `breadcrumb-overflow-menu`
- `breadcrumb-state-hover` / `breadcrumb-state-focus` /
  `breadcrumb-state-disabled`
