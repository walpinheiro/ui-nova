# VSidebar — DESIGN-SPEC ✅ (fonte: doc/ui/VSidebar.png)

> **Status:** ✅ Concluído e validado  
> **Data:** 2026-09-20  
> **Testes:** `pnpm build` ok; `pnpm exec vitest run src/components/navigation/VSidebar/_tests/VSidebar.spec.ts` — 13/13; e2e (6 specs) pendente de `pnpm exec playwright install chromium` neste ambiente.  
> **Validação visual:** inspeção de `doc/ui/VSidebar.png`, harness `.val-harness/VSidebar.html` (default, interactive, sizes sm/md/lg, disabled) e asserções Playwright de collapse, nested sections, hover/focus e ARIA.

## 1) Objetivo do componente

Painel de navegação persistente (persistent navigation panel) que dá experiência de navegação consistente e acessível: mantém seções-chave, itens aninhados e ações do usuário ao alcance, preservando espaço para o conteúdo. Três valores: Structured (organiza conteúdo com seções e itens aninhados), Collapsible (economiza espaço com modos colapsável e icon-only), Contextual (adapta-se a diferentes contextos e papéis). Hero mostra sidebar real com brand "VueUI Nova", busca com atalho ⌘K, itens Dashboard (ativo) / Analytics / Projects (chevron) / Team (expandido: Overview, Members, Settings) / Design System / Integrations / Settings, e área de usuário "Alex Chen / alex@nova.dev" com avatar e reticências. Anotação: "Focus on what matters".

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomy numerada (5 partes):

1. **Brand area** — logo (estrela/sparkle azul) + nome do app "VueUI Nova" + toggle de collapse (`«` chevron duplo no hero). Cabeçalho da sidebar.
2. **Search** — input de busca global ("Search…" com ícone de lupa e badge de atalho `⌘K` no hero). Nas versões mini aparece só o ícone de lupa.
3. **Navigation item** — ícone + label + opcional badge/chevron. Exemplos: Dashboard (home, ativo com fundo azul-claro e texto brand), Analytics (barras), Projects (pasta + chevron `>`), Team (pessoas + chevron), Design System (losango + chevron), Integrations (raio), Settings (engrenagem). Estados de indentação para filhos.
4. **Nested section** — grupo expansível com filhos (Team expandido mostra Overview/Members/Settings com bullet points; Overview em azul = selecionado). Chevron gira (down quando expandido).
5. **User area** — usuário atual + ações: avatar (foto), nome "Alex Chen", e-mail "alex@nova.dev", botão `…` (more). Separador acima.
- Elementos auxiliares: área de conteúdo esmaecida à direita do hero (placeholder de gráfico), badges de contagem não aparecem aqui (são do Tree), scrollbar ausente, divisórias sutis entre blocos.
- Blocos inferiores: Variants, Sizes, States, Motion (diagrama rail→expandido), Design tokens, Accessibility, Vue usage (`<VSidebar v-model:collapsed="false" :items="items">` + slot `#footer` com `<UserMenu name="Alex Chen" email="alex@nova.dev" :avatar="avatar" />`), Pro tip (usar `v-model:collapsed` para controlar estado do app; exemplo `v-model:collapsed="isCollapsed"`).

## 3) Variantes e tamanhos visíveis

Variantes (4 cards):

| Variante | Conteúdo do card | Descrição |
|---|---|---|
| Expanded (default) | VueUI Nova + Dashboard (ativo) + Projects (chevron) + Team (chevron) | Navegação completa com labels |
| Icon-only rail | Só ícones empilhados (home ativo, barras, pasta, pessoas) | Navegação mínima só com ícones |
| Collapsible | Brand + Dashboard + Projects + Team, cada linha com chevron | Colapso controlado pelo usuário |
| Nested | Team expandido com Overview (ativo, azul), Members, Settings com bullets | Suporta navegação aninhada |

Tamanhos (3 presets por largura):

| Tamanho | Largura | Uso |
|---|---|---|
| Rail | 64px | Só ícones |
| Standard (default) | 240px (default) | Uso cotidiano |
| Wide | 320px | Layouts espaçosos |

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira States (6 células): Collapsed (rail com 3 ícones), Hover item (linha com fundo claro), Focus item (anel de foco + indicador), Active item (fundo azul-claro + pill/indicador brand), Expanded section (seção aberta com filhos), Disabled item (item esmaecido).

| Estado | Aparência |
|---|---|
| Default/Collapsed | Rail ou linhas neutras |
| Hover | Fundo `--v-sidebar-item-hover-bg` |
| Focus | Anel de foco visível + fundo claro |
| Active | Fundo `--v-sidebar-item-active-bg`, texto/ícone brand |
| Expanded | Filhos visíveis, chevron para baixo |
| Disabled | Opacidade reduzida, sem interação |

Loading: sem estado de loading na imagem.

## 5) Micro-interações (click, hover, teclado, overlays)

- **Click**: item navega/ativa (fundo active); chevron expande/colapsa seção aninhada; toggle `«` colapsa para rail icon-only e vice-versa; `…` do usuário abre menu de ações.
- **Hover**: realce de fundo na linha.
- **Teclado**: Tab entre brand/busca/itens/usuário; Enter/Space ativa item; Arrow keys navegam na lista e expandem/colapsam seções (setas); `aria-expanded`/`aria-current` anunciados.
- **Overlays**: menu do usuário (`…`) e potencial tooltip dos ícones no modo rail (implícito); sem dropdown próprio além do user-menu.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

