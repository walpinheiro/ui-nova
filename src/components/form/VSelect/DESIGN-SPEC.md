# VSelect — DESIGN-SPEC (fonte: doc/Ui/especificação_ui_vueui_nova_select.png)

## 1) Objetivo do componente

`VSelect` é o **single-choice dropdown field**: deixa o usuário escolher uma opção de uma lista. Texto guia: "Lets users choose one option from a list. Ideal for setting, filtering, and form input. Clean, consistent, and expressive across your product."
Pilares: **Flexible** (with or without icons and search), **Accessible** (built for everyone), **Modern** (refined, minimal, ready for the future).
Hero: "PICK A BETTER EXPERIENCE — Choices that feel effortless. A select field for every context." + nota "Simple choices. Big possibilities." Três exemplos: **Standard** ("Product"), **With icon** ("All categories" com ícone cubo), **Compact** ("Sort").
Código da doc: `label[for=product]` + `select#product.select v-model="value"` com options ("Select option", Product, Marketing, Development, Design); nota "Supports icons, custom options, validation, and more."

## 2) Anatomia (partes, cada elemento visível na imagem)

- **Field container (background + border)** — caixa do campo fechado com fundo e borda de 1px, raio 10px.
- **Value label (or placeholder)** — texto do valor ("Product") ou placeholder ("Select option").
- **Chevron (icon)** — seta 16px à direita; aponta para baixo fechado, gira 180° aberto.
- **Menu panel (elevation)** — dropdown suspenso com as opções; sombra de elevação 8px; altura máx. 256px.
- **Option row (interactive item)** — cada linha (altura 40px, padding-X 16px): Product (selecionada), Marketing, Development, Design, Human Resources.
- **Selected check (indicator)** — check `✓` à direita da opção selecionada, com fade-in.
- **Focus ring (2px offset)** — anel de foco de 2px com offset de 2px ao redor do campo.
- **Hit area (min 44×40px)** — área mínima de toque por linha/opção.
- Ícone líder opcional (cubo em "All categories").

## 3) Variantes e tamanhos visíveis

Sabores do hero: Standard, With icon, Compact (largura reduzida, ex. "Sort").

Tamanhos (seção "Sizes"):

- **SM** — Height 32px.
- **MD (Default)** — Height 40px.
- **LG** — Height 48px.
- Métricas: horizontal padding 16px; font-size (value) 16px Medium; line-height 24px; option height 40px; option horizontal padding 16px; menu max-height 256px; border radius 10px; border width 1px; icon (chevron) 16px; elevation (menu) 8px.

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Seção "States" (7 linhas + menu aberto ilustrado ao lado):

- **Default** — "Resting state." campo com "Product", chevron para baixo.
- **Hover** — "Border darken + tint."
- **Focus** — "Focus ring appears." anel primário.
- **Open** — "Menu is visible." campo com chevron para cima + painel com 5 opções e check na selecionada.
- **Selected** — "Value is selected." campo com fundo tintado/lavanda e texto primário.
- **Error** — "Error state with helpful feedback." campo com borda/texto vermelhos.
- **Disabled** — "Non-interactive state." campo apagado.
- **Loading**: não exibido na imagem (não se aplica; só faria sentido com busca remota).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Click**: abre/fecha o menu; chevron rota 180°; opção clicada recebe check com fade-in e fecha (single-choice).
- **Hover na opção**: fundo tintado na linha (option background tint).
- **Teclado**: Tab foca; ↑/↓ navegam; Enter confirma; Esc fecha.
- **Leitor de tela**: papéis ARIA apropriados; erro anunciado.
- **Overlay**: menu em elevação sobre o conteúdo, com fade/slide de entrada; altura máx. com rolagem interna.
- **Label**: associação via `<label>` ou `aria-label`.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Faixa da seção "Motion — Subtle, purposeful motion":

- **Hover**: "Border darken + tint. 120ms ease-out." → ~`--v-motion-fast`/`--v-motion-normal` + `--v-ease-out`.
- **Focus**: "Ring appear. 120ms ease-out." → idem em `box-shadow`/`opacity`.
- **Open**: "Chevron rotate 180°. Menu fade/slide. 160ms cubic-bezier (0,2,0,8,0,2,1)" [leia-se (0.2, 0.8, 0.2, 1)]. → `--v-motion-normal: 160ms` + `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`; chevron em `transform: rotate`; menu em `transform` (slide 4–24px) + `opacity`.
- **Option hover**: "Option background tint. 100ms ease-out." → `--v-motion-fast: 100ms` + `--v-ease-out`.
- **Option select**: "Check fade in. 120ms ease-out." → ~fast/normal + `--v-ease-out` em `opacity` (e leve `transform`).
- `prefers-reduced-motion`: sem rotação/slide (estado final imediato).

## 7) Acessibilidade observada

Checklist literal ("Accessibility — Inclusive by design"):

- Keyboard navigable — Tab, ↑/↓, Enter, Esc.
- Screen reader support — Proper ARIA roles.
- Visible focus indicator — 2px offset ring.
- Sufficient color contrast — ≥ 4.5:1 (AA).
- Clear label association — Use `<label>` or aria-label.
- Error messaging — Announced to screen readers.
- Disabled state — Not focusable.
- Touch friendly — Min 44×40px hit area.

## 8) data-test-ids sugeridos (lista)

- `v-select` (root/field)
- `v-select-label`
- `v-select-trigger` (botão/campo que abre)
- `v-select-value`
- `v-select-chevron`
- `v-select-panel` (menu)
- `v-select-option-{value}` (cada opção)
- `v-select-check-{value}` (indicador de selecionado)
- `v-select-error` (mensagem de erro)
- Referência: "Learn more at vueui.dev →".
