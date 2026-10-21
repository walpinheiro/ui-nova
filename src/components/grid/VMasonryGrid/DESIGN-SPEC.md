# VMasonryGrid — DESIGN-SPEC (fonte: doc/Ui/documentação_vueui_nova_masonry_grid.png)

## 1) Objetivo do componente

Layout de conteúdo de altura variável ("masonry"): organiza itens de alturas
diferentes em colunas responsivas, sem espaços mortos ("gapless"), com fluxo
visual natural. Ideal para galerias, feeds de artigos, portfólios e qualquer
conteúdo onde alturas flexíveis criam uma navegação mais natural, estilo
"magazine-like". Pilares do pôster: **Dynamic** (adapta a qualquer altura),
**Balanced** (otimiza o fluxo de colunas automaticamente), **Visual**
(envolvente, tipo revista). Anotação manuscrita: "Natural visual flow".

## 2) Anatomia (partes, cada elemento visível na imagem)

Hero (topo direito, 8 cards em ~4 colunas de alturas variadas):

- Card 1 (alto, montanha/lago): mídia foto "Serene mountains", categoria
  "Nature" (Caption muted), ícone coração + contador "342".
- Card 2 (baixo, folha verde): "A calmer mind", "Lifestyle", coração "128".
- Card 3 (médio, vila costeira): "Coastal village", "Travel", coração "521".
- Card 4 (alto, cânion): "Into the canyon", "Adventure", coração "299".
- Card 5 (médio, sala/cadeira): "Minimal workspace", "Design", coração "416".
- Card 6 (médio, gato): "Curious friend", "Animals", coração "312".
- Card 7 (médio, palmeiras pôr-do-sol): "Golden hours", "Photography",
  coração "198".
- Card 8 (baixo, comida): "Good food", "Lifestyle", coração "267".
- Cada card = tile arredondado (surface #FFFFFF, sombra `md`), mídia no topo
  com radius interno, bloco de conteúdo embaixo (título Medium 14/600,
  categoria Caption 11 muted, linha de metadados com coração).

Anatomy numerada (1–5) no pôster:

1. **Column** — container de coluna responsiva (empilha tiles verticalmente).
2. **Tile** — item individual de conteúdo (card).
3. **Gap** — espaçamento entre itens (seta vertical dupla; exemplo `:gap="24"`).
4. **Media** — imagem, vídeo ou outra mídia (topo do tile).
5. **Content** — título, descrição e metadados (bloco inferior do tile).

Exemplo Vue do pôster: `<MasonryGrid :cols="3" :gap="24">` +
`<MasonryItem v-for="item in items" :key="item.id">` com
`<img :src="item.image" :alt="item.title">` dentro de `div class="p-4"`,
`<h3 class="font-medium">`, `<p class="text-sm text-gray-500">`.
Pro tip: `:cols="{ xs: 2, md: 3, lg: 4 }"`.

## 3) Variantes e tamanhos visíveis

Variantes (4, cada uma com 3–4 thumbnails ilustrativos + subtítulo):

- **Image-first** — "Visual content focus": grade só de fotos (montanhas).
- **Content-first** — "Text-driven layout": linhas de texto + imagens pequenas.
- **Mixed media** — "Images, text and more": fotos + blocos de texto + faixa.
- **Magazine layout** — "Editorial style with featured items": 1 item grande
  em destaque + itens pequenos ao lado.

Colunas (seletor de densidade, 3-col default destacado em azul):

- **2-col** — "2 columns" (ícone 2 barras).
- **3-col (default)** — "3 columns" (ícone 3 barras, pill azul).
- **4-col** — "4 columns" (ícone 4 barras).
- Responsivo por breakpoint: `xs: 2, md: 3, lg: 4` (ver breakpoints DESIGN.md:
  xs <640, md ≥768, lg ≥1024).

Não há prop `size` SM/MD/LG; densidade = nº de colunas + `gap` (24px =
`--v-space-6`, consistente com grid 12 col / gutter 24 do DESIGN.md §13).

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira States (6 miniaturas):

- **Default** — tile em repouso, sem overlay.
- **Hover** — leve escurecimento/zoom da mídia (overlay sutil).
- **Focus** — anel azul 2px ao redor do tile (`:focus-visible`,
  `--v-color-focus #6366F1`).
- **Selected** — mesmo anel + selo check azul no canto superior direito do tile.
- **Loading** — esqueleto cinza (skeleton tile) + spinner circular azul.
- **Empty** — caixa tracejada com ícone de imagem + texto "No items yet".
- Não há estado `disabled`/`pressed` típico (grid é layout; pressed aplica-se
  aos itens clicáveis internos).

## 5) Micro-interações (click, hover, teclado, overlays)

- Hover no tile: elevação/zoom sutil da mídia (só `transform`/`opacity`).
- Click: abre detalhe/seleciona item (estado Selected com check).
- Teclado: Tab entre tiles interativos, setas (Tab, Arrow keys — ver
  Acessibilidade); Enter ativa; anel de foco visível.
- Loading: skeleton + spinner enquanto o conteúdo carrega.
- Empty: placeholder tracejado não-interativo.
- Reflow: ao filtrar/adicionar/remover itens, colunas se reequilibram com
  transição suave (sem salto).
- Likes (coração + contador) são metadados ilustrativos do card.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Pôster: "Staggered reveal and smooth reflow when content changes."
(diagrama 3 estágios de blocos se reorganizando).

- **Staggered reveal**: entrada dos tiles em cascata — fade (`opacity` 0→100%)
  + slide pequeno (4–24px, token de slide do DESIGN.md §10).
  Mapear: `opacity var(--v-motion-normal) var(--v-ease-out)` +
  `transform var(--v-motion-normal) var(--v-ease-standard)`, com
  `transition-delay` incremental por índice (ex. `i * 30ms`, teto 300ms).
- **Reflow**: reorganização das colunas com transição de `transform`
  `var(--v-motion-normal) var(--v-ease-standard)` (~160ms).
- Hover do tile: `var(--v-motion-fast) (100ms) var(--v-ease-out)`.
- Escala de hover dentro de 0.98–1.02 (DESIGN.md §10).
- `prefers-reduced-motion: reduce` → sem stagger, aparição instantânea
  (tokens de motion zerados).
- Nunca animar `column-count/width/height` (propriedades caras); só
  `transform`/`opacity`.

## 7) Acessibilidade observada

Checklist do pôster (7 itens):

- Suporta navegação por teclado (Tab, Arrow keys).
- Alt text significativo para imagens (`:alt="item.title"`).
- Funciona com leitores de tela.
- Mantém ordem lógica do documento (DOM = ordem de leitura, não ordem visual).
- Indicadores de foco nos itens interativos.
- ARIA roles e labels.
- Responsivo e independente de conteúdo.
- Implicação: tiles focáveis com `tabindex`/role adequada, `aria-label`
  descritivo, foco nunca removido via CSS, respeitar `prefers-reduced-motion`.

## 8) data-test-ids sugeridos (lista)

- `masonry-grid` (root)
- `masonry-column` / `masonry-column-{index}`
- `masonry-tile` / `masonry-tile-{id}`
- `masonry-tile-media`
- `masonry-tile-title`
- `masonry-tile-meta`
- `masonry-like` / `masonry-like-count`
- `masonry-columns-2` / `masonry-columns-3` / `masonry-columns-4`
- `masonry-state-loading` / `masonry-skeleton`
- `masonry-state-empty`
- `masonry-tile-selected`
