# VDateRangePicker — DESIGN-SPEC (fonte: doc/Ui/VDateRangePicker.png)

> Página de documentação do componente VDateRangePicker (VueUI Nova › Components › VDateRangePicker, v1.0.0).
> Tagline da página: "A start-and-end date selection component for reporting, booking, and filtering workflows."
> Três pilares no topo: **Flexible** (Pick date ranges, single days, or use helpful presets) · **Powerful** (Supports time selection, custom ranges, and constraints) · **User friendly** (Clear, accessible, and consistent with your workflow).
> Header da página: breadcrumb "VueUI Nova › Components › VDateRangePicker", título "VDateRangePicker", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, **DateRangePicker ativo**, Select, Tabs, Tooltip) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`.
> Texto decorativo manuscrito no fundo: "Time makes better products."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." · "Thoughtful components for modern products."

## 1) Objetivo do componente

Seleção de intervalo start-end para relatórios, reservas e fluxos de filtragem. Permite escolher ranges, dias únicos ou presets úteis ("Last 7 days", "This month"), com suporte a seleção de hora, ranges customizados e restrições (datas desativadas). Diretriz de uso (Pro tip): oferecer presets úteis ("Last 7 days", "This month") para o utilizador encontrar o intervalo certo mais depressa.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the VDateRangePicker" (calendário duplo abril/maio 2024 + campo):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Leading icon (calendar) | sim | Ícone de calendário à esquerda do campo |
| Start date | sim | Data inicial no campo (ex.: "Apr 1, 2024") |
| Separator | sim | Separador `–` entre start e end |
| End date | sim | Data final no campo (ex.: "Apr 30, 2024") |
| Clear action (optional) | não | `×` para limpar o intervalo |
| Chevron | sim | `▾` que abre o popover do calendário |
| Presets list | não | Coluna lateral (Last 7 days, **Last 30 days ativo**, Last 90 days, This month, Last month, Custom range) |
| Dual calendar | estado | Dois meses lado a lado (April 2024 / May 2024) com navegação `‹ ›`, dias da semana Su–Sa, dia 1 e 30 selecionados (círculos azuis), range preenchido |
| Footer actions | sim | `Cancel` (ghost) + `Apply` (primary) no rodapé do popover |

Elementos da secção "In context — Filtering an analytics report with a date range":

- Card "Product analytics — Track growth, engagement, and revenue over time." com campo `Apr 1, 2024 – Apr 30, 2024 ▾` + botão primary `Apply filters`.
- 4 stat cards com sparklines: Total users `24,532 ↑ 12%`, Page views `87,421 ↑ 8%`, Conversions `3,942 ↑ 16%`, Revenue `$12,480 ↑ 11%`.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different ways to use the date range picker", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Default | Campo `Apr 1, 2024 – Apr 30, 2024 ▾` | Intervalo explícito |
| With presets | Campo `Last 30 days ▾` | Atalho de preset |
| Inline calendar | Campo `Apr 1 – Apr 30` (sem ano, formato curto) | Exibição compacta em linha |
| Compact field | Campo `04/01 – 04/30` (numérico) | Espaços apertados |
| Range with time | Campo `Apr 1, 10:00 – Apr 5, 18:00 ▾` | Intervalo com hora (`enable-time`) |

### Tamanhos ("Sizes — Three sizes for different layouts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | Campo compacto `Apr 1, 2024 – Apr 30, 2024 ▾` | Padding/escala reduzidos |
| Medium (default) | Campo intermédio (mesmo texto) | Uso geral |
| Large | Campo amplo (mesmo texto, chevron destacado) | Layouts espaçosos |

## 4) Estados ("States — Component states across interactions", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Campo `Select dates` neutro |
| Hover | Campo `Select dates` com borda realçada |
| Focus | Campo `Select dates` com anel de foco azul |
| Open | Campo `Apr 1 – Apr 30 ▾` com popover aberto |
| Range selected | Campo `Apr 1 – Apr 30 ▾` com destaque azul (intervalo aplicado) |
| Disabled | Campo `Select dates` esmaecido, sem interação |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click (campo/chevron) | Abre o popover do calendário duplo (150ms ease-out); `aria-expanded="true"`; foco vai para o dia selecionado/hoje |
| Hover (dia do calendário) | Pré-visualização do range (faixa azul-clara do start ao dia pairado, 100ms ease-out) antes de confirmar |
| Click (dia) | Primeiro clique fixa start, segundo fixa end; clique único = single day; dias desativados ignorados e anunciados |
| Click (preset) | Aplica preset imediatamente ao campo (ex.: Last 30 days → `Apr 1 – Apr 30`); marca preset ativo |
| Click (navegação `‹ ›`) | Transição de mês 200ms ease-in-out; foco mantido no calendário |
| Click (Cancel) | Fecha sem aplicar; Esc faz o mesmo e devolve foco ao campo |
| Click (Apply / Apply filters) | Confirma start/end (+ hora), fecha popover, atualiza `v-model`; anuncia novo intervalo |
| Click (clear `×`) | Limpa start/end para placeholder `Select date range`; `aria-live` anuncia "intervalo limpo" |
| Teclado Tab / setas / Enter | Tab: campo → calendário → presets → Cancel → Apply; setas movem o dia focado; Enter seleciona; Space alterna; `aria-selected`/`aria-disabled` por dia |
| Hora (variante with time) | Stepper/input de hora sincronizado com o campo; setas ajustam 30/60 min |

## 6) Motion ("Motion — Smooth, purposeful interactions", 3 especificações literais do poster)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Popover open | **150ms ease-out** | Entre `--v-motion-fast: 100ms` e `--v-motion-normal: 160ms`; usar `--v-motion-normal` + `--v-ease-out` (`opacity`/`transform`) |
| Range hover preview | **100ms ease-out** | `--v-motion-fast: 100ms` + `--v-ease-out` (preenchimento do range) |
| Month transition | **200ms ease-in-out** | Sem token exato (entre normal 160ms e slow 300ms); aproximar com `--v-motion-normal` ou token dedicado + `ease-in-out` (`transform: translateX`) |

Regras gerais: popover com fade+scale a partir do campo; preview do range só com `background`/`opacity`; transição de mês em `transform`; `prefers-reduced-motion: reduce` remove fade/slide (abertura e troca de mês instantâneas).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-date-range-picker__popover {
  background: var(--v-color-surface, #ffffff); // --vdr-calendar-bg
  border-radius: var(--v-radius-md, 12px); // --vdr-radius
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.08); // --vdr-shadow
  transition: opacity var(--v-motion-normal) var(--v-ease-out),
    transform var(--v-motion-normal) var(--v-ease-out);

  .v-date-range-picker__range-fill { background: rgba(99, 102, 241, 0.12); } // --vdr-range-fill
  .v-date-range-picker__day--selected {
    background: var(--v-color-primary, #6366f1); // --vdr-selected-ring
    color: #fff;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 6 checks literais)

1. **Keyboard range selection (Tab, Arrow keys, Enter)** — fluxo completo por teclado: abrir, navegar dias, confirmar.
2. **Announces selected date range to screen readers** — start/end anunciados via `aria-live` a cada mudança e no Apply.
3. **Logical focus order (input → calendar → actions)** — foco segue campo → calendário → presets → Cancel → Apply.
4. **Clear and descriptive labels** — `label` + placeholder `Select date range`; ícone decorativo com `aria-hidden`.
5. **Disabled dates are properly announced** — dias indisponíveis com `aria-disabled="true"` e anúncio "indisponível".
6. **Meets WCAG 2.1 AA contrast requirements** — texto, dias selecionados (branco sobre `#6366F1`) e labels dentro do mínimo AA.

