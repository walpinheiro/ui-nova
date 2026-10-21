# VButton — DESIGN-SPEC (fonte: doc/Ui/button.png)

> Página de documentação do componente Button (VueUI Nova › Components › Button, v1.0.0).
> Tagline da página: "A versatile action trigger for primary, secondary, and contextual actions."
> Três pilares no topo: **Clear** (Communicates actions with confidence) · **Flexible** (Multiple variants, sizes and states for any use case) · **Accessible** (Built with inclusive design principles from the start).
> Header da página: breadcrumb "VueUI Nova › Components › Button", título "Components / Button", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, **Button ativo**, Card, Input, Select, Tabs, Tooltip) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Small components. Big possibilities."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Disparador de ação versátil para ações primárias, secundárias e contextuais. É o controle de ação fundamental do sistema: confirma formulários ("Save changes"), cria recursos ("Create project"), cancela fluxos ("Cancel"), abre menus contextuais ("…") e sinaliza processamento (loading). Card lateral da doc resume a diretriz de uso: "Buttons help users take action and make progress. Keep labels clear and concise."

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a button" (exemplo com botão primary "✦ Create project" + spinner):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Container | sim | Retângulo arredondado (`radius 12px`), fundo `--button-bg #6366F1`, sombra `0 2px 8px rgba(99,102,241,0.25)`, padding `10px 16px` |
| Label | sim | Texto branco `#FFFFFF`, ex.: "Primary", "Save changes", "Create project", "Cancel"; diretriz: labels claros e concisos |
| Icon (optional) | não | À esquerda do label no exemplo ("✦" sparkle em "Create project"); variante Icon button exibe só ícone (coração ♡) |
| Loading spinner (optional) | não | Anel circular à direita do label no exemplo e à esquerda do texto em "Loading"; ver seção 4/5 |
| Focus ring | estado | Anel externo `0 0 0 3px rgba(99,102,241,0.3)` ao redor do container (mostrado no estado Focus e no diagrama) |

Elementos da seção "In context — Buttons in a real interface" (card de exemplo real, janela com semáforo vermelho/amarelo/verde):

- Card "Project settings" com ícone de engrenagem em quadrado arredondado, subtítulo "Manage your project details and preferences."
- Ações à direita: `Cancel` (secondary/outline), `Save changes` (primary), `…` (icon/overflow compacto).
- Abas abaixo: General (ativa, sublinhado primary), Team, Integrations, Billing.
- Card lateral "✦ Polished by design — Buttons help users take action and make progress. Keep labels clear and concise."

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different styles for different intents", 7 exemplares)

| Variante | Aparência na imagem | Uso (inferido + Pro tip) |
|---|---|---|
| Primary | Fundo sólido `#6366F1`, texto branco | Ação principal ("Save changes"). Pro tip: usar Primary só para a ação principal |
| Secondary | Fundo cinza-claro/neutro, texto escuro | Ação de apoio ("Cancel"). Pro tip: Secondary ou Ghost para ações de apoio |
| Ghost | Sem fundo/borda visível, texto escuro | Ação de apoio terciária |
| Outline | Fundo branco, borda neutra, texto escuro | Alternativa secundária com contorno |
| Destructive | Fundo vermelho/rose sólido, texto branco | Ação destrutiva |
| Icon button | Quadrado branco com borda, ícone ♡ centralizado | Ação icônica compacta (ex.: favoritar); exige `aria-label` |
| Loading button | Fundo primary com spinner + texto "Loading" | Ação em processamento; bloqueia novo clique |

### Tamanhos ("Sizes — Three sizes for different contexts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | Botão compacto "Button" | Padding/escala reduzidos |
| Medium (default) | "Button" intermediário | `padding-x 16px / padding-y 10px` (tokens da página) |
| Large | "Button" amplo | Padding/escala ampliados |

Alturas seguem a escala de espaçamento do sistema; target mínimo de toque **44×44px** (ver acessibilidade).

## 4) Estados ("States — Interactive states and feedback", 6 exemplares lado a lado)

| Estado | Aparência na imagem |
|---|---|
| Default | Primary sólido `#6366F1`, sombra `0 2px 8px rgba(99,102,241,0.25)` |
| Hover | Primary levemente alterado (tom/elevação do hover) |
| Focus | Primary + anel de foco visível `0 0 0 3px rgba(99,102,241,0.3)` ao redor |
| Pressed | Primary mais escuro/comprimido (feedback de pressão) |
| Disabled | Cinza-claro dessaturado, texto cinza, sem sombra; `opacity 0.5`, `cursor: not-allowed`, semântica `disabled`/`aria-disabled` |
| Loading | Primary com spinner circular animado + (na variante) texto "Loading"; interação bloqueada |

