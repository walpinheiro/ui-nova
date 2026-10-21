# VSlider — DESIGN-SPEC (fonte: doc/Ui/VSlider.png)

> Página de documentação do componente VSlider (VueUI Nova › Components › VSlider, v1.0.0).
> Tagline da página: "A slider component for selecting numeric values or ranges."
> Três pilares no topo: **Flexible** (Supports single values, range selection, marks and vertical orientation) · **Precise** (Smooth, responsive interactions with accurate value control) · **Accessible** (Keyboard support and ARIA attributes out of the box).
> Header da página: breadcrumb "VueUI Nova › Components › VSlider", título "Components / VSlider", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido até Tooltip, com **VSlider ativo**) / Patterns / Resources, card "Design. Build. Ship faster." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Small components. Big possibilities."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Controlo deslizante para selecionar valores numéricos ou intervalos. É o controlo de ajuste contínuo do sistema: volume e progresso de media, brilho/contraste/saturação, preço mínimo–máximo, filtros e configurações. O exemplo real ("In context — Sliders in real interfaces") mostra dois usos canónicos: (a) leitor "Midnight Drive / Luna Fields" com barra de progresso `2:14 – 4:28` e slider de volume `80%` (com shuffle, anterior, play, seguinte, mute); (b) card "Display settings" com `Brightness 75%` (ícones sol), `Contrast 40%`, `Saturation 60%`.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a slider" (exemplo com valor `50` + tooltip):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Track (background) | sim | Trilho de fundo `--slider-track #E5EAF9`, raio `--slider-radius 4px` |
| Filled range (active track) | sim | Trecho ativo preenchido `--slider-fill #6366F1` (do min até o thumb; entre thumbs no range) |
| Thumb | sim | Manipulo circular branco com borda azul, tamanho `--slider-thumb-size 20px`; arrastável |
| Value label | sim | Rótulo numérico do valor, ex.: `40`, `20 – 80`, `75`, `30` |
| Tooltip (on drag) | não | Balão sobre o thumb durante o arrasto, ex.: `50`; fundo `--slider-tooltip-bg #1F2937`, texto `--slider-tooltip-color #FFFFFF` |
| Marks (optional) | não | Marcos discretos sob o trilho, ex.: `0 25 50 75 100`; tamanho `--slider-mark-size 4px` |

No contexto media player o thumb do progresso e do volume segue o mesmo desenho; nas "Display settings" cada linha tem ícone à esquerda (sol, contraste, gota), slider ao centro e percentagem à direita.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different slider types for different use cases", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Single value | Um thumb, valor `40` | "Single value" |
| Range slider | Dois thumbs com faixa preenchida, `20 – 80` | "Range selection" |
| With marks | Thumb em `50` sobre escala `0 25 50 75 100` | "With marks" |
| Vertical | Trilho vertical com thumb, valor `75` | "Vertical orientation" |
| Disabled | Trilho acinzentado com thumb neutro, valor `30` | "Disabled state" |

### Tamanhos ("Sizes — Three sizes for different contexts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | Trilho fino, thumb pequeno, `40` | Escala reduzida |
| Medium (default) | Trilho/thumb intermédios, `40` | `--slider-thumb-size 20px` |
| Large | Trilho grosso, thumb grande, `40` | Escala ampliada |

O thumb mantém área de acerto mínima de **44×44px** (padding invisível além dos 20px visuais) em todos os tamanhos.

## 4) Estados ("States — Interactive states and feedback", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Thumb branco com borda azul sobre o trilho |
| Hover thumb | Thumb com anel de hover `--slider-thumb-hover-ring 0 0 4px rgba(99,102,241,0.25)` |
| Focus | Thumb com anel de foco grande azul (visível, para teclado) |
| Dragging | Thumb ampliado/preenchido (azul sólido) durante o arrasto + tooltip `50` |
| Disabled | Trilho e thumb acinzentados, sem interação (`30`) |

Foco via teclado usa anel duplo (anel de foco + thumb); arrasto mostra tooltip e atualiza faixa em tempo real; desativado usa `disabled` + `aria-disabled`.

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Drag do thumb (pointer/touch) | Thumb segue cursor/toque com easing suave; faixa preenchida e tooltip atualizam em tempo real |
| Click no track | Thumb salta/move-se para a posição clicada (com animação); valor atualizado |
| Arrow Left / Right (horizontal) · Up / Down (vertical) | Ajusta por `step`; Home/End vão a min/max; PageUp/PageDown ajustam por salto maior |
| Range slider | Cada thumb move-se independentemente; thumbs não se cruzam (ou trocam de papel); `aria-valuenow`/`aria-valuetext` por thumb |
| Marks | Click/arrasto encaixa (snap) nos marcos quando configurado |
| Tooltip on drag | Aparece ao iniciar o arrasto/foco e desvanece ao largar/blur |
| Hover no thumb | Anel de hover + cursor grab; durante arrasto cursor grabbing |
| Focus / Tab | Anel de foco visível; Tab alcança cada thumb (range = dois stops); `:focus-visible` |
| Disabled | Sem ação via teclado/pointer; sem tooltip |
| Vertical | Mesmas interações no eixo Y (teclas Up/Down); altura mínima de acerto mantida |

