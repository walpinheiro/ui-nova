# VCommandPalette — DESIGN-SPEC ✅ (fonte: doc/ui/VCommandPalette.png)

> **Status:** ✅ Concluído e validado

## 1) Objetivo do componente

Superfície universal de busca de comandos ("A universal command search
surface"): achar conteúdo, rodar ações e navegar pelo app inteiro a partir de
um só lugar. Rápida, versátil e **keyboard-first** — para power users e uso
cotidiano. Atributos: **Searchable** ("Find pages, actions, and content
instantly"), **Fast** ("Optimized for speed and large datasets"),
**Keyboard-first** ("full keyboard support"). Anotações: "Find, navigate, and
do more — all from one place." / "Search. Jump. Do."

## 2) Anatomia (partes, cada elemento visível na imagem)

Hero (doc principal, painel grande):

- Input de busca: ícone lupa + placeholder "Search for anything…" + badge
  de atalho "⌘ K" à direita.
- Grupo **Recent**: "Open project settings" (engrenagem, destacado azul =
  selecionado, badge "⌘ ."), "Create a new document" (doc, "⌘ N"),
  "Go to dashboard" (home, "⌘ 1").
- Grupo **Navigation**: "Projects" (pasta, "⌘ P"), "Team" (pessoas, "⌘ T"),
  "Calendar" ("⌘ C"), "Analytics" (barras, "⌘ A").
- Grupo **Actions**: "Create a new project" ("+" , "⌘ ⇧ N"),
  "Invite teammates" (pessoa+, "⌘ ⇧ I").

Guia complementar (variação de conteúdo): Recent = "Open settings ⌘,",
"View documentation ⌘D", "Create new component ⌘N"; Navigation inclui
"Browse components ⌘2", "View analytics ⌘3"; Actions = "Toggle dark mode ⌘D",
"Open command palette ⌘K"; labels de grupo com ícone (relógio Recent,
grade Navigation, raio Actions).

Anatomy numerada (5 partes):

1. **Input** — campo de busca (lupa + placeholder + badge ⌘K).
2. **Group label** — título de seção/categoria ("Recent", "Navigation",
   "Actions").
3. **Result row** — um comando/opção (ícone + label + badge).
4. **Shortcut badge** — hint de atalho ("⌘ A", "⌘ ," etc.).
5. **Empty state** — "No results found / Try a different search term."
   (ícone doc + texto).

Vue usage (doc): `<VCommandPalette v-model="open"
:placeholder="'Search for anything…'" :items="'commands'"
@select="'onSelect'" />`. Pro tip: invocar com atalho global ⌘K
(or Ctrl+K): `<VCommandPalette v-model="open" />` + no app
`<VButton variant="ghost" size="sm">⌘ K</VButton>`.

## 3) Variantes e tamanhos visíveis

Variantes (4 cards, iguais nos dois pôsteres):

- **Global search** — busca no app inteiro (conteúdo, páginas, ações).
- **Quick actions** — foco em ações comuns e atalhos ("Type a command…").
- **File switcher** — alternar arquivos/docs/projetos ("Go to file…").
- **Settings palette** — acessar config/preferências ("Search settings…").
- Cada card tem ícone próprio (lupa, raio, doc, engrenagem) e placeholder
  diferente.

Tamanhos ("Different widths for different contexts"):

- **Compact / SM — 320px** — listas simples e ações rápidas.
- **Default / MD (default, destacado azul) — 480px** — uso mais comum.
- **Wide / LG — 640px** — resultados ricos com descrições.

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira States (6 miniaturas, 2 linhas no doc principal):

- **Closed** — "Not visible" (só o gatilho tracejado com badge "⌘ K").
- **Hover result** — mouse sobre a linha (fundo tintado; cursor visível).
- **Focus input** — "Input is active" (anel/borda azul no campo).
- **Selected result** — "Keyboard selection" (linha preenchida azul + texto
  branco + ícone em badge circular).
- **Loading** — "Searching…" (linhas skeleton + spinner circular).
- **Empty** — "No results found" ("No results" + ícone lupa/doc).
- Sem `disabled`/`pressed` próprios; ação destrutiva não aparece nos pôsteres.

## 5) Micro-interações (click, hover, teclado, overlays)

- Abrir: atalho global ⌘K / Ctrl+K, click no gatilho; overlay modal com
  backdrop; foco vai direto ao input.
- Digitar filtra resultados com highlight; setas ↑↓ movem seleção, Enter
  executa, Esc fecha (foco retorna ao gatilho).
- Hover com mouse move highlight junto (sincronizado com seleção de teclado).
- Click numa linha executa a ação e fecha.
- Loading durante busca assíncrona (spinner + skeleton).
- Empty quando zero resultados (mensagem + sugestão de outro termo).
- Anuncia contagem de resultados e empty state a leitores de tela (live region).

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Painel Motion (3 diagramas):

- **Scale and fade in** — "Opens with a smooth scale and fade (150ms)."
- **Smooth transitions** — "Navigate with fluid highlight transitions."
  (complemento: "Result highlight transitions in 100ms.")
- **Scale and fade out** — "Closes with a smooth scale and fade (150ms)."
- Complemento confirma: "Scales and fades in with a 150ms ease-out
  animation."

Mapeamento (DESIGN.md §10/§20):

- 150ms → `var(--v-motion-normal) (160ms)` (sem token de 150ms; documentar).
- Highlight 100ms → `var(--v-motion-fast) (100ms)`.
- Easing `ease-out` → `var(--v-ease-out)` (entrada);
  padrão `var(--v-ease-standard) cubic-bezier(.2,.8,.2,1)`.
- Escala dentro de 0.98–1.02; fade 0–100%.
- Só `transform`/`opacity` no painel e no highlight.
- `prefers-reduced-motion`: abre/fecha instantâneo, sem scale/fade.

## 7) Acessibilidade observada

Checklist unificada (doc + guia, 9–10 itens):

- `role="dialog"` com `aria-expanded` (guia: 'Uses role="dialog" with
  aria-expanded').
- Label acessível do input de busca.
- Navegação completa por teclado (Arrow keys, Enter, Escape).
- Enter seleciona, Escape fecha.
- Indicadores de foco claros/visíveis.
- Anuncia contagem de resultados e empty state (live regions / ARIA).
- Suporta regiões ARIA; semântica de grupos e labels descritivos.
- Alto contraste e `prefers-reduced-motion`.
- "Follows WAI-ARIA best practices" (doc) / "ARIA compliant
  (aria-expanded, role='dialog')" (guia).
- Grupo com `role="group"` + `aria-labelledby`; input `type="search"` ou
  `combobox` com `aria-controls`/`aria-activedescendant`.

## 8) data-test-ids sugeridos (lista)

- `command-palette` (dialog root)
- `command-palette-backdrop`
- `command-palette-input`
- `command-palette-trigger`
- `command-palette-group` / `command-palette-group-{name}`
- `command-palette-group-label`
- `command-palette-result` / `command-palette-result-{id}`
- `command-palette-result-selected`
- `command-palette-shortcut`
- `command-palette-state-loading`
- `command-palette-state-empty`
- `command-palette-size-compact` / `command-palette-size-default` /
  `command-palette-size-wide`