Estados de borda do sistema (DESIGN.md §7): default/hover `1px`, focus `2px` + anel via `:focus-visible`.

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click (primary/secondary/ghost/outline/destructive) | Dispara a ação; feedback Press (escala ~0.98) + retorno; `:active { transform: scale(0.98) }` |
| Click (icon button ♡) | Alterna/aciona ação icônica; manter `aria-label` e área mínima 44×44px |
| Click (overflow "…") | Abre menu contextual/overlay com ações adicionais |
| Click (Loading) | Ignorado/bloqueado; spinner indica processamento; sem re-disparo |
| Hover | Transição de `background` 100ms ease-out (+ sombra); cursor pointer (exceto disabled/loading) |
| Focus / Tab | Anel de foco visível; `:focus-visible { outline + offset }`; ordem de tabulação: Cancel → Save changes → … |
| Teclado Enter / Space | Ativa o botão focado (semântica nativa `<button>`); Space ativa no keyup, Enter no keydown |
| Tabs General/Team/Integrations/Billing | Click/←/→ alterna painel (contexto de uso, padrão de tabs) |
| Overlay (menu "…") | Abre sob o botão; Escape fecha e devolve foco ao botão; click-fora fecha |

## 6) Motion ("Motion — Smooth, intentional interactions", 4 especificações literais do poster)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente (DESIGN.md §10/§20) |
|---|---|---|
| Appear | **100ms ease-out** | `--v-motion-fast: 100ms` + `--v-ease-out` (entrada) |
| Hover | **100ms ease-out** | `--v-motion-fast: 100ms` + `--v-ease-out` (`background`/`box-shadow`) |
| Press | **80ms ease-out** | Sem token exato (entre fast 100ms); aproximar com `--v-motion-fast` ou token dedicado; `transform: scale(0.98)` (escala 0.98–1.02 do poster) |
| Loading | **200ms linear** | Sem token exato (entre normal 160ms e slow 300ms); spinner rotativo `linear infinite` (`--v-motion-spin-duration` se existir) |

Regras gerais: motion apenas em `transform`/`opacity` (e `background`/`box-shadow` baratos no hover); saída usa `ease-in`; `prefers-reduced-motion: reduce` zera transições/animações (inclusive spinner → estado estático com texto "Loading").

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-button {
  background: var(--v-color-primary); // #6366F1
  color: #ffffff;
  border-radius: var(--v-radius-md); // 12px
  padding: 10px 16px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
  transition:
    background var(--v-motion-fast) var(--v-ease-out),
    transform var(--v-motion-fast) var(--v-ease-out),
    box-shadow var(--v-motion-fast) var(--v-ease-out);

  &:hover { background: var(--v-color-primary-hover); }
  &:active { transform: scale(0.98); }
  &:focus-visible {
    outline: var(--v-focus-ring-width) solid var(--v-color-focus);
    outline-offset: var(--v-focus-ring-offset);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 6 checks literais)

1. **Keyboard accessible (Tab, Enter, Space)** — foco via Tab, ativação via Enter/Space; usar `<button>` nativo.
2. **Visible focus ring** — anel `0 0 0 3px rgba(99,102,241,0.3)` sempre visível via `:focus-visible`, nunca removido sem substituto.
3. **Correct aria labels for icon buttons** — icon button (♡, …) exige `aria-label` ("Favorite", "More actions"); spinner com `role="status"`/`aria-live` ou `aria-busy="true"` no loading.
4. **Disabled state uses proper semantics** — atributo `disabled` (ou `aria-disabled` quando foco precisa ser mantido), sem ação via teclado/pointer.
5. **Sufficient color contrast** — texto branco sobre `#6366F1` e texto escuro sobre secondary/ghost/outline dentro do mínimo WCAG AA.
6. **Minimum 44×44px target size** — inclusive icon button e "…" compactos (padding/área de acerto, não só o glifo).

## 8) data-test-ids sugeridos

- `v-button` (root; variantes via `data-variant="primary|secondary|ghost|outline|destructive|icon|loading"`, `data-size="sm|md|lg"`, `data-state`)
- `v-button-label`
- `v-button-icon` / `v-button-icon-favorite` (icon button ♡)
- `v-button-spinner` (loading)
- `v-button-cancel` (contexto Project settings)
- `v-button-save` (contexto "Save changes")
- `v-button-overflow` (botão "…")
- `v-button-create-project` (exemplo da anatomia)
- `v-button-group-actions` (grupo Cancel/Save/…)
- `docs-button-variant-{primary,secondary,ghost,outline,destructive,icon,loading}` (fileira de variantes)
- `docs-button-size-{sm,md,lg}` (fileira de tamanhos)
- `docs-button-state-{default,hover,focus,pressed,disabled,loading}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--button-bg` | `#6366F1` (swatch azul) |
| `--button-text` | `#FFFFFF` (swatch branco) |
| `--button-radius` | `12px` |
| `--button-padding-x` | `16px` |
| `--button-padding-y` | `10px` |
| `--button-shadow` | `0 2px 8px rgba(99, 102, 241, 0.25)` |
| `--button-focus-ring` | `0 0 0 3px rgba(99, 102, 241, 0.3)` |
| `--button-disabled-opacity` | `0.5` |

No repo equivalem a `--v-color-primary`, `--v-radius-md`, `--v-space-4`/`--v-space-3` (aprox.), `--v-shadow-*`, `--v-color-focus`, `--v-state-disabled-opacity`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VButton variant="primary">
    Save changes
  </VButton>
</template>
```

**Pro tip (literal):** "Use Primary for the main action, and Secondary or Ghost for supporting actions."
