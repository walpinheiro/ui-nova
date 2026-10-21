# VSheet — DESIGN-SPEC (fonte: doc/ui/VSheet.png)

> Status: ✅ Concluído e validado
> Data: 2026-09-20
> Testes: `pnpm build` ok; `pnpm exec vitest run src/components/containment/VSheet/_tests/VSheet.spec.ts` — 18/18; e2e (10 specs) pendente de `pnpm exec playwright install chromium` neste ambiente.
> Validação visual: comparado com `doc/ui/VSheet.png` — variantes right/left/bottom/full-height, tamanhos S–XL, estados closed/opening/open/closing via `data-state`, motion slide-in/out, anatomia header/content/footer, focus-trap e backdrop dismissível.
> Blockers: typecheck global permanece com erros preexistentes em outros componentes; Storybook depende de `.storybook/main.*` no ambiente local.

## 1) Objetivo do componente

O `VSheet` é uma superfície contextual presa à borda do ecrã que desliza para dentro, para conteúdo secundário
sem sair do contexto atual.
Poster principal: **"Sheet — An edge-attached surface for focused tasks"** — *"Sheet is a contextual surface that
slides in from the edge of the screen, providing additional content and actions without leaving the current context.
Use it for settings, details, filters, or creation flows."*
Complemento: **"Sheet — Edge-attached contextual surface"** — *"perfect for secondary content, settings, filters,
or quick actions without navigating away from the current page."*
Três pilares (principal): **Contextual** ("Keep users in context while they work"), **Flexible**
("Slide from any edge, with multiple sizes"), **Composable** ("Supports rich content, forms, and actions").
Complemento acrescenta: **Lightweight** ("Opens quickly without disrupting the flow") e **Focused**
("Draw attention to what matters").
Hero do poster principal: janela "Acme Platform" (sidebar Home/Projects/Tasks/Team/Settings + lista Projects com
search "Search projects…" e 5 projetos com dot colorido) + sheet "Project Settings" ancorado à direita com
tabs, formulário e rodapé. Hero do complemento: app "VueUI Nova" (Dashboard/Analytics/Projects/Team/Calendar/
Inbox/Settings + "Projects/Your recent work" com 3 cartões) + sheet "Project settings" com 4 linhas de navegação
e botões "Save changes"/"Cancel".
Nota manuscrita: *"Slide in for focused tasks, without leaving context."* / *"Details without detours"*.
Pro tip: combinar o Sheet com o router para fluxos de navegação como painel de detalhes ou formulário de edição
rápida; usar título descritivo, manter ações focadas, uma tarefa única e clara por sheet. Mini-exemplo "Create filter"
(Name + "e.g. Marketing leads" + Cancel/Create) ilustra o fluxo de criação.

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomia numerada do poster principal (7 partes):

1. **Container (backdrop + panel)** — o conjunto overlay + painel.
2. **Header** — barra superior do sheet.
3. **Title** — título + descrição ("Sheet Title" + "A brief description goes here." / "Project Settings").
4. **Actions** — botão `…` no cabeçalho.
5. **Close button** — `×` no canto superior direito.
6. **Content area** — corpo livre: no hero principal contém a lista de tabs (General/Members/Notifications/
   Integrations/Danger Zone, com "General" selecionada) e o formulário (Project name = "Website Redesign",
   Description = "A modern and accessible marketing website for our brand.", Visibility = select "Team only").
7. **Footer** — barra inferior de ações: "Cancel" (fantasma) + "Save changes" (primário azul).

Anatomia do complemento (5 partes, visão simplificada): 1 Container, 2 Header, 3 Title ("Settings"), 4 Actions (`…`),
5 Close button (`×`).

Elementos do hero principal (todos cobertos):

- Janela de fundo "Acme Platform" com semáforo macOS (vermelho/amarelo/verde), sidebar (Acme Platform, Home,
  Projects selecionado, Tasks, Team, Settings), coluna "Projects / Manage your projects and teams.",
  search "Search projects…", 5 linhas de projeto cada uma com quadrado colorido (azul, roxo, verde, rosa, azul)
  + nome + categoria (Marketing/Product/Design/Engineering), ex.: "Website Redesign / Marketing".
- Sheet "Project Settings" + `×`: 5 linhas de tab com ícone (General/Members/Notifications/Integrations/Danger Zone),
  label "Project name" + input "Website Redesign", label "Description" + textarea, label "Visibility" + select
  "Team only" (ícone globo), rodapé Cancel/Save changes.

