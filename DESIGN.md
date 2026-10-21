# VueUI Nova — Design.md

> Referência visual: `doc/Ui/design.png` (pôster oficial VueUI Nova Design System, v1.0.0 — Setembro 2026).
> Fonte de verdade dos tokens implementados: `src/tokens/_tokens.scss` (fonte única SCSS; emite `:root --v-*` para live editing).
> Convenções de implementação: `.opencode/skills/vue-component-development/SKILL.md`.

## 1. Visão geral

VueUI Nova é um design system moderno para Vue 3, inspirado na clareza do macOS, com identidade própria.
Promessa do pôster: **"Interfaces que fluem. Para ideias que vão além."** / **"Clareza. Foco. Liberdade. Design para o que importa."**

Posicionamento: Moderno · Acessível · Flexível · Escalável.

### Princípios visuais (seção 19 do pôster)

| Princípio | Significado | Implicação prática |
|---|---|---|
| Clareza | Interfaces limpas e objetivas | Hierarquia tipográfica estrita, um foco por tela, SFC declarativo e pequeno |
| Consistência | Padrões claros em toda a experiência | Um componente = uma pasta em `src/components/<categoria>/<VNome>/`; BEM leve; `variant`/`size`/`tone`/`state` |
| Flexibilidade | Funciona em qualquer contexto | Tokens em camadas primitive → semantic → component; props tipadas mínimas |
| Acessibilidade | Inclusivo por padrão | Semântica nativa primeiro, `:focus-visible` obrigatório, teclado, `prefers-reduced-motion` |
| Beleza funcional | Design que facilita, não atrapalha | Motion apenas em `transform`/`opacity`; sombras sutis; `data-test-id` estável para E2E |

> "Mais que componentes. Uma experiência."

## 2. Cores (01)

Paletas semânticas e consistentes para todos os contextos.

### Neutros 50–900

Escala de 10 passos (50, 100, 200, 300, 400, 500, 600, 700, 800, 900), do quase-branco ao quase-preto.
Uso: texto, fundos, bordas sutis, superfícies.

### Brand (Primary) 50–900

Escala de 10 passos (50–900). Ancoragem confirmada no pôster (seção 16):

- `primary-500: #6366F1`
- `primary-600: #4F46E5`

Uso: ações primárias, foco, estados ativos, links.

### Semânticas

| Token | Uso |
|---|---|
| Sucesso (verde) | Confirmações, status OK, métricas positivas |
| Informação (azul) | Avisos neutros, ajuda, atividade recente |
| Aviso (amarelo/âmbar) | Atenção sem bloqueio, pendências |
| Erro (vermelho) | Falhas, validação, ações destrutivas |

### Tons especiais

`Purple` · `Pink` · `Indigo` · `Teal` · `Orange` · `Lime` — usados em ilustrações, data viz e accents de categoria. Não usar como cor de ação primária.

Regra da skill: nunca codificar cor literal quando existir token semântico.

## 3. Tipografia (02)

Família: **Inter** — Moderna. Versátil. Atemporal.
Hierarquia clara e legível, com foco em produtividade.

### Display

| Estilo | Tamanho / Altura | Peso |
|---|---|---|
| Display 1 | 60/72 | 700 |
| Display 2 | 48/60 | 700 |

### Heading

| Estilo | Tamanho / Altura | Peso |
|---|---|---|
| H1 | 34/44 | 700 |
| H2 | 24/32 | 700 |
| H3 | 20/28 | 600 |
| H4 | 18/26 | 600 |
| H5 | 16/24 | 600 |

### Text

| Estilo | Tamanho / Altura | Peso |
|---|---|---|
| Large | 16/24 | 400 |
| Medium | 14/20 | 400 |
| Small | 12/16 | 400 |
| Caption | 11/16 | 400 |

Texto de prova do pôster: "The quick brown fox jumps over the lazy dog."

## 4. Espaçamento (03)

Escala baseada em **4px**:

