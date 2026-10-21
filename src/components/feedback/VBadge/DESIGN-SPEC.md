# VBadge — DESIGN-SPEC

Fonte visual: `doc/Ui/VBadge.png`.

## 1. Objetivo

`VBadge` é um rótulo pequeno e conciso para status, categoria, contagem e informação importante. A referência apresenta os pilares Informative, Compact e Expressive, além dos exemplos `New`, `Beta`, `Active`, `Warning`, `Count 12`, `Online` e `Pro`.

O componente é não-interativo por padrão. Quando `interactive` é usado, a raiz passa a ser um `button` nativo para oferecer foco, Enter, Espaço e estados de seleção sem criar semântica falsa em badges informativos.

## 2. Anatomia

1. **Container** — a raiz em formato de pílula, com fundo, borda, tipografia e estados.
2. **Label** — o texto do slot padrão.
3. **Optional leading visual** — ícone, dot ou spinner de loading antes do label.
4. **Count** — pílula interna opcional depois do label.

Elementos relevantes têm IDs estáveis: `badge` (raiz), `badge-label`, `badge-icon`, `badge-dot`, `badge-count` e `badge-loader`. `dataTestId` permite nomear instâncias de séries visuais como `badge-status-warning`.

## 3. Variantes

| Variante | Aparência / uso |
|---|---|
| `neutral` | Fundo neutro claro e texto slate; é o default visual. |
| `success` | Fundo success soft e texto success strong. |
| `warning` | Fundo warning soft, texto warning strong e ícone de alerta automático. |
| `danger` | Fundo error soft e texto error strong. |
| `count` | Fundo primary 50, label `Count` por fallback e count azul interno. |
| `dot` | Fundo neutro claro, dot success e label de estado. |
| `outlined` | Fundo transparente, contorno e texto primary. |
| `purple` | Fundo purple light e texto purple dark; usado no hero para `Beta`. |
| `primary` | Fundo primary 600 e texto branco; usado para destaque, como `Pro`. |

`default` e `subtle` permanecem aliases legados de `neutral`. `count` é selecionado automaticamente quando `count` é fornecido sem `variant`; `dot` pode ser combinado com outra variante para manter o tom do badge.

## 4. Tamanhos

| Tamanho | Tipografia / densidade |
|---|---|
| `xs` | text-small, padding compacto. |
| `sm` | text-medium, padding compacto. |
| `md` | text-medium, padding padrão; default. |
| `lg` | text-large, padding amplo. |

Todos os tamanhos usam a escala existente de spacing e tipografia; não há valores visuais hardcoded no SCSS.

## 5. Estados

- **Default** — superfície semântica da variante.
- **Hover** — somente para badges interativos; usa uma mistura sutil do token da variante.
- **Focus-visible** — anel primary/focus de 2px com offset tokenizado.
- **Pressed** — escala sutil de `0.98` durante `:active`.
- **Selected** — `selected` aplica fundo primary sólido e texto branco; em modo não-controlado alterna após click/Enter/Espaço.
- **Disabled** — `disabled`/`loading` desabilita um botão interativo e aplica a opacidade disabled.
- **Loading** — spinner preserva a geometria e expõe `aria-busy="true"`.

Badges informativos não recebem `tabindex` e não entram na ordem de tabulação.

## 6. API

```ts
type VBadgeSize = 'xs' | 'sm' | 'md' | 'lg'
type VBadgeVariant =
  | 'neutral' | 'default' | 'primary' | 'success' | 'warning'
  | 'danger' | 'count' | 'dot' | 'outlined' | 'purple' | 'subtle'

interface VBadgeProps {
  size?: VBadgeSize
  variant?: VBadgeVariant
  count?: string | number
  dot?: boolean
  icon?: string
  interactive?: boolean
  selected?: boolean
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  live?: boolean
  dataTestId?: string
}
```

Eventos: `click`, `select` e `update:selected`.

Slots: `default` para o label e `icon` para substituir o visual textual opcional.

## 7. Ícones e conteúdo

