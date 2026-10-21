# VTreeNavigation — DESIGN-SPEC ✅ (fonte: doc/ui/VTreeNavigation.png)

> **Status:** ✅ Concluído e validado  
> **Data:** 2026-09-20  
> **Implementação:** `src/components/navigation/VTreeNavigation/`  
> **Harness:** `.val-harness/VTreeNavigation.html` (porta 8321)  
> **Testes:** `pnpm build` ok; `pnpm exec vitest run src/components/navigation/VTreeNavigation/_tests/VTreeNavigation.spec.ts` — 16/16; e2e harness — 7/7 (`pnpm harness` + Playwright)

> Lote E, item 4. Duas imagens fundidas; divergências marcadas com (Doc = documentação_de_tree_navigation) / (Pôster = pôster_do_sistema_tree_navigation).

## 1) Objetivo do componente

Explorador hierárquico expansível para dados aninhados: file systems, settings, documentação e qualquer conteúdo nested que precise de organização clara e navegação fácil. (Doc) subtítulo "Expandable hierarchical explorer", valores Structured (organiza informação complexa hierarquicamente), Nested (profundidade ilimitada), Navigable (exploração amigável a teclado e mouse). (Pôster) subtítulo "Explore hierarchical content with ease", valores Structured, Flexible (ícones, labels, contagens e ações custom), Accessible (navegação por teclado + screen reader). Hero (Doc): árvore Workspace(12) > Projects(8) > vueui-nova(3, selecionado) / marketing(2) / design-system(3), Resources, Documentation (Getting Started, Components 24, Guides 12, Changelog 5), Trash(4); anotação "Deep structure, clear path". Hero (Pôster): janela com árvore Acme Workspace(12) > Projects(5) > VueUI Nova(8) > src(24)/docs(12)/Getting Started.md/Components.md(selecionado)/Guides.md/API Reference.md/tests(8)/package.json/README.md/Design System(4)/Archived(3) + painel de preview "Components.md" (Markdown Document, 2.4 KB, Modified 2 days ago, descrição, botão primário "Open in Editor" + `…`, metadados Location /docs/Components.md, Modified Jan 15 2026, Author Alex Chen, Tags docs/components/guide); anotação "Navigate complex content with clarity". Uso: `v-model:active` + `:items` + `:multiple`, lazy via `:load-children lazy` / `:load-children="loadChildren"`, `:expanded-keys`, `@select`, `show-counts`, `icon-field`.

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomy numerada (5 partes, rótulos convergem):

1. **Toggle** — chevron `>` (colapsado, filhos ocultos) / `v` (expandido, filhos visíveis); expande/colapsa o nó.
2. **Node icon** — ícone do tipo: pasta amarela (folders), documento (arquivos .md, cinza; selecionado azul), lixeira, engrenagem (settings), casa/estrela (menu simple tree: Home/About/Services/Contact), mapa/doc (documentation tree). Customizável via `icon-field`.
3. **Label** — texto do nó (ex.: Projects, Components.md, Appearance, Getting Started).
4. **Active item / Count badge** — (Doc) "Active item": destaque do item selecionado (fundo azul-claro); (Pôster) "Count badge (optional)": pill com número de filhos (12, 8, 24, 5, 4, 3…). Ambos coexistem: linha selecionada + badge à direita.
5. **Children (nested nodes)** — nós aninhados indentados (guides de indentação/conectores visíveis no diagrama Motion do Pôster), recuo por nível (`--v-tree-indent-size`).
- Extras: painel de preview do Pôster (título, tipo/tamanho/data, descrição, Open in Editor, metadados, tags); bullets das variantes; header/breadcrumb ("Navigation / Tree Navigation" no Doc; "Components / Tree Navigation" no Pôster); blocos Motion/Design tokens/Accessibility/Vue usage/Pro tip (Doc: `use lazy loading for large trees`; Pôster: `Use icons, counts, and lazy loading to handle large trees`).

