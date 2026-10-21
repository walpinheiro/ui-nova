# VSegmentedControl — DESIGN-SPEC ✅

> Fonte: `doc/ui/VSegmentedControl.png` (+ guias legadas fundidas).  
> Implementação validada: tokens `--v-segmented-*`, indicador deslizante 200ms ease-in-out, variantes default/pill, tamanhos sm/md/lg, ARIA radiogroup/radio, harness `.val-harness/VSegmentedControl.html`, unit + e2e Playwright.

> Lote E, item 1. Duas imagens lidas integralmente e fundidas. Divergências entre elas estão marcadas com (Guia) / (Pôster).

## 1) Objetivo do componente

Controle segmentado inline de escolha única (single-choice) entre opções relacionadas do mesmo contexto — alternativa compacta a tabs. Serve para trocar views/modos (View mode: List/Grid/Calendar; Time range: 7D/30D/3M/1Y ou Day/Week/Month; Sort by: Newest/Oldest/Popular ou Latest/Popular/Featured), filtrar conteúdo, ajustar escopo e alternar ordenação. Promessas do doc: "Simple switching for clearer experiences." / "One choice, instant context". Três valores de marca: Focused (mantém opções relacionadas visíveis e acessíveis), Flexible (texto, ícones ou ambos) na Guia; Clear (mostra as opções de relance), Compact (economiza espaço mantendo escolhas visíveis), Direct (troca contexto instantaneamente, sem reload) no Pôster. Exemplos de uso no Vue: `v-model="view"` com `:options="[{value,icon,label}]"`; `aria-label="Select view mode"`.

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomy numerada nas duas imagens (5 partes, ordem/numeração difere levemente):

1. **Container** — trilho que contém todos os segmentos. Retângulo com borda sutil (1px), radius médio (Guia lista `--v-segmented-radius`), fundo `--v-segmented-bg`. Na Guia o container aparece como moldura de janela de exemplo (com dots vermelho/amarelo/verde de window-chrome acima dos grupos View mode/Time range/Sort by); no Pôster o container é o próprio controle.
2. **Segment** — cada opção individual clicável (ex.: List, Grid, Cal/Calendar; Day, Week, Month; 7D, 30D; Newest, Oldest; Latest, Popular, Featured; All, Active, Archived; Small/Medium/Large nos exemplos de size). Divisórias verticais finas entre segmentos não-selecionados. Padding interno `--v-segmented-padding-x / -y`, gap `--v-segmented-gap`.
3. **Selected indicator** — fundo de destaque do segmento ativo (preenchimento azul-claro `#E8EEFF`-like com borda azul `--v-segmented-indicator` / `--v-segmented-primary`). É o elemento que desliza (ver Motion). Texto do segmento ativo em azul/brand (`--v-segmented-text-active`).
4. **Label** — texto do segmento (ex.: "List", "Week", "7D", "Newest"). Cor `--v-segmented-text`, hover `--v-segmented-text-hover`, disabled `--v-segmented-text-disabled`. Tipografia small/medium, peso 500-600 no ativo.
5. **Optional icon** — ícone à esquerda do label (lista, grade 2x2, calendário, sol/lua/monitor no Pill Light/Dark/System, seta de ordenação, fogo em Popular, estrela em Featured). Tamanho ~16px, herda cor do texto. Suportado sozinho (variante icon-only), com texto (icon+text) ou ausente (text-only).
- **Labels de grupo** (acima de cada controle no hero): "View mode / Choose how to display content.", "Time range / Select a time period.", "Sort by / Choose a sorting method." (Guia) e "View mode / Time range / Sort by" (Pôster). Não são parte do componente, mas contexto de uso.
- **Anotações manuscritas**: "Simple switching for clearer experiences." (Guia), "One choice, instant context" (Pôster).
- **Header do pôster**: logo VueUI Nova + "Build beautiful, faster.", breadcrumb "Components / Segmented Control" (Guia) / "Navigation / Segmented Control" (Pôster), título "Segmented Control", subtítulo "Switch between related options" (Guia) / "Multi-option inline switcher" (Pôster), parágrafo descritivo, 3 bullets com ícones (camadas/raio/grade na Guia; lupa/compacto/raio no Pôster).
- **Blocos inferiores**: Motion (diagrama List→Grid→Cal com setas), Design tokens, Accessibility, Vue usage (snippet `v-model="view" :options="viewOptions"` com List/Grid/Calendar), Pro tip (Guia: usar ícones para opções escaneáveis quando espaço limitado + exemplo icon-only com `aria-label`; Pôster: usar labels significativos e concisos que descrevam o conteúdo, não ações + exemplo Day/Week/Month e anotação "Use clear, parallel labels"). Footer: "VueUI Nova — Beautiful components for modern web apps. Open source · Customizable · Production ready".

## 3) Variantes e tamanhos visíveis

Variantes (4, idênticas nas duas imagens, exemplos concretos):

