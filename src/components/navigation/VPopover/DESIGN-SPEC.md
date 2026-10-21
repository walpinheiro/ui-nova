# VPopover — DESIGN-SPEC (fonte: doc/ui/VPopover.png) ✅

## 1) Objetivo do componente

Superfície flutuante contextual ("Contextual floating surface"): exibe conteúdo
ancorado a um elemento — informação rápida, ações, formulários — sem sair da
página. Atributos: **Contextual** ("Show relevant content, right when it's
needed"), **Lightweight** ("Non-intrusive and easy to use"), **Flexible**
("Supports multiple placements, sizes, and content types"). Anotação: "Small
surfaces. Big possibilities".

## 2) Anatomia (partes, cada elemento visível na imagem)

Hero (painel grande):

- Trigger: botão primário azul "Show popover ⌄" com seta triangular
  (arrow) apontando para baixo até o card.
- Card popover (surface branca, sombra `lg`, radius): header com ícone
  lâmpada + título "Quick tip" + botão X (fechar); corpo "Popovers are
  perfect for short, contextual content, actions, or forms."; divisória;
  footer com "Learn more" (ghost) + "Got it" (primário azul).

Anatomy numerada ("Key parts of the popover component"):

1. **Arrow** — seta de ancoragem ao trigger.
2. **Container** — superfície flutuante (bg, border, shadow, radius).
3. **Content** — área de conteúdo (título + texto: "Popover title / This is
   the popover content area.").
4. **Actions** — botões ("Cancel" ghost + "Confirm" primário).

Vue usage:

```vue
<VPopover>
  <template #trigger>
    <VButton variant="primary">Show popover</VButton>
  </template>
  <div class="p-4">
    <h4 class="font-medium mb-2">Quick tip</h4>
    <p class="text-sm text-muted mb-4">
      Popovers are perfect for short, contextual content.</p>
    <div class="flex justify-end gap-2">
      <VButton variant="ghost" size="sm">Learn more</VButton>
      <VButton size="sm">Got it</VButton>
    </div>
  </div>
</VPopover>
```

Slots: `#trigger` + conteúdo default. Pro tip: "Use different triggers like
hover or focus for even smoother experiences." —
`<VPopover trigger="hover" placement="top"><!-- content --></VPopover>`.

## 3) Variantes e tamanhos visíveis

Variantes ("Different content styles for common use cases", 4 cards):

- **Informational** — ícone "i" azul + "Helpful info / This popover provides
  useful information."
- **Action menu** — lista "Edit" (lápis), "Duplicate" (quadrados), "Share"
  (nó), "Delete" vermelho (lixeira).
- **Rich content** — thumbnail paisagem + "VueUI Nova / Beautiful components
  for modern web apps." + botão "View details" (tintado).
- **Form popover** — "Subscribe / Get the latest updates." + input "Your
  email" + botão "Subscribe" azul full-width.

Tamanhos ("Three sizes for different densities", 3 triggers de larguras
crescentes):

- **SM ("Small")** · **MD (default, "Medium (default)", pill azul)** ·
  **LG ("Large")** — variam largura máxima e padding do container
  (tokens `--v-popover-*`; trigger de exemplo com chevron ">" à direita).

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Fileira States (6 pills/botões):

- **Closed** — só trigger "Show popover" em repouso ("Not visible" implícito).
- **Hover trigger** — fundo tintado do trigger.
- **Focus trigger** — anel/borda azul no trigger.
- **Open** — trigger com chevron "^" + popover visível.
- **Pressed action** — botão "Action" primário preenchido (press do CTA).
- **Disabled** — trigger apagado, sem interação.
- Sem `loading` no pôster (submit de form usaria spinner no botão — fora da
  imagem).

## 5) Micro-interações (click, hover, teclado, overlays)

- Triggers: `click` (default), `hover`, `focus` (prop `trigger`,
  `placement="top"` no exemplo).
- Abrir: mostra container + arrow; foco vai ao primeiro elemento focável
  (ou ao painel com `tabindex="-1"`).
- Fechar: X, Esc, click fora, ou ação (Got it/Confirm); foco retorna ao
  trigger ("Proper focus management").
- Hover/focus trigger dão preview/abertura conforme prop (experiências "mais
  suaves" do Pro tip).
- Form popover: input + submit dentro do painel; Enter envia.
- Sem overlay de backdrop (diferente de modal — "lightweight,
  non-intrusive").

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Painel Motion: "Smooth and subtle by default." / "Fades and scales in with a
smooth 150ms ease-out animation." Diagrama: retângulo vazio → card com linhas
→ vazio (abre/fica/fecha).

- Abertura: fade (0–100%) + scale (dentro de 0.98–1.02) em **150ms ease-out**
  → mapear para `var(--v-motion-normal) (160ms)` + `var(--v-ease-out)`
  (sem token de 150ms; token dedicado `--v-popover-transition` listado nos
  design tokens pode encapsular exatamente isso).
- Fechamento: reverso simétrico (~100–150ms).
- Hover/focus do trigger: tint em `var(--v-motion-fast) (100ms)`.
- Só `transform`/`opacity` (+ tint barata).
- `prefers-reduced-motion`: aparição instantânea.
- Tokens de transição: `--v-popover-transition`, `--v-popover-z-index`.

## 7) Acessibilidade observada

Painel Accessibility (6 checks):

- ARIA compliant (`role="dialog"`).
- Proper focus management (foco entra no painel, retorna ao trigger).
- Keyboard navigation (Esc to close).
- Supports aria-labelledby / aria-describedby (título "Quick tip" + corpo).
- Screen reader friendly.
- Works with multiple trigger types (click, hover, focus).
- Trigger precisa `aria-haspopup="dialog"` + `aria-expanded`; X com
  `aria-label="Close"`; inputs do form com `<label>` real.

## 8) data-test-ids sugeridos (lista)

- `popover` (root)
- `popover-trigger`
- `popover-arrow`
- `popover-container` / `popover-content`
- `popover-title`
- `popover-close`
- `popover-actions`
- `popover-action-confirm` / `popover-action-cancel`
- `popover-variant-informational` / `popover-variant-action-menu` /
  `popover-variant-rich` / `popover-variant-form`
- `popover-size-sm` / `popover-size-md` / `popover-size-lg`
- `popover-state-open` / `popover-state-disabled`
