# VToolbar — DESIGN-SPEC ✅ (fonte: doc/ui/VToolbar.png + doc/Ui/documentação_vueui_nova_componente_toolbar.png + doc/Ui/documentação_vueui_nova_toolbar.png)

> **Status:** ✅ Concluído e validado  
> **Data:** 2026-09-20  
> **Testes:** `pnpm build` ok; vitest **12/12**; e2e **6/6** (`.val-harness/VToolbar.html`).

> Lote E, item 3. Duas imagens fundidas; divergências marcadas com (Comp = componente_toolbar) / (Nav = nova_toolbar).

## 1) Objetivo do componente

Barra de ações para fluxos de produtividade: organiza ações relacionadas numa interface compacta, acessível e flexível, com acesso rápido a ferramentas, comandos e workflows. (Comp) valores: Efficient (ações-chave ao alcance), Flexible (ícones, labels, grupos, divisórias e mais), Consistent (experiência unificada). (Nav) valores: Efficient (ações comuns ao alcance), Contextual (adapta-se a tarefas e contextos), Lightweight (design limpo e mínimo). Hero (Comp): janela com toolbar (+ pasta, lixeira | undo, redo | B I U link | … + botão primário Save com ícone) e overflow aberto (Share, Download, Duplicate, Move to…); anotação "Common actions in one place." Hero (Nav): toolbar (doc, pasta | undo, redo | Tt com dropdown, link, imagem ativa, … + Save) com tooltip "Add image"; anotação "Actions in reach". Uso: `<Toolbar>` com `<ToolbarGroup>`, `<ToolbarButton icon label>`, `<ToolbarDivider>`, `<ToolbarSpacer>`, botão `variant="primary"` e overflow (`icon="more-h" :menu` / `icon="more-vertical"`).

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomy numerada (6 partes, idênticas nas duas; numeração 1-6):

1. **Container** — barra que envolve tudo (borda 1px, radius, fundo `--toolbar-bg`, sombra em floating).
2. **Group** — agrupamento lógico de ações relacionadas (ex.: +/pasta/lixeira; undo/redo; B/I/U).
3. **Divider** — separador vertical fino entre grupos (`--toolbar-divider`).
4. **Icon action** — botão só-ícone (ex.: +, pasta, lixeira, undo/redo, B/I/U/link, Tt, imagem, duplicar). Cor `--toolbar-icon`, fundo hover/active próprios.
5. **Primary action** — botão de destaque (Save azul sólido, ícone + label, `--toolbar-primary-bg/hover/text`).
6. **Overflow menu** — botão `…` que recolhe ações menos comuns; abre menu (Share, Download, Duplicate, Move to… no Comp).
- Extras visíveis: window-chrome (dots vermelho/amarelo/verde) no hero Comp; tooltip "Add image" (Nav); formatações B/I/U, listas e alinhamento no Editor; ícone de link/corrente; "Tt" com chevron (tamanho de texto); texto manuscrito "A cleaner, faster way to work." (Comp); Pro tip ("Group related actions for better clarity" / agrupar + colapsar em overflow; ações mais importantes como botão primário); footer padrão VueUI Nova.

## 3) Variantes e tamanhos visíveis

Variantes (4, nas duas imagens):

| Variante | (Comp) exemplo | (Nav) exemplo | Descrição |
|---|---|---|---|
| Default toolbar | + pasta lixeira \| undo redo \| … + Save | doc pasta \| undo redo \| … | Padrão com ícones e grupos |
| Compact toolbar | + pasta lixeira \| … | B I link \| … | Espaçamento mínimo p/ interfaces densas |
| Floating toolbar | T link imagem … | duplicar lixeira … | Elevada (sombra) p/ ações contextuais |
| Editor toolbar | B I U listas imagem | B I U listas … | Edição de conteúdo/formatação (rich text) |

Tamanhos: Small 32px (compacto), Medium 40px (default, uso cotidiano), Large 48px (touch-friendly); (Nav) SM/MD(default)/LG.

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira de 6 estados do botão-ícone (pasta/documento):

| Estado | Aparência |
|---|---|
| Default | Ícone neutro, fundo transparente |
| Hover | Fundo azul-claro (`--toolbar-icon-hover`) |
| Focus | Anel de foco azul 2px |
| Pressed | Fundo mais escuro, ícone pressionado ("While clicking" / leve scale down 100ms no Comp) |
| Active | Fundo/ícone brand (toggled on; ex. imagem ativa com contorno) |
| Disabled | Opacidade reduzida, sem interação (`--toolbar-icon-disabled`) |

Loading: sem estado de loading nas imagens.

## 5) Micro-interações (click, hover, teclado, overlays)

- **Click**: executa ação; botões toggle (B/I/U, imagem) alternam active; `…` abre/fecha overflow (Share/Download/Duplicate/Move to…); Save dispara ação primária.
- **Hover**: fundo do botão sofre fade + leve slide-up (Comp: "Fades and slides up (120ms)"); tooltip textual ("Add image").
- **Teclado**: Tab entre ações; Arrow keys navegam dentro dos grupos; Enter/Space ativam; grupos e divisórias anunciados corretamente.
- **Overlays**: menu overflow ancorado ao `…`; tooltip de ação; dropdown do "Tt" (Nav).

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

- (Comp): Hover "Fades and slides up (**120ms**)"; Active "Slight scale down (**100ms**)". (Nav): "Fades and slides in with a **150ms ease-out** animation."
- Cruzamento DESIGN.md: 100ms = `--v-motion-fast`; 120ms ≈ entre fast e `--v-motion-normal: 160ms`; 150ms ≈ normal; easing → `--v-ease-out` (standard `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`); animar `transform` (scale 0.98–1.02, slide 4–24px) + `opacity`; `prefers-reduced-motion` zera.

## 7) Acessibilidade observada

- Icon buttons têm `aria-labels` descritivos / nomes acessíveis.
- Navegação por teclado (Tab, Arrow keys; Nav: + Enter, Space).
- Indicadores de foco visíveis; grupos/divisórias anunciados adequadamente; funciona com screen readers (roles + labels; Nav: layouts horizontal e vertical, responsivo e contextual).
- Contraste suficiente; suporta ações icon-only e icon+label; segue WAI-ARIA.

## 8) data-test-ids sugeridos (lista)

- `toolbar` (root; variantes: `toolbar--default/compact/floating/editor`)
- `toolbar-group`, `toolbar-divider`, `toolbar-spacer`
- `toolbar-button` (+ `--new/open/delete/undo/redo/bold/italic/underline/link/image/save/more`)
- `toolbar-primary-action` (Save), `toolbar-overflow-trigger`, `toolbar-overflow-menu`, `toolbar-overflow-item` (+ `--share/download/duplicate/move-to`)
- `toolbar-tooltip` (ex. Add image)
