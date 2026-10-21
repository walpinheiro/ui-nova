# VColorPicker — DESIGN-SPEC (fonte: doc/Ui/VColorPicker.png)

> Página de documentação do componente VColorPicker (VueUI Nova › Components › VColorPicker, v1.0.0).
> Tagline da página: "A color selection component for themes, branding, and creative tools."
> Três pilares no topo: **Flexible** (Multiple formats, palettes, and interaction styles) · **Customizable** (Easily integrate with your design system and brand) · **Accessible** (Built with accessibility and keyboard support).
> Header da página: breadcrumb "VueUI Nova › Components › VColorPicker", título "VColorPicker", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VColorPicker ativo**, Switch, Progress) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`.
> Texto decorativo manuscrito no fundo: "Colors inspire brighter products."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." · "Thoughtful components for modern products."

## 1) Objetivo do componente

Seleção de cor para temas, branding e ferramentas criativas. Cobre desde o seletor compacto (swatch + popover) até paletas predefinidas de marca, com suporte a formatos manuais (HEX), transparência (alpha/opacity) e integração com o design system. Diretriz de uso (Pro tip): usar preset colors da marca e ativar alpha (opacity) para overlays e gradientes.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of VColorPicker":

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Trigger | sim | Swatch quadrado arredondado que abre o popover (quadrado azul `#6366F1`) |
| Popover | estado | Painel flutuante branco com todos os controlos (`radius 12px`, sombra `0 8px 32px rgba(99,102,241,0.15)`) |
| Saturation area | sim | Gradiente 2D saturação/luminosidade (azul→preto) com pino de mira circular branco |
| Preview swatch | sim | Amostra da cor atual dentro do popover/trigger |
| Color handle | sim | Pino circular arrastável na saturation area e nos sliders (16px, anel branco) |
| Hue slider | sim | Faixa arco-íris horizontal com handle (altura 8px) |
| Opacity slider | não | Faixa de transparência (terceira barra, xadrez→cor) com handle |
| Input fields | não | Campo HEX `#6366F1` (com stepper) + seletor `100% ▾` de opacidade |
| Recent colors | não | Fileira de swatches recentes + ação `Clear` (azul, roxo, rosa, laranja, verde, cinzento) |

Elementos da secção "In context — Choose brand colors in a real interface":

- Sidebar "Project settings": General, **Appearance ativa** (azul, ícone pincel), Team, Integrations.
- Painel "Brand identity — Define the colors that represent your brand across the product."
- `Primary color — Used for primary actions, links and key UI elements.` swatch azul + `#6366F1 ▾`.
- `Accent color — Used for highlights and interactive elements.` swatch rosa + `#EC4899 ▾`.
- Popover aberto à direita com saturation, hue, opacity, HEX + 100%, Recent colors + Clear.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different ways to use VColorPicker", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Popover picker | Swatch + `▾` | Click to open a full color picker |
| Inline swatches | Fileira compacta (roxo, rosa, laranja, verde) | Compact swatch selection |
| With HEX input | Swatch + campo `#6366F1` + `▾` | Manual input support for precise values |
| With opacity | Swatch xadrez (transparência) + `▾` | Color with alpha transparency |
| Preset palette | Fileira (azul, roxo, rosa, laranja, verde, cinzento) | Predefined brand or theme colors |

### Tamanhos ("Sizes — Three sizes for different contexts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | Swatch `24×24` + `▾` | `24px` |
| Medium (default) | Swatch `32×32` + `▾` | `--vcp-swatch-size: 32px` |
| Large | Swatch `40×40` + `▾` | `40px` |

## 4) Estados ("States — Common states and interactions", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Swatch azul neutro |
| Hover | Swatch com realce/borda de hover |
| Focus | Swatch com anel de foco accent visível |
| Open | Swatch + chevron para cima `˄` (popover aberto) |
| Selected | Swatch azul com `✓` branco (cor escolhida) |
| Disabled | Swatch cinzento dessaturado, sem interação |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click (trigger swatch/`▾`) | Abre/fecha o popover com animação 120ms ease-out; `aria-expanded` atualizado; foco vai para a saturation area |
| Drag (saturation pino) | Atualiza a cor em tempo real com feedback do cursor (ver Motion); anuncia valor HEX via `aria-live` |
| Drag (hue slider) | Desliza o handle pelo arco-íris; preview + HEX atualizam em tempo real; setas ajustam por passos |
| Drag (opacity slider) | Ajusta alpha 0–100%; seletor `100% ▾` sincronizado; xadrez indica transparência |
| Edição (campo HEX) | Entrada manual com validação (`#RGB`/`#RRGGBB`); stepper incrementa; Enter confirma, valor inválido reverte com mensagem |
| Click (recent swatch) | Aplica a cor recente imediatamente (100ms ease-out); marca estado Selected com `✓` |
| Click (Clear) | Limpa recentes (ou repõe transparente conforme implementação) |
| Hover (swatch) | Realce subtil + tooltip com valor HEX; cursor pointer |
| Teclado Tab / setas | Tab percorre trigger → saturation → hue → opacity → HEX → recentes; setas movem handles; Enter/Space selecionam; Esc fecha popover e devolve foco ao trigger |
| Disabled | Sem pointer/keyboard; `aria-disabled="true"`, swatch cinzento |