Ícones do poster usam `VIcon` com glyphs Keyline (`@iconify-icons/keyline-icons`): `crown`, `triangle-alert` (warning/alert automático), `info` e `check`. O slot `icon` permite substituir o visual leading. Ícones decorativos usam `aria-hidden` porque o label textual permanece a fonte semântica.

## 8. Motion

| Trigger | Propriedades | Token / easing |
|---|---|---|
| Entrada | `opacity`, `transform: scale(0.98 → 1)` | `--v-motion-normal`, `--v-ease-out` |
| Hover / focus / seleção | `background-color`, `transform`, `box-shadow`, `opacity` | `--v-motion-fast`, `--v-ease-standard` |
| Loading | `transform: rotate()` | `--v-motion-spin-duration`, linear |

Em `prefers-reduced-motion: reduce`, entrada, transições e spinner são neutralizados.

## 9. Acessibilidade

- Semântica nativa: `span` para status informativo e `button type="button"` para `interactive`.
- `aria-pressed` informa seleção; `aria-disabled` e `aria-busy` informam estados.
- `count`, `dot` e `live` usam `role="status"` quando não interativos.
- `ariaLabel` fornece um nome acessível explícito quando o slot não for suficiente.
- Ícones e dots são complementares; significado não depende apenas de cor.
- Foco visível, ativação por Enter/Espaço e disabled nativo cobrem teclado e leitores de tela.

## 10. Tokens

O SCSS usa somente utilities Tailwind e tokens `--v-*` existentes:

- Neutral: `--v-color-neutral-100` / `--v-color-neutral-700`.
- Success: `--v-color-success-soft` / `--v-color-success-strong` / `--v-color-success-base`.
- Warning: `--v-color-warning-soft` / `--v-color-warning-strong` / `--v-color-warning-base`.
- Danger: `--v-color-error-soft` / `--v-color-error-strong` / `--v-color-error-base`.
- Primary: `--v-color-primary-50`, `--v-color-primary-600`, `--v-color-primary-hover`, `--v-color-on-primary`.
- Spacing, radius, motion, focus, opacity, font and loader: tokens globais equivalentes.

TOKEN_REQUEST: o poster nomeia aliases específicos `--v-badge-*` (`bg`, `color`, `border`, superfícies semânticas, dot-size e font-size), mas esses tokens ainda não existem na fonte central. O componente usa os tokens semânticos mais próximos e não duplica valores; a centralização desses aliases pode ser feita pelo coordenador sem alterar esta pasta.

## 11. Uso

```vue
<VBadge>New</VBadge>
<VBadge variant="success">Active</VBadge>
<VBadge variant="warning">Warning</VBadge>
<VBadge :count="12" />
<VBadge dot variant="success">Online</VBadge>
<VBadge variant="primary" icon="crown">Pro</VBadge>
<VBadge interactive @select="onSelect">Filter</VBadge>
```

## 12. Validação

Status: ✅ Concluído e validado

Data: `2026-09-21`

Testes executados:

- `pnpm exec vitest run src/components/feedback/VBadge/_tests/VBadge.spec.ts` — 21 testes (mount helpers + componente).
- `pnpm exec playwright test src/components/feedback/VBadge/_tests/VBadge.e2e.spec.ts` — 5 testes e2e contra `.val-harness/VBadge.html` (`pnpm harness` em `:8321`).
- Harness de validação: `.val-harness/VBadge.html` com hero (poster), variants, sizes, states e interactive.
- Evidência visual: `doc/evidence/VBadge.png` via `node scripts/capture-evidence.cjs`.

Validação visual: comparação com `doc/Ui/VBadge.png` cobrindo neutral, purple (Beta), success, warning, count, dot, primary (Pro), outlined, sizes xs–lg, estados interactive/selected/disabled/loading. Ícones warning e crown via VIcon+Keyline; foco, seleção por teclado e reduced motion conferidos.

Gaps conhecidos (não bloqueantes):

- `TOKEN_REQUEST`: aliases `--v-badge-*` do poster ainda não existem na fonte central; o SCSS usa tokens semânticos equivalentes (`--v-color-*`).
- Harness não reproduz o hero composto do poster (título + grid de anatomia); a matriz de estados cobre os exemplos funcionais.
