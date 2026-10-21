# VToast — DESIGN-SPEC (fonte: doc/Ui/documentação_do_toast_vueui_nova.png)

## 1) Objetivo do componente

Mensagem transitória de feedback (transient feedback message) que informa ação,
evento de sistema ou atualização de status de forma breve e não intrusiva. Aparece
temporariamente, mantém o usuário informado e desaparece automaticamente.
Promessa hero: "Deliver feedback without interruption. Keep users informed, in the
moment." Pilares: Non-intrusive (delivers feedback without blocking flow), Flexible
(multiple variants and placements), Consistent (follows the Nova design system).
Exemplos hero empilhados: "Project saved successfully." (verde), "New updates are
available." (azul), "Connection is unstable." (amarelo), "Failed to upload file."
(vermelho). Anotação: "Small moments. Big trust."

## 2) Anatomia (partes, cada elemento visível na imagem)

Diagrama "Anatomy — The building blocks of a toast" sobre "New updates are available.":
- **Container (background + border)**: pill/card arredondado com fundo tonal por severidade + borda.
- **Icon slot (16×16px)**: ícone de status à esquerda (check verde, "i" azul, "!" amarelo, "×" vermelho, spinner no loading).
- **Message (text)**: texto da mensagem ("New updates are available.").
- **Close action (16×16px)**: "×" à direita para dismiss manual.
- **Progress bar (optional)**: barra fina na base do toast indicando tempo de auto-dismiss (visível no diagrama e no estado "Paused on hover").
- Extras: variante Loading troca ícone por spinner + texto "Saving changes…"; estado Paused mostra ícone de pause no lugar do close; Dismissed aparece apagado/fantasma.
- Props do code: `type="success"`, `message="Project saved successfully."`, `duration="5000"`, `@close="onClose"`.

## 3) Variantes e tamanhos visíveis

Variantes = severidade (4 cards com ícone + nome + descrição):
- **Success** — "Positive completion or confirmation." (fundo verde claro).
- **Info** — "Helpful information or updates." (fundo azul claro).
- **Warning** — "Caution or potential issues." (fundo amarelo claro).
- **Error** — "Critical issues or failure states." (fundo vermelho claro).

Tamanhos (3 toasts "Saved successfully." com ícone info + close):
- **SM** — Height 40px.
- **MD (Default)** — Height 48px.
- **LG** — Height 56px.
- "Consistent sizing for different contexts." Placements citados na API ("multiple variants and placements") mas não ilustrados — seguir DS.

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Tabela "States" (7 linhas, todas com exemplo Info + Description):
- **Default** — "Normal appearance."
- **Hover** — "Subtle background change on hover."
- **Focus action** — close com anel de foco azul. "Visible focus ring on action (for keyboard users)."
- **Pressed action** — close pressionado. "Action in pressed state."
- **Paused on hover** — barra de progresso congelada + ícone pause. "Auto-dismiss timer pauses on hover."
- **Dismissed** — toast apagado/fantasma. "Fade out and remove."
- **Loading** — spinner + "Saving changes…" + close. "Indicates a pending operation."
- Sem disabled dedicado; toast não interativo além do close/ação.

## 5) Micro-interações (click, hover, teclado, overlays)

- Auto-dismiss após 3–5s com barra de progresso (determinate/indeterminate); timer **pausa no hover e no focus** e retoma ao sair.
- Click no "×" dispensa imediatamente com fade-out; Esc também dispensa (keyboard dismiss).
- Hover muda sutilmente o background e congela o timer; focus no close mostra ring.
- Loading indica operação pendente e depois transiciona para o toast de resultado (ver Motion: Saving… → Saved).
- Sem overlay: empilha sem bloquear o fluxo; múltiplos toasts empilham verticalmente (hero mostra 4).
- API flexível: "Supports all variants, sizes, placement, and more."

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Storyboard de 4 fases com valores explícitos:
- **Enter**: "Fade + slide up. 160ms ease-out." (= `--v-motion-normal: 160ms` + `--v-ease-out`).
- **Settle**: "Subtle scale (0.98 → 1). 120ms ease-out." (≈ `--v-motion-fast: 100ms` + `--v-ease-out`; escala dentro da faixa 0.98–1.02 do DS).
- **Progress**: "Determinate/indeterminate progress. Auto-dismiss after 3–5s."
- **Exit**: "Fade + slide up. 120ms ease-in." (≈ `--v-motion-fast` + `--v-ease-in`; ease-in = saída).
- Slide na faixa 4–24px do DS; fade 0–100%; animar só `transform`/`opacity`; `prefers-reduced-motion` desativa (ver acessibilidade).

## 7) Acessibilidade observada

Tabela "Accessibility — Inclusive by design" (8 linhas):
- ARIA live region — `aria-live="polite"`.
- Keyboard dismiss — Esc key.
- Focus visible — Clear focus indicator.
- Screen reader support — Meaningful, concise text.
- Color contrast — Meets WCAG 2.1 AA (≥ 4.5:1).
- Non-color cues — Icons + text.
- Reduced motion — Respects `prefers-reduced-motion`.
- Auto-dismiss control — Pauses on hover and focus.
- Severidade nunca só por cor: sempre ícone + texto.

## 8) data-test-ids sugeridos (lista)

- `toast-container`
- `toast-icon`
- `toast-message`
- `toast-close-button`
- `toast-progress-bar`
- `toast-success`
- `toast-info`
- `toast-warning`
- `toast-error`
- `toast-loading`
- `toast-paused`

Tokens de design vistos na imagem: container height MD 48px; container padding 12px 16px; border radius 12px (`--v-radius-md`); backgrounds `var(--color-success-bg/info-bg/warning-bg/error-bg)` (mapear para `--v-color-success/info/warning/error-soft`); text color `var(--color-fg-primary)` (`--v-color-text`); icon size 16px; close button size 16px; font size MD 14px (`--v-font-size-medium`); progress height 2px; gap (icon to text) 12px.
