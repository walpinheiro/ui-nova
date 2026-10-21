# VSkeleton — DESIGN-SPEC (fonte: doc/Ui/VSkeleton.png)

> Página de documentação do componente VSkeleton (VueUI Nova › Components › Skeleton, v1.0.0).
> Tagline da página: "A flexible loading placeholder for content that's on its way."
> Três pilares no topo: **Improves perceived speed** (Keeps users engaged while content is loading) · **Flexible and composable** (Multiple variants, sizes, and shapes for any use case) · **Accessible by default** (Built with motion preferences and screen readers in mind).
> Header da página: breadcrumb "VueUI Nova › Components › Skeleton", título "Components / Skeleton", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **Skeleton ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Smooth experiences. Happier users."
> Footer da página: "Open source · Customizable · Production ready".

## 1) Objetivo do componente

Placeholder de carregamento flexível para conteúdo que está a caminho: melhora a velocidade percebida e mantém o utilizador envolvido enquanto dashboard, cartões, tabelas e gráficos carregam. O skeleton deve espelhar forma e layout do conteúdo real para uma transição coesa (Pro tip: "Use VSkeleton to match the shape and layout of your real content for a smoother, more cohesive loading experience.").

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the skeleton component" (bloco quadrado + 2 linhas):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Shape | sim | Forma base do placeholder (retângulo, linhas de texto, círculo avatar, quadrado cartão) |
| Base color | sim | Cor base `--skeleton-bg #F1F5F9` das formas |
| Shimmer layer | estado | Faixa de brilho `--skeleton-highlight #FFFFFF` que atravessa a forma quando animada |
| Radius | sim | Cantos arredondados `--skeleton-radius 8px` (variante grande `--skeleton-radius-lg 12px`) |

Elementos da seção "In context — A real-world example of VSkeleton in action" (dashboard "Good Morning, Alex!" com sidebar Dashboard ativo, Projects, Team, Analytics, Settings):

- Avatar circular + 2 linhas de saudação, 3 cartões de stats (quadrado + 2 linhas), tabela com 3 linhas (ponto + barra larga + 4 barras), tudo em skeleton sobre fundo claro.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Common skeleton patterns for different content types", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Text line | 3 linhas horizontais | Linhas únicas ou múltiplas de texto |
| Avatar | Círculo | Placeholder circular para avatares de utilizador |
| Card | Quadrado + 3 linhas ao lado | Blocos de conteúdo como cards ou listas |
| Table row | Ponto + barra larga + 3 barras por linha | Dados tabulares com estrutura consistente |
| Chart / Widget | 5 barras verticais crescentes | Gráficos, estatísticas e conteúdo rico |

### Tamanhos ("Sizes — Predefined sizes for different contexts", 4 exemplares)

| Tamanho | Observado |
|---|---|
| XS `16 × 16` | Quadrado mínimo |
| SM `24 × 24` | Quadrado pequeno |
| MD (default) `40 × 40` | Quadrado padrão (destaque azul na doc) |
| LG `64 × 64` | Quadrado grande |

## 4) Estados ("States — Different states for different loading scenarios", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | 2 barras estáticas — placeholder estático |
| Animated shimmer | 2 barras com brilho + borda de destaque azul — animação suave de carregamento |
| Paused | 2 barras + botão `⏸` — animação pausada |
| Grouped layout | Bloco avatar + 2 linhas repetido 2× — para listas e coleções |
| Reduced motion | 2 barras estáticas suaves — respeita preferências do utilizador (sem shimmer) |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Início de espera | Skeletons substituem o conteúdo; shimmer inicia (800ms ease-in-out, loop) |
| Fim de espera | Conteúdo real substitui o skeleton com fade; leitores de ecrã anunciam via `aria-busy="false"` |
| Paused | Animação congelada a pedido (botão `⏸` / prop); forma estática mantida |
| Reduced motion | Shimmer desativado automaticamente via `prefers-reduced-motion` |
| Sem informação essencial | Skeleton nunca transporta texto/dados reais — apenas forma (ver acessibilidade) |

