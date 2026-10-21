# VDropdownMenu — DESIGN-SPEC (fonte: doc/ui/VDropdownMenu.png)

> Status: ✅ Concluído e validado
> Data: 2026-09-20
> Testes: `pnpm build` ok; unit `VDropdownMenu.spec.ts` — 16/16; e2e harness `VDropdownMenu.e2e.spec.ts` — 6/6 (`pnpm harness` + `http://localhost:8321/VDropdownMenu.html`).
> Validação visual: trigger primary/secondary/ghost/destructive, tamanhos sm/md/lg (32/40/48px), menu min-width 200px, item 36px, radius trigger 12px / menu 8px, sombra `0 8px 24px rgba(0,0,0,0.08)`, separator, item destrutivo, submenu lateral, motion hover 120ms / press 70ms / open 120ms / close 100ms.
> Blockers: Storybook sem `.storybook/main.*` no repo; e2e requer `pnpm harness` + `pnpm exec playwright install chromium`.

## 1) Objetivo do componente

Lista de ações e navegação compacta ("Action list and compact navigation"):
acesso a ações/links a partir de um único gatilho, mantendo a interface limpa
e focada. Título do hero: "PRIMARY EXAMPLE — Small menu. Fast actions.
Everything you need, right where you need it." Atributos: **Flexible**
(ações, links e menus aninhados), **Accessible** (keyboard friendly, screen
reader ready), **Modern** (limpo, consistente). Anotação: "Small interactions.
Big progress."

## 2) Anatomia (partes, cada elemento visível na imagem)

Exemplo primário (hero):

- Trigger: pill "••• More options ⌄" (ícone ellipsis + label + chevron down).
- Menu aberto (surface branca, sombra, radius): "View details" (olho),
  "Share" (upload + seta submenu >), "Rename" (lápis), "Duplicate"
  (quadrados), divisória, "Delete" vermelho (lixeira).
- Submenu aninhado: "Copy link" (link), "Share to Slack" (logo),
  "Share to email" (envelope).

Anatomy ("The building blocks of a dropdown menu"):

- **Trigger icon (optional)** — ellipsis "•••" à esquerda do label.
- **Label** — texto do trigger ("More options").
- **Chevron** — "⌄" (vira "^" quando aberto).
- **Menu list (surface)** — container flutuante.
- **Menu item** — linha com ícone + label (ex. doc/pessoa/engrenagem).
- **Separator** — linha divisória 1px entre grupos.
- **Submenu (optional)** — item filho ("Submenu item" com pasta/link).

Código do pôster:

```vue
<Dropdown>
  <template #trigger>
    <Button variant="secondary" size="md">
      <Icon name="more-horizontal" /> More options
    </Button>
  </template>
  <DropdownItem icon="eye">View details</DropdownItem>
  <DropdownItem icon="edit">Rename</DropdownItem>
  <DropdownDivider />
  <DropdownItem icon="trash" variant="destructive">Delete</DropdownItem>
</Dropdown>
```

API: `Dropdown`, `#trigger`, `Button variant/size`, `Icon`,
`DropdownItem icon/variant`, `DropdownDivider`; "Supports icons, separators,
submenus, keyboard navigation, and more." Link vueui.dev.

## 3) Variantes e tamanhos visíveis

Variantes de trigger (4 pills "••• Dropdown ⌄"):