`0 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

Usar tokens de espaço em padding de componente (ex.: seção 17 usa `var(--space-3)` / `var(--space-4)` no botão) e em gaps de layout. Não usar valores arbitrários quando houver passo da escala.

## 5. Raios (04)

Raios para uma linguagem suave e moderna:

`0 · 4 · 8 · 12 · 16 · 24`

Mapeamento implementado hoje: `--v-radius-sm: 8px`, `--v-radius-md: 12px`, `--v-radius-lg: 16px` (ver seção 20).

## 6. Sombras (05)

Sombras sutis para profundidade e hierarquia:

`sm · md · lg · xl`

Uso: `sm` para controles, `md` para cards/surface, `lg` para popovers/dropdowns, `xl` para modais/sheets. Ver gap na seção 20 — ainda sem tokens em `_tokens.scss`.

## 7. Borders (06)

Bordas consistentes e delicadas:

| Estado | Largura |
|---|---|
| Default | 1px |
| Hover | 1px |
| Focus | 2px |

Cor base: `--v-color-border: #dbe3f0`. Foco usa cor de foco (`--v-color-focus: #6366f1`) com 2px + anel visível via `:focus-visible`.

## 8. Superfícies (07)

Camadas para organizar o conteúdo:

| Camada | Token conceitual | Uso |
|---|---|---|
| Background | `bg` | Fundo da aplicação (`#f8faff` / pós­ter seção 16 `elevated #F8FAFC`) |
| Surface | `surface` | Cards, painéis (`#FFFFFF`) |
| Elevated | `elevated` | Elementos com sombra `md/lg` |
| Overlay | `overlay` | Gradiente/translúcido sobre ilustração ou backdrop de modal |

## 9. Estados (08)

Estados visuais padrão para componentes:

`Default · Hover · Pressed · Focus · Disabled` (+ `Loading` quando fizer sentido, conforme a skill).

Todos os elementos interativos precisam implementar os cinco estados com tokens (nunca valores mágicos). Exemplo: `--v-color-primary` → `--v-color-primary-hover` → pressed (escurecer) → focus (anel) → disabled (opacidade/cinza).

## 10. Motion (09)

Animações suaves e naturais:

| Conceito | Valor do pôster |
|---|---|
| Duração | 100–300ms |
| Easing | cubic-bezier |
| Escala | 0.98–1.02 |
| Fade | 0–100% |
| Slide | 4–24px |
| Spring | suave |

Implementado hoje: `--v-motion-fast: 100ms`, `--v-motion-normal: 160ms`, `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`, com `prefers-reduced-motion` zerando durações. Motion apenas em `transform`, `opacity` e propriedades baratas.

## 11. Easings (10)

Curvas de animação para diferentes situações:

| Curva | Uso |
|---|---|
| ease-out | Entrada |
| ease-in | Saída |
| ease-in-out | Padrão |
| spring | Interativa |

## 12. Breakpoints (11)

Sistema responsivo para todos os dispositivos:

| Nome | Valor |
|---|---|
| xs | < 640px |
| sm | ≥ 640px |
| md | ≥ 768px |
| lg | ≥ 1024px |
| xl | ≥ 1280px |
| 2xl | ≥ 1536px |

## 13. Grid (12)

Sistema de layout flexível:

- 12 colunas
- Gutter: 24px
- Margins: 24px
- Máx. largura: 1440px

## 14. Ícones (13)

Estilo consistente e minimalista, duotone opcional. Regra da skill: sem dependência direta de ícones no componente — usar `VIcon`/registry quando disponível. Tamanho deve seguir escala de espaçamento (ex.: 16/20/24).

## 15. Ilustrações (14)

Estilo leve, moderno e amigável:

- Foco no que importa
- Simples e expressivo
- Cores suaves e consistentes (usar tons especiais + brand claros, nunca semânticas de erro para ilustração neutra)

## 16. Data Visualization (15)

Cores semânticas para gráficos e métricas. Distribuição de exemplo do pôster:

| Série | % |
|---|---|
| Product | 40% |
| Design | 24% |
| Development | 20% |
| Marketing | 12% |
| Outros | 4% |

Destaques: donut `72% Concluído`, barra com pico `2.4k +12%`. Usar paleta categorial (brand + tons especiais), reservando verde/vermelho para positivo/negativo.

## 17. Tokens em camadas — exemplo (16)

Estrutura `primitive → semantic → component`, conforme o pôster:

```json
{
  "colors": {
    "primary": { "500": "#6366F1", "600": "#4F46E5" }
  },
  "surface": {
    "default": "#FFFFFF",
    "elevated": "#F8FAFC"
  }
}
```

## 18. Component Tokens (17)

Tokens específicos por componente (exemplo do botão no pôster):

