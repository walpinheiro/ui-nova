# VCanvasGrid — DESIGN-SPEC (fonte: doc/Ui/poster_de_design_system_canvas_grid.png)

## 1) Objetivo do componente

`VCanvasGrid` é o **infinite snapping workspace grid**: grade flexível de alta performance para editores e construtores visuais. Texto guia: "Canvas Grid provides a flexible, high-performance grid for editors and visual builders. Pan, zoom, and snap elements with pixel precision, creating structured layouts without getting in the way."
Pilares: **Precise** (pixel-perfect snapping and alignment), **Scalable** (infinite canvas with smooth zoom and pan), **Flexible** (multiple grid styles and customization options).
Hero (nota "Structure without noise"): canvas com grade clara, retângulo de seleção com handles quadrados e guias tracejadas azuis (horizontal/vertical), toolbar flutuante (cursor, comentário, copiar, lixeira), controles de zoom (− 100% +) + fullscreen, botão de mão (pan), minimapa com viewport, fechar ×.
Uso Vue: `<div class="h-80 border rounded-lg"> <CanvasGrid :grid-size="16" :snap="true" :show-controls="true" style="width: 100%; height: 100%;" /> </div>`; Pro tip: "Use Ctrl + scroll to zoom, and hold Space + drag to pan." (`<CanvasGrid :grid-size="16" :snap="true" :show-controls="true" />`).

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomia numerada ("Key parts of the canvas grid component"):

- **(1) Grid line** — linha da grade de fundo (tracejada no detalhe da anatomia).
- **(2) Snap point** — ponto de snap/ancoragem (nó onde o elemento se alinha).
- **(3) Selection box** — caixa de seleção do elemento (retângulo azul translúcido com handles nos cantos).
- **(4) Guide** — guia de alinhamento (linha tracejada que cruza a seleção).
- **(5) Zoom control** — controle de zoom (− 100% +).
- Extras do hero: toolbar de edição flutuante, botão de pan (mão), minimapa de navegação, botão fullscreen, fechar ×.

## 3) Variantes e tamanhos visíveis

Variantes de estilo ("Variants — Different grid styles for different contexts"):

- **Line grid** — "Clean solid lines for structure."
- **Dot grid** — "Minimal and unobtrusive."
- **Dense grid** — "Higher precision for detailed work."
- **Presentation grid** — "Large spacing for overview."

Tamanhos/modos ("Sizes / Modes — Different canvas sizes and densities"):

- **Compact** — "Smaller grid (8px)".
- **Default** — "Standard grid (16px)" (destacado/selecionado).
- **Wide canvas** — "Larger grid (32px)".

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Seção "States — Visual states for interaction feedback" (6 mini-canvas):

- **Idle** — grade vazia em repouso.
- **Hover guide** — cursor com guias tracejadas cruzadas + ponto.
- **Selecting** — caixa de seleção ativa com handles.
- **Snapping** — seleção encaixada no snap point com guias.
- **Focused** — seleção com contorno/ênfase de foco.
- **Disabled** — grade apagada/não interativa.
- Loading não exibido (canvas é contínuo; carregamento seria skeleton do host).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Pan**: arrastar com mão / segurar Space + arrastar; setas do teclado movem o pan (keyboard panning).
- **Zoom**: Ctrl + scroll, botões −/+, atalhos Ctrl + / Ctrl −; pourcentage exibido (100%).
- **Snap**: ao arrastar, o elemento encaixa nos snap points com guias de alinhamento.
- **Seleção**: click cria/abre selection box com handles; toolbar flutuante oferece ações (selecionar, comentar, duplicar, excluir).
- **Minimapa**: navegação/posicionamento do viewport.
- **Teclado**: pan por setas, zoom por Ctrl +/−; controles com ARIA labels.
- **Reduced motion**: respeita preferência de movimento reduzido.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Valor literal ("Motion — Smooth and subtle by default"): "Smooth zoom, pan, and selection animations (150ms ease-out)." (ilustração em 3 quadros: grade → grade densa → seleção). Cruzamento: 150ms ≈ `--v-motion-normal: 160ms` + `--v-ease-out`; animar `transform` (pan/zoom/seleção) + `opacity` das guias; `prefers-reduced-motion` desliga pan/zoom animados (salto direto). Faixa slide 4–24px e escala 0.98–1.02 do DESIGN.md §10 valem para a caixa de seleção.

## 7) Acessibilidade observada

Checklist literal ("Accessibility — Built with accessibility in mind"):

- Keyboard panning (arrow keys).
- Keyboard zoom (Ctrl + / Ctrl −).
- Screen reader friendly labels.
- Sufficient color contrast.
- Supports reduced motion.
- Clear focus indicators.
- ARIA labels for controls.
- Works in both light and dark mode.

## 8) data-test-ids sugeridos (lista)

- `v-canvasgrid` (root/canvas)
- `v-canvasgrid-zoom-in`
- `v-canvasgrid-zoom-out`
- `v-canvasgrid-zoom-label` (percentual)
- `v-canvasgrid-fullscreen`
- `v-canvasgrid-pan`
- `v-canvasgrid-selection`
- `v-canvasgrid-guide`
- `v-canvasgrid-toolbar`
- `v-canvasgrid-minimap`
- Tokens da doc (prefixo `--vc-*` na imagem): `--vc-grid-size`, `--vc-grid-line-color`, `--vc-grid-line-color-strong`, `--vc-grid-dot-color`, `--vc-grid-bg`, `--vc-grid-guide-color`, `--vc-grid-snap-color`, `--vc-canvas-selection-color`, `--vc-canvas-zoom-bg`, `--vc-canvas-zoom-color`.
- Rodapé: "VueUI Nova — Beautiful components for modern web apps. Open source · Customizable · Production ready".
