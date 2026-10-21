# VSearchField — DESIGN-SPEC (fonte: doc/Ui/especificação_do_search_field_vueui_nova.png)

## 1) Objetivo do componente

`VSearchField` é o campo de **query and command entry**: ajuda o usuário a encontrar conteúdo, rodar comandos e navegar pelo produto. Texto guia: "Search fields help users find content, run commands, and navigate your product. Clear, consistent, and expressive search for every context."
Pilares: **Flexible** (search, filter or run commands), **Accessible** (built for everyone), **Modern** (refined, minimal, ready for the future).
Hero: "SEARCH, EVERYWHERE — Find. Filter. Do more. A search field for every moment." + nota "From search to action." Três sabores no hero: **Standard search** (simple and familiar — "Search products, docs, or anything..."), **Shortcut-enabled** (fast access anywhere — "Search or jump to..." + pill ⌘K), **Command search** (find or run anything — ícone `>_` + "Type a command or search..." + ⌘K).
API da doc: `<SearchField v-model="query" placeholder="Search products, docs, or anything..." :shortcut="true" :suggestions="suggestions">`; nota "supports search, commands, suggestions, loading, and more".

## 2) Anatomia (partes, cada elemento visível na imagem)

- **Container (background + border)** — campo pill/rounded com fundo e borda.
- **Search icon (16×16px)** — lupa à esquerda dentro do campo (ou `>_` de terminal na variante command).
- **Placeholder / value (text)** — texto fantasma ("Search for anything...") ou valor digitado ("Vue", "VueUI Nova").
- **Keyboard shortcut pill (semibold)** — pílula `⌘ K` à direita (dois segmentos: tecla ⌘ + letra K), fonte 12px semibold, altura 24px, padding-X 8px.
- **Clear action (16×16px)** — botão `×` para limpar o campo, visível quando há valor.
- **Focus ring (2px offset)** — anel de foco primário de 2px ao redor do container.
- **Suggestion panel (dropdown)** — painel suspenso com sugestões: linhas com ícone + rótulo + categoria à direita (ex.: `vue` → Search suggestion; `Vue components` → Documentation; `vue-router` → Package; `Vue CLI` → Command). Altura do item 40px, raio 12px, sombra `0 12px 32px rgba(16, 24, 64, 0.08)`.
- **Hit area (min 44×44px)** — área mínima de toque (aplica-se sobretudo ao botão clear).
- **Loading spinner** — indicador giratório no lugar do ícone quando pesquisando ("Searching...").

## 3) Variantes e tamanhos visíveis

Sabores (hero + API): Standard (só lupa + placeholder), Shortcut-enabled (com pill ⌘K), Command (prefixo `>_` + pill ⌘K).

Tamanhos (seção "Sizes"):

- **SM** — Height 32px.
- **MD (Default)** — Height 40px.
- **LG** — Height 48px.
- Tokens: padding-X 12px, padding-Y 10px, font-size 16px.

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Seção "States" (8 linhas):

- **Default** — "Resting state." placeholder cinza.
- **Hover** — "Background tint." leve escurecimento/tinta.
- **Focus** — "Focus ring visible." anel primário de 2px.
- **Typing** — "User typing input." valor parcial ("Vue|") com caret.
- **With Value** — "Input with value." valor completo ("VueUI Nova") + botão clear `×`.
- **Suggestions Open** — "With suggestions panel open." campo com valor + clear + dropdown de 4 sugestões.
- **Loading** — "Loading state." spinner + "Searching...".
- **Disabled** — "Not interactive." campo apagado/não interativo.
- Pressed discreto não é listado como linha própria (o press acontece no botão clear/itens); o motion cobre "Clear action".

## 5) Micro-interações (click, hover, teclado, overlays)

- **Digitar**: filtra e abre o painel de sugestões; caret visível.
- **Clear**: botão `×` limpa o valor com fade/scale de 100ms; ação anunciada (`aria-label="Clear search"`).
- **Atalho ⌘K**: foca/abre a busca de qualquer lugar (fast access anywhere).
- **Teclado**: Tab foca; Esc fecha o painel; setas navegam sugestões (`aria-activedescendant`); Enter executa.
- **Sugestões**: overlay `role="listbox"`; itens clicáveis com ícone, rótulo e categoria.
- **Comando**: prefixo `>_` indica modo comando (run anything).
- **Loading**: spinner em loop enquanto busca.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Valores literais da seção "Motion — Purposeful, responsive motion":

- **Hover**: "Tint + border darken. 120ms ease-out." → ~`--v-motion-fast`/`--v-motion-normal` + `--v-ease-out`.
- **Focus**: "Ring appear. 120ms ease-out." → idem, em `box-shadow`/`opacity`.
- **Suggestions panel**: "Fade + slide up. 160ms cubic-bezier (0.2, 0.8, 0.2, 1)." → exatamente `--v-motion-normal: 160ms` + `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`; slide dentro da faixa 4–24px do DESIGN.md §10; animar `transform` + `opacity`.
- **Clear action**: "Fade / scale. 100ms ease-out." → `--v-motion-fast: 100ms` + `--v-ease-out` (scale na faixa 0.98–1.02).
- **Loading**: "Spinner rotate. 180ms linear loop." → rotação linear contínua (token de spin; DESIGN.md cita `--v-motion-spin-duration`).
- `prefers-reduced-motion`: zerar transições e o loop do spinner.

## 7) Acessibilidade observada

Checklist literal ("Accessibility — Inclusive by design"):

- Minimum hit target — 44 × 44px.
- Labelled with accessible name — aria-label or `<label>`.
- Keyboard navigation — Tab, Esc to close.
- Clear action announced — aria-label="Clear search".
- Suggestions use listbox — role="listbox" + aria-activedescendant.
- Focus visible — Clear focus indicator.
- High contrast support — Validated (WCAG AA).
- Disabled state — aria-disabled="true".

## 8) data-test-ids sugeridos (lista)

- `v-searchfield` (root)
- `v-searchfield-input`
- `v-searchfield-icon`
- `v-searchfield-shortcut`
- `v-searchfield-clear`
- `v-searchfield-panel` (dropdown)
- `v-searchfield-option-{index}` (cada sugestão)
- `v-searchfield-loading`
- Referência: "Learn more at vueui.dev →".
