# VDatePicker — DESIGN-SPEC (fonte: doc/Ui/sistema_de_date_picker_vueui_nova.png)

## 1) Objetivo do componente

Date picker flexível para selecionar data única ou intervalo, com experiência limpa,
acessível e customizável. Ideal para scheduling, filtering e workflows baseados em
data. Anotação hero: "Pick dates for what's next." Pilares: Flexible (single date,
range, and presets), Customizable (format, min/max dates, disabled dates, and more),
Accessible (keyboard and screen reader support). Exemplo hero: input "Jan 17, 2026"
com × e chevron + calendário "January 2026" Su–Sa, dias 28–31 apagados, dia 17
selecionado em azul, footer Today / Clear / Done (primário).

## 2) Anatomia (partes, cada elemento visível na imagem)

Diagrama "Anatomy — Key parts of the date picker component" numerado sobre input "Select date":
- **(1) Leading icon**: calendário à esquerda do input.
- **(2) Input field**: campo com placeholder "Select date" ou valor "Jan 17, 2026" / "Jan 10, 2026 – Jan 17, 2026".
- **(3) Clear button**: "×" que limpa o valor (só com valor).
- **(4) Dropdown trigger**: chevron que abre/fecha o calendário.
- **Calendário**: header "January 2026" + setas ‹ ›; grade Su Mo Tu We Th Fr Sa; dias do mês anterior apagados (28–31); dia atual com anel; dia selecionado preenchido em azul; faixa de range em azul claro; dot de evento roxo.
- **Footer do calendário**: "Today" (link/pill) / "Clear" / "Done" (botão primário azul).
- Props do code: `v-model="date"`, `placeholder="Select date"`, `format="MMM d, yyyy"`, `show-today="true"`; range via `v-model="range"` + `range`.

## 3) Variantes e tamanhos visíveis

Variantes (4 inputs):
- **Default** — "Select date".
- **With Icon** — com ícone de calendário.
- **With Preset** — "Last 7 days".
- **Range** — "Jan 10, 2026 – Jan 17, 2026" com ícone.

Tamanhos (3 inputs "Select date"):
- **Small** — H 32px.
- **Medium (default)** — H 40px (destacado com borda azul).
- **Large** — H 48px.

Seleção de range: painel "Range Selection" com dias 12 e 16 como extremos e intervalo preenchido.

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Faixa "States — Visual states for different situations" (6 inputs):
- **Default** — "Select date" neutro.
- **Hover** — leve destaque de borda.
- **Focus** — anel/borda azul. "Input focused."
- **Pressed / Open** — fundo azul claro com calendário aberto.
- **Disabled** — acinzentado, "Select date" apagado. "Non-interactive."
- **With value** — "Jan 17, 2026" + ×.
- Estados especiais de dia ("Special Date States"): Selected date (azul, "The currently selected date"), Date in range (azul claro, "Part of a range selection"), Disabled date (cinza 20/24, "Not selectable"), Today (anel, "Current date indicator"), Date with event (dot roxo, "Shows an event indicator").
- Sem loading dedicado nesta doc.

## 5) Micro-interações (click, hover, teclado, overlays)

- Click no input/chevron abre o calendário como overlay; Esc ou click fora fecha ("Closes with a light fade out").
- Setas ‹ › ou teclado (←/→) navegam meses ("Navigate months — Use arrows or keyboard"); transição de mês suave ("Transitions between months smoothly").
- Click num dia seleciona ("Select a date — Click a day to select it."); em modo range, dois cliques definem start/end.
- "Today" salta para a data atual ("Jump to today"); "Clear" remove a seleção ("Remove the selected date"); "Done" confirma e fecha.
- Hover destaca dia/input; × limpa sem abrir.
- Formato, min/max e disabled dates configuráveis; presets ("Last 7 days") aplicam range pronto.
- Overlay: calendário flutuante com sombra; "Opens with a gentle scale and fade."

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Faixa "Motion — Smooth and natural interactions" (3 diagramas, sem valores numéricos na imagem):
- Abertura: "Opens with a gentle scale and fade." (entrada: scale ~0.98→1 + fade; mapear para `--v-motion-normal: 160ms` + `--v-ease-out`, ease-out = entrada).
- Troca de mês: "Transitions between months smoothly." (deslize/fade curto; `--v-motion-fast: 100ms` a normal + `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`).
- Fechamento: "Closes with a light fade out." (saída: fade; `--v-motion-fast` + `--v-ease-in`, ease-in = saída).
- Faixas do DS: escala 0.98–1.02, fade 0–100%, slide 4–24px; animar só `transform`/`opacity`; `prefers-reduced-motion` zera.

## 7) Acessibilidade observada

Lista "Accessibility — Built with accessibility in mind" (8 itens):
- ARIA label and role support.
- Keyboard navigation (Tab, Arrow keys, Enter, Esc).
- Visible focus indicator.
- Screen reader friendly (announces selected date).
- Proper color contrast.
- Disabled dates are announced.
- Supports both single and range selection.
- Follows WAI-ARIA date picker best practices.
- Implica `role="dialog"`/`grid` no calendário, dias desabilitados com `aria-disabled`, foco visível no input e nos dias.

## 8) data-test-ids sugeridos (lista)

- `datepicker-input`
- `datepicker-leading-icon`
- `datepicker-clear-button`
- `datepicker-trigger`
- `datepicker-calendar`
- `datepicker-month-prev`
- `datepicker-month-next`
- `datepicker-day`
- `datepicker-day-selected`
- `datepicker-day-in-range`
- `datepicker-day-disabled`
- `datepicker-day-today`
- `datepicker-day-event`
- `datepicker-today-button`
- `datepicker-clear-action`
- `datepicker-done-button`

Tokens de design vistos na imagem (nomes): `--datepicker-bg/surface/border/text/text-muted/primary/primary-hover/selected-bg/range-bg/today-ring/disabled/disabled-text/event` (mapear para `--v-color-*/--v-space-*/--v-radius-*/--v-shadow-lg` e `--v-color-primary` / `--v-state-disabled-opacity`).
