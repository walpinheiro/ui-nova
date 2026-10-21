# VNotificationItem — DESIGN-SPEC (fonte: doc/Ui/VNotificationItem.png)

> Página de documentação do componente VNotificationItem (VueUI Nova › Components › VNotificationItem, v1.0.0).
> Tagline da página: "A flexible notification item for messages, activity, and system alerts."
> Três pilares no topo: **Versatile** (Supports user messages, system alerts, and activity) · **Clear** (Communicates key information at a glance) · **Actionable** (Built for real workflows with optional actions).
> Header da página: breadcrumb "VueUI Nova › Components › VNotificationItem", título "Components / VNotificationItem", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, **Notification ativo**, Select, Tabs, Tooltip) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Keep your users informed. Beautifully."
> Footer da página: "Open source · Customizable · Production ready".

## 1) Objetivo do componente

Unidade de notificação flexível para mensagens de utilizadores, atividade e alertas de sistema dentro de listas (centro de notificações, inbox, feed). Cada item comunica quem/que aconteceu, o detalhe, quando aconteceu e o estado de leitura, com ações opcionais para o próximo passo (configurar integração, aceitar/declinar convite, abrir menu `…`). Pro tip: usar o estado não-lido com parcimónia para chamar a atenção apenas para o que mais importa.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the notification item" (exemplo Sarah Chen):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Unread indicator (1) | estado | Ponto azul à extrema-esquerda quando `unread=true`; ausente quando lido |
| Avatar (2) | sim (variante) | Foto circular do ator (Sarah Chen) ou ícone de sistema (check verde, `i` azul, `N` Notion, triângulo de aviso laranja) |
| Content (3) | sim | Título forte ("Sarah Chen mentioned you") + pré-visualização secundária ("@john take a look at this design…") |
| Timestamp (4) | sim | Texto relativo à direita ("2m ago", "12m ago", "1h ago", "3h ago", "1d ago") |
| Actions (5) | não | Menu `…` à extrema-direita e/ou botões inline ("Set up", "Accept" primary + "Decline") |

Elementos da seção "In context — Notifications in a real interface" (painel real com sidebar Acme: Dashboard, Inbox `12` ativo, Projects, Calendar, Team, Settings; tabs All, Unread `3`, Mentions, System; busca `Search notifications…`):

- "Sarah Chen mentioned you in a comment / @john take a look at this design when you have a moment." — 2m ago, ponto azul, `…`.
- "Build completed successfully / Deploy preview is ready for review." — 12m ago, avatar check verde, `…`.
- "New integration available / Connect your workspace with Notion to sync pages." — 1h ago, ícone Notion, botão `Set up`, `…`.
- "Alex Rivera invited you to join Acme / You've been invited to collaborate on the Design System." — 3h ago, foto, botões `Accept` + `Decline`, `…`.
- "Scheduled maintenance / Our systems will be offline for 2 hours on Jan 20, 2026." — 1d ago, triângulo laranja, `…`.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different notification types for different needs", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| With avatar | Foto + ponto azul, "Sarah Chen mentioned you / 2m ago" | Atividade de utilizador com avatar e pré-visualização da mensagem |
| System alert | Ícone `i` azul, "New feature available / Check out what's new in this release." | Mensagens informativas do produto |
| Success update | Check verde, "Changes saved / Your updates have been synced." | Feedback positivo e confirmações |
| Actionable item | Ícone Notion + seta `›`, "Connect Notion / Sync your workspace to get started." | Inclui ação ou link para o próximo passo |

### Tamanhos ("Sizes — Three sizes for different contexts", 3 exemplares)

| Tamanho | Observado |
|---|---|
| Small | Linha densa "New comment on your post / 1h ago" — compacto para listas densas |
| Medium (default) | Mesmo conteúdo com padding equilibrado e borda de destaque azul — uso quotidiano |
| Large | Mesmo conteúdo com padding e tipo ampliados — ênfase e legibilidade |

