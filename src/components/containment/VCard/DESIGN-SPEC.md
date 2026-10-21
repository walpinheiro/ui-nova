# VCard — DESIGN-SPEC (fonte: doc/Ui/VCard.png)

> Status: ✅ Concluído e validado
> Data: 2026-09-20
> Testes: `pnpm build` ok; `pnpm exec vitest run src/components/containment/VCard/_tests/VCard.spec.ts` — 14/14; e2e (5 specs) pendente de `pnpm exec playwright install chromium` neste ambiente (subagente [VCard](646e06df-f624-4f17-8af7-f9bf8f7cc49d) reportou 5/5 no ambiente dele).
> Validação visual: variantes elevated/outlined/filled/interactive, tamanhos sm/md/lg, estados default/hover/focus/pressed/selected/disabled/loading, motion 150ms hover / 100ms press / 150ms focus, media full-bleed, badge, check de seleção, footer avatar+actions.
> Blockers: Storybook sem `.storybook/main.*` no repo; typecheck global pode falhar por componentes externos — build e testes de VCard são a fonte de aceite.

> Página de documentação do componente Card (Components › Card).
> Tagline da página: "Flexible content container".
> Descrição de abertura: "Cards help you group related content, actions, and metadata in a clear, scalable way. Use cards to showcase information, navigate, and drive actions across your product."
> Três pilares no topo: **Versatile** (Content, actions, and media) · **Consistent** (Unified structure across your product) · **Modern** (Clean, flexible, and ready for the future).
> Header da página: breadcrumb "Components / Card", bloco "PRIMARY PREVIEW — Organize content beautifully. Inform, inspire, and take action — all in a card."
> Texto decorativo manuscrito: "Small components. Big possibilities."
> Primary preview (3 cartões): (1) "Alpine Pro" com imagem de montanha/lago, badge "Product", título "Alpine Pro", descrição "A modern workspace for brighter ideas.", grupo de avatares + "+3" e botão circular `→`; (2) stat "Active Users 12,480 ↑12% vs last month" com ícone de barras, `…` e sparkline; (3) CTA em gradiente roxo "Turn ideas into impact. Build faster with AI powered workflows." com botão "Get Started →".
> Footer da página: texto decorativo "Beautiful building blocks for what's next." + link "Learn more at vueui.dev →".
> NOTA DE INVENTÁRIO (atualizada): `VCard` implementado em `src/components/containment/VCard/` (categoria: contentor). Comportamento interativo via variante `interactive` ou prop `interactive` em qualquer variante; classe de motion `v-card--actionable`.

## 1) Objetivo do componente

Contentor flexível para agrupar conteúdo relacionado, ações e metadados de forma clara e escalável. Serve para apresentar informação (produto, métricas), navegar (cartão clicável) e conduzir ações (CTA) em todo o produto, com estrutura unificada e visual moderno.

## 2) Anatomia (partes)

Anatomia oficial no diagrama ("Anatomy — The building blocks of a card", exemplo "Alpine Pro"):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Container (background + border + radius) | sim | Cartão branco arredondado (`16px lg`), borda/sombra conforme variante |
| Media (optional) | não | Imagem de topo (montanhas/lago no exemplo), cantos superiores arredondados |
| Badge (optional) | não | Pill "Product" sobre a media, canto superior-direito |
| Content (title, description, supporting text) | sim | Título "Alpine Pro" + descrição "A modern workspace for brighter ideas." |
| Actions / more menu (more menu) | não | Botão `…` (visível no stat card "Active Users") |
| Avatar group (optional) | não | Três avatares + "+3" no rodapé do exemplo |
| Action button (optional) | não | Botão circular com seta `→` no rodapé do exemplo |