```json
{
  "button": {
    "bg": "var(--color-primary-500)",
    "hover": "var(--color-primary-600)",
    "text": "var(--color-white)",
    "radius": "var(--radius-md)",
    "padding": "var(--space-3) var(--space-4)"
  }
}
```

Na convenção atual do repo (`--v-*`), isso equivale a `--v-color-primary`, `--v-color-primary-hover`, `--v-radius-md`, `--v-space-3`/`--v-space-4`.

## 19. Aplicação em Vue (18)

Uso dos tokens no projeto (exemplo do pôster, adaptado à skill):

```vue
<template>
  <VButton variant="primary" data-test-id="cta-primary">Clique aqui</VButton>
</template>

<script setup lang="ts">
import { VButton } from '@/components/actions/VButton'
</script>
```

```scss
// VButton.scss — BEM leve + nesting + tokens (fonte: src/tokens/_tokens.scss via var(--v-*))
.v-button {
  background: var(--v-color-primary);
  color: var(--v-color-surface);
  border-radius: var(--v-radius-md);
  padding: var(--v-space-3) var(--v-space-4);
  transition:
    background var(--v-motion-normal) var(--v-ease-standard),
    transform var(--v-motion-fast) var(--v-ease-standard);

  &:hover { background: var(--v-color-primary-hover); }
  &:active { transform: scale(0.98); }
  &:focus-visible {
    outline: var(--v-focus-ring-width) solid var(--v-color-focus);
    outline-offset: var(--v-focus-ring-offset);
  }
  &:disabled { opacity: var(--v-state-disabled-opacity); cursor: not-allowed; }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

Estrutura por componente (skill): `VButton.vue` (SFC enxuto) · `VButton.scss` · `useVButton.ts` (estado/eventos) · `mountVButton.ts` (normalização) · `VButton.types.ts` (`variant`/`size`/`tone`/`state`) · `VButton.stories.ts` · `VButton.mdx` · `index.ts` · `_tests/` (unit + Playwright).

## 20. Correspondência com `src/tokens/_tokens.scss` (fonte única; emite `:root --v-*` para live editing)

Expansão total: 145 tokens. Paleta base Tailwind v3 documentada no topo de `_tokens.scss` (indigo bate exato nas âncoras 500 `#6366F1` / 600 `#4F46E5`).

| Conceito do pôster | Token `--v-*` real | Status |
|---|---|---|
| Surface bg `#f8faff` | `--v-color-bg` (alias) | OK |
| Surface surface `#ffffff` | `--v-color-surface` (alias) | OK |
| Texto principal | `--v-color-text` (alias) | OK |
| Texto muted | `--v-color-text-muted` (alias) | OK |
| Primary 500/600 | `--v-color-primary-500/600` + alias `--v-color-primary` | OK |
| Neutros 50–900 | `--v-color-neutral-50…900` | OK |
| Brand 50–900 | `--v-color-primary-50…900` | OK |
| Semânticas (4× soft/base/strong/contrast) | `--v-color-{success,info,warning,error}-{soft,base,strong,contrast}` | OK |
| Especiais (6× light/base/dark) | `--v-color-{purple,pink,indigo,teal,orange,lime}-{light,base,dark}` | OK |
| Superfícies | `--v-color-bg/surface/elevated/overlay` | OK |
| Tipografia fluida Inter | `--v-font-size-display-1…caption` (clamp) + `--v-line-height-*` + `--v-font-weight-*` | OK |
| Spacing 0–96 | `--v-space-0/1/2/3/4/6/8/12/16/24` | OK |
| Raios 0–24 | `--v-radius-0/4/8/12/16/24` + alias sm/md/lg/full | OK |
| Sombras sm–xl | `--v-shadow-sm/md/lg/xl` | OK |
| Bordas default/focus/disabled | `--v-border-width(-focus)`, `--v-color-border(-disabled)` | OK |
| Motion 100/160/300 + spin | `--v-motion-fast/normal/slow/spin-duration` | OK |
| Easings out/in/in-out/spring | `--v-ease-out/in/in-out/spring` (+ standard) | OK |
| Estados hover/pressed/disabled/loading | `--v-state-hover-mix/pressed-mix/disabled-opacity/loading-opacity` | OK |
| Breakpoints xs–2xl + grid | `--v-breakpoint-*`, `--v-grid-columns/gutter/margins/max-width` | OK |
| `prefers-reduced-motion` | zera motions | OK |

Sem gaps: todas as 8 pendências anteriores foram implementadas.
