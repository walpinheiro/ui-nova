# VTooltip — DESIGN-SPEC (fonte: doc/Ui/documentação_vueui_nova_tooltip_interativo.png)

## 1) Objetivo do componente

Dica contextual (contextual helper hint) que exibe informação breve e contextual ao
dar hover, focus ou tap num elemento. Explica recursos, reduz carga cognitiva e mantém
a interface limpa e focada. Promessa hero: "Explain more with less. Small hints. Big
understanding." Pilares: Clear (concise, relevant information), Non-intrusive (stays
out of the way until needed), Flexible (supports text, rich content, and icons).
Exemplo hero: botão "Button" (ícone doc à esquerda, "?" à direita) cercado por "Top
tooltip", "Left tooltip", "Right tooltip", "Bottom tooltip". Anotação: "Small
interactions. Big progress."

## 2) Anatomia (partes, cada elemento visível na imagem)

Diagrama "Anatomy — The building blocks of a tooltip" sobre "This is a tooltip" + trigger "?":
- **Content**: texto, ícones ou rich content dentro da bolha ("Text, icons, or rich content").
- **Container**: bolha escura (Background + border + shadow).
- **Arrow (directional pointer)**: seta de 6px apontando para o trigger, reposicionada por placement.
- **Trigger**: elemento que mostra o tooltip (ex.: botão "?" circular branco com borda).
- Exemplo rico: tooltip "Keyboard shortcut" com teclas "⌘ K" + legenda "Open command palette".
- Props do code: `<Tooltip content="This is a helpful tooltip" placement="top">` envolvendo `<button>Hover me</button>`.

## 3) Variantes e tamanhos visíveis

Variantes (6 bolhas, cada uma sobre um trigger "?"; Default destacada):
- **Default** — "Supports text only." / "General purpose."
- **With icon** — ⓘ "With an icon" / "Add leading icon."
- **Success** — ✅ "Success saved!" / "Positive feedback."
- **Error** — ⚠ "Action unavailable" / "Critical information."
- **Brand** — ✨ "Pro tip!" / "Branded and expressive."
- **Light** — bolha branca "Light tooltip" / "For light surfaces."

Tamanhos (4 bolhas sobre triggers "?"):
- **SM** — "Small hint", Max width 160px, Font 12px.
- **MD (Default)** — "Default hint", Max width 200px, Font 14px.
- **LG** — "Larger hint text", Max width 240px, Font 14px.
- **XL** — "A longer tooltip message with more context.", Max width 320px, Font 14px.

Placements (hero): Top, Bottom, Left, Right ao redor do botão.

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Seção "States — How the tooltip behaves in different states" (7 células):
- **Hidden** — caixa tracejada vazia + "?". "Not visible by default."
- **Hover trigger** — bolha "Hover me". "Shows on mouse hover."
- **Focus trigger** — bolha "Focus me" + trigger "?" com anel de foco roxo. "Shows on keyboard focus."
- **Visible** — bolha "Tooltip text". "Visible and fully interactive."
- **Rich content** — bolha "Keyboard shortcut ⌘ K / Open command palette". "Supports formatted content, icons, etc."
- **Delayed hide** — bolha "Hides in 500ms". "Remains visible briefly after exit."
- **Disabled trigger** — trigger "?" apagado/tracejado sem bolha. "Does not show tooltip."
- Sem loading/pressed próprios; tooltip é não interativo por padrão.

## 5) Micro-interações (click, hover, teclado, overlays)

- Hover no trigger mostra; saída do mouse esconde após delay de 500ms (delayed hide).
- Focus via teclado mostra; blur/Esc esconde ("Escape to dismiss", "Closes on Esc key").
- Touch: long press mostra (touch support).
- Não captura foco por padrão (non-interactive by default, "Doesn't trap focus").
- Rich content pode incluir ícones/formatos mas segue não interativo; informação crítica nunca deve depender só do tooltip ("Not a replacement for labels — Critical info should be visible").
- Sem overlay; reposiciona seta/placement conforme espaço.
- API flexível: "Supports all variants, placements, rich content, and more."

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Storyboard de 4 fases:
- **Idle** — "Initial state." (só trigger).
- **Show** — "Fading in… Fades in + moves up. 120ms ease-out." (≈ `--v-motion-fast: 100ms` + `--v-ease-out`; ease-out = entrada).
- **Visible** — "Static while hovered or focused."
- **Hide** — "Fading out… Fades out. 100ms ease-in." (= `--v-motion-fast` + `--v-ease-in`; ease-in = saída).
- Deslocamento pequeno (slide 4–24px do DS), fade 0–100%, escala sutil; animar só `transform`/`opacity`; `prefers-reduced-motion` desativa animações (ver acessibilidade).

## 7) Acessibilidade observada

Tabela "Accessibility — Inclusive by design" (8 itens):
- Keyboard accessible — Shows on focus.
- Screen reader support — Uses `aria-describedby`.
- Non-interactive by default — Doesn't trap focus.
- Sufficient color contrast — Meets WCAG 2.1 AA (4.5:1).
- Touch support — Shows on long press.
- Escape to dismiss — Closes on Esc key.
- Not a replacement for labels — Critical info should be visible.
- Respects reduced motion — Disables animations.
- Trigger "?" precisa de nome acessível; foco visível obrigatório.

## 8) data-test-ids sugeridos (lista)

- `tooltip-trigger`
- `tooltip-container`
- `tooltip-content`
- `tooltip-arrow`
- `tooltip-default`
- `tooltip-with-icon`
- `tooltip-success`
- `tooltip-error`
- `tooltip-brand`
- `tooltip-light`
- `tooltip-rich-content`

Tokens de design vistos na imagem: background color #1F2937 (`--v-color-neutral-800`-like); text color #FFFFFF (`--v-color-surface`); border color rgba(255,255,255,0.08); shadow `0 8px 24px rgba(0,0,0,0.15)` (`--v-shadow-lg`); border radius 8px (`--v-radius-sm`); arrow size 6px; padding X/Y 12px/8px (`--v-space-3`/`--v-space-2`); font size 14px (`--v-font-size-medium`); max width MD 200px; z-index 1000.