- **Primary** — preenchido índigo, texto branco ("Main actions, high
  emphasis").
- **Secondary** — fundo claro, texto escuro ("Supporting actions").
- **Ghost** — mínimo, sem fundo ("Minimal style").
- **Destructive** — tintado vermelho ("For dangerous actions") + item
  "Delete" vermelho no menu.

Tamanhos ("Consistent sizing", alturas explícitas):

- **SM** — Height 32px · **MD (Default)** — Height 40px ·
  **LG** — Height 48px.
- Tokens: padding horizontal 16px, corner radius 12px; menu min-width 200px,
  item height 36px, padding horizontal 16px, ícone 16px, gap ícone–label 12px.

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Trigger (4 + menu aberto):

- **Default trigger** — "Options" repouso.
- **Hover trigger** — tint de fundo.
- **Focus trigger** — anel azul (`focus ring on trigger and items`).
- **Open** — trigger ativo + chevron "^" + menu visível ("View details /
  Rename / Delete").

Itens (5):

- **Item hover** — fundo tintado.
- **Item focus** — anel/borda azul.
- **Selected item** — check azul + fundo tintado.
- **Disabled item** — texto apagado, sem interação.
- **Destructive item** — fundo vermelho claro + texto/ícone vermelhos.
- Sem `loading` no pôster (ação assíncrona usaria spinner no item — fora do
  escopo da imagem).

## 5) Micro-interações (click, hover, teclado, overlays)

- Click/Enter/Espaço/↓ no trigger abre; Esc fecha e devolve o foco ao trigger.
- Hover destaca item; click executa e fecha.
- Seta submenu (>) abre submenu lateral no hover/foco/seta direita.
- Teclado: setas navegam itens e submenus; Esc fecha menu e submenus;
  Tab fecha (focus management retorna ao trigger).
- Click fora fecha; menu reposiciona (flip) se faltar espaço.
- Item desabilitado: não focável, anunciado como tal.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Faixa Motion ("Smooth and purposeful interactions", 5 estágios):

- **Closed** — "Resting state."
- **Hover** — "Background tint, 120ms ease-out."
- **Press** — "Slight scale (0.98), 70ms ease-out."
- **Open** — "Menu fades in and moves up, 120ms ease-out."
- **Close** — "Menu fades out, 100ms ease-out."

Mapeamento (DESIGN.md §10/§20):

- 120ms ≈ `var(--v-motion-normal) (160ms)` (ou `fast` 100ms — sem token de
  120ms; documentar a aproximação, nunca hardcodar).
- 70ms press → `var(--v-motion-fast) (100ms)` (mais próximo disponível).
- 100ms close → `var(--v-motion-fast)` exato.
- Easing `ease-out` → `var(--v-ease-out)`; padrão `var(--v-ease-standard)`.
- Abertura = fade (0–100%) + slide-up (4–24px); press = `scale(0.98)`
  (faixa 0.98–1.02).
- Só `transform`/`opacity` (+ tint de `background-color`, propriedade barata).
- `prefers-reduced-motion`: abre/fecha instantâneo.

## 7) Acessibilidade observada

Tabela Accessibility ("Inclusive by design", 8 linhas):

- Keyboard support — "Open with Enter, Space, or ↓".
- Clear focus indicator — "Visible focus ring on trigger and items".
- Screen reader support — "Proper ARIA roles and labels"
  (`menu`/`menuitem`, `aria-haspopup`, `aria-expanded`).
- Arrow key navigation — "Navigate items and submenus".
- Escape to close — "Closes menu and submenus".
- Focus management — "Returns focus to trigger".
- Disabled state — "Not focusable, announced correctly".
- High contrast — "Meets WCAG 2.1 AA (4.5:1)".
- Contraste do item destrutivo também ≥ 4.5:1; `:focus-visible` obrigatório.

## 8) data-test-ids sugeridos (lista)

- `dropdown` (root)
- `dropdown-trigger`
- `dropdown-trigger-icon`
- `dropdown-chevron`
- `dropdown-menu`
- `dropdown-item` / `dropdown-item-{id}`
- `dropdown-item-selected`
- `dropdown-item-destructive`
- `dropdown-item-disabled`
- `dropdown-separator`
- `dropdown-submenu` / `dropdown-submenu-trigger` / `dropdown-submenu-item`
- `dropdown-variant-primary` / `dropdown-variant-secondary` /
  `dropdown-variant-ghost` / `dropdown-variant-destructive`
- `dropdown-size-sm` / `dropdown-size-md` / `dropdown-size-lg`
