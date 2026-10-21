# VCheckbox — DESIGN-SPEC (fonte: doc/Ui/VCheckbox.png)

> Página de documentação do componente VCheckbox (VueUI Nova › Components › VCheckbox, v1.0.0).
> Tagline da página: "A checkbox component for boolean choices and multi-select interfaces."
> Três pilares no topo: **Flexible** (Supports checked, unchecked and indeterminate states) · **Accessible** (Built with inclusive design and keyboard support) · **Versatile** (Perfect for forms, settings and multi-select experiences).
> Header da página: breadcrumb "VueUI Nova › Components › VCheckbox", título "VCheckbox", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VCheckbox ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`.
> Texto decorativo manuscrito no fundo: "Small components. Big possibilities."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." · "Thoughtful components for modern products."

## 1) Objetivo do componente

Caixa de verificação para escolhas booleanas e interfaces de multisseleção. Usada em formulários, preferências e listas de opções independentes (ex.: preferências de notificação). Suporta três valores visuais: unchecked, checked e indeterminate (seleção parcial de grupo). Card lateral da doc resume a diretriz: "Clear and familiar — Checkboxes help users make selections quickly, whether it's a single option or multiple choices." Pro tip: usar checkbox para opções independentes; para escolha única mutuamente exclusiva, preferir radio buttons.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a checkbox" (exemplo "Enable two-factor authentication"):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Container | sim | Linha clicável que agrupa box + label + textos (área de acerto mínima 44×44px) |
| Checkbox box | sim | Quadrado `20px` (md), borda `1.5px`, `radius 4px`, fundo `#FFFFFF`; checked: fundo `#6366F1` |
| Check icon | estado | Marca `✓` branca (checked) ou traço `–` (indeterminate) dentro da box |
| Label | sim | Texto principal (ex.: "Enable two-factor authentication", "Product updates", "I agree to the Terms of Service") |
| Description (optional) | não | Texto secundário (ex.: "Add an extra layer of security to your account.", "Get the latest feature releases and improvements.") |
| Helper text (optional) | não | Linha auxiliar com ícone `ⓘ` (ex.: "We'll only use this for account security.") |

Elementos da secção "In context — Check boxes in a real interface" (card "Notification preferences — Choose what you'd like to be notified about", com ícone de engrenagem):

- `Product updates` checked — "Get the latest feature releases and improvements."
- `Marketing emails` unchecked — "Receive tips, stories and product news."
- `Security alerts` checked — "Important updates about your account security."
- `Weekly digest` indeterminate — "A summary of what's new, sent every Monday."

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Common usage patterns for checkboxes", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Unchecked | Box vazia com borda neutra | Estado inicial / opção não selecionada |
| Checked | Box sólida `#6366F1` com `✓` branco | Opção selecionada |
| Indeterminate | Box sólida `#6366F1` com traço `–` branco | Seleção parcial de grupo (ex.: "Weekly digest", "select all" parcial) |
| With description | Box + label + linha de descrição ("Receive product updates.") | Opções que precisam de contexto |
| With link | Box + label com link ("I agree to the Terms of Service", link sublinhado azul) | Aceitação de termos; link focável separadamente |

### Tamanhos ("Sizes — Three sizes for different contexts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | Box `16px` | `--checkbox-size-sm: 16px` |
| Medium (default) | Box `20px` com `✓` | `--checkbox-size-md: 20px` |
| Large | Box `24px` | `--checkbox-size-lg: 24px` |

A área de acerto mantém-se ≥ 44×44px via padding do container em todos os tamanhos.

## 4) Estados ("States — Visual states for all interactions", 7 exemplares lado a lado)

| Estado | Aparência na imagem |
|---|---|
| Default | Box branca com borda neutra |
| Hover | Box com fundo subtil acinzentado/azulado |
| Focus | Box com anel de foco visível `0 0 0 3px rgba(99,102,241,0.25)` |
| Pressed | Box com fundo azul-claro preenchido (feedback de pressão) |
| Checked | Box sólida `#6366F1` + `✓` branco |
| Indeterminate | Box sólida `#6366F1` + traço `–` branco |
| Disabled | Box cinzenta dessaturada, sem interação; `opacity 0.5`, `cursor: not-allowed` |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click (container/label) | Alterna checked/unchecked; clique na box, label ou descrição ativa o input nativo; emite `update:modelValue` |
| Click (indeterminate) | Primeiro clique resolve para checked (padrão); `aria-checked="mixed"` → `"true"` |
| Click (link "Terms of Service") | Navega/abre termos; não alterna a checkbox (stopPropagation); foco separado por Tab |
| Hover | Fundo subtil da box 100ms; cursor pointer (exceto disabled) |
| Focus / Tab | Anel de foco visível via `:focus-visible`; ordem: checkbox → link (se existir) → próximo campo |
| Teclado Space | Alterna o checkbox focado (semântica nativa `<input type="checkbox">`); Enter não alterna, apenas submete formulário |
| Grupo (select-all) | Pai reflete `mixed` quando filhos parcialmente marcados; clicar no pai marca/desmarca todos |
| Disabled | Sem ação pointer/teclado; semântica `disabled` + `aria-disabled` |

