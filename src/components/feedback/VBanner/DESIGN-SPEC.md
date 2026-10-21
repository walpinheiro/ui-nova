# VBanner — DESIGN-SPEC (fonte: doc/Ui/VBanner.png)

> Status: ✅ Concluído e validado
> Data: 2026-09-20
> Testes: `pnpm exec vitest run src/components/feedback/VBanner/_tests/VBanner.spec.ts` (8/8), `pnpm exec playwright test src/components/feedback/VBanner/_tests/VBanner.e2e.spec.ts` (5/5), `pnpm exec vite build` (passou), VBanner-specific `vue-tsc` filter (sem erros).
> Validação visual: screenshot renderizado no browser comparado com `doc/Ui/VBanner.png`; verificados anatomia default, cores/tokens, raio, padding, variantes, estados disabled/loading/dismissed, viewport estreito de 360px e `prefers-reduced-motion`.
> Blockers: Storybook não pôde ser iniciado porque o repositório não possui `.storybook/main.*`; o typecheck completo permanece bloqueado por erros preexistentes em outros componentes/testes. O build de produção e o typecheck específico de VBanner passaram.

> Página de documentação do componente VBanner (VueUI Nova › Components › VBanner, v1.0.0).
> Tagline da página: "A flexible banner component for important messages, alerts, and contextual information."
> Três pilares no topo: **Clear** (Communicate important information at a glance) · **Flexible** (Multiple variants and layouts to fit any use case) · **Accessible** (Built with inclusive design and keyboard support).
> Header da página: breadcrumb "VueUI Nova › Components › VBanner", título "Components / VBanner", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, **Banner ativo**, Button, Card, Input, Select, Tabs, Tooltip) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Keep your users informed. Beautifully."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Faixa informativa persistente para mensagens importantes, oportunas ou contextuais no topo de uma vista ou secção. Comunica atualizações de produto ("New version available"), confirmações ("Great! Your profile is updated.") e avisos que exigem atenção sem bloquear o fluxo. Diretriz da doc (Pro tip): usar banners para mensagens oportunas, importantes ou contextuais; texto curto, ação clara, sem sobreutilização — reservar para informação de alto valor; evitar banners para mensagens de baixa prioridade.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the banner component" (exemplo "New version available / A new version of VueUI Nova is available." + botão "View" + `×`):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Container (6) | sim | Faixa arredondada (`radius 12px`), fundo `--banner-bg #F8FAFF`, borda `--banner-border #E5E7F2`, sombra `0 1px 2px rgba(16,24,40,0.04)`, padding `12px 16px` |
| Icon (1) | sim | Círculo informativo azul (`i`) à esquerda; varia por variante (check verde, `!` amarelo/vermelho, megafone neutro) |
| Title (2) | sim | Texto forte escuro `#0F172A`, ex.: "New version available", "Information banner", "Success banner" |
| Description (3) | não | Texto secundário por baixo do título, ex.: "A new version of VueUI Nova is available.", "Your changes have been saved." |
| Action button(s) (4) | não | Botões à direita, ex.: "View changelog" (ghost/outline) + "Update now" (primary azul), "View" |
| Dismiss control (5) | não | Botão `×` à extrema-direita quando `closable="true"` |

Elementos da seção "In context — Banners in a real interface" (barra de exemplo real, janela com semáforo vermelho/amarelo/verde):

- Banner info completo: ícone `i` + "New version available" + "A new version of VueUI Nova is available with performance improvements." + `View changelog` + `Update now` + `×`.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different variants for different messages", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Info | Fundo azul-claro, ícone `i` azul, label "Info" | Informação útil ("Information banner / Here's some helpful information.") |
| Success | Fundo verde-claro, ícone check verde, label "Success" | Confirmação ("Success banner / Your changes have been saved.") |
| Warning | Fundo amarelo-claro, ícone `!` amarelo, label "Warning" | Revisão pedida ("Warning banner / Please review this information.") |
| Error | Fundo vermelho-claro, ícone `!` vermelho, label "Error" | Falha ("Error banner / Something went wrong.") |
| Neutral | Fundo cinza-claro, ícone megafone cinza, label "Neutral" | Novidade sem severidade ("Product update / We've shipped new features.") |

Todas as variantes de cartão exibem botão `×` de dispensa.

### Tamanhos ("Sizes — Different sizes for different contexts", 3 exemplares)

| Tamanho | Observado |
|---|---|
| Small | Linha única compacta "Small banner text" + `×` |
| Medium (default) | "This is a default banner" + `×`, com borda de destaque azul na doc |
| Large | Duas linhas "A more prominent banner / With additional context for larger spaces." + `×` |