## 4) Estados ("States — Visual states for different situations", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Unread | Fundo tintado azul-claro + ponto azul + "New comment / 2m ago" |
| Read | Fundo branco, sem ponto, avatar normal |
| Hover | Fundo hover + cursor pointer sobre o item |
| Focused action | Item com botão `…` delineado (foco visível na ação) |
| Pressed action | Botão `…` preenchido cinza (ação premida) |
| Disabled | Item acinzentado (avatar e texto dessaturados), sem interação |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click no item | Abre o detalhe/contexto da notificação; marca como lida (ponto desaparece) |
| Click ação inline (Set up / Accept / Decline) | Executa a ação sem abrir o detalhe; `stopPropagation` para não disparar o click do item |
| Click `…` | Abre menu contextual (marcar como lida, silenciar, remover); `…` focável por Tab |
| Hover | Transição de `background` 80ms ease-out; revela/fortalece ações |
| Focus / Tab | Indicador de foco visível no item/ação; ordem: item → ações inline → `…` |
| Teclado Enter / Space | Ativa item ou ação focada |
| Escape no menu `…` | Fecha menu e devolve foco ao botão `…` |

## 6) Motion ("Motion — Smooth, purposeful interactions", 3 especificações literais)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Appear | **120ms ease-out** | `--v-motion-fast: 100ms` (aprox.) + `--v-ease-out` (entrada do item) |
| Hover | **80ms ease-out** | Sem token exato (abaixo de fast); aproximar com `--v-motion-fast`; `background` |
| Press | **60ms ease-out** | Sem token exato; aproximar com `--v-motion-fast`; `transform: scale(0.99)` |

Regras gerais: animar apenas `transform`/`opacity` (+ `background` barato no hover); saída usa `ease-in`; `prefers-reduced-motion: reduce` elimina appear/hover animados.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-notification-item {
  background: var(--v-color-surface); // #FFFFFF
  border: 1px solid var(--v-color-border); // #E5E7EB
  border-radius: var(--v-radius-md); // 12px
  padding: 16px;
  gap: 12px;
  transition:
    background 80ms var(--v-ease-out),
    transform 60ms var(--v-ease-out),
    opacity 120ms var(--v-ease-out);

  &.is-unread { background: var(--v-color-info-bg); } // #F8FAFF
  &:active { transform: scale(0.99); }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 8 checks literais)

1. **ARIA role="listitem"** — cada item com `role="listitem"`.
2. **Works within role="list"** — lista contentora com `role="list"` (ou `<ul>/<li>` nativos).
3. **Keyboard navigable actions** — ações inline e `…` atingíveis e operáveis por teclado.
4. **Visible focus indicators** — foco visível no item e nas ações (estado Focused action).
5. **Sufficient color contrast** — título, preview e timestamp dentro do mínimo WCAG AA; estado lido/não-lido não depende só da cor (ponto + peso).
6. **Meaningful alt text for avatars** — `alt="Sarah Chen"` nas fotos; ícones decorativos com `aria-hidden`.
7. **Supports screen readers** — título + tempo anunciados; mudança lido/não-lido via `aria-live` subtil ou região viva da lista.
8. **Follows WCAG 2.2 AA** — conforme WCAG 2.2 AA.

## 8) data-test-ids sugeridos

- `v-notification-item` (root; `data-variant="avatar|system|success|actionable"`, `data-size="sm|md|lg"`, `data-state="unread|read|hover|focused|pressed|disabled"`)
- `v-notification-unread-dot`
- `v-notification-avatar`
- `v-notification-title` ("Sarah Chen mentioned you")
- `v-notification-preview`
- `v-notification-time` ("2m ago")
- `v-notification-action-setup` (botão "Set up")
- `v-notification-action-accept` / `v-notification-action-decline`
- `v-notification-menu` (botão `…`)
- `docs-notification-variant-{avatar,system,success,actionable}`
- `docs-notification-size-{sm,md,lg}`
- `docs-notification-state-{unread,read,hover,focused,pressed,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--notification-bg` | `#FFFFFF` |
| `--notification-hover` | `#F8FAFF` |
| `--notification-border` | `#E5E7EB` |
| `--notification-unread` | `#3882F6` (ponto azul; ler como azul primary do sistema) |
| `--notification-success` | `#22C55E` |
| `--notification-warning` | `#F59E0B` (triângulo laranja de manutenção) |
| `--notification-error` | `#EF4444` |
| `--notification-radius` | `12px` |
| `--notification-padding` | `16px` |
| `--notification-gap` | `12px` |

No repo equivalem a `--v-color-surface`, `--v-color-info-bg`, `--v-color-border`, `--v-color-primary`, `--v-color-success`, `--v-color-warning`, `--v-color-danger`, `--v-radius-md`, `--v-space-4`, `--v-space-3`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VNotificationItem
    avatar="user.avatar"
    title="Sarah Chen mentioned you"
    time="2m ago"
    :unread="true"
    @action="handleClick"
  />
</template>
```

**Pro tip (literal):** "Use the unread state sparingly to draw attention to what matters most."
