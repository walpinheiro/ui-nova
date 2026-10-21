# VNotificationCenter — DESIGN-SPEC (fonte: doc/Ui/VNotificationCenter.png)

> Página de documentação do componente VNotificationCenter (VueUI Nova › Components › VNotificationCenter, v1.0.0).
> Tagline da página: "A flexible notification center for in-app messages, alerts, and updates."
> Três pilares no topo: **Organized** (Group and filter notifications with a clean, structured interface) · **Flexible** (Multiple display modes and placement options for any use case) · **Actionable** (Built-in actions, unread states, and quick management tools).
> Header da página: breadcrumb "VueUI Nova › Components › VNotificationCenter", título "Components / VNotificationCenter", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VNotificationCenter ativo**, Window) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Stay informed. Stay in flow."
> Hero "IN CONTEXT — Keep your team in the loop": marketing "Surface what matters, right when it matters. The notifications center helps users stay informed without leaving their workflow." + mock app (sidebar Acme: Dashboard, Inbox `3`, Projects, Calendar, Team, Settings; busca `Search across your workspace… ⌘K`) + painel Notifications aberto (sino com badge, avatar J).
> Footer da página: "Open source · Customizable · Production ready".

## 1) Objetivo do componente

Centro de notificações in-app para mensagens, alertas e atualizações sem sair do fluxo de trabalho. Agrupa e filtra notificações (tabs All/Unread/Mentions/Updates), sinaliza não-lidas com badge e pontos, oferece gestão rápida ("Mark all as read", "View all notifications →") e agrupa por tempo ("Today", "Yesterday"). Pro tip: usar rótulos claros e status para ajudar a escanear e agir rapidamente nas notificações importantes.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the notification center":

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Trigger — icon with badge (1) | sim | Sino com ponto/badge vermelho de não-lidas (tamanhos 24/32/40); abre o painel |
| Header (2) | sim | Título "Notifications" + sino com badge + avatar do utilizador |
| Actions — Mark all as read (3) | não | Link "Mark all as read" + botão `…` (gestão rápida) |
| Tabs (4) | sim | Abas "All" (ativa) / "Unread `3`" / "Mentions" / "Updates" para filtrar |
| Notification item (5) | sim | Linhas `VNotificationItem`: ícone, título, preview, tempo, ponto azul/cinza (ex.: "Design file shared with you / Sarah shared "Landing Page v2.fig" with you." — 2m ago) |
| Footer / View all (6) | não | Link "View all notifications →" no fundo do painel |

Conteúdo do painel hero: secção "Today" (Design file shared with you 2m ago; New comment 15m ago; You were mentioned 1h ago) + "Yesterday" (Build completed 5h ago) + "View all notifications →".

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different display patterns for different use cases", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Compact | Só o sino com badge vermelho em cartão | Ícone com badge, abre o painel |
| Grouped | Mini painel "Notifications" com tabs All/Unread/Mentions + item | Categorizado com abas |
| Activity feed | Lista "Recent activity": New sign up 2m ago, Payment received 12m ago, Feature released 1h ago | Lista de atividade simplificada |
| Drawer | Painel lateral "Notifications ⌄" com `×`, tabs e item | Painel lateral para conteúdo maior |

### Tamanhos ("Sizes — Different sizes for different contexts", 3 exemplares de trigger)

| Tamanho | Observado |
|---|---|
| Small `24 × 24` | Sino compacto com badge |
| Medium (default) `32 × 32` | Sino padrão com badge (destaque azul na doc) |
| Large `40 × 40` | Sino amplo com badge |

## 4) Estados ("States — Common states for different situations", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Empty | Sino + "No notifications yet." — sem notificações |
| Unread | "New message / You have 3 unread messages." com sino azul e ponto — indica não-lidas |
| Hover item | "Project updated / Click to view details." com ícone azul — hover interativo sobre o item |
| Loading | Linhas skeleton (barras cinza) — estado de carregamento |
| Filtered | Campo de busca com "design" + resultado "Design updated / 1 result found." — busca/filtra resultados |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click trigger (sino) | Abre/fecha o painel; badge limpa após leitura |
| Click tab (All/Unread/Mentions/Updates) | Filtra a lista; "Unread `3`" mostra contagem |
| Click "Mark all as read" | Marca tudo como lido; pontos/badge desaparecem |
| Click item | Abre detalhe; marca item como lido (ponto azul → cinza) |
| Hover item | Destaque interativo ("Click to view details") |
| Busca/filtro ("design") | Filtra para "1 result found" |
| Click "View all notifications →" | Navega para a vista completa de notificações |
| Teclado Tab / Esc | Tab navega trigger → tabs → itens → ações; Esc fecha o painel e devolve foco ao sino |
| Click-fora | Fecha o painel aberto |

