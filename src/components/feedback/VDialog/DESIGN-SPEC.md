# VDialog — DESIGN-SPEC ✅ (fonte: doc/Ui/VDialog.png)

> **Status:** ✅ Concluído e validado  
> **Data:** 2026-09-21  
> **Testes:** `pnpm build` ok; vitest **10/10**; e2e **4/4** (`.val-harness/VDialog.html`).

> Validação visual: surface branco, raio 16px, shadow modal `--v-shadow-xl`, overlay com blur, paddings 24px/16×24px, larguras 320/480/640px, close via `VIcon` + Keyline (`x`, 18px), z-index `--v-popover-z-index`, animação de entrada/saída e reduced motion.

## 0) Contrato implementado

- `v-model`/`modelValue` controla a abertura; `open` é alias explícito para `v-model:open`.
- Eventos: `update:modelValue`, `update:open`, `open-change`, `close` e `dismiss`.
- Slots: `default`, `title`, `description`, `icon`, `actions` e `footer`.
- Variants: `basic`, `confirmation`, `alert`, `form` e `fullscreen`; sizes: `sm`, `md` e `lg`.
- IDs estáveis de teste usam a anatomia `dialog-backdrop`, `dialog-container`, `dialog-title`, `dialog-description`, `dialog-content`, `dialog-icon`, `dialog-close-button`, `dialog-actions` e `dialog-loader`.

## 1) Objetivo do componente

Superfície modal focada e temporária para informação crítica, decisões ou tarefas.
Tira o foco do fundo (dim/blur via backdrop) para reduzir distração e concentrar o
usuário no que importa. Promessa do pôster: "Bring focus to important moments. A dialog
for every use case." Pilares declarados: Focused (removes distractions), Flexible
(supports content, forms, and actions), Accessible (built for everyone).
Exemplo hero: "Turn on notifications? Get notified about product updates, new features,
and important activity." com ações "Not now" + "Enable notifications".

## 2) Anatomia (partes, cada elemento visível na imagem)

- **Container**: card central branco, fundo + borda + sombra (`background + border + shadow`).
- **Backdrop/Overlay**: cobre a página ao fundo com blur + escurecimento; página desfocada visível atrás.
- **Icon (optional)**: selo arredondado claro com sino (bell) no topo do exemplo hero e no diagrama de anatomia.
- **Title**: "Turn on notifications?" / "Dialog title" — heading centralizado no exemplo, negrito.
- **Description**: texto de apoio cinza abaixo do título ("Supporting description goes here.").
- **Content area (custom content)**: região livre entre descrição e ações (slots, forms, texto).
- **Actions (primary + secondary)**: fileira de botões no rodapé — "Cancel" (ghost/secundário) + "Confirm" / "Enable notifications" (primário índigo).
- **Close button (optional)**: "×" no canto superior direito do container (18px).
- **Trigger**: botão "Open Dialog" fora do modal (visto na seção States/Closed).
- **Code slots**: `#default` (corpo) e `#actions` (botões), props `v-model="isOpen"`, `title`, `description`, `variant="ghost"`.

## 3) Variantes e tamanhos visíveis

Variantes (5 cards com ícone + nome + descrição):
- **Basic** — "Standard dialog with title and actions." (selecionada/destacada na imagem).
- **Confirmation** (?) — "Asks users to confirm a decision."
- **Alert** (!) — "Communicates important information."
- **Form** — "Collects input from users."
- **Fullscreen** (expand) — "Immersive dialog for complex tasks."