## 8) data-test-ids sugeridos

- `v-date-range-picker` (root; `data-variant="default|presets|inline|compact|with-time"`, `data-size="sm|md|lg"`, `data-state`)
- `v-date-range-picker-input`
- `v-date-range-picker-leading-icon`
- `v-date-range-picker-start` / `v-date-range-picker-end` / `v-date-range-picker-separator`
- `v-date-range-picker-clear`
- `v-date-range-picker-chevron`
- `v-date-range-picker-popover`
- `v-date-range-picker-presets` / `v-date-range-picker-preset-{7d,30d,90d,this-month,last-month,custom}`
- `v-date-range-picker-calendar-prev` / `v-date-range-picker-calendar-next`
- `v-date-range-picker-day-{yyyy-mm-dd}` (com `aria-selected`/`aria-disabled`)
- `v-date-range-picker-cancel` / `v-date-range-picker-apply`
- `docs-daterange-variant-{default,presets,inline,compact,with-time}` (fileira de variantes)
- `docs-daterange-size-{sm,md,lg}` (fileira de tamanhos)
- `docs-daterange-state-{default,hover,focus,open,range-selected,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for theming and customization")

| Token | Valor |
|---|---|
| `--vdr-calendar-bg` | `#FFFFFF` |
| `--vdr-range-fill` | `rgba(99, 102, 241, 0.12)` |
| `--vdr-selected-ring` | `#6366F1` |
| `--vdr-input-border` | `#E5E7EB` |
| `--vdr-preset-bg` | `#F1F5FF` |
| `--vdr-radius` | `12px` |
| `--vdr-shadow` | `0 10px 30px rgba(99, 102, 241, 0.08)` |

No repo equivalem a `--v-color-surface`, `--v-color-primary` (+ alpha), `--v-color-border`, `--v-radius-md`, `--v-shadow-lg`, `--v-motion-*` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VDateRangePicker
    v-model="dateRange"
    :presets="presets"
    :enable-time="false"
    placeholder="Select date range"
  />
</template>

<script setup>
import { ref } from 'vue'

const dateRange = ref(null, null)
const presets = [
  { label: 'Last 7 days', range: '7d' },
  { label: 'Last 30 days', range: '30d' },
  { label: 'This month', range: 'this-month' }
]
</script>
```

**Pro tip (literal):** "Add useful presets like 'Last 7 days' or 'This month' to help users find the right range faster."
