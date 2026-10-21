# VNumberInput — DESIGN-SPEC (fonte: doc/Ui/VNumberInput.png)

> Página de documentação do componente VNumberInput (VueUI Nova › Components › VNumberInput, v1.0.0).
> Tagline da página: "A numeric input component with step controls and validation."
> Três pilares no topo: **Precise control** (Step buttons and keyboard support for quick input) · **Flexible formatting** (Supports numbers, currency, percentages and custom steps) · **Accessible** (Built with inclusive design and keyboard interactions in mind).
> Header da página: breadcrumb "VueUI Nova › Components › VNumberInput", título "Components / VNumberInput", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **Number Input ativo**, Checkbox, Radio, Switch, Slider, Date Picker) / Patterns / Resources, card "Design. Build. Ship faster." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Small components. Big possibilities."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Campo numérico com controlos de incremento/decremento (stepper) e validação integrada. Serve para entrada de valores exatos com confiança: preços, descontos, percentagens, inventário e quantidades. O card lateral da doc resume: "VNumberInput helps users enter accurate values with confidence, from pricing to quantities and beyond." O exemplo real ("In context — Number inputs in a product pricing form") mostra o uso canónico: formulário "Product pricing" (preço base, descontos e inventário) com ações `Cancel` / `Save changes`.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a number input" (exemplo com `$ 42` + stepper):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Field (container) | sim | Retângulo arredondado (`radius 10px`), fundo `--number-bg #FFFFFF`, borda `--number-border #E5E7EB`, altura `--number-height 40px` |
| Value | sim | Texto do valor `#111827`, ex.: `42`; fonte `--number-font-size 14px` |
| Increment button | sim | Botão `^` no topo da coluna stepper à direita, tamanho `--number-stepper-size 32px` |
| Decrement button | sim | Botão `v` na base da coluna stepper à direita |
| Prefix (optional) | não | À esquerda do valor, ex.: `$` em Price `$ 29.99` e Currency `$ 99.00` |
| Suffix (optional) | não | À direita do valor, ex.: `%` em Discount `10 %` e Percentage `25 %` |
| Helper text (optional) | não | Texto auxiliar sob o campo, ex.: "Minimum of 0, maximum of 1000"; no contexto: "Base product price", "Applied at checkout", "Units in stock" |
| Focus ring | estado | Anel externo azul `0 0 0 3px rgba(99,102,241,…)` no estado Focus (ver Motion) |

Elementos da seção "In context" (formulário "Product pricing", janela com semáforo vermelho/amarelo/verde):

- Card "Product pricing" com ícone de engrenagem em quadrado arredondado, subtítulo "Set the base price, discounts, and inventory for your product."
- Ações à direita: `Cancel` (secondary/outline), `Save changes` (primary azul).
- Três campos rotulados: `Price` (`$ 29.99` + stepper), `Discount` (`10 %` + stepper), `Inventory` (`100` + stepper).
- Card lateral "Real-world ready — VNumberInput helps users enter accurate values with confidence, from pricing to quantities and beyond."

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different formats for different use cases", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Default | `42` + stepper | "Basic number input." |
| With stepper buttons | `0` + stepper em destaque | "Built-in increment and decrement." |
| Currency | `$ 99.00` + stepper | "With currency prefix." |
| Percentage | `25 %` + stepper | "With percentage suffix." |
| Min / max | `10` + stepper | "Respects minimum and maximum values." |

### Tamanhos ("Sizes — Three sizes for different contexts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | Campo compacto `12` | Altura/escala reduzidas |
| Medium (default) | Campo `42` com foco | `--number-height 40px`, `--number-font-size 14px` |
| Large | Campo amplo `100` | Altura/escala ampliadas |

Alturas seguem a escala do sistema; target mínimo de toque **44×44px** (ver acessibilidade) — aplicar à coluna stepper e aos botões `^`/`v`.

## 4) Estados ("States — Interactive states and feedback", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | `42`, borda `#E5E7EB`, fundo branco |
| Hover | `42` com fundo/borda subtilmente alterados |
| Focus | `42` + anel de foco azul visível ao redor do campo |
| Pressed stepper | `42` com botão `^` do stepper pressionado (fundo azul-claro no botão) |
| Invalid | `-1` com borda vermelha `#EF4444`; legenda "Invalid — Must be ≥ 0" |
| Disabled | `42` acinzentado, fundo neutro, sem interação |

Borda default/hover `1px`, focus `2px` + anel via `:focus-visible`; inválido usa `--number-invalid #EF4444` + mensagem de erro associada via `aria-describedby`/`aria-invalid`.

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click stepper `^` / `v` | Incrementa/decrementa pelo `step`; feedback de escala subtil (Step feedback); respeita `min`/`max` (clamp, sem ultrapassar) |
| Press contínuo no stepper | Repetição da variação enquanto pressionado (pressed stepper); largar interrompe |
| Digitação direta | Aceita apenas entrada numérica válida; formatação (prefixo/sufixo, casas decimais) aplicada no blur/commit |
| ArrowUp / ArrowDown | Incrementa/decrementa (suporte de teclado obrigatório); Shift+setas pode usar passo maior (se implementado) |
| Min / max atingido | Valor fixado no limite; opcional: anuncia limite a leitores de ecrã; stepper na direção bloqueada fica desativado |
| Valor inválido (`-1`) | Borda vermelha + mensagem "Must be ≥ 0"; erro anunciado a leitores de ecrã (`aria-live`) |
| Hover | Transição suave de `background`/`border-color`; cursor pointer sobre o stepper, text sobre o campo |
| Focus / Tab | Anel de foco visível; `:focus-visible { outline + offset }`; Tab entra no campo, setas ajustam sem sair |
| Disabled | Sem ação via teclado/pointer; `disabled` + `aria-disabled`; opacidade reduzida |