Tamanhos (3 miniaturas com barra de título, linhas de texto e botões):
- **SM** — Max width 320px. "Ideal for simple content."
- **MD (Default)** — Max width 480px. "Most common use case." (destacado).
- **LG** — Max width 640px. "For complex content."

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Seção "States — How the dialog actions look in different states":
- **Closed** — botão trigger "Open Dialog" neutro. "Default trigger state."
- **Open** — botão "Open Dialog" primário + "Dialog visible with backdrop."
- **Hover action** — botão "Confirm" primário levemente escurecido. "Pointer hover state."
- **Focused action** (Focused action) — botão "Confirm" com anel de foco visível. "Keyboard focus state."
- **Loading action** — botão "Saving..." com spinner. "Shows activity state."
- **Destructive** — botão "Delete" rosa/vermelho claro com texto vermelho. "Dangerous action."
- **Disabled action** — botão "Confirm" cinza não interativo. "Non-interactive state."
- Implícitos: backdrop visível apenas no Open; pressed segue padrão do DS (scale ~0.98).

## 5) Micro-interações (click, hover, teclado, overlays)

- Click no trigger abre o dialog com backdrop; click em "Not now"/"Cancel"/"×" fecha (`@click="isOpen = false"`).
- Click em ação primária confirma (`@click="enableNotifications"`); ação destrutiva exige confirmação redobrada.
- Hover na ação primária escurece o fundo (primary-500 → primary-600).
- Teclado: Tab circula preso dentro do dialog (focus trap); Escape fecha; Enter ativa ação focada.
- Overlay: click fora do container (no backdrop) deve fechar ou ser configurável; backdrop desfoca o fundo.
- Loading: botão mostra spinner e bloqueia duplo submit até concluir.
- Ao fechar, foco retorna ao trigger que abriu.
- Slots flexíveis: conteúdo, animações, sizes e variants via API (`Flexible API for any use case`).

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Storyboard de 3 quadros: Fade in → Idle → Fade out.
- **Fade in**: "Backdrop fades in. Dialog scales up." Entrada = fade do overlay (opacity 0→100%) + scale do container (~0.98→1) + leve slide-up.
- **Idle**: "Subtle elevation and presence." Repouso com sombra `xl` de modal.
- **Fade out**: "Dialog scales down. Backdrop fades out." Saída = scale down + fade do overlay.
- Mapeamento para tokens (DESIGN.md §10/§20): entrada usa `--v-motion-normal: 160ms` com `--v-ease-out` (ease-out = entrada); saída usa `--v-motion-fast: 100ms` a `--v-motion-normal` com `--v-ease-in` (ease-in = saída); scale dentro da faixa do pôster 0.98–1.02; fade 0–100%; animar só `transform`/`opacity`; `prefers-reduced-motion: reduce` zera durações.
- Hover/pressed das ações: transição de `background` em `--v-motion-normal` + `transform` em `--v-motion-fast` com `--v-ease-standard: cubic-bezier(.2,.8,.2,1)`.

## 7) Acessibilidade observada

Checklist "Accessibility — Inclusive by design" (6 itens com check verde):
- Traps focus within the dialog.
- Closes with Escape key.
- Supports screen readers (ARIA roles).
- Describes purpose with clear titles and labels.
- Maintains sufficient color contrast (WCAG 2.1 AA).
- Returns focus to trigger on close.
- Implicações: `role="dialog"` + `aria-modal="true"`, `aria-labelledby` (título) + `aria-describedby` (descrição), `:focus-visible` obrigatório no botão primário, contraste AA nos botões índigo/branco e no destrutivo.

## 8) data-test-ids sugeridos (lista)

- `dialog-container`
- `dialog-backdrop`
- `dialog-title`
- `dialog-description`
- `dialog-content`
- `dialog-icon`
- `dialog-close-button`
- `dialog-actions`
- `dialog-action-confirm`
- `dialog-action-cancel`
- `dialog-action-destructive`
- `dialog-action-loading`
- `dialog-trigger-open`

Tokens de design vistos na imagem (para implementação): container SM 320px / MD 480px / LG 640px; border radius 16px (`--v-radius-lg`); shadow `0 20px 60px rgba(0,0,0,0.15)` (`--v-shadow-xl`); overlay `rgba(0,0,0,0.5)` (`--v-color-overlay`); header padding 24px; content padding 24px; footer padding 16px 24px; close icon 18px; z-index 1000.
