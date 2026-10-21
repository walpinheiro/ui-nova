# VSwitch — DESIGN-SPEC (fonte: doc/Ui/documentação_do_switch_vueui_nova.png)

## 1) Objetivo do componente

`VSwitch` é o **binary on/off toggle**: deixa o usuário ligar/desligar uma configuração com resposta clara e imediata. Texto guia: "Switches let users turn a setting on or off, providing a clear, immediate way to change a single option. Use switches for binary choices within settings, preferences, and customizable experiences."
Pilares: **Intuitive** (clear on/off states), **Accessible** (built for everyone), **Modern** (clean, minimal, ready for the future).
Hero: "PRIMARY ACTION — Small switch. Big control. Simple. Expressive. Everywhere you need it." + nota "Simple controls. Big possibilities." Três exemplos: **Standard** (switch isolado), **Labeled** ("Enable notifications" ligado), **Settings row** ("Dark mode — A more comfortable viewing experience." com ícone de lua, ligado).
Código: `label.switch > input[type=checkbox] v-model="enabled" + span.switch-track > (span.switch-icon > SunIcon v-if="enabled") + span.switch-thumb + span.switch-label + span.switch-description`; nota "supports v-model, labels, descriptions, icons, variants, and sizes".

## 2) Anatomia (partes, cada elemento visível na imagem)

- **Track (background)** — trilho pill do switch; MD: largura 52px, altura 28px, padding 2px, raio 14px; cor off = `var(--color-surface-300)` (cinza), on = `var(--color-primary)`.
- **Thumb (movable element)** — bolinha branca móvel (`#FFFFFF`); MD: 24px; desliza de um lado ao outro.
- **Icon slot (16×16px, in track)** — ícone opcional dentro do trilho (ex.: sol quando ligado, na anatomia ampliada).
- **Label (secondary text style)** — rótulo visível (ex.: "Enable notifications"); fonte 14px Medium.
- **Description** — texto de apoio abaixo do label (ex.: "Get product updates and tips."); fonte 12px Regular.
- **Focus ring (2px offset)** — anel primário `2px solid var(--color-primary)` com offset de 2px.
- **Hit area (min)** — tabela diz "44 × 24px"; checklist de a11y diz "Minimum 44 × 24px".

## 3) Variantes e tamanhos visíveis

Uso (hero): Standard (só o controle), Labeled (controle + label), Settings row (ícone + título + descrição + controle à direita).

Tamanhos ("Size variants"):

- **SM** — Height 20px.
- **MD (Default)** — Height 28px (track 52×28, thumb 24px).
- **LG** — Height 36px.

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Tabela "States" (1 linha "Switch" × 9 colunas):

- **Off** — trilho cinza, thumb à esquerda.
- **Hover Off** — trilho cinza com sombra/tinta sutil.
- **Focus Off** — anel de foco ao redor do switch desligado.
- **On** — trilho primário, thumb à direita.
- **Hover On** — trilho primário com sombra/tinta.
- **Focus On** — anel de foco ao redor do switch ligado.
- **Pressed** — thumb comprimido (squish) durante o press.
- **Disabled Off** — trilho cinza claro apagado.
- **Disabled On** — trilho primário claro apagado.
- **Loading**: não há na imagem (não se aplica a switch).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Toggle (click/toque)**: thumb desliza + cor do trilho muda (transição principal de 160ms).
- **Hover**: sombra sutil / tinta no trilho.
- **Focus**: aparece o focus ring.
- **Pressed**: thumb comprime (efeito squash) por ~70ms.
- **Disabled**: mudança de opacidade (não só cor).
- **Teclado**: Tab foca; Space/Enter alterna; estado anunciado como "on"/"off" (role="switch" nativo via checkbox).
- Sem overlays.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Faixa literal ("Motion — Subtle, purposeful motion"):

- **Toggle**: "Thumb slide + track color shift — 160ms cubic-bezier (0,2,0,8,0,2,1)" [ler (0.2, 0.8, 0.2, 1)]. → `--v-motion-normal: 160ms` + `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`; thumb em `transform: translateX`; trilho em `background-color`/`opacity`.
- **Hover**: "Subtle shadow / tint — 100ms ease-out." → `--v-motion-fast: 100ms` + `--v-ease-out`.
- **Focus**: "Ring appear — 120ms ease-out." → ~fast/normal + `--v-ease-out` em `box-shadow`/`opacity`.
- **Pressed**: "Thumb compress — 70ms ease-in." → `--v-ease-in` em `transform` (scale).
- **Disabled**: "Opacity shift — 120ms ease-out." → ~fast/normal + `--v-ease-out` em `opacity` (usa `--v-state-disabled-opacity`).
- `prefers-reduced-motion`: thumb vai direto ao estado final, sem slide.

## 7) Acessibilidade observada

Checklist literal ("Accessibility — Inclusive by design"):

- Keyboard operable — Tab to focus, Space/Enter to toggle.
- Screen reader support — Uses native input (role="switch").
- Clear labels — Visible label and optional description.
- Focus visible — 2px focus ring, meets contrast.
- Sufficient contrast — Meets WCAG AA (4.5:1).
- Disabled state — Not just color — reduced opacity.
- Hit area — Minimum 44 × 24px.
- State announcement — Announces "on" / "off".

## 8) data-test-ids sugeridos (lista)

- `v-switch` (label raiz)
- `v-switch-input` (input nativo)
- `v-switch-track`
- `v-switch-thumb`
- `v-switch-icon`
- `v-switch-label`
- `v-switch-description`
- Referência: "Learn more at vueui.dev →".
