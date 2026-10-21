# VProgress — DESIGN-SPEC (fonte: doc/Ui/documentação_do_componente_progress.png)

## 1) Objetivo do componente

Indicador de progresso linear e circular que comunica claramente o status de
conclusão de uma tarefa ou processo. Usar para atividade contínua, fluxos
multi-step ou resultado de ações concluídas. Anotação hero: "Clear progress at every
step". Pilares: Informative (clearly communicates current status), Responsive (works
across different sizes and contexts), Reassuring (builds trust with clear visual feedback).
Exemplos hero: "File upload (linear) — Uploading project files… 72%, 2.8 MB of 3.9 MB",
"Onboarding (segmented) — Step 3 of 5 — Add your team", "Loading (indeterminate) —
Please wait… / Loading", "Complete (circular) — Setup finished! / 100%".

## 2) Anatomia (partes, cada elemento visível na imagem)

Diagrama "Anatomy — Key parts" numerado sobre barra linear 72%:
- **(1) Value (fill)**: preenchimento índigo/azul com ponta arredondada sobre o trilho.
- **(2) Track**: trilho cinza claro de fundo (largura total).
- **(3) Label**: texto percentual à direita ("72%").
- Extras visíveis no hero e variantes: título do contexto ("File upload (linear)"),
  subtítulo ("Uploading project files…"), meta ("2.8 MB of 3.9 MB", "Step 3 of 5",
  "3 of 5", "Please wait…", "Setup finished!", "Loading", "100%"), segmentos
  (5 blocos, 3 preenchidos), anel circular (72% / 100% verde com check), ícone de
  pause no estado Paused, ícone de check verde no Complete, ícone de erro vermelho
  no Error.
- Props do exemplo Vue: `value="72"`, `label`, `type="segmented|circular"`, `:max="5"`,
  `size="md"`, `status="success"`, binding reativo `:value="uploadProgress"`.

## 3) Variantes e tamanhos visíveis

Variantes (5 cards):
- **Linear** — "Default progress bar" (barra 72%).
- **Circular** — "Compact circular display" (anel 72%).
- **Segmented** — "Multi-step progress" (5 segmentos, "3 of 5").
- **Indeterminate** — "For unknown duration" (bloco animado sem % fixo).
- **Success** — "Shows completion" (barra verde + check).

Tamanhos (3 células, todas 72%):
- **Small (SM)**, **Medium — MD (default)** (destacado), **Large (LG)** — diferem em
  altura/espessura da barra e do anel; "Three sizes for different densities."

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Seção "States — Visual states for different situations" (7 células):
- **Empty (0%)** — trilho vazio, "0%".
- **Active** — preenchimento 72%.
- **Hover** — mesma barra com leve destaque de hover.
- **Focus** — barra com anel de foco azul. (único estado com ring; pressed/disabled não ilustrados — seguir DS.)
- **Paused** — barra 72% com ícone de pause à esquerda.
- **Complete** — barra verde + check verde.
- **Error** — barra vermelha + ícone "!" vermelho.
- Loading = variante **Indeterminate** + exemplo hero "Loading (indeterminate)" com anel animado.

## 5) Micro-interações (click, hover, teclado, overlays)

- Valor reativo: "Progress smoothly animates to new values" e Pro tip "You can bind
  progress to reactive state and show dynamic values" (`:value="uploadProgress"`,
  `:label="s{uploadProgress}%"`).
- Hover/focus dão destaque/anel mas não mudam o valor; foco via teclado expõe o ring.
- Paused indica processo pausável/retomável (ícone pause sobre o fill).
- Indeterminate comunica duração desconhecida com shimmer/loop contínuo.
- Sem overlay próprio; quando usado em cards de upload/onboarding, acompanha textos
  auxiliares (MB, steps) que atualizam junto.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

- "Smooth and subtle by default." Diagrama de 3 quadros (trilho vazio → fill parcial → fill maior): o fill anima suavemente até o novo valor.
- Mapeamento para tokens (DESIGN.md §10/§20): transição do fill em `--v-motion-normal: 160ms` a `--v-motion-slow: 300ms` com `--v-ease-standard: cubic-bezier(.2,.8,.2,1)` (dentro da faixa do pôster 100–300ms, ease-out na entrada); loop do indeterminate usa `--v-motion-spin-duration` com easing linear; respeitar `prefers-reduced-motion` (animações zeradas — ver acessibilidade).
- Animar só `transform`/`opacity` (ex.: `scaleX` do fill ou `stroke-dashoffset` do anel) e nunca layout.

## 7) Acessibilidade observada

Lista "Accessibility — Built with accessibility in mind" (6 itens):
- `ARIA role="progressbar"`.
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- Screen reader friendly labels.
- Works with dynamic and indeterminate states.
- Sufficient color contrast.
- Supports reduced motion (`prefers-reduced-motion`).
- Estados Complete/Error combinam cor + ícone + texto (não só cor).

## 8) data-test-ids sugeridos (lista)

- `progress-container`
- `progress-track`
- `progress-value`
- `progress-label`
- `progress-meta`
- `progress-segmented`
- `progress-circular`
- `progress-indeterminate`
- `progress-complete-icon`
- `progress-error-icon`
- `progress-paused-icon`

Tokens de design vistos na imagem: `--v-progress-track-bg`, `--v-progress-fill-bg`, `--v-progress-fill-success`, `--v-progress-fill-error`, `--v-progress-label-color`, `--v-progress-size-sm/md/lg` (mapear para `--v-space-*` de altura), `--v-progress-radius` (mapear para `--v-radius-*`); cores de estado via `--v-color-success/error-base` e trilho neutro.
