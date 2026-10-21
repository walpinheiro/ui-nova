# VTabs — DESIGN-SPEC (fonte: doc/Ui/VTabs.png)

> **Status:** ✅ Concluído e validado  
> **Data:** 2026-09-20  
> **Testes:** `pnpm build` ok; vitest **15/15**; e2e **6/6** (harness `.val-harness/VTabs.html`).

> Página de documentação do componente Tabs (Navigation › Tabs).
> Tagline da página: "Contextual content navigation".
> Descrição de abertura: "Tabs help users navigate between related content, keeping information organized and easily accessible within the same context."
> Três pilares no topo: **Organized** (Group related content) · **Clear** (Show current context) · **Flexible** (Multiple styles and use cases).
> Header da página: breadcrumb "Components / Tabs".
> Texto decorativo manuscrito: "Clean navigation. Happier users."
> Primary example (hero, "Different styles. Same experience. — Tabs for any content structure."): fileira 1 underline (Overview ativa com sublinhado azul, Features, Pricing, FAQ); fileira 2 pill (General ativa em pill azul, Team, Billing, Integrations); fileira 3 icon (Home ativa com ícone + sublinhado, Analytics, Settings, Security).
> Footer da página: "Small components. A brighter tomorrow." + link "Learn more at vueui.dev →".

## 1) Objetivo do componente

Ajudar o utilizador a navegar entre conteúdos relacionados dentro do mesmo contexto, mantendo a informação organizada e acessível. É navegação contextual (não muda de página): alterna painéis de conteúdo relacionado (ex.: Overview/Features/Pricing/FAQ, General/Team/Billing/Integrations, Home/Analytics/Settings/Security).

## 2) Anatomia (partes)

Anatomia oficial numerada no diagrama ("Anatomy — The building blocks of a tab component", exemplo com Overview/Features/Pricing/FAQ):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Icon slot (16×16px) | não | Ícone à esquerda do label (ex.: casa em "Overview"/"Home" ativa) |
| Tab label (Semibold) | sim | Texto do separador, ex.: "Overview", "Features", "Pricing", "FAQ"; peso 600 |
| Container (background) | sim | Faixa/contentor dos separadores (fundo claro; pill usa contentor arredondado) |
| Active indicator (2px height) | sim | Sublinhado azul de 2px sob o separador ativo (variante underline) / pill preenchida (variante pill) |
| Focus ring (2px offset) | estado | Anel tracejado/outline azul de 2px com offset 2px ao redor do separador focado |
| Divider (1px) | não | Separador vertical de 1px entre tabs (visível no diagrama entre Features/Pricing) |
| Hit area (min 44×32px) | sim | Área de acerto mínima por separador (ver acessibilidade) |

Elementos do primary example: três fileiras demonstrando underline, pill e icon tabs com o mesmo vocabulário de labels.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Visual styles for different use cases", 3 cartões)

| Variante | Aparência na imagem | Uso (literal da imagem) |
|---|---|---|
| Underline tabs | Separadores de texto com sublinhado azul de 2px no ativo; "Minimal and modern. Best for most use cases." | Caso geral (default) |
| Pill tabs | Ativo dentro de pill/contida azul; "Contained style. Great for compact spaces." | Espaços compactos |
| Icon tabs | Ícones (16px) com labels opcionais; "Useful for product sections." | Secções de produto (ex.: Home, Analytics, Settings, Security) |

Código de uso confirma: `<Tabs>` suporta variantes `underline`, `pill` e `icon` (`icon="home"` no exemplo).

### Tamanhos ("Sizes — Consistent sizing for different contexts", 3 exemplares)

| Tamanho | Observado | Altura do contentor (literal dos tokens) |
|---|---|---|
| SM | Fileira compacta Overview/Features/Pricing | `Container height (SM)` = `32px` |
| MD (Default) | Fileira intermédia | `Container height (MD)` = `40px` |
| LG | Fileira ampla | `Container height (LG)` = `48px` |

Outros valores literais dos tokens: `Horizontal padding 16px`, `Icon size 16px`, `Label font size 14px`, `Label font weight 600 (Semibold)`, `Item gap 8px`, `Hit area (min) 44×32px`, `Border radius (Pill) 999px`.

## 4) Estados ("States — How tabs appear in different states (Underline variant)", tabela com 7 linhas)

| Estado | Aparência na imagem |
|---|---|
| Default | Label azul "Overview" (ativa por defeito na tabela) + restantes em cinza |
| Hover | "Features" com fundo tintado claro (retângulo de hover) |
| Focus | "Features" com anel de foco tracejado azul + fundo tintado |
| Active | "Overview" em azul semibold com sublinhado azul de 2px |
| Active Hover | "Overview" ativa com fundo tintado claro sob o sublinhado |
| Disabled | Todos os labels esmaecidos (cinza-claro), sem indicador |
| Overflow | Fileira com "…" e sombra/gradiente de desvanecimento à direita indicando conteúdo cortado |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click num separador | Ativa o separador; move o indicador (underline/pill desliza); troca o painel de conteúdo |
| Hover | Aplica tint de fundo (transição 100ms); cursor pointer (exceto disabled) |
| Focus / Tab | Anel de foco visível (2px, offset 2px); `:focus-visible`; Tab entra na tablist, setas movem-se entre tabs |
| Teclado ←/→ (e Arrow keys) | Move seleção/foco entre tabs (padrão WAI-APG de tabs); Home/End vão ao primeiro/último |
| Active change | Indicador desliza 180ms `cubic-bezier(0.2,0,0,0.2,1)`; painel troca com fade 120ms |
| Overflow ("…") | Abre menu com os separadores ocultos; `aria-label` no menu; sombra/gradiente ("Overflow shadow hint") sinaliza scroll |
| Disabled | Sem foco (`aria-disabled="true"`, não focável), sem ação |
| Painel associado | `aria-selected`, `aria-controls` ligam tab ↔ painel; painel com `role="tabpanel"` |

