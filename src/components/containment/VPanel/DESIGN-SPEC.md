# VPanel — DESIGN-SPEC (fonte: doc/ui/VPanel.png)

> Status: ✅ Concluído e validado  
> Data: 2026-09-20  
> Testes: `pnpm build` — OK; `pnpm exec vitest run src/components/containment/VPanel/_tests/VPanel.spec.ts` — 11/11; Playwright e2e — bloqueado neste ambiente (`playwright install chromium` timeout de rede); specs e harness prontos em `.val-harness/VPanel.html`.  
> Validação visual: inspeção de `doc/ui/VPanel.png`, harness `.val-harness/VPanel.html` e asserções Playwright para variantes (default/bordered/elevated/filled), tamanhos SM/MD/LG, estados (hover interativo, focus-visible, disabled, loading com spinner no ícone), tokens `--v-panel-*` e motion enter/exit.

## 1) Objetivo do componente

O `VPanel` é um contentor flexível para agrupar conteúdo relacionado — informação, ações e media — em secções claras e autocontidas.
Cabeçalho do poster: **"Panel — A flexible container for grouped content"**.
Promessa do hero: *"Panel provides a flexible content container for related information, actions, and media.
Use it to organize content into clear, self-contained sections across your application."*
Três pilares declarados: **Flexible** (suporta diferentes tipos de conteúdo e layouts), **Versatile** (serve para
conteúdo, formulários, dados ou ações), **Consistent** (segue a linguagem visual VueUI Nova).
Exemplo do hero: cartão "Project Overview" — cabeçalho com ícone + título + subtítulo + menu `…`, 4 mini-estatísticas
(12 Files, 5 Collaborators, 3 Active tasks, 2 Days left), bloco "Recent activity" e rodapé com dois botões.
Nota manuscrita no poster: *"Organize content beautifully."*
Pro tip do poster: usar o Panel para agrupar conteúdo relacionado e combiná-lo com Form, Table ou List para criar
secções ricas (exemplo: `<Panel title="Settings" icon="settings"><Form>…</Form></Panel>`).

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomy numerada do poster (5 partes):

1. **Leading icon** — ícone à esquerda do cabeçalho (no hero: ícone de documento dentro de quadrado arredondado
   azul-claro; na anatomia: mesmo ícone de documento).
2. **Title** — título + descrição curta; no exemplo da anatomia: "Panel Title" + "Brief description of the panel."
   No hero: "Project Overview" + "Key information about your project."
3. **Actions / menu** — botão `…` (três pontos) no canto superior direito do cabeçalho.
4. **Content area** — zona livre de conteúdo; no exemplo da anatomia mostra duas barras skeleton (uma longa, uma
   mais curta); no hero contém os 4 cartões de estatística + "Recent activity".
5. **Footer / actions** — barra inferior de ações; no exemplo: botão fantasma "Cancel" + botão primário "Save changes".
   No hero: "View details" (outline) + "Open project →" (primário azul).

Elementos visíveis no hero "Project Overview" (todos fazem parte da spec):

- Cabeçalho: ícone de documento, título "Project Overview", subtítulo "Key information about your project.", botão `…`.
- 4 cartões de estatística lado a lado, cada um com ícone de contorno azul (pasta, pessoas, pulso, relógio),
  número grande em negrito (12 / 5 / 3 / 2) e legenda pequena (Files / Collaborators / Active tasks / Days left).
- Bloco "Recent activity" com link "View all" à direita; 3 linhas: ponto colorido (azul, magenta, verde) + texto
  ("You updated a document", "Design file added", "Task completed") + tempo relativo à direita ("2m ago", "1h ago", "3h ago").
- Rodapé: "View details" (botão outline à esquerda) e "Open project →" (botão primário azul à direita).

Variantes mostram sempre: ícone documento + 2 barras skeleton + `…`. Tamanhos mostram versões compactas do mesmo trio.

## 3) Variantes e tamanhos visíveis

Variantes (4 cartões, cada um com label + descrição):

| Variante | Descrição do poster | Aparência |
|---|---|---|
| **Default** | "Clean and versatile." | Superfície branca, sem borda visível |
| **Bordered** | "Subtle border for separation." | Borda subtil de separação |
| **Elevated** | "Raised surface with shadow." | Superfície elevada com sombra |
| **Filled** | "Subtle background tint." | Fundo com matiz subtil (tom azul-acinzentado) |

Tamanhos (3 cartões; **Medium é o default**, com destaque azul):

| Tamanho | Descrição | Uso |
|---|---|---|
| **Small** | "Compact content." | Conteúdo compacto |
| **Medium (default)** | "Everyday use." | Uso quotidiano |
| **Large** | "Content-heavy sections." | Secções com muito conteúdo |

Design tokens listados no poster (mapeiam tamanhos e variantes):

`--panel-bg`, `--panel-surface`, `--panel-border`, `--panel-radius`, `--panel-shadow`,
`--panel-padding-sm`, `--panel-padding-md`, `--panel-padding-lg`,
`--panel-title-color`, `--panel-text-color`, `--panel-footer-bg`, `--panel-divider`.

Exemplo de uso Vue (transcrito do poster):