## 3) Variantes e tamanhos visíveis

Variantes (4, mesmas nas duas, exemplos):

| Variante | Exemplo | Uso |
|---|---|---|
| File tree | (Doc) Documents > Photos/Work + Notes.txt; (Pôster) My Files > Documents/Images/Videos | File explorers, content management |
| Settings tree | Appearance/Notifications/Privacy/Advanced (engrenagens); Pôster: General/Appearance/Notifications/Security | App settings e preferências |
| Documentation tree | Introduction/Components/Guides/API Reference; Pôster: Getting Started/Components/Composables/Examples | Docs, guias, knowledge bases |
| Simple tree | Menu Home/About/Services/Contact (casa/estrelas); Pôster: Categories 1-3 | Árvore mínima p/ dados hierárquicos básicos |

Tamanhos (3): Compact/SM (Pôster: 28px item height, dense layouts), Default/MD default (Pôster: 36px, everyday use), Spacious/LG (Pôster: 44px, touch interfaces).

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira States (6 células, idênticas):

| Estado | Aparência |
|---|---|
| Collapsed | Chevron `>`, filhos ocultos |
| Expanded | Chevron `v`, filhos visíveis |
| Hover node | Fundo `--v-tree-item-hover-bg` |
| Focus node | Anel de foco 2px (`--v-tree-focus-ring` / focus indicator) |
| Selected node | Fundo `--v-tree-item-selected-bg`/`-active-bg`, texto brand |
| Disabled | Texto/ícone esmaecidos (`--v-tree-item-disabled-opacity`), não interativo |

Pressed: sem célula própria (feedback = hover/active). Loading: sem célula, mas lazy loading suportado (carregamento assíncrono de filhos, Pro tip).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Click**: toggle expande/colapsa com animação de altura; click no label seleciona (single ou multiple via `:multiple="false"`); chevron e linha ambos acionáveis.
- **Hover**: destaque de fundo da linha.
- **Teclado**: navegação completa — Arrow keys (cima/baixo entre nós, direita expande, esquerda colapsa), Enter/Space seleciona/expande; Tab move foco; foco visível gerenciado; anuncia estado expand/collapse e níveis aninhados.
- **Overlays**: nenhum próprio; painel de preview do Pôster é composição de página (botão "Open in Editor", menu `…`).

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

- (Doc): "Expands and collapses with a **200ms ease-out** animation." (Pôster): "Expand — Smooth height animation (**200ms, ease-out**)" / "Collapse — Smooth collapse animation (**200ms, ease-in**)", com diagramas de indentação/conectores.
- Cruzamento DESIGN.md: 200ms dentro da faixa 100–300ms (entre `--v-motion-normal: 160ms` e `--v-motion-slow: 300ms`); expand → `--v-ease-out`, collapse → `--v-ease-in` (`--v-tree-transition` mapeia para esses tokens); animar `height`/`transform`/`opacity` dos filhos; `prefers-reduced-motion` zera.

## 7) Acessibilidade observada

- ARIA compliant: `role="tree"` no container (Pôster: 'Uses role="tree" container'), `role="treeitem"` nos nós, `role="group"` (Doc); `aria-expanded` suportado/anunciado (Pôster: 'Supports aria-expanded state / Announces expand/collapse state').
- Navegação por teclado (Arrow keys, Enter, Space; Tab); gerenciamento de foco + foco visível; screen-reader friendly incl. níveis aninhados; suporta nós disabled; seleção single e multiple; segue WAI-ARIA tree view best practices.

## 8) data-test-ids sugeridos (lista)

- `tree-navigation` (root), `tree-node` (+ `--workspace`, `--projects`, `--vueui-nova`, `--components-md`…), `tree-node-toggle`, `tree-node-icon`, `tree-node-label`, `tree-node-count` (badge), `tree-node-children` (grupo aninhado)
- `tree-preview` (painel de preview, quando composto), `tree-preview-open-editor`