## 4) Estados ("States — Different states and interactions", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Banner info "Banner text" + `×` estático |
| Hover (action) | Botão "View" com cursor mão (hover sobre a ação) |
| Focus (button) | Botão "View" com anel de foco azul visível |
| Dismissed | Contentor tracejado vazio com texto "Banner dismissed" (placeholder após fechar) |
| Compact | Banner denso "Compact" + `×` (padding reduzido) |
| Disabled | Banner acinzentado "Disabled" + `×`, ícone e texto dessaturados, sem interação |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click ação ("View" / "Update now" / "View changelog") | Dispara a ação contextual; mantém o banner visível |
| Click dismiss (`×`) | Remove o banner com animação Fade out; estado "Dismissed"; emite `@close`/`close`; foco move-se para o próximo elemento focável |
| Teclado Esc | Dispensa o banner focável/dispensável (ver acessibilidade) |
| Hover na ação | Transição de `background` 100ms ease-out; cursor pointer |
| Focus / Tab | Anel de foco visível no botão de ação; ordem: ação primária → secundária → dismiss |
| Enter / Space no botão | Ativa a ação ou dispensa (semântica nativa `<button>`) |

## 6) Motion ("Motion — Smooth and subtle interactions", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Fade in | Entrada por opacidade (aparecimento) | `--v-motion-normal: 160ms` + `--v-ease-out` (entrada) |
| Slide in | Entrada por deslizamento subtil | `--v-motion-normal: 160ms` + `--v-ease-out` (`transform`/`opacity`) |
| Fade out | Saída por opacidade (dispensa) | `--v-motion-fast: 100ms` + `--v-ease-in` (saída) |

Regras gerais: animar apenas `transform`/`opacity`; saída usa `ease-in`; `prefers-reduced-motion: reduce` desativa slide/fade (dispensa instantânea).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-banner {
  background: var(--v-color-info-bg); // #F8FAFF
  border: 1px solid var(--v-color-border); // #E5E7F2
  color: var(--v-color-text); // #0F172A
  border-radius: var(--v-radius-md); // 12px
  padding: 12px 16px;
  gap: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  transition:
    opacity var(--v-motion-normal) var(--v-ease-out),
    transform var(--v-motion-normal) var(--v-ease-out);

  &.is-leaving { opacity: 0; transition-timing-function: var(--v-ease-in); }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 8 checks literais)

1. **Uses semantic roles (role="status" or alert)** — info/neutral com `role="status"`, error/warning com `role="alert"`.
2. **Keyboard accessible (Tab, Enter, Space)** — ações e dismiss focáveis e ativáveis por teclado.
3. **Visible focus indicators** — anel de foco visível no botão (estado Focus).
4. **Clear and concise messaging** — título + descrição curtos.
5. **Supports screen readers** — ícone decorativo com `aria-hidden`, texto anunciado via live region.
6. **Dismissable via keyboard (Esc)** — `×` atingível e Esc dispensa.
7. **Sufficient color contrast** — texto `#0F172A` sobre fundos tintados dentro do mínimo WCAG AA.
8. **Works with links and buttons** — slot de ação aceita links e botões sem quebrar semântica.

## 8) data-test-ids sugeridos

- `v-banner` (root; `data-variant="info|success|warning|error|neutral"`, `data-size="sm|md|lg"`, `data-state`)
- `v-banner-icon`
- `v-banner-title` ("New version available")
- `v-banner-description`
- `v-banner-action-view` (botão "View" / "View changelog")
- `v-banner-action-update` (botão "Update now")
- `v-banner-dismiss` (botão `×`)
- `v-banner-dismissed-placeholder` (estado "Banner dismissed")
- `docs-banner-variant-{info,success,warning,error,neutral}`
- `docs-banner-size-{sm,md,lg}`
- `docs-banner-state-{default,hover,focus,dismissed,compact,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--banner-bg` | `#F8FAFF` |
| `--banner-border` | `#E5E7F2` |
| `--banner-text` | `#0F172A` |
| `--banner-icon-size` | `20px` |
| `--banner-padding-x` | `16px` |
| `--banner-padding-y` | `12px` |
| `--banner-radius` | `12px` |
| `--banner-gap` | `12px` |
| `--banner-shadow` | `0 1px 2px rgba(16, 24, 40, 0.04)` |

No repo equivalem a `--v-color-info-bg`, `--v-color-border`, `--v-color-text`, `--v-space-4`/`--v-space-3`, `--v-radius-md`, `--v-shadow-xs`.

## Uso Vue (transcrição literal do card "Vue usage — A simple example to get you started")

```vue
<template>
  <VBanner variant="info" title="New version available"
    description="A new version of VueUI Nova is available."
    :closable="true"
    @close="handleClose"
  >
    <template #action>
      <VButton size="sm">Update now</VButton>
    </template>
  </VBanner>
</template>
```

**Pro tip (literal):** "Use banners for timely, important, or contextual messages. Keep the text short, add a clear action, and don't overuse them — reserve banners for high-value information."