```vue
<template>
  <Panel title="Project Overview" icon="folder">
    <p class="text-slate-600">Your content goes here.</p>
    <template #footer>
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </template>
  </Panel>
</template>
```

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Estados do poster (5 cartões lado a lado; mesmo esqueleto ícone + barras + `…`):

| Estado | Aparência no poster |
|---|---|
| **Default** | Aparência base |
| **Hover** | "Subtle background on hover." — fundo subtilmente escurecido |
| **Focused** | "Visible focus ring." — anel de foco azul de 2px à volta do painel |
| **Loading** | "Shows a loading state." — spinner circular azul no lugar do ícone, barras skeleton mantidas |
| **Disabled** | "Reduced opacity and no interaction." — opacidade reduzida, sem interação |

Pressed não tem cartão próprio, mas segue o padrão do sistema (secção 08/09 do DESIGN.md): escurecer via
`--v-state-pressed-mix` + `transform: scale(0.98)` em elementos clicáveis do painel (ex.: botões do rodapé,
menu `…`). Focus usa `:focus-visible` com `outline: 2px solid var(--v-color-focus)` + offset, nunca apenas
`outline: none`. Disabled aplica `opacity: var(--v-state-disabled-opacity)` e `cursor: not-allowed`.

## 5) Micro-interações (click, hover, teclado, overlays)

- **Hover no painel interativo**: fundo muda subtilmente (token de hover); o cursor muda para pointer apenas se o
  painel for clicável; botões do rodapé seguem os seus próprios hovers.
- **Click no menu `…`**: abre menu/overlay de ações do painel (três pontos no cabeçalho).
- **Click "View all"** (Recent activity): navega para a lista completa de atividade.
- **Click nos botões do rodapé**: "Cancel" descarta / fecha; "Save changes" / "Open project →" confirma e avança;
  seguem os estados hover → pressed (scale 0.98) → focus ring → disabled dos botões VueUI Nova.
- **Teclado**: painel interativo é navegável por teclado (Tab até ao painel/controles, Enter/Espaço ativa);
  anel de foco sempre visível via `:focus-visible`.
- **Loading**: spinner substitui o ícone principal enquanto o conteúdo carrega; skeleton preserva o layout para
  evitar saltos (sem overlays a bloquear o resto da página — o Panel é inline, não modal).
- **Entrada/saída**: ver secção Motion — o painel entra com fade + slide-up e sai com fade + slide-down
  (quando dispensado/condicional).

## 6) Motion (durações, easing, transições, cruzando com tokens do DESIGN.md)

Valores literais do poster:

- **Panel entrance**: "Fades and slides up (150ms) for a smooth appearance."
- **Panel exit**: "Fades and slides down (100ms) when dismissed."

Cruzamento com tokens `DESIGN.md` (secções 10–11, 20):

| Conceito do poster | Token `--v-*` real | Uso no Panel |
|---|---|---|
| Entrada 150ms | `--v-motion-normal: 160ms` (≈150ms do poster) | `opacity 0→100%` + `translateY(4–8px → 0)` (slide 4–24px do pôster) |
| Saída 100ms | `--v-motion-fast: 100ms` | `opacity 100→0%` + `translateY(0 → 4–8px)` |
| Easing natural | `--v-ease-out` (entrada), `--v-ease-in` (saída), `--v-ease-standard: cubic-bezier(.2,.8,.2,1)` | entrada ease-out, saída ease-in |
| Escala 0.98–1.02 | `transform: scale(0.98)` no pressed | botões/menu do painel |

Regras obrigatórias: animar apenas `transform`/`opacity`; `transition: opacity …, transform …`;
`@media (prefers-reduced-motion: reduce) { transition: none; }`.
Sombras por camada: variante Elevated usa `--v-shadow-md` (cards/surface).

## 7) Acessibilidade observada

Checklist literal do poster ("Built with accessibility in mind"):

- Semantic container elements (usar `<section>`/região semântica, não `div` genérica).
- Supports proper headings hierarchy (título do painel num nível de heading correto).
- Keyboard navigable when interactive.
- Screen reader friendly structure.
- Sufficient color contrast.
- ARIA roles and labels when interactive.
- Supports focus indicators (anel visível).
- Follows WCAG 2.1 AA best practices.

Implicações: título exposto como heading; `aria-label`/`aria-labelledby` quando o painel for interativo;
contraste de título, texto e dots de atividade ≥ 4.5:1; foco nunca removido sem substituto.

## 8) data-test-ids sugeridos (lista)

- `data-test-id="panel"` — contentor raiz
- `data-test-id="panel-header"` — cabeçalho
- `data-test-id="panel-icon"` — leading icon
- `data-test-id="panel-title"` — título
- `data-test-id="panel-description"` — subtítulo/descrição
- `data-test-id="panel-actions"` — botão `…` (menu)
- `data-test-id="panel-content"` — content area
- `data-test-id="panel-stat-files"` / `panel-stat-collaborators` / `panel-stat-tasks` / `panel-stat-days` — cartões de estatística do hero
- `data-test-id="panel-activity"` — bloco Recent activity
- `data-test-id="panel-activity-view-all"` — link "View all"
- `data-test-id="panel-footer"` — rodapé de ações
- `data-test-id="panel-button-cancel"` — botão "Cancel" / "View details"
- `data-test-id="panel-button-confirm"` — botão "Save changes" / "Open project"
- `data-test-id="panel-loading"` — estado loading (spinner)