## 6) Motion ("Motion — Subtle motion for clear interactions", 3 especificações)

| Movimento | Duração / easing (literal ou inferido da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Step feedback | Efeito de escala **rápido e subtil ao clicar** ("A quick, subtle scale effect on click") | `--v-motion-fast: 100ms` + `--v-ease-out`; `transform: scale(0.98–1.02)` |
| Hover | **Transição suave de fundo e borda** ("Gentle background and border transition") | `--v-motion-fast: 100ms` + `--v-ease-out` (`background`/`border-color`) |
| Focus ring | **Anel de foco suave para navegação por teclado** ("Smooth focus ring for keyboard navigation") | `--v-motion-fast: 100ms` + `--v-ease-out` (`box-shadow` do anel `0 0 0 3px rgba(99,102,241,0.3)`) |

Regras gerais: motion apenas em `transform`/`opacity` (e `background`/`border-color`/`box-shadow` baratos); saída usa `ease-in`; `prefers-reduced-motion: reduce` zera transições/animações.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-number-input {
  background: var(--v-color-surface); // #FFFFFF
  color: var(--v-color-text); // #111827
  border: 1px solid var(--v-color-border); // #E5E7EB
  border-radius: var(--v-radius-md); // 10px
  height: 40px;
  font-size: var(--v-font-size-md); // 14px
  transition:
    border-color var(--v-motion-fast) var(--v-ease-out),
    box-shadow var(--v-motion-fast) var(--v-ease-out),
    background var(--v-motion-fast) var(--v-ease-out);

  &:hover { background: var(--v-color-surface-hover); border-color: var(--v-color-border-hover); }
  &:focus-within {
    border-color: var(--v-color-primary); // #6366F1
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
  &[aria-invalid="true"] { border-color: var(--v-color-danger); } // #EF4444
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  .v-number-input__stepper:active { transform: scale(0.98); }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 7 checks literais)

1. **Keyboard support (ArrowUp / ArrowDown)** — ajustar valor sem rato; stepper focável e operável por teclado.
2. **Proper labels and aria attributes** — `label` associado (`for`), `aria-label`/`aria-describedby` para prefixo/sufixo e ajuda.
3. **Validation errors announced to screen readers** — erro (`Must be ≥ 0`) via `aria-live`/`role="alert"`, com `aria-invalid="true"`.
4. **Sufficient target size (minimum 44x44px)** — botões do stepper com área de acerto mínima.
5. **Supports min, max, step constraints** — expostos como atributos `min`/`max`/`step` e `aria-valuemin`/`aria-valuemax`/`aria-valuenow` (semântica `spinbutton`).
6. **Compatible with screen readers** — valor e limites anunciados; prefixo/sufixo não poluem a leitura.
7. **Clear focus indication** — anel de foco sempre visível via `:focus-visible`, nunca removido sem substituto.

## 8) data-test-ids sugeridos

- `v-number-input` (root; `data-variant="default|stepper|currency|percentage|min-max"`, `data-size="sm|md|lg"`, `data-state`)
- `v-number-input-field` (input nativo)
- `v-number-input-prefix` (`$`)
- `v-number-input-suffix` (`%`)
- `v-number-input-increment` (botão `^`)
- `v-number-input-decrement` (botão `v`)
- `v-number-input-stepper` (coluna stepper)
- `v-number-input-helper` (helper text / limites)
- `v-number-input-error` (mensagem "Must be ≥ 0")
- `v-number-input-price` / `v-number-input-discount` / `v-number-input-inventory` (contexto Product pricing)
- `docs-number-input-variant-{default,stepper,currency,percentage,min-max}`
- `docs-number-input-size-{sm,md,lg}`
- `docs-number-input-state-{default,hover,focus,pressed-stepper,invalid,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--number-bg` | `#FFFFFF` |
| `--number-border` | `#E5E7EB` |
| `--number-border-focus` | `#6366F1` |
| `--number-text` | `#111827` |
| `--number-placeholder` | `#9CA3AF` |
| `--number-invalid` | `#EF4444` |
| `--number-stepper-size` | `32px` |
| `--number-radius` | `10px` |
| `--number-font-size` | `14px` |
| `--number-height` | `40px` |

No repo equivalem a `--v-color-surface`, `--v-color-border`, `--v-color-primary`, `--v-color-text`, `--v-color-danger`, `--v-radius-md`, `--v-font-size-md`, `--v-space-*`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VNumberInput
    v-model="price"
    :min="0"
    :step="1"
    prefix="$"
    placehodder="0.00"
  />
</template>
```

> Nota: `placehodder="0.00"` está assim escrito literalmente na imagem (typo por `placeholder`).

**Pro tip (literal):** "Use step and min/max to guide valid input and prevent user errors."