## 6) Motion ("Motion — Smooth, purposeful interactions", 3 especificações literais do poster)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Popover open | **120ms ease-out** | `--v-motion-fast: 100ms` ≈ 120ms + `--v-ease-out` (`opacity`/`transform: scale(0.96 → 1)`) |
| Swatch select | **100ms ease-out** | `--v-motion-fast: 100ms` + `--v-ease-out` (`background`/`transform`) |
| Cursor drag feedback | **During drag real-time updates** (sem valor; contínuo, sem transição) | Transição `none` durante o drag; 60fps via `transform`; respeita `prefers-reduced-motion` (saltos discretos por setas) |

Regras gerais: popover entra com fade+scale a partir do trigger; seleção com transição curta; drag sempre direto (sem easing); `prefers-reduced-motion: reduce` remove fade/scale (abertura instantânea).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-color-picker__popover {
  background: var(--v-color-surface, #ffffff); // --vcp-popover-bg
  border-radius: var(--v-radius-md, 12px); // --vcp-radius
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15); // --vcp-shadow
  transition: opacity var(--v-motion-fast) var(--v-ease-out),
    transform var(--v-motion-fast) var(--v-ease-out);

  &--open { opacity: 1; transform: scale(1); }
  &--closed { opacity: 0; transform: scale(0.96); pointer-events: none; }

  .v-color-picker__swatch {
    width: 32px; height: 32px; // --vcp-swatch-size
    &:focus-visible { outline: 2px solid var(--v-color-focus, #6366f1); } // --vcp-swatch-ring
  }
  .v-color-picker__handle { width: 16px; height: 16px; } // --vcp-handle-size
  .v-color-picker__hue-track { height: 8px; } // --vcp-hue-track-height

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 7 checks literais)

1. **Full keyboard navigation (Tab, Arrow keys)** — todo o fluxo operável por teclado; setas movem handles, Enter confirma, Esc fecha.
2. **Proper labels for color channels (HEX, RGB)** — cada canal/campo com `<label>` associado e nome acessível.
3. **Announces selected color to screen readers** — valor HEX/RGB anunciado via `aria-live` a cada mudança.
4. **Maintains sufficient contrast in UI contexts** — `✓`/texto sobre swatches garante contraste mínimo (anel/overlay quando a cor é clara).
5. **Supports high contrast mode** — bordas/indicadores visíveis em forced-colors.
6. **Clear focus indicators** — anel de foco accent em trigger, sliders e swatches via `:focus-visible`.
7. **ARIA compliant and semantic structure** — papéis `dialog`/`slider`/`listbox`/`option` com `aria-valuenow/min/max/text` conforme APG.

## 8) data-test-ids sugeridos

- `v-color-picker` (root; `data-variant="popover|inline|hex|opacity|preset"`, `data-size="sm|md|lg"`, `data-state`)
- `v-color-picker-trigger`
- `v-color-picker-popover`
- `v-color-picker-saturation` / `v-color-picker-saturation-handle`
- `v-color-picker-hue` / `v-color-picker-hue-handle`
- `v-color-picker-opacity` / `v-color-picker-opacity-handle`
- `v-color-picker-preview`
- `v-color-picker-hex-input`
- `v-color-picker-alpha-select` (seletor `100%`)
- `v-color-picker-recent` / `v-color-picker-recent-clear`
- `v-color-picker-preset-{index}` (paleta predefinida)
- `docs-color-variant-{popover,inline,hex,opacity,preset}` (fileira de variantes)
- `docs-color-size-{sm,md,lg}` (fileira de tamanhos)
- `docs-color-state-{default,hover,focus,open,selected,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--vcp-surface` | `#FFFFFF` |
| `--vcp-popover-bg` | `#FFFFFF` |
| `--vcp-swatch-size` | `32px` |
| `--vcp-swatch-ring` | `#6366F1` |
| `--vcp-handle-size` | `16px` |
| `--vcp-shadow` | `0 8px 32px rgba(99, 102, 241, 0.15)` |
| `--vcp-hue-track-height` | `8px` |
| `--vcp-radius` | `12px` |

No repo equivalem a `--v-color-surface`, `--v-space-8` (aprox. 32px), `--v-color-primary`, `--v-shadow-lg`, `--v-radius-md`, `--v-motion-fast` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VColorPicker
    v-model="color"
    :show-alpha="true"
    :presets="brandColors"
    @update:modelValue="onChange"
  />
</template>
```

**Pro tip (literal):** "Use preset colors for your brand, and enable alpha (opacity) for overlays and gradients."