## 6) Motion ("Motion — Subtle, purposeful motion", 5 especificações literais)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Hover (tint) | **Tint 100ms ease-out** | `--v-motion-fast: 100ms` + `--v-ease-out` |
| Focus (ring appear) | **Ring appear 120ms ease-out** | `--v-motion-fast` (aprox. 100–120ms) + `--v-ease-out` |
| Active change (underline/indicator slide) | **180ms cubic-bezier(0.2,0,0,0.2,1)** | Token dedicado de slide (~`--v-motion-normal` 160–180ms) + easing literal |
| Content swap (fade) | **120ms fade** | `--v-motion-fast` + `--v-ease-out` (`opacity`) |
| Overflow shadow hint | **140ms ease-out** | `--v-motion-fast`/`--v-motion-normal` + `--v-ease-out` |

Regras gerais: motion apenas em `transform`/`opacity` (indicador e fade do painel); `prefers-reduced-motion: reduce` desativa slide/fade (troca instantânea).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-tabs__indicator {
  height: 2px;
  background: var(--v-color-primary);
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 0.2, 1);
}

.v-tabs__tab {
  min-height: 44px;
  min-width: 32px;
  transition: background var(--v-motion-fast) var(--v-ease-out);

  &:focus-visible {
    outline: 2px solid var(--v-color-focus);
    outline-offset: 2px;
  }
}

.v-tabs__panel {
  transition: opacity 120ms var(--v-ease-out);
  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 8 checks literais)

1. **Minimum hit target — 44 × 32px** — cada separador com área mínima de acerto.
2. **Sufficient color contrast — ≥ 4.5:1 (AA)** — labels e indicador dentro do mínimo WCAG AA.
3. **Clear focus indicator — 2px visible ring** — anel de 2px sempre visível via `:focus-visible`.
4. **Supports keyboard navigation — Arrow keys** — setas movem-se entre tabs; Tab entra/sai da tablist.
5. **Uses semantic structure — `<button>` with `role="tab"`** — tabs como botões com `role="tab"` dentro de `role="tablist"`, painéis com `role="tabpanel"`.
6. **Works with screen readers — aria-selected, aria-controls** — estado ativo e relação tab↔painel expostos.
7. **Overflow is announced — aria-label on menu** — menu "…" com `aria-label`; itens ocultos anunciados.
8. **Disabled tabs are not focusable — aria-disabled="true"** — separadores desativados fora da ordem de tabulação.

## 8) data-test-ids sugeridos

- `v-tabs` (root; `data-variant="underline|pill|icon"`, `data-size="sm|md|lg"`)
- `v-tabs-list` (`role="tablist"`)
- `v-tabs-tab-{name}` (cada `role="tab"`, ex.: `v-tabs-tab-overview`, `v-tabs-tab-features`, `v-tabs-tab-pricing`, `v-tabs-tab-faq`)
- `v-tabs-indicator` (sublinhado/pill ativa)
- `v-tabs-panel-{name}` (cada `role="tabpanel"`)
- `v-tabs-overflow` (botão "…") / `v-tabs-overflow-menu`
- `docs-tabs-variant-{underline,pill,icon}`
- `docs-tabs-size-{sm,md,lg}`
- `docs-tabs-state-{default,hover,focus,active,active-hover,disabled,overflow}`

## Tokens da página (transcrição literal do card "Design tokens — Key values for consistent implementation")

| Token (descritivo na imagem) | Valor |
|---|---|
| Container height (SM) | `32px` |
| Container height (MD) | `40px` |
| Container height (LG) | `48px` |
| Horizontal padding | `16px` |
| Icon size | `16px` |
| Label font size | `14px` |
| Label font weight | `600 (Semibold)` |
| Active indicator height | `2px` |
| Divider width | `1px` |
| Item gap | `8px` |
| Hit area (min) | `44×32px` |
| Border radius (Pill) | `--v-radius-pill` |

No repo equivalem a tokens `--v-space-*`, `--v-font-size-*`, `--v-font-weight-*`, `--v-color-primary/focus`, `--v-radius-pill` (`--v-tabs-pill-radius`), `--v-motion-*`, `--v-ease-out`.

## Uso Vue (transcrição literal do card "Code — Simple and flexible to use in Vue")

```vue
<template>
  <Tabs v-model="activeTab">
    <Tab name="overview" label="Overview" icon="home" />
    <Tab name="features" label="Features" />
    <Tab name="pricing" label="Pricing" />
    <Tab name="faq" label="Faq" />
  </Tabs>
</template>
```

**Nota lateral (literal):** "Flexible API for any use case. `<Tabs>` supports underline, pill, and icon variants, icons, disabled states, and more. Learn more at vueui.dev →"