## 6) Motion ("Motion — A subtle shimmer animation", sequência Initial → Shimmer → Loop)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Initial | Estado base (`--skeleton-bg`, opacidade 1) | `--v-motion-instant` (ponto de partida) |
| Shimmer | **800ms ease-in-out** (literal do rodapé do card) | `--v-motion-slow: 300ms` não cobre; usar token dedicado `--v-skeleton-duration: 800ms` + `--v-ease-in-out`; gradiente highlight a atravessar |
| Loop | Repetição contínua do shimmer | `infinite`; `prefers-reduced-motion: reduce` congela no estado base |

Regras gerais: animação subtil e contida que não distrai ("A smooth, understated animation that doesn't distract."); animar apenas `transform`/`opacity` (ou `background-position` do gradiente); `prefers-reduced-motion: reduce` → estado estático.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-skeleton {
  background: var(--v-skeleton-bg, #F1F5F9); // --skeleton-bg
  border-radius: var(--v-radius-md); // --skeleton-radius 8px
  opacity: 1; // --skeleton-opacity
  overflow: hidden;
  position: relative;

  &.is-animated::after {
    content: "";
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, var(--v-skeleton-highlight, #FFFFFF), transparent);
    animation: v-shimmer var(--v-skeleton-duration, 800ms) var(--v-ease-in-out) infinite;
  }
  @keyframes v-shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

  @media (prefers-reduced-motion: reduce) { &.is-animated::after { animation: none; } }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 7 checks literais)

1. **Uses aria-busy when loading** — contentor com `aria-busy="true"` durante o carregamento.
2. **Screen reader friendly** — skeleton ignorado (`aria-hidden="true"`), conteúdo real anunciado ao chegar.
3. **Respects prefers-reduced-motion** — shimmer desativado (estado Reduced motion).
4. **Maintains content structure** — ordem/estrutura do conteúdo preservada (grouped layout espelha a lista real).
5. **Sufficient color contrast** — base `#F1F5F9` distinguível do fundo sem depender de texto.
6. **Works with dynamic content** — funciona com conteúdo assíncrono/dinâmico (dashboard, tabelas, gráficos).
7. **No essential information in skeleton** — nenhuma informação essencial vive no skeleton (só forma).

## 8) data-test-ids sugeridos

- `v-skeleton` (root; `data-variant="text|avatar|card|table-row|chart"`, `data-size="xs|sm|md|lg"`, `data-state="default|animated|paused|grouped|reduced-motion"`, `aria-busy`)
- `v-skeleton-shape` (forma base: linha/círculo/quadrado/barras)
- `v-skeleton-shimmer` (camada de brilho)
- `v-skeleton-group` (layout agrupado para listas)
- `docs-skeleton-variant-{text,avatar,card,table-row,chart}`
- `docs-skeleton-size-{xs,sm,md,lg}`
- `docs-skeleton-state-{default,animated,paused,grouped,reduced-motion}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--skeleton-bg` | `#F1F5F9` |
| `--skeleton-highlight` | `#FFFFFF` |
| `--skeleton-radius` | `8px` |
| `--skeleton-duration` | `800ms` |
| `--skeleton-easing` | `ease-in-out` |
| `--skeleton-opacity` | `1` |
| `--skeleton-radius-lg` | `12px` |

No repo equivalem a `--v-skeleton-bg`, `--v-skeleton-highlight`, `--v-radius-md`, `--v-skeleton-duration`, `--v-ease-in-out`, `--v-radius-lg`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VSkeleton
    variant="text"
    :lines="3"
    :animated="true" />
</template>
```

**Pro tip (literal):** "Use VSkeleton to match the shape and layout of your real content for a smoother, more cohesive loading experience."
