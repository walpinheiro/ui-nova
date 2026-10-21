# VDrawer — DESIGN-SPEC (fonte: doc/Ui/documentação_vueui_nova_componente_drawer.png)

## 1) Objetivo do componente

Painel contextual slide-in que revela detalhes e ações sem tirar o usuário da página
atual. Usar para detalhes, settings, filtros ou fluxos de criação mantendo o contexto.
Promessa hero: "Reveal details without leaving context. A slide-in panel for every
moment." Pilares: Contextual (keep users in flow without navigation), Flexible
(supports multiple sizes and content), Versatile (details, forms, settings).
Exemplo hero: painel "Project details" com abas Overview/Activity/Settings, "+ New",
"Acme Website / Web app · v2.0", "A modern marketing website for Acme Inc.", Status
"Active", Members (3 avatares + "+3"), Due date "Jan 24, 2026", botão "Open project →".
CTA de demo: botão primário "Try Drawer →" + anotação "More context. Greater flow."

## 2) Anatomia (partes, cada elemento visível na imagem)

- **Container**: painel lateral branco (background, shadow, border).
- **Overlay/Backdrop**: véu escuro sobre o conteúdo da página atrás do painel.
- **Header (title + actions)**: "Drawer title" / "Project details" + botão close; altura 64px.
- **Close button (24×24px)**: "×" no topo direito do painel.
- **Tabs (optional)**: "Tab 1 / Tab 2 / Tab 3" (hero: Overview ativa sublinhada + Activity + Settings).
- **Divider (1px)**: linha separando header/tabs do conteúdo e conteúdo do footer.
- **Content area (scrollable)**: região rolável com texto, imagem placeholder (montanha), meta-dados (Status pill verde "Active", Members, Due date).
- **Footer (optional actions)**: barra de 72px com "Cancel" (ghost) + "Save" (primário).
- **Trigger/CTA**: botão "Try Drawer" que abre o painel.
- Props do code: `v-model="isOpen"`, `title="Project details"`, `placement="right"`, `width="md"`, slot `#default` (`<ProjectDetails />`).

## 3) Variantes e tamanhos visíveis

Variantes = placement (4 miniaturas de página com painel sombreado):
- **Right (Default)** — "Slides in from right." (destacada com borda índigo).
- **Left** — "Slides in from left."
- **Top** — "Slides down from top."
- **Bottom** — "Slides up from bottom."

Tamanhos (3 miniaturas):
- **SM** — Width 320px. "Compact, focused."
- **MD (Default)** — Width 480px. "Balanced for most use cases."
- **LG** — Width 640px. "For complex content."

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Seção "States" com 7 células (cursor/anel sobre o "×"):
- **Closed** — "Not visible." (só a página, sem painel).
- **Opening** — "Slides in." (painel entrando com seta →).
- **Open** — "Fully visible."
- **Hover action** — cursor mão sobre o close. "Action on hover."
- **Focused action** — close com anel de foco azul. "Keyboard focus."
- **Pressed action** — close com fundo cinza pressionado + cursor. "On click/tap."
- **Disabled action** — close cinza claro apagado. "Not interactive."
- Sem estado loading dedicado nesta doc; loading, se houver, segue padrão do DS (spinner + `--v-state-loading-opacity`).

## 5) Micro-interações (click, hover, teclado, overlays)

- Click no CTA/trigger abre o painel com slide + fade do overlay.
- Hover no close muda fundo/contraste; pressed dá feedback de clique; disabled ignora pointer.
- Teclado: Tab / Shift+Tab navegam presos no drawer (focus trap); Esc fecha.
- Overlay: fade in/out sincronizado; click no overlay fecha (configurável).
- Tabs internas trocam conteúdo sem fechar o drawer.
- Ações do footer: Cancel fecha sem salvar; Save confirma e fecha.
- Ao fechar, foco retorna ao trigger; abertura anuncia open/close + título para screen reader.
- API flexível: "Supports all variants, sizes, positions, and customization."

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Storyboard de 3 quadros com valores explícitos na imagem:
- **Slide in**: "300ms ease-out. Translate X from 100% to 0%." (≈ `--v-motion-slow: 300ms` + `--v-ease-out`).
- **Slide out**: "250ms ease-in. Translate X from 0% to 100%." (≈ interpolação normal→slow + `--v-ease-in`).
- **Overlay fade**: "200ms ease. Fade in/out overlay." (≈ `--v-motion-normal: 160ms`–slow + `--v-ease-standard`).
- Para placements Top/Bottom, mesmo padrão no eixo Y (slide 4–24px do DS). Animar só `transform`/`opacity`.
- Hover/pressed do close: transição rápida `--v-motion-fast: 100ms` + `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`.
- `prefers-reduced-motion`: respeitado — desativa/desliza instantâneo (ver acessibilidade).

## 7) Acessibilidade observada

Tabela "Accessibility — Inclusive by design" (8 linhas):
- Keyboard support — Tab, Shift+Tab, Esc to close.
- Focus trap — Keeps focus within drawer.
- Aria roles — `role="dialog"`, `aria-modal="true"`.
- Accessible name — `aria-labelledby` / `aria-label`.
- Focus management — Returns focus to trigger on close.
- Screen reader support — Announces open/close and title.
- Color contrast — Meets WCAG 2.1 AA (≥ 4.5:1).
- Reduced motion — Respects `prefers-reduced-motion`.
- Mais: `:focus-visible` obrigatório no close e ações; conteúdo rolável acessível por teclado.

## 8) data-test-ids sugeridos (lista)

- `drawer-container`
- `drawer-overlay`
- `drawer-header`
- `drawer-title`
- `drawer-close-button`
- `drawer-tabs`
- `drawer-tab-overview`
- `drawer-tab-activity`
- `drawer-tab-settings`
- `drawer-content`
- `drawer-divider`
- `drawer-footer`
- `drawer-action-cancel`
- `drawer-action-save`
- `drawer-trigger-open`

Tokens de design vistos na imagem: container background #FFFFFF (`--v-color-surface`); overlay `rgba(0,0,0,0.5)` (`--v-color-overlay`); border radius 12px (`--v-radius-md`); shadow (elevation) `0 20px 60px rgba(0,0,0,0.15)` (`--v-shadow-xl`); width MD 480px; header height 64px; footer height 72px; padding (content) 24px; z-index 1000.
