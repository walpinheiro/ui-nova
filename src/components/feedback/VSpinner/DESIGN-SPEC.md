# VSpinner — DESIGN-SPEC (fonte: doc/Ui/VSpinner.png)

> Página de documentação do componente VSpinner (VueUI Nova › Components › VSpinner, v1.0.0).
> Tagline da página: "A flexible loading indicator for communicating progress and waiting states."
> Três pilares no topo: **Clear feedback** (Communicates loading states instantly) · **Flexible styles** (Multiple variants, sizes, and colors for any context) · **Accessible** (Built with inclusive design and reduced motion support).
> Header da página: breadcrumb "VueUI Nova › Components › VSpinner", título "Components / VSpinner", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VSpinner ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Small components. Big possibilities."
> Footer da página: "Open source · Customizable · Production ready".

## 1) Objetivo do componente

Indicador de carregamento flexível para comunicar progresso e estados de espera: confirma processamento em botões ("Creating project…"), sobreposições ("Loading your project… This may take a few seconds.") e conteúdo inline (listas, tabelas, secções). Pro tip: emparelhar sempre o spinner com um rótulo descritivo (prop `label` ou texto visualmente escondido) para melhor acessibilidade.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the spinner component" (anel grande azul):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Track — background | sim | Anel de fundo suave (cor `--spinner-track-color var(--color-border)`) |
| Indicator — animated | sim | Arco azul animado sobre o track (cor `--spinner-color var(--color-primary)`) |
| Size — controlled via size prop | sim | Diâmetro via prop: XS `12×12`, SM `16×16`, MD `24×24`, LG `32×32`, XL `48×48` |
| Color — inherits from color prop | sim | Herdada da prop `color` (azul primary por omissão; branca em botão azul) |

Elementos da seção "In context — Spinners in real product scenarios" (3 cartões):

- Overlay centrado "Loading your project… / This may take a few seconds." sobre mock Acme (Dashboard, Projects, Tasks, Calendar, Settings) esmaecido.
- "Button loading state — Integrate spinners directly into buttons to indicate progress during async actions." Botão azul "Creating project…" com spinner branco.
- "Inline loading — Use a subtle spinner for content areas like lists, tables, or sections that are loading." Cartão "Loading data…" com spinner + 2 barras skeleton.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different spinner styles for different use cases", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Circular | Anel clássico azul com track suave | O spinner clássico e mais comum |
| Dots | Três pontos azuis (central maior) | Animação mínima de pontos saltitantes |
| Ring | Anel refinado com track suave | Estilo de anel refinado com track suave |
| Inline | Ponto/anel azul subtil pequeno | Spinner subtil para conteúdo e texto inline |

### Tamanhos ("Sizes — Consistent sizes for different contexts", 5 exemplares)

| Tamanho | Observado |
|---|---|
| XS `12 × 12` | Minúsculo (inline/texto) |
| SM `16 × 16` | Pequeno (botões densos) |
| MD `24 × 24` | Padrão (uso geral) |
| LG `32 × 32` | Grande (cartões/overlays) |
| XL `48 × 48` | Extra-grande (página completa) |

## 4) Estados ("States — Visual states for different situations", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Idle | Anel cinza estático (pronto, sem animação) |
| Spinning | Anel azul em rotação (ativo) |
| In button | Spinner branco dentro de botão azul ("Creating project…") |
| Over surface | Spinner azul sobre superfície clara (overlay) |
| Disabled / Reduced motion | Anel cinza estático (movimento reduzido: sem rotação) |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Início de espera | Spinner entra (fade) + inicia rotação/salto; região anuncia "Loading…" |
| Fim de espera | Spinner sai; conteúdo real substitui; anúncio de conclusão via live region |
| Em botão | Botão fica `disabled`/`aria-busy="true"` durante o spin; cliques ignorados |
| Overlay | Bloqueia interação com a superfície por baixo; Esc não cancela (espera não-cancelável) salvo indicação contrária |
| Reduced motion | Animação parada (estado estático Disabled/Reduced motion) mantendo o rótulo textual |

## 6) Motion ("Motion — Smooth, purposeful animation", 2 especificações literais)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Continuous rotation | **1s linear infinite** | `--v-motion-spin-duration: 1s` (literal `--spinner-duration 1s` + `--spinner-easing linear`); `transform: rotate(360deg)` |
| Bouncing dots | **1.4s ease-in-out infinite** | Sem token `--v-*` exato; variante Dots com `ease-in-out` e pulso dos pontos (tamanho `--spinner-dot-size 6px`, gap `--spinner-dot-gap 4px`) |

Regras gerais: rotação `linear infinite` para Circular/Ring; Dots com `ease-in-out infinite`; `prefers-reduced-motion: reduce` congela a animação (estado estático + texto).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-spinner {
  width: 24px; // var(--spinner-size-md)
  height: 24px;
  border-radius: 50%;
  border: 3px solid var(--v-color-border); // track
  border-top-color: var(--v-color-primary); // indicator
  animation: v-spin var(--v-motion-spin-duration, 1s) linear infinite;

  @keyframes v-spin { to { transform: rotate(360deg); } }

  @media (prefers-reduced-motion: reduce) { animation: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 8 checks literais)

1. **Uses role="status" and aria-live** — região viva que anuncia o carregamento.
2. **Provides accessible loading text** — rótulo textual ("Loading projects…", "Loading your project…").
3. **Respects prefers-reduced-motion** — animação congelada com texto mantido.
4. **Sufficient color contrast** — indicador vs. track/fundo dentro do mínimo (não depende só da cor: movimento + texto).
5. **Works in high contrast mode** — anel visível em forced-colors.
6. **Does not rely on color alone** — movimento + rótulo textual redundantes.
7. **Supports custom aria-label** — prop `:label` / `aria-label` personalizável.
8. **Recommended 3:1 minimum size** — rácio mínimo 3:1 recomendado (tamanho/contraste do indicador; ver Motion/tokens).

## 8) data-test-ids sugeridos

- `v-spinner` (root; `data-variant="circular|dots|ring|inline"`, `data-size="xs|sm|md|lg|xl"`, `data-state="idle|spinning|in-button|over-surface|disabled"`)
- `v-spinner-track`
- `v-spinner-indicator`
- `v-spinner-label` (texto "Loading your project…" / "Creating project…" / "Loading data…")
- `v-spinner-in-button` (contexto botão)
- `docs-spinner-variant-{circular,dots,ring,inline}`
- `docs-spinner-size-{xs,sm,md,lg,xl}`
- `docs-spinner-state-{idle,spinning,in-button,over-surface,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--spinner-size-xs` | `12px` |
| `--spinner-size-sm` | `16px` |
| `--spinner-size-md` | `24px` |
| `--spinner-size-lg` | `32px` |
| `--spinner-size-xl` | `48px` |
| `--spinner-track-color` | `var(--color-border)` |
| `--spinner-color` | `var(--color-primary)` |
| `--spinner-duration` | `1s` |
| `--spinner-easing` | `linear` |
| `--spinner-dot-size` | `6px` |
| `--spinner-dot-gap` | `4px` |

No repo equivalem a `--v-spinner-*` + `--v-color-border`, `--v-color-primary`, `--v-motion-spin-duration`, `--v-ease-linear`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VSpinner variant="circular"
    size="md"
    :label="Loading projects..." />
</template>
```

**Pro tip (literal):** "Pair VSpinner with a descriptive label using the label prop or visually hidden text for better accessibility."