Elementos do hero do complemento: sidebar (Dashboard selecionado, Analytics, Projects, Team, Calendar, Inbox,
Settings), search "Search anything…", "Projects / Your recent work", 3 cartões (Website Redesign "Updated 2 hours ago"
com dot verde, Mobile App "Updated 1 day ago" dot azul, Design System "Updated 3 days ago" dot roxo), sheet
"Project settings" com cartão de contexto (ícone documento, "Website Redesign / Product design and branding"),
4 linhas (General "Name, description, visibility" / Members "Invite and manage access" / Integrations
"Connect your favorite tools" / Danger zone "Archive or delete project") cada uma com ícone + `›`, botão primário
largo "Save changes" + botão claro "Cancel".

## 3) Variantes e tamanhos visíveis

Variantes — posicionamento (4 cartões; posterior com mini-janela macOS; complemento com mock de browser):

| Variante | Descrição | Direção do slide |
|---|---|---|
| **Right sheet (default)** | "Slides in from the right edge." | Da direita |
| **Left sheet** | "Slides in from the left edge." | Da esquerda |
| **Bottom sheet** | "Slides up from the bottom edge." (complemento: "Slides up from the bottom.") | De baixo |
| **Full height sheet** | "A taller sheet for immersive flows." / "Covers the full height." | Direita, altura total |

Tamanhos — larguras para side sheets (complemento indica **M como default**):

| Tamanho | Largura | Descrição |
|---|---|---|
| **S** | 320px | "For simple content." / "Predefined widths for different content needs" |
| **M (default)** | 480px | "Everyday use." |
| **L** | 640px | "For complex content." |
| **XL** | 800px | "For content-heavy workflows." |

Design tokens (poster principal):

`--sheet-bg`, `--sheet-surface`, `--sheet-backdrop`, `--sheet-border`, `--sheet-shadow`,
`--sheet-header-height`, `--sheet-footer-height`, `--sheet-radius`, `--sheet-z-index`,
`--sheet-transition-duration`, `--sheet-ease`.

Complemento lista: `--sheet-bg`, `--sheet-border`, `--sheet-shadow`, `--sheet-header-bg`, `--sheet-title-color`,
`--sheet-description-color`, `--sheet-divider`, `--sheet-close-color`, `--sheet-close-hover-bg`, `--sheet-backdrop-bg`.

Exemplo Vue do poster principal:

```vue
<template>
  <Sheet v-model:open="isOpen" side="right">
    <template #header>
      <h3>Project Settings</h3>
      <p class="text-slate-600">Manage your project details.</p>
    </template>
    <div class="space-y-4">
      <!-- Your content goes here -->
    </div>
  </Sheet>
</template>
```

Complemento mostra API alternativa: `<VButton @click="show = true">Open settings</VButton>` +
`<VSheet v-model:open="show" side="right" title="Project settings">…</VSheet>`; Pro tip com
`side="right" :size="md" @update:open="onOpenChange"`.

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Estados literais (4 cartões em ambos os posters):

| Estado | Poster principal | Complemento |
|---|---|---|
| **Closed** | "Not visible." (contorno tracejado vazio) | "Closed" |
| **Opening** | "Sliding in." (seta → para o painel) | "Opening" |
| **Open** | "Fully visible and interactive." (painel com borda azul) | "Open" |
| **Closing** | "Sliding out." (seta ←) | "Closing" |

Hover/focus/pressed não têm cartões próprios (o sheet é contentor, não controle), mas aplicam-se aos elementos
interativos internos pelo padrão do sistema (DESIGN.md secções 08–09): tabs e linhas de navegação com hover
(fundo, ex.: "General" selecionada em azul-claro), botões Cancel/Save com hover → pressed (scale 0.98) → focus
(anel 2px `--v-color-focus`) → disabled (opacidade). Focus trap: o foco fica preso dentro do sheet enquanto aberto.
Loading: não ilustrado; inferido do padrão — skeleton no content area + spinner, mantendo header/footer.

## 5) Micro-interações (click, hover, teclado, overlays)

