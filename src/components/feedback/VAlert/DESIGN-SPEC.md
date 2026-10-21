# VAlert — DESIGN-SPEC (fonte: doc/Ui/VAlert.png)

> Status: ✅ Concluído e validado  
> Data: 2026-09-20  
> Testes: `pnpm exec vitest run src/components/feedback/VAlert/_tests/VAlert.spec.ts` — 9/9; `pnpm exec playwright test src/components/feedback/VAlert/_tests/VAlert.e2e.spec.ts` — 6/6; `vue-tsc --noEmit` sem diagnósticos em `src/components/feedback/VAlert`.  
> Validação visual: inspeção do `doc/Ui/VAlert.png`, screenshot do VAlert renderizado no navegador e asserções Playwright dos cinco fundos semânticos, paddings SM/MD/LG, anatomia, foco/hover/pressed, banner/responsividade e reduced motion.  
> Bloqueio externo: o Storybook não pôde ser iniciado porque o repositório não contém `.storybook/main.*`; a validação Playwright foi executada contra o SFC real servido pelo Vite, sem alterar configuração/harness proibidos.

## 1) Objetivo do componente

O `VAlert` comunica informação importante, orienta e ajuda o utilizador a agir — success, error, warning, info
ou mensagens neutras dentro do produto.
Cabeçalho: **"Alert — Inline status and guidance message"** + **"Guide users at the right moment."**
(*"Clear messages. Confident users. Better outcomes."*) — *"Alerts communicate important information, provide
guidance, and help users take action. Use alerts to show success, errors, warnings, info, or neutral messages
within your product."*
Três pilares: **Clear** ("Convey information at a glance"), **Flexible** ("Inline or banner variants"),
**Accessible** ("Built for everyone").
Hero "PRIMARY ACTION": 5 alertas empilhados — info "New update available! Version 2.4 includes performance
improvements.", success "Your changes have been saved.", warning "Please review your information before
continuing.", danger "Something went wrong. Please try again.", neutro "This is a neutral message with helpful
information." — todos com ícone à esquerda e `×` à direita (só o neutro sem `×` visível).
Nota manuscrita: *"Inform. Guide. Keep users moving."*
Rodapé: "Flexible API for any use case. Supports variants, sizes, icons, dismissible, slots, and more."
+ "Learn more at vueui.dev →" + *"Small components. A brighter tomorrow."*
Exemplo de código (transcrito): `<Alert variant="info" title="New update available!"
description="Version 2.4 includes performance improvements." dismissible />`.

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomia numerada ("The building blocks of an alert", exemplo info):

- **Icon slot (16×16px)** — círculo azul com "i" (info); por variante: check verde, triângulo âmbar, "!" vermelho,
  círculo cinzento (neutro).
- **Label (semibold)** — "New update available!" (peso 600, 14px).
- **Description (optional)** — "Version 2.4 includes…" (14px, peso normal).
- **Content (title + description)** — o conjunto label + descrição.
- **Close button (optional)** — `×` à direita (14px).
- **Container (background + border)** — caixa arredondada (radius 12px) com fundo e borda por variante.