## 6) Motion ("Motion — Subtle, intentional interactions", 3 especificações literais do poster)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Check animation | **Check icon fades and scales in (120ms)** | `--v-motion-fast: 100ms` ≈ 120ms + `--v-ease-out` (`opacity`/`transform: scale(0.5 → 1)`) |
| Hover background | **Subtle background color (100ms)** | `--v-motion-fast: 100ms` + `--v-ease-out` (`background-color`) |
| Focus ring | **A clear focus ring for keyboard users (100ms)** | `--v-motion-fast: 100ms` + `--v-ease-out` (`box-shadow`) |

Regras gerais: animar só `transform`/`opacity` (+ `background` barato no hover); `prefers-reduced-motion: reduce` desativa fade/scale (troca instantânea de estado).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-checkbox {
  display: inline-flex; align-items: flex-start; gap: 10px; // --checkbox-gap
  cursor: pointer;

  .v-checkbox__box {
    width: 20px; height: 20px; // --checkbox-size-md
    border: 1.5px solid var(--v-color-border-strong); // --checkbox-border
    border-radius: 4px; // --checkbox-border-radius
    background: var(--v-color-surface, #ffffff); // --checkbox-bg
    transition: background var(--v-motion-fast) var(--v-ease-out),
      box-shadow var(--v-motion-fast) var(--v-ease-out);

    .v-checkbox__icon {
      opacity: 0; transform: scale(0.5);
      transition: opacity var(--v-motion-fast) var(--v-ease-out),
        transform var(--v-motion-fast) var(--v-ease-out);
    }
  }

  &--checked .v-checkbox__box { background: var(--v-color-primary, #6366f1); border-color: transparent; }
  &--checked .v-checkbox__icon { opacity: 1; transform: scale(1); }
  &:focus-visible .v-checkbox__box { box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25); } // --checkbox-focus-ring
  &--disabled { opacity: 0.5; cursor: not-allowed; }

  @media (prefers-reduced-motion: reduce) { * { transition: none; } }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 6 checks literais)

1. **Properly associated with labels** — cada input tem `<label>` associado (clique no texto alterna).
2. **Fully keyboard accessible (Space to toggle)** — foco via Tab, alternância via Space com input nativo.
3. **Indeterminate state announced by screen readers** — `aria-checked="mixed"` anunciado como "parcialmente marcado".
4. **Visible focus indicator** — anel de foco sempre visível via `:focus-visible`.
5. **Sufficient color contrast** — `✓` branco sobre `#6366F1` e texto/label dentro do mínimo WCAG AA.
6. **Minimum 44×44px target size** — área de acerto do container, não só a box de 16–24px.

## 8) data-test-ids sugeridos

- `v-checkbox` (root; `data-state="unchecked|checked|indeterminate|disabled"`, `data-size="sm|md|lg"`)
- `v-checkbox-input` (input nativo)
- `v-checkbox-box`
- `v-checkbox-icon` (`✓`/`–`)
- `v-checkbox-label`
- `v-checkbox-description`
- `v-checkbox-helper`
- `v-checkbox-terms-link` (variante With link)
- `docs-checkbox-variant-{unchecked,checked,indeterminate,with-description,with-link}` (fileira de variantes)
- `docs-checkbox-size-{sm,md,lg}` (fileira de tamanhos)
- `docs-checkbox-state-{default,hover,focus,pressed,checked,indeterminate,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--checkbox-size-sm` | `16px` |
| `--checkbox-size-md` | `20px` |
| `--checkbox-size-lg` | `24px` |
| `--checkbox-border` | `1.5px` |
| `--checkbox-bg` | `#FFFFFF` |
| `--checkbox-checked-bg` | `#6366F1` |
| `--checkbox-border-radius` | `4px` |
| `--checkbox-focus-ring` | `0 0 0 3px rgba(99, 102, 241, 0.25)` |
| `--checkbox-gap` | `10px` |

No repo equivalem a `--v-space-*`, `--v-color-surface`, `--v-color-primary`, `--v-radius-sm`, `--v-color-focus`, `--v-motion-fast` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VCheckbox
    v-model="notifications"
    label="Product updates"
    description="Get the latest feature releases."
  />
</template>
```

**Pro tip (literal):** "Use checkboxes for independent options. For a single, mutually exclusive choice, consider using radio buttons instead."