Variações do primary preview que estendem a anatomia: stat card (ícone, valor "12,480", delta "+12% vs last month", sparkline) e CTA card (título, descrição, botão "Get Started →" em fundo roxo sólido).

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different card styles for different use cases", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Elevated | Rebordo com sombra e profundidade ("Robustest with shadow and depth") — selecionada com borda azul no poster | Destaque padrão com elevação |
| Outlined | Borda subtil ("Subtle border for minimal contexts") | Contextos mínimos |
| Filled | Fundo suave ("Soft background for grouped content") | Conteúdo agrupado |
| Interactive | Com estados hover/focus/press ("Hover, focus, and press states for actions") — cursor de mão sobre o cartão | Cartões clicáveis/ação |

### Tamanhos ("Sizes — Consistent sizing for different contexts", 3 exemplares)

| Tamanho | Observado | Uso (literal) |
|---|---|---|
| Small | Cartão compacto com skeleton | "Compact for dense layouts." |
| Medium (Default) | Cartão intermédio, destacado com borda azul | "Balanced for most use cases." |
| Large | Cartão amplo com skeleton | "Spacious for rich content." |

Padding de referência: `Padding (MD) 24px`; `Gap (content) 12px`.

## 4) Estados ("States — Interactive card states (Interactive variant)", 7 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | "Project Alpha / Build what's next." em repouso |
| Hover | Elevação subtil ("Subtle lift and shadow increase") |
| Focus | Anel de foco de teclado ("Keyboard focus ring for accessibility"), cartão com borda azul |
| Pressed | Escala ligeiramente reduzida ("Slightly reduced scale") |
| Selected | Check azul `✓` no canto superior-direito ("Indicates active selection") |
| Disabled | Opacidade reduzida, sem interação ("Reduced opacity and no interaction") |
| (Skeleton/loading implícito) | Blocos de skeleton nos cartões de Sizes (carregamento) |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Hover (interactive) | Sombra aumenta e cartão eleva-se (150ms ease-out); cursor pointer |
| Click (interactive) | Navega/dispara ação do cartão; feedback press (escala 0.98, 100ms); `:active { transform: scale(0.98) }` |
| Focus / Tab | Anel de foco de 2px visível; `:focus-visible`; Tab alcança o cartão interativo e os controlos internos (botão `→`, `…`, "Get Started") |
| Teclado Enter / Space | Ativa o cartão interativo focado (semântica de botão/link; `role` adequado) |
| Pressed | Escala reduzida enquanto pressionado, retorno ao largar |
| Selected | Click (em contexto de seleção) alterna o estado com check `✓`; exposto via `aria-selected`/`aria-pressed` |
| Disabled | Sem ação de pointer/teclado; `aria-disabled="true"` |
| Botão interno (`→`, `…`, "Get Started") | Click propaga conforme composição (ação interna vs. ação do cartão); `…` abre menu de contexto |
| Menu `…` | Abre sob o botão; Escape fecha e devolve o foco; click-fora fecha |

## 6) Motion ("Motion — Subtle, purposeful motion", 3 especificações literais)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Default → Hover (shadow increases and lifts) | **150ms ease-out** | `--v-motion-normal` (150ms standard) + `--v-ease-out`; sombra `0 4px 24px → 0 8px 32px rgba(16,24,40,…)` |
| Hover → Pressed (slight scale down 0.98) | **100ms ease-out** | `--v-motion-fast: 100ms` + `--v-ease-out`; `transform: scale(0.98)` |
| Focus (focus ring appears) | **150ms ease-out** | `--v-motion-normal` + `--v-ease-out` (anel via `outline`/`box-shadow`) |