Séries visíveis: cartões de variante com título colorido + descrição ("Info / General information and helpful
guidance.", "Success / Positive feedback and confirmations.", "Warning / Caution and potential risks to be aware
of.", "Danger / Errors and critical issues that need attention.", "Neutral / Supplementary information.");
3 linhas de tamanho (Small/Medium Default/Large) com o mesmo alerta info em paddings diferentes.

## 3) Variantes e tamanhos visíveis

Variantes (5 cartões):

| Variante | Cor | Uso |
|---|---|---|
| **Info** | Azul | "General information and helpful guidance." |
| **Success** | Verde | "Positive feedback and confirmations." |
| **Warning** | Âmbar | "Caution and potential risks to be aware of." |
| **Danger** | Vermelho | "Errors and critical issues that need attention." |
| **Neutral** | Cinzento | "Supplementary information." |

Tamanhos ("Consistent sizing for different contexts"):

| Tamanho | Padding Y | Uso |
|---|---|---|
| **Small** | 8px | Mensagens compactas |
| **Medium (Default)** | 12px | Uso geral (destaque azul no poster) |
| **Large** | 16px | Mais presença |

Tabela "Design tokens — Key values for consistent implementation" (valores literais):

| Token | Valor |
|---|---|
| Container radius | 12px |
| Icon size | 16px |
| Close icon size | 14px |
| Padding Y (SM) | 8px |
| Padding Y (MD) | 12px |
| Padding Y (LG) | 16px |
| Padding X | 16px |
| Gap (icon – text) | 12px |
| Border width | 1px |
| Font weight (title) | 600 (Semibold) |
| Font size (title) | 14px |
| Font size (description) | 14px |
| Line height | 20px |
| Shadow (optional) | 0 1px 2px rgba(0,0,0,0.04) |

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Tabela "States — How the alert looks in different states" (8 linhas, transcrita):

| State | Preview | Description |
|---|---|---|
| **Default** | Alerta base com `×` | "Default appearance." |
| **Hover action** | Cursor mão sobre o alerta | "Shows hover feedback on interactive elements." |
| **Focus action** | Anel azul à volta | "Shows focus ring for keyboard navigation." |
| **Pressed action** | Fundo azul mais escuro | "Shows pressed state." |
| **Dismissed** | Alerta esmaecido "This alert has been dismissed." | "Removed from view after closing." |
| **Banner style** | Largura total "This is a banner alert message." | "Full-width banner for important announcements." |
| **Inline style** | "This is an inline alert message." | "Inline with surrounding content." |
| **Disabled action** | "This is a disabled alert." esmaecido | "Non-interactive state." |

Loading não ilustrado: inferido — spinner no icon slot + texto skeleton, mantendo container e layout.

## 5) Micro-interações (click, hover, teclado, overlays)

- **Hover em elementos interativos** (links/`×` dentro do alerta): feedback de fundo (escurece subtilmente).
- **Focus por teclado**: anel de foco azul no elemento focado (`Tab` até ao botão fechar/ação).
- **Pressed**: escala subtil para baixo no elemento ativo.
- **Close (`×`)**: click (ou `Enter`/`Espaço` com foco) dispara fade + slide-out de 200ms e remove o alerta
  ("Dismissed" → "Removed from view after closing"); "Dismissible with keyboard".
- **Banner vs. Inline**: banner ocupa largura total (anúncios importantes); inline flui com o conteúdo.
- **Overlays**: o Alert é inline/banner — não cria overlay nem backdrop.
- Leitura por leitor de ecrã anunciada via `role="alert"` (ver A11y).

## 6) Motion (durações, easing, transições, cruzando com tokens do DESIGN.md)

Sequência "Motion — Subtle, purposeful motion" (4 fases literais):

| Fase | Efeito literal |
|---|---|
| **Default** | "Resting state." |
| **Hover** | "Slight background darken. 120ms ease-out." |
| **Press** | "Slight scale down. 80ms ease-out." |
| **Close** | "Fade and slide out. 200ms ease-in." |

Cruzamento com tokens `DESIGN.md`:

| Conceito | Token `--v-*` | Uso no Alert |
|---|---|---|
| Hover 120ms | `--v-motion-normal: 160ms` (≈120ms) + `--v-ease-out` | `background-color` do elemento interativo |
| Press 80ms | `--v-motion-fast: 100ms` (≈80ms) + `--v-ease-out` | `transform: scale(0.98)` |
| Close 200ms | `--v-motion-normal/slow` + `--v-ease-in` | `opacity 1→0` + `translateY(0→-4/8px)` do container |
| Shadow | `--v-shadow-sm` (`0 1px 2px rgba(0,0,0,0.04)` — igual ao token do poster) | sombra opcional do container |
| Radius/gap | `--v-radius-md: 12px`, gap 12px (`--v-space-3`) | container radius 12px, gap ícone–texto 12px |

`prefers-reduced-motion`: sem slide/escala — fade simples ou remoção instantânea ("Respects reduced motion").

## 7) Acessibilidade observada

Tabela "Accessibility — Inclusive by design" (transcrita, 2 colunas):

| Requisito | Detalhe |
|---|---|
| Uses semantic role="alert" | Announced by screen readers |
| Sufficient color contrast | Meets WCAG 2.1 AA (≥ 4.5:1) |
| Keyboard accessible | Tab to close button |
| Clear, concise messaging | Short and scannable text |
| Icon + text (not icon-only) | Supports all users |
| Non-color cues | Icons and labels convey meaning |
| Dismissible with keyboard | Enter and Space to close |
| Respects reduced motion | Minimal motion, user preference |

## 8) data-test-ids sugeridos (lista)

- `data-test-id="v-alert"` — contentor raiz
- `data-test-id="v-alert-icon"` — icon slot/visual semântico
- `data-test-id="v-alert-title"` — label ("New update available!")
- `data-test-id="v-alert-description"` — descrição
- `data-test-id="v-alert-content"` — conjunto título + descrição/mensagem
- `data-test-id="v-alert-message"` — default/message slot
- `data-test-id="v-alert-close"` — botão `×`
- `data-test-id="v-alert-action"` — ação interativa interna
- `data-test-id="v-alert-spinner"` — indicador de loading

## 9) Contrato público implementado

Props: `variant: info | success | warning | danger | neutral` (default `info`), `size: sm | md | lg` (default `md`), `layout: inline | banner` (default `inline`), `title`, `description`, `dismissible`, `disabled`, `loading`, `modelValue`, `ariaLabel` e `dismissLabel`.

Slots: `icon`, `title`, `description`, `action` e default/message. Eventos: `dismiss` e `update:modelValue(false)`. O botão de fechar é nativo, usa `type="button"`, suporta Tab/Enter/Espaço e fica disabled durante `disabled` ou `loading`.
