# VRadioGroup — DESIGN-SPEC (fonte: doc/Ui/documentação_do_componente_radio_group.png)

## 1) Objetivo do componente

`VRadioGroup` é o controle de **single-choice selection**: permite ao usuário escolher **uma única opção** de uma lista de alternativas mutuamente exclusivas. Cabeçalho da doc: "Radio Group — Single-choice selection". Texto guia: "Radio groups allow users to select one option from a list of choices. Use radio groups for mutually exclusive options where only one selection is possible."
Pilares declarados na imagem: **Clear** (obvious selection state), **Consistent** (familiar and accessible), **Flexible** (vertical, horizontal, and card styles).
Hero de uso: "Give users a clear choice. One selection. A better experience." com exemplo de planos (Personal plan / For individuals selecionado; Team plan / For small teams; Enterprise / For large organizations) e nota manuscrita "Simple choices. Big outcomes."
Exemplo de código da doc usa `fieldset.radio-group` + `legend` ("Choose a plan") + `label.radio` com `input[type=radio] v-model="plan"`.

## 2) Anatomia (partes, cada elemento visível na imagem)

Cada opção de rádio é composta por:

- **Outer ring (2px stroke)** — círculo externo da bolinha. Anel de 2px; cor default = borda, selecionado = primária.
- **Inner dot (fills when selected)** — ponto interno de ~10px que aparece/preenche quando a opção está selecionada.
- **Label (semibold)** — texto principal da opção (ex.: "Personal plan", "Email notifications"). Peso semibold.
- **Description (optional)** — texto secundário abaixo do label (ex.: "For individuals", "Get notified via email").
- **Selected state (ring + inner dot)** — combinação visual do estado marcado: anel colorido + dot interno.
- **Focus ring (2px offset)** — anel de foco visível ao redor da opção, com offset de 2px.
- **Hit area (min 44×44px)** — área clicável mínima garantida por opção, maior que o glifo visual.
- Agrupador: `fieldset` + `legend` ("Choose a plan") envolvendo o conjunto; variante card envolve cada opção num cartão clicável (Free / Pro / Business).

## 3) Variantes e tamanhos visíveis

Variantes de layout (seção "Variants — Different layouts for different contexts"):

- **Vertical (default)** — opções empilhadas; exemplo: Email notifications / Get notified via email (marcada), Push notifications / Get notified on your device, SMS notifications / Get text message alerts.
- **Horizontal** — opções em linha; exemplo: Monthly (marcado), Yearly, Lifetime.
- **Card radios** — cada opção é um card com radio + título + descrição; exemplo: Free / For getting started (selecionado, com borda destacada e fundo tintado), Pro / More features, Business / Advanced controls.

Tamanhos (seção "Sizes"):

- **SM** — Height 20px, Label 14px.
- **MD (Default)** — Height 24px, Label 16px.
- **LG** — Height 28px, Label 18px.
- Descrição em MD: 14px (tabela de tokens).

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Tabela "States — How the radio option looks in different states", 3 linhas (Option A/B/C) × 8 colunas:

- **Unselected (default)** — anel cinza vazio.
- **Hover** — anel escurecido (border darken).
- **Focus** — anel + focus ring visível (halo claro ao redor) com dot fantasma/anel interno claro.
- **Selected** — anel primário + inner dot preenchido.
- **Pressed** — anel primário + dot preenchido mais denso/escuro (compressão de 1px).
- **Disabled** — anel e label em cinza claro, sem dot.
- **Disabled Selected** — anel cinza com dot cinza (marcado mas inerte).
- **Error** — anel vermelho vazio (as 3 linhas mostram o anel vermelho; indica `aria-invalid`).
- **Loading**: não há estado de loading na imagem (não se aplica a radio).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Click/toque**: seleciona a opção clicada e desseleciona as demais do grupo (exclusividade); na variante card, o card inteiro é clicável e recebe highlight de superfície.
- **Hover**: escurecimento da borda do anel (feedback de mira).
- **Teclado**: Tab entra no grupo; setas movem a seleção entre opções (navegação por arrow keys); seleção anunciada ao screen reader.
- **Focus**: aparece o focus ring de 2px com offset.
- **Pressed**: compressão de 1px no glifo durante o press.
- **Erro/validação**: estado vermelho + suporte a `aria-invalid="true"`.
- **Slots**: API flexível com slots para conteúdo customizado nas variantes vertical/horizontal/card (nota "with slots for custom content").
- Sem overlays/dropdowns — controle inline.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Valores literais da seção "Motion — Subtle, purposeful motion":

- **Hover**: "Border darken 100ms ease-out." → `--v-motion-fast: 100ms` + `--v-ease-out`.
- **Select**: "Inner dot scale from 0 to 1 + ring tint 140ms cubic-bezier (0.2, 0, 0, 0.2, 1)." → duração entre fast e normal; aproximar de `--v-motion-normal: 160ms` (ou token dedicado ~140ms) + `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`; animar apenas `transform` (scale do dot) e `opacity`/`border-color` (tint do anel). A curva impressa parece variante de ease-out.
- **Focus**: "Ring appear 120ms ease-out." → ~`--v-motion-fast`/`--v-motion-normal` + `--v-ease-out` em `opacity`/`box-shadow`.
- **Pressed**: "Compress 1px 70ms ease-in." → duração curta (< fast) + `--v-ease-in` em `transform` (scale ~0.98, cf. DESIGN.md §10 escala 0.98–1.02).
- **Card-radio select**: "Surface highlight 140ms ease-out." → ~`--v-motion-normal` + `--v-ease-out` em `background`/`border-color`/`opacity`.
- Respeitar `prefers-reduced-motion` (zera durações, cf. DESIGN.md §20); motion apenas em propriedades baratas.

## 7) Acessibilidade observada

Checklist literal da seção "Accessibility — Inclusive by design":

- Uses native radio inputs — `<input type="radio">`.
- Group with fieldset/legend — Descriptive label.
- Keyboard navigation — Tab and arrow keys.
- Visible focus indicator — 2px visible ring.
- Minimum hit target — 44 × 44px.
- Proper labels and descriptions — Use `<label>`.
- Error state support — `aria-invalid="true"`.
- Announce selection — Works with screen readers.

## 8) data-test-ids sugeridos (lista)

- `v-radiogroup` (fieldset raiz)
- `v-radiogroup-legend`
- `v-radiogroup-option-{value}` (label de cada opção)
- `v-radiogroup-input-{value}` (input nativo)
- `v-radiogroup-label-{value}`
- `v-radiogroup-description-{value}`
- `v-radiogroup-error` (mensagem/estado de erro)
- Doc de referência: "Learn more at vueui.dev →".
