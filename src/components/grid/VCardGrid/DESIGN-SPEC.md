# VCardGrid — DESIGN-SPEC (fonte: doc/Ui/documentação_vueui_nova_card_grid.png)

## 1) Objetivo do componente

`VCardGrid` é o **responsive card collection layout**: exibe conteúdo numa grade responsiva e flexível de cards. Texto guia: "Card Grid displays content in a responsive, flexible grid of cards. Perfect for dashboards, product listings, blogs, and any interface that needs to present multiple items in a clean, scannable way."
Pilares: **Modular** (flexible card content with consistent structure), **Adaptive** (responsive columns for any screen size), **Scannable** (visual hierarchy helps users find what matters).
Hero (nota "Cards with rhythm"): card de mídia grande "Explore the Alps" (foto de montanhas, badge "Featured" com coroa, ícone de imagem, avatar stack +3, botão seta) + cards menores: "Project Files" (24 items · Updated 2h ago, badge "Online" verde, seta), "Team Meeting" (Tomorrow, 10:00 AM, badge "Upcoming", avatares, seta), "Analytics" (12.4K views ↑+12%, seta), "Design System" (142 components, coração, seta).
Uso Vue: `<CardGrid :cols="3" :gap="6"> <Card v-for="item in items" :key="item.id"> <template #media> <img :src="item.image" :alt="item.title" /> </template> <h3>{{ item.title }}</h3> <p>{{ item.description }}</p> </Card> </CardGrid>`; Pro tip: "Use responsive column props to create the perfect layout at any size." (`<CardGrid :cols="{ default: 2, md: 3, lg: 4 }" :gap="6" />`).

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomia numerada ("Key parts of the card component"):

- **(1) Media** — imagem/mídia do topo do card (ex.: foto das montanhas; placeholder com ícone de imagem nos cards sem foto).
- **(2) Title** — "Card title" (ex.: "Explore the Alps", "Project Files").
- **(3) Meta** — "Supporting text or description for the card content." (ex.: "Breathtaking routes and unforgettable views.", "24 items · Updated 2h ago").
- **(4) Card (container)** — o cartão em si (fundo + borda + raio + sombra + espaçamento).
- **(5) Action** — botão de ação circular com seta (chevron) à direita.
- Extras visíveis: badges ("Featured", "Online", "Upcoming", "Popular"), avatar stack (+3), ícones de categoria (pasta, calendário, gráfico, coração, raio, documento), deltas (+12%).

## 3) Variantes e tamanhos visíveis

Variantes de card ("Variants — Different card styles for different content types"):

- **Uniform cards** — "Clean and consistent cards for lists and dashboards."
- **Highlight cards** — "Featured Plan / Everything you need to build faster." + badge "Popular" (destaque colorido).
- **Compact cards** — "Quick Action / Take action in one tap."
- **Media cards** — "Discover More / Beautiful destinations around the world." (com imagem).

Tamanhos de layout ("Layout sizes — Common column configurations"):

- **2 columns** — "Best for content-rich cards".
- **3 columns** — "Balanced and flexible".
- **4 columns** — "Ideal for dense content".
- Props: `cols` (número ou mapa responsivo `{ default: 2, md: 3, lg: 4 }`), `gap` (ex.: 6).

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Seção "States — Visual states for interaction feedback" (6 cards):

- **Default** — card em repouso.
- **Hover** — card elevado (sombra maior / lift).
- **Focus** — anel de foco azul ao redor do card.
- **Pressed** — card comprimido/pressionado.
- **Selected** — card tintado com checkbox azul + "Selected".
- **Disabled** — card apagado ("Selebted" [sic na imagem] desabilitado).
- Loading de card (skeleton) não aparece nesta imagem.

## 5) Micro-interações (click, hover, teclado, overlays)

- **Hover**: card eleva suavemente (lift + sombra).
- **Click/toque**: abre/aciona o item (botão de seta); no modo selecionável, alterna o estado Selected (checkbox).
- **Teclado**: Tab foca os cards; Enter/Space ativam.
- **Reordenação**: a grade se rearranja suavemente quando o conteúdo muda (adição/remoção/filtro).
- **Badges/ações**: badges indicam status (Featured/Online/Upcoming/Popular); ação por card.
- Sem overlays próprios — cada card é o alvo interativo.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Valor literal ("Motion — Smooth and subtle by default"): "Cards gently lift on hover and smoothly rearrange when content changes." (ilustração card → card elevado, sem números impressos). Cruzamento com o sistema (DESIGN.md §10/§20):

- Hover lift: `--v-motion-fast: 100ms` a `--v-motion-normal: 160ms` + `--v-ease-out` em `transform: translateY` (poucos px, faixa slide 4–24px) + `box-shadow` (`--v-shadow-*` → hover-shadow).
- Rearranjo da grade: `--v-motion-normal: 160ms` + `--v-ease-standard: cubic-bezier(.2,.8,.2,1)` em `transform`/`opacity` dos cards.
- Focus/pressed/selected: mesmo vocabulário dos demais controles (anel 120ms ease-out; compress 70ms ease-in; highlight ~140ms ease-out).
- `prefers-reduced-motion`: sem lift/rearranjo animado.

## 7) Acessibilidade observada

Checklist literal ("Accessibility — Built with accessibility in mind"):

- ARIA roles and labels support.
- Keyboard navigation (Tab, Enter, Space).
- Visible focus states.
- Sufficient color contrast.
- Works with screen readers.
- Meaningful alternative text for media.
- Support for dynamic content updates.

## 8) data-test-ids sugeridos (lista)

- `v-cardgrid` (root da grade)
- `v-cardgrid-card-{id}` (cada card)
- `v-cardgrid-media-{id}`
- `v-cardgrid-title-{id}`
- `v-cardgrid-meta-{id}`
- `v-cardgrid-action-{id}` (botão de seta)
- `v-cardgrid-badge-{id}` (badge de status)
- Tokens da doc: `--v-card-bg`, `--v-card-border`, `--v-card-radius`, `--v-card-shadow`, `--v-card-hover-shadow`, `--v-card-selected-bg`, `--v-card-title-size`, `--v-card-meta-color`, `--v-card-spacing`.
- Rodapé: "VueUI Nova — Beautiful components for modern web apps. Open source · Customizable · Production ready".