## 6) Motion ("Motion — Smooth and purposeful interactions", 4 especificações literais)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Fade in | **120ms ease-out** | `--v-motion-fast: 100ms` (aprox.) + `--v-ease-out` (abertura do painel) |
| Scale | **150ms ease-out** | `--v-motion-normal: 160ms` (aprox.) + `--v-ease-out` (trigger/popover) |
| Slide up | **200ms ease-out** | Sem token exato (entre normal 160ms e slow 300ms); `transform: translateY(4px→0)` + `opacity` |
| Item hover | **100ms ease-out** | `--v-motion-fast: 100ms` + `--v-ease-out` (`background`) |

Regras gerais: animar apenas `transform`/`opacity` (+ `background` barato no hover); saída usa `ease-in`; `prefers-reduced-motion: reduce` desativa fade/scale/slide.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-notification-center-panel {
  background: var(--v-color-surface); // #FFFFFF
  border: 1px solid var(--v-color-border); // #E5E7EB
  border-radius: var(--v-radius-lg); // 16px
  padding: 16px;
  box-shadow: 0 8px 30px rgba(16, 24, 40, 0.08);
  transition:
    opacity 120ms var(--v-ease-out),
    transform 200ms var(--v-ease-out);

  &.is-entering { opacity: 0; transform: translateY(4px) scale(0.98); }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Built with accessibility in mind", 7 checks literais)

1. **ARIA roles and labels** — painel com `role="dialog"`/`region` rotulado, lista com `role="list"`, itens `listitem`.
2. **Keyboard navigation (Tab, Esc)** — trigger, tabs, itens e ações operáveis; Esc fecha.
3. **Focus management** — foco entra no painel à abertura e volta ao sino ao fechar; focus trap leve no drawer.
4. **Screen reader announcements** — contagem de não-lidas ("3 unread") anunciada via `aria-live`.
5. **Sufficient color contrast** — texto `#111827`/`#687280` sobre branco dentro do mínimo WCAG AA.
6. **Clear unread indicators** — não-lidas sinalizadas por ponto + contagem, não só pela cor.
7. **Works in high contrast mode** — badge, pontos e bordas visíveis em alto contraste (forced-colors).

## 8) data-test-ids sugeridos

- `v-notification-center` (root; `data-variant="compact|grouped|feed|drawer"`, `data-state`)
- `v-notification-center-trigger` (sino; `data-size="sm|md|lg"`, `data-unread-count="3"`)
- `v-notification-center-badge`
- `v-notification-center-header`
- `v-notification-center-mark-all` ("Mark all as read")
- `v-notification-center-tab-{all,unread,mentions,updates}`
- `v-notification-center-group-today` / `v-notification-center-group-yesterday`
- `v-notification-center-item-*` (itens; delegam a `v-notification-item`)
- `v-notification-center-search` (busca "design")
- `v-notification-center-view-all` ("View all notifications")
- `v-notification-center-empty` / `v-notification-center-loading`
- `docs-notification-center-variant-{compact,grouped,feed,drawer}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--notification-bg` | `#FFFFFF` |
| `--notification-border` | `#E5E7EB` |
| `--notification-shadow` | `0 8px 30px rgba(16, 24, 40, 0.08)` |
| `--notification-radius` | `16px` |
| `--notification-padding` | `16px` |
| `--notification-unread` | `#3882F6` |
| `--notification-badge` | `#EF4444` |
| `--notification-text` | `#111827` |
| `--notification-muted` | `#687280` |

No repo equivalem a `--v-color-surface`, `--v-color-border`, `--v-shadow-lg`, `--v-radius-lg`, `--v-space-4`, `--v-color-primary`, `--v-color-danger`, `--v-color-text`, `--v-color-text-muted`.

## Uso Vue (transcrição literal do card "Vue usage — A simple example to get you started")

```vue
<template>
  <VNotificationCenter
    :notifications="notifications"
    :model-value="open"
    @update:model-value="open = $event"
  />
</template>
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
```

**Pro tip (literal):** "Use clear titles and labels to help users quickly scan and act on important notifications."