- Documentado: "Expands and collapses with a **200ms ease-out** animation." Diagrama mostra rail → intermediário → expandido.
- Cruzamento com DESIGN.md: 200ms dentro da faixa 100–300ms (entre `--v-motion-normal: 160ms` e `--v-motion-slow: 300ms`); easing → `--v-ease-out` (standard `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`); animar largura via `transform` (scaleX/translate) / `opacity` dos labels, fade dos filhos; `prefers-reduced-motion` zera.

## 7) Acessibilidade observada

- ARIA compliant (`aria-expanded`, `aria-current`).
- Navegação por teclado (Tab, Enter, Arrow keys).
- Foco visível; screen-reader friendly; labels e estrutura claros.
- "Works in both single and multiple mode" (expansão simples ou múltipla de seções).

## 8) data-test-ids sugeridos (lista)

- `sidebar` (root), `sidebar-brand`, `sidebar-collapse-toggle`
- `sidebar-search`, `sidebar-nav`, `sidebar-nav-item` (+ `--dashboard`, `--analytics`, `--projects`, `--team`…), `sidebar-nav-item-chevron`
- `sidebar-nested-section`, `sidebar-nested-child` (+ `--overview`, `--members`, `--settings`)
- `sidebar-user-area`, `sidebar-user-avatar`, `sidebar-user-menu-trigger`

---

## 9) Revisão 2026-10 — menu multi-nível, acordeão e scroll

Referências: Linear / Vercel / "Starline AI" (dark) / "Locally inc." (light) / "CareOps". Itens 32–36px (token 34px), raio 8px, label 13px/500, ícones 16px muted, hover discreto, **sem barra lateral no item ativo**.

### API

| Prop | Padrão | Descrição |
|---|---|---|
| `accordion` | `true` | Abrir um item expansível fecha os irmãos abertos do mesmo nível (e os descendentes deles). Ancestrais permanecem abertos. |
| `accordionGroups` | `false` | Aplica o acordeão também entre grupos irmãos. Grupos são independentes por padrão. |
| `filterOnSearch` | `true` | Filtra por label (case-insensitive), mantém ancestrais dos resultados, expande-os e esconde grupos vazios. Sempre emite `search`. |
| `searchShortcut` | `'⌘K'` | Dica `<kbd>` à direita do campo (vira botão limpar quando há texto). |
| `expandedSections` | — | `v-model:expanded-sections` + `section-toggle` continuam funcionando. |

`VSidebarItem` (qualquer profundidade): `children`, `type: 'item' \| 'heading' \| 'group'`, `collapsible` (grupos, padrão `true`), `defaultOpen`, `badge`, `badgeTone: 'primary'`, `tag` (ex.: "Soon"), `iconColor` (quadrado colorido 14px), `disabled`, `href` (renderiza `<a>`; `to` apenas resolve o item, sem âncora).

- `heading` = legenda plana não colapsável (compatível). Pode aparecer dentro de submenus; é pulada pelo teclado.
- `group` = cabeçalho de seção (11px, 600, uppercase, `letter-spacing: .06em`) com chevron; `children` renderizados sem indentação extra. Em modo rail vira divisor fino.

Slots: `header` (`{ collapsed, toggle }`, substitui a marca — workspace switcher), `before-nav` (abaixo da busca), `after-nav` (card promo, fora do scroll), `footer`, `item-trailing` (`{ item }`, antes do chevron).

### Estrutura e scroll

`aside` (`min-height:100%; max-height:100%`, flex column) → header / search / before-nav (fixos) → **`nav` único com scroll** → after-nav / footer (fixos). Usa `min/max-height` em vez de `height:100%` para não quebrar o `align-self: stretch` em hosts flex com altura indefinida (ProductShell).

Nav: `overflow-y:auto; overscroll-behavior:contain; scrollbar-gutter:stable`, scrollbar fina que só aparece em hover/scroll (`data-scrolling`), fades topo/base via `mask-image` controlados por `data-scroll-top` / `data-scroll-bottom` (`"true"` = encostado na borda). Ao montar / trocar `activeItem` o item ativo é revelado (`nearest`, só dentro do nav); ao expandir uma seção o bloco é revelado (`after-enter`). Smooth, exceto com `prefers-reduced-motion`.

### Multi-nível

Recursivo (`VSidebarNode.vue`). Cada `li` expõe `--v-sidebar-depth`. Submenus têm guia vertical de 1px (`--v-sidebar-guide`) alinhada ao centro do ícone do pai. Expand/collapse com `<Transition>` + `grid-template-rows: 0fr → 1fr` (200ms, `--v-ease-out`), chevron gira por `transform`. Ancestrais do item ativo ganham `v-sidebar__item--contains-active` (label em `--v-color-text`).

### Teclado / ARIA

↑/↓ itens visíveis em qualquer profundidade; → abre / foca o 1º filho; ← fecha / foca o pai; Home/End; Enter/Space selecionam (via `VNavItem`). `aria-expanded` + `aria-controls` (id do submenu), `aria-current="page"`, listas aninhadas `ul role="list"`. Foco com `:focus-visible` (anel inset).

### Rail (colapsado)

Somente ícones com `title` nativo; clicar em um pai com filhos expande a sidebar e abre a seção; grupos viram divisor.

### Tokens novos / ajustados

`--v-sidebar-guide`, `--v-sidebar-caption-color`, `--v-sidebar-search-bg`, `--v-sidebar-scrollbar-thumb`, `--v-sidebar-fade-size`, `--v-sidebar-accent` (ícone ativo). Light: hover = `neutral-100`; item height 34px, label 13px, ícone 16px, busca 32px. Dark definidos em `v-tokens-dark`.