| Variante | Exemplo na imagem | Descrição |
|---|---|---|
| Text only | Day / Week / Month (Week ativo) | Só labels, aparência simples e limpa |
| Icon only | 3 células só com ícones lista/grade/calendário (List ativo) | Compacta, baseada em ícone; exige `aria-label` por segmento |
| Icon + text | List/Grid/Calendar com ícone + texto (List ativo) | Combina ícones com labels |
| Pill style | (Guia) Light/Dark/System com ícones sol/lua/monitor, Light ativo; (Pôster) All/Active/Archived, Active ativo | Totalmente arredondada (full radius), aparência moderna |

Tamanhos (3 presets):

| Tamanho | Guia (altura explícita) | Pôster | Uso |
|---|---|---|---|
| Small / SM | 28px height | SM | Layouts compactos |
| Medium (default) / MD | 36px height | MD (default) | Uso cotidiano |
| Large / LG | 44px height | LG | Touch-friendly |

Exemplos de segmentos por contexto: View mode (List/Grid/Calendar), Time range (7D/30D/3M/1Y; Day/Week/Month), Sort by (Newest/Oldest/Popular; Latest/Popular/Featured), Status (All/Active/Archived).

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira States com 6 células (rótulos idênticos nas duas imagens):

| Estado | Aparência observada |
|---|---|
| Default | Segmentos neutros, fundo branco/surface, texto cinza-azulado, borda do container visível |
| Hover | Segmento sob cursor ganha fundo azul-claro suave (`--v-segmented-hover-bg` no Pôster; `--v-segmented-text-hover` na Guia) |
| Focus | Anel de foco azul de 2px ao redor do segmento/container (`--v-color-focus`-like), segmento com fundo claro e texto azul |
| Pressed | Fundo levemente mais escuro que hover, texto escuro (feedback de clique) |
| Selected | Indicador preenchido (fundo azul-claro + borda azul) com texto/ícone em brand (ex.: botão "List" sólido azul na Guia; segmento claro com texto azul no Pôster) |
| Disabled | Todo o controle esmaecido (fundo cinza-claro, texto `--v-segmented-disabled-text` / `--v-segmented-text-disabled`), sem interação |

Loading: não há estado de loading nas imagens (componente de seleção instantânea, sem async).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Click/toque**: seleciona o segmento (escolha única, comportamento radio); indicador desliza até o segmento clicado; só um ativo por vez. Suporte a modo múltiplo mencionado apenas na lista de acessibilidade do Pôster ("Works in both single and multiple mode") — sem exemplo visual de multi-select.
- **Hover**: realce de fundo no segmento (tokens de hover), cursor pointer.
- **Teclado**: navegação por Arrow keys (left/right) entre segmentos; container `role="radiogroup"`, cada segmento `role="radio"`; Tab entra no grupo, setas movem seleção; leitor de tela anuncia mudanças de seleção.
- **Overlays**: nenhum (sem dropdown, popover ou tooltip no componente).

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

- Documentado: "The indicator slides smoothly between segments **(200ms)** with a subtle **ease-in-out** curve." (Guia) / "The indicator slides smoothly between segments with a **150ms ease-out** animation." (Pôster). Diagrama Motion mostra List→Grid→Cal com setas de progressão.
- Cruzamento com DESIGN.md: `--v-motion-fast: 100ms`, `--v-motion-normal: 160ms` (≈150–160ms do Pôster), faixa do pôster oficial 100–300ms (200ms da Guia dentro da faixa, próximo de `--v-motion-normal` estendido / futuro `--v-motion-slow: 300ms`); easing `ease-in-out` → `--v-ease-in-out`, `ease-out` → `--v-ease-out` (standard `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`); animar só `transform`/`opacity` (deslizar indicador via `translateX`, nunca `left`/`width`); `prefers-reduced-motion: reduce` zera a transição.
- Hover/pressed seguem micro-fades rápidos (≤ `--v-motion-fast`).

## 7) Acessibilidade observada

Checklists verdes nas imagens, fundidas:

- Usa `role="radiogroup"` no container; cada segmento tem `role="radio"` (Guia: 'Uses role="radiogroup" for the container / Each segment has role="radio"'; Pôster: 'ARIA compliant (role="radiogroup") / Each segment has role="radio"').
- Navegação completa por teclado (Arrow keys; Tab/Enter no padrão radio).
- Anuncia mudanças de seleção ao screen reader ("Announces selection changes" / "announces selection").
- Indicador de foco visível; contraste de cor suficiente; labels claros e descritivos; semântica de disabled adequada.
- Suporta labels de ícone e texto; `aria-label` no controle quando icon-only (ex. `aria-label="Select view mode"`).
- Segue best practices WAI-ARIA (Guia) / ARIA compliant (Pôster); Pôster acrescenta "Works in both single and multiple mode".

## 8) data-test-ids sugeridos (lista)

- `segmented-control` (root, por instância: `segmented-control--view-mode`, `--time-range`, `--sort-by`)
- `segmented-control-segment` (cada segmento; com modificador de valor: `segmented-control-segment--list`, `--grid`, `--calendar`, `--day`, `--week`, `--month`, `--7d`, `--newest`, `--latest`, `--active`…)
- `segmented-control-indicator` (indicador deslizante do ativo)
- `segmented-control-label` (texto), `segmented-control-icon` (ícone opcional)
- `segmented-control-group-label` (label externo do grupo: view-mode/time-range/sort-by, quando renderizado pela página)
