# VTextarea — DESIGN-SPEC (fonte: doc/Ui/documentação_do_componente_textarea.png)

## 1) Objetivo do componente

`VTextarea` é o campo de **multiline text input**: deixa o usuário inserir conteúdo longo com múltiplas linhas. Texto guia: "Textarea lets users enter longer-form content with multiple lines. Perfect for comments, descriptions, feedback, and any input that needs more space."
Pilares: **Flexible** (auto-resize, character counters, and validation), **Readable** (clear text layout with helper or error messages), **Accessible** (built with ARIA and keyboard support).
Hero (nota "More space for your ideas"): exemplo válido "Notes or feedback" (placeholder "Share your thoughts...", helper "Tell us what you like or what we can improve.", contador "0 / 500", alça de resize) e exemplo inválido "Your message" ("This field is required.", erro "Please enter a message." com ícone + "0 / 500").
Uso Vue da doc: `<VTextarea v-model="message" label="Notes or feedback" placeholder="Share your thoughts..." helper-text="Tell us what you like or what we can improve." :counter="500" :auto-resize="true" />` + Pro tip: "Use auto-resize for a better writing experience." (`<VTextarea v-model="message" :auto-resize="true" />`).

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomia numerada da doc ("Key parts of the textarea component"):

- **(1) Label** — rótulo acima do campo (ex.: "Your message...").
- **(2) Helper text** — texto de apoio abaixo do campo (ex.: mensagem de ajuda ou erro).
- **(3) Textarea** — a caixa de texto multilinha em si (fundo + borda + placeholder/valor + alça de resize no canto).
- **(4) Character counter** — contador de caracteres (ex.: "0 / 500"), alinhado à direita sob o campo.
- Elementos visíveis adicionais: **placeholder** ("Share your thoughts...", "Enter your text..."), **resize handle** (alça diagonal no canto inferior-direito), **ícone de erro** (círculo "!" vermelho antes de "Please enter a message.").

## 3) Variantes e tamanhos visíveis

Variantes ("Variants — Different styles for different use cases"):

- **Default** — "Simple and clean." ("Enter your text...").
- **Auto-resize** — "Expands with content." ("This textarea grows automatically as you type...").
- **With counter** — "Shows character count." ("Write a short bio..." + "0 / 500").
- **Helper or error text** — "With supporting text." ("Tell us more..." + "This will be visible to other users.").

Tamanhos ("Sizes — Three sizes for different densities"):

- **SM** — caixa baixa ("Your message...").
- **MD (default)** — caixa média em destaque (borda azulada na ilustração).
- **LG** — caixa alta com resize handle visível.

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Seção "States — Visual states for clear interaction feedback" (8 caixas):

- **Empty** — placeholder "Your message...".
- **Hover** — borda levemente escurecida.
- **Focus** — borda/anel de foco azul.
- **Typing** — valor parcial com caret ("Hello|").
- **Filled** — "This is a filled textarea."
- **Invalid** — borda vermelha + "This field is required." (erro com anúncio apropriado).
- **Disabled** — campo apagado/não interativo ("Your message...").
- **Read-only** — fundo cinza com "Read only content."
- **Loading**: não há na imagem (não se aplica a textarea). Pressed não é listado como estado separado (o press não muda o campo de texto).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Foco/digitar**: borda de foco aparece; caret visível durante a digitação.
- **Auto-resize**: o campo cresce suavemente conforme o conteúdo aumenta (sem scrollbar interna agressiva).
- **Resize manual**: alça de redimensionamento arrastável; "Resizable via keyboard" (redimensionável também por teclado).
- **Contador**: atualiza "n / 500" à medida que digita (com limite).
- **Validação**: estado inválido com erro anunciado ("Proper error announcement"); suporta `required`.
- **Teclado**: navegação Tab / Shift+Tab; operação integral por teclado.
- Sem overlays/dropdowns.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Seção "Motion — Smooth and subtle by default": "Grows smoothly as content increases." (ilustração campo vazio → campo expandido com linhas de skeleton). A imagem não imprime duração/easing literais para o textarea; aplicar o padrão do sistema (DESIGN.md §10/§20):

- Auto-resize / expansão: altura em transição suave → `--v-motion-normal: 160ms` (ou `--v-motion-slow: 300ms` para blocos maiores) + `--v-ease-standard: cubic-bezier(.2,.8,.2,1)` / `--v-ease-out` para entrada; animar `height`/`transform` com contenção (evitar layout shift brusco).
- Hover/focus do contorno: `--v-motion-fast: 100ms` + `--v-ease-out` em `border-color`/`box-shadow`/`opacity` (mesmo padrão dos demais inputs).
- `prefers-reduced-motion`: expansão instantânea (zera durações).

## 7) Acessibilidade observada

Checklist literal ("Accessibility — Built with accessibility in mind"):

- ARIA compliant (aria-labelledby, aria-describedby).
- Keyboard navigation (Tab, Shift+Tab).
- Screen reader friendly.
- Proper error announcement.
- Resizable via keyboard.
- Supports required and read-only states.

## 8) data-test-ids sugeridos (lista)

- `v-textarea` (root/wrapper)
- `v-textarea-label`
- `v-textarea-input` (elemento `<textarea>`)
- `v-textarea-helper`
- `v-textarea-error`
- `v-textarea-counter`
- Rodapé da doc: "VueUI Nova — Beautiful components for modern web apps. Open source · Customizable · Production ready".