Tokens da página confirmam: `Transition duration 150ms (standard)` e `Elevation (hover) 0 8px 32px rgba(16, 24, 40, 0.12)`.
Regras gerais: motion apenas em `transform`/`opacity`/`box-shadow`; `prefers-reduced-motion: reduce` desativa lift/escala (mudança instantânea de estado).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-card {
  background: var(--v-color-surface);
  border: 1px solid var(--v-color-border);
  border-radius: 16px; // lg
  padding: 24px;
  box-shadow: 0 4px 24px rgba(16, 24, 40, 0.08);
  transition:
    box-shadow 150ms var(--v-ease-out),
    transform 100ms var(--v-ease-out);

  &--interactive:hover { box-shadow: 0 8px 32px rgba(16, 24, 40, 0.12); }
  &--interactive:active { transform: scale(0.98); }
  &--interactive:focus-visible {
    outline: 2px solid var(--v-color-focus);
    outline-offset: 2px;
  }
  &--selected { border-color: var(--v-color-primary); }
  &:disabled, &--disabled { opacity: 0.5; pointer-events: none; }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 7 checks literais)

1. **Keyboard accessible (Tab, Enter, Space)** — cartão interativo focável e acionável por teclado.
2. **Clear focus indicator — 2px outline ring** — anel de 2px sempre visível via `:focus-visible`.
3. **Sufficient color contrast — Meets WCAG 2.1 AA** — título/descrição e CTA dentro do mínimo AA.
4. **Semantic structure — `<article>` or `<div>`** — usar `<article>` para conteúdo autónomo; cartão interativo como `<button>`/`<a>` ou com `role` + teclado.
5. **Screen reader friendly — Proper labels and roles** — título/descrição programáticos; imagem com `alt`; badge e avatar group com labels.
6. **Non-color cues — Icons, text, and states** — seleção/desativação nunca só por cor (check `✓`, texto, ícones).
7. **Disabled state — aria-disabled="true"** — estado desativado exposto e sem interação.

## 8) data-test-ids sugeridos

- `v-card` (root; `data-variant="elevated|outlined|filled|interactive"`, `data-size="sm|md|lg"`, `data-state`)
- `v-card-media`
- `v-card-badge` (pill "Product")
- `v-card-title` ("Alpine Pro" / "Project Alpha")
- `v-card-description`
- `v-card-avatar-group`
- `v-card-action-button` (seta `→`)
- `v-card-actions` / `v-card-more-menu` (botão `…`)
- `v-card-stat-value` ("12,480") / `v-card-cta` ("Get Started")
- `docs-card-variant-{elevated,outlined,filled,interactive}`
- `docs-card-size-{sm,md,lg}`
- `docs-card-state-{default,hover,focus,pressed,selected,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key values for consistent implementation")

| Token (descritivo na imagem) | Valor |
|---|---|
| Container background | `var(--color-surface)` |
| Border color | `var(--color-border)` |
| Border radius | `16px (lg)` |
| Shadow (default) | `0 4px 24px rgba(16, 24, 40, 0.08)` |
| Padding (MD) | `24px` |
| Gap (content) | `12px` |
| Title font | `var(--font-size-lg) / 600` |
| Description font | `var(--font-size-sm) / 400` |
| Action icon size | `16px` |
| Transition duration | `150ms (standard)` |
| Elevation (hover) | `0 8px 32px rgba(16, 24, 40, 0.12)` |

No repo equivalem a `--v-color-surface/border/primary/focus`, `--v-radius-lg`, `--v-space-*`, `--v-font-size-*/--v-font-weight-*`, `--v-shadow-*`, `--v-motion-normal/fast`, `--v-ease-out`.

## Uso Vue (transcrição literal do card "Code — Simple and flexible to use in Vue")

```vue
<template>
  <VCard
    variant="elevated"
    :interactive="true"
    title="Alpine Pro"
    description="A modern workspace for brighter ideas."
    badge="Product"
  >
    <template #media>
      <img src="/images/alpine.jpg" alt="Alpine Pro" />
    </template>
    <template #avatar-group>
      <VAvatarGroup :avatars="avatars" :max="3" />
    </template>
    <template #actions>
      <VButton variant="ghost" icon="arrow-right" aria-label="Open" />
    </template>
  </VCard>
</template>
```

**Nota lateral (literal):** "Flexible API for any use case. Supports media, actions, slots, variants, sizes, and more. View example in playground →"