## 6) Motion ("Motion — Smooth, purposeful interactions", 3 especificações)

| Movimento | Descrição (literal ou inferida da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Thumb drag | **"Thumb follows cursor or touch with smooth easing"** | Transição curta de `transform` com `--v-ease-out`; durante o arrasto o valor segue em tempo real (sem atraso) |
| Tooltip appear | **"Value tooltip fades and scales in (100ms ease-out)"** (literal) | `--v-motion-fast: 100ms` + `--v-ease-out` (`opacity` + `transform: scale`) |
| Filled track update | **"Track width updates in real time as you drag"** | Sem transição artificial (atualização síncrona com o pointer); ao clicar no track, animar `width` com `--v-motion-fast` + `--v-ease-out` |

Regras gerais: motion apenas em `transform`/`opacity` (e `width` da faixa no click); `prefers-reduced-motion: reduce` elimina easing/tooltip animado (mudança instantânea).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-slider__track {
  background: var(--v-color-track); // #E5EAF9
  border-radius: var(--v-radius-sm); // 4px
}

.v-slider__fill {
  background: var(--v-color-primary); // #6366F1
}

.v-slider__thumb {
  width: 20px; height: 20px;
  background: #ffffff;
  border: 2px solid var(--v-color-primary);
  transition:
    box-shadow var(--v-motion-fast) var(--v-ease-out),
    transform var(--v-motion-fast) var(--v-ease-out);

  &:hover { box-shadow: 0 0 4px rgba(99, 102, 241, 0.25); }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
  &:active { transform: scale(1.15); cursor: grabbing; }

  &::after { content: ""; min-width: 44px; min-height: 44px; } // área de acerto
}

.v-slider__tooltip {
  background: #1f2937; color: #ffffff;
  transition: opacity var(--v-motion-fast) var(--v-ease-out), transform var(--v-motion-fast) var(--v-ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .v-slider__thumb, .v-slider__tooltip { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 6 checks literais)

1. **Keyboard support (Arrow Left / Right, Home, End, Page Up / Down)** — operação completa por teclado, incluindo orientação vertical (Up/Down).
2. **aria-valuenow and aria-valuetext** — valor e texto legível expostos (semântica `role="slider"`; range com dois sliders).
3. **Proper labeling (aria-label or label)** — cada slider rotulado ("Brightness", "Volume", …); `aria-orientation` (`horizontal`/`vertical`).
4. **Visible focus state** — anel de foco sempre visível via `:focus-visible`.
5. **Works with screen readers** — valor/limites anunciados; tooltip espelhada em `aria-valuetext`.
6. **Sufficient color contrast** — faixa `#6366F1` sobre `#E5EAF9` e tooltip branca sobre `#1F2937` dentro do mínimo WCAG AA.

## 8) data-test-ids sugeridos

- `v-slider` (root; `data-variant="single|range|marks|vertical|disabled"`, `data-size="sm|md|lg"`, `data-state`, `data-orientation`)
- `v-slider-track`
- `v-slider-fill`
- `v-slider-thumb` / `v-slider-thumb-min` / `v-slider-thumb-max` (range)
- `v-slider-tooltip` (valor `50` no arrasto)
- `v-slider-mark-{0,25,50,75,100}` (marcos)
- `v-slider-value` (`40`, `20 – 80`, `75`, `30`)
- `v-slider-brightness` / `v-slider-contrast` / `v-slider-saturation` (contexto Display settings)
- `v-slider-progress` / `v-slider-volume` (contexto media player)
- `docs-slider-variant-{single,range,marks,vertical,disabled}`
- `docs-slider-size-{sm,md,lg}`
- `docs-slider-state-{default,hover,focus,dragging,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--slider-track` | `#E5EAF9` |
| `--slider-fill` | `#6366F1` |
| `--slider-thumb-size` | `20px` |
| `--slider-thumb-hover-ring` | `0 0 4px rgba(99, 102, 241, 0.25)` |
| `--slider-mark-size` | `4px` |
| `--slider-radius` | `4px` |
| `--slider-tooltip-bg` | `#1F2937` |
| `--slider-tooltip-color` | `#FFFFFF` |

No repo equivalem a `--v-color-primary`, `--v-radius-sm`, `--v-motion-fast`, `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VSlider v-model="value" :min="0" :max="100" :step="1" />
</template>
<script setup>
import { ref } from 'vue'
const value = ref(50)
</script>
```

**Pro tip (literal):** "Use a range slider for selecting min/max values, like price ranges or date ranges."