- **Abertura**: trigger (botão "Open settings", navegação, router) → backdrop faz fade-in + painel desliza da borda.
- **Click no backdrop**: fecha o sheet ("Accessible backdrop (closes on click)").
- **Click `×` / "Cancel"**: fecha e devolve o foco ao elemento que abriu ("Maintains focus on close").
- **Click "Save changes"/"Create"**: confirma (valida o formulário) e fecha.
- **Tabs/linhas `›`** (General/Members/…): hover destaca, click troca o conteúdo do content area sem sair do sheet.
- **Hover nos controles internos**: inputs/select/textarea com borda de hover; botões com inversão primário↔hover.
- **Teclado**: `Tab` / `Shift+Tab` circula preso dentro do sheet; `Esc` fecha; foco inicial vai para o primeiro
  elemento focável ou para o título; ao fechar, o foco retorna ao trigger.
- **Overlays**: backdrop sobre a página (fecha ao clicar, acessível a teclado e leitor de ecrã); o sheet pode
  conter dropdowns/selects (ex.: "Visibility") que abrem acima do content area.
- **Router**: pode ser ligado ao router como painel de detalhes/edição rápida (Pro tip), com persistência de estado
  via `v-model:open` / `@update:open`.

## 6) Motion (durações, easing, transições, cruzando com tokens do DESIGN.md)

Valores literais:

- Poster principal — **Slide in**: "Slides from edge with a smooth ease-out (200ms).";
  **Slide out**: "Slides back to edge with a smooth ease-in (150ms)."
- Complemento — "Slides in with a 250ms ease-out animation."

Cruzamento com tokens `DESIGN.md`:

| Conceito | Token `--v-*` | Uso no Sheet |
|---|---|---|
| Slide-in 200–250ms | `--v-motion-slow: 300ms` / `--v-motion-normal: 160ms` (interpolar; `--sheet-transition-duration` do poster) | painel: `translateX(±24px→0)` / `translateY(24px→0)` + fade, `var(--v-ease-out)` |
| Slide-out 150ms | `--v-motion-normal: 160ms` (≈150ms) | reverso com `var(--v-ease-in)` |
| Slide 4–24px | distância do slide do pôster | deslocamento de entrada conforme lado (right/left/bottom) |
| Fade 0–100% | opacity | backdrop `opacity 0→1`, painel `opacity 0→1` |
| Spring suave | `--v-ease-spring` (interativa) | opcional no settle do painel |

Regras: animar só `transform`/`opacity`; backdrop e painel com transições separadas mas sincronizadas;
`prefers-reduced-motion: reduce` zera durações (fade simples ou sem animação); sombra `--v-shadow-xl`
(modais/sheets) no painel.

## 7) Acessibilidade observada

Checklist combinada dos dois posters:

- Follows WAI-ARIA dialog pattern / dialog pattern (ARIA `role="dialog"`).
- Traps focus within the sheet.
- Supports keyboard navigation (Tab, Esc) / (Tab, Shift+Tab, Esc).
- Announces content to screen readers / Screen reader announcements.
- Proper heading structure (título como heading).
- Sufficient color contrast.
- Supports aria-labelledby and aria-describedby / Uses aria-labelledby and aria-describedby.
- Backdrop is keyboard and screen reader accessible / Accessible backdrop (closes on click).
- Supports multiple sizes and placements; Maintains focus on close; Follows WAI-ARIA best practices.

## 8) data-test-ids sugeridos (lista)

- `data-test-id="sheet-backdrop"` — overlay de fundo
- `data-test-id="sheet-panel"` — painel do sheet
- `data-test-id="sheet-header"` — header
- `data-test-id="sheet-title"` — título ("Project Settings")
- `data-test-id="sheet-description"` — descrição do header
- `data-test-id="sheet-actions"` — botão `…`
- `data-test-id="sheet-close"` — botão `×`
- `data-test-id="sheet-tabs"` — lista de tabs (General/Members/…)
- `data-test-id="sheet-tab-general"` / `sheet-tab-members` / `sheet-tab-notifications` / `sheet-tab-integrations` / `sheet-tab-danger-zone`
- `data-test-id="sheet-content"` — content area
- `data-test-id="sheet-field-name"` — input Project name
- `data-test-id="sheet-field-description"` — textarea Description
- `data-test-id="sheet-field-visibility"` — select Visibility
- `data-test-id="sheet-footer"` — rodapé
- `data-test-id="sheet-button-cancel"` — "Cancel"
- `data-test-id="sheet-button-save"` — "Save changes" / "Create"
- `data-test-id="sheet-trigger"` — botão que abre ("Open settings")
