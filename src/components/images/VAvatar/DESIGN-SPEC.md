# VAvatar — DESIGN-SPEC (fonte: doc/Ui/documentação_vueui_nova_componente_avatar.png)

## 1) Objetivo do componente

Representar pessoas, times ou entidades: ajuda a reconhecer "quem é quem",
mostra presença (online/busy) e dá toque humano ao produto. Hero: "PRIMARY
ACTION — Show people, teams, and presence. Avatars bring your product to
life." Três atributos: **Recognizable** (pessoas, times e marcas),
**Flexible** (imagens, iniciais e ícones), **Expressive** (estados de presença
e uso contextual). Anotação: "Real people. Real progress." Faixa de exemplo:
Individual/Online (foto + dot verde), Grouped/Team members (3 fotos + "+3"),
Status/Busy (foto + dot laranja), Initials/Iniciais fallback ("JD" lilás).

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomy ("The building blocks of an avatar", foto grande com callouts):

- **Image (avatar content)** — foto, iniciais "JD" ou ícone de pessoa.
- **Container (shape + border)** — círculo por padrão (ou quadrado arredondado);
  borda 1px (`var(--color-border)`).
- **Status indicator (presence dot)** — dot 10px no canto inferior direito,
  verde online / laranja busy / cinza offline; com borda do surface.
- **Badge (optional)** — selo 16px sobreposto (ex.: coroa laranja "pro",
  check azul de selecionado).

Exemplo de código do pôster:

```vue
<VAvatar src="/images/jane.jpg" alt="Jane Doe" size="md"
  status="online" badge="pro" />
```

Props visíveis: `src`, `alt`, `size`, `status`, `badge`. Texto auxiliar:
"Flexible API for any use case. Supports images, initials, icons, status,
badges, sizes, and more." Link "Learn more at vueui.dev →".

## 3) Variantes e tamanhos visíveis

Variantes (7 cards):

- **Image** — "User photo" (foto; card destacado azul = default).
- **Initials** — "Text fallback" ("JD" sobre fundo lilás claro).
- **Icon** — "System icon" (silhueta de pessoa sobre cinza).
- **Group** — "Multiple users" (2 fotos sobrepostas + pill "+3").
- **Team** — "Team or project" (3 círculos "A" azul, "B" roxo, "C" verde).
- **With badge** — "Role or status" (foto + selo coroa laranja).
- **Square (rounded)** — "Alternative shape" (foto em quadrado `radius` grande).

Tamanhos ("Consistent sizing", 5 fotos em escala + px):

- **XS** 24×24 · **SM** 32×32 · **MD (Default)** 40×40 (destacado) ·
  **LG** 48×48 · **XL** 64×64.
- Status dot 10px e badge 16px escalam proporcionalmente (SM/XS podem usar
  8px/12px — verificar na implementação, sem valor mágico fora de token).

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Grade States (8 cards, 2 fileiras):

- **Default** — repouso.
- **Hover** — "Slight lift + shadow" (elevação + sombra).
- **Focus** — "Focus ring for keyboard navigation" (anel 2px solid
  `var(--color-primary)`).
- **Selected** — "Selected state" (anel + selo check azul; card destacado).
- **Online** — "User is online" (dot verde sucesso).
- **Busy** — "User is busy" (dot laranja warning).
- **Loading** — "Loading state" (círculo cinza + spinner).
- **Fallback** — "Initials or icon" (fundo cinza/lilás com "JD" ou ícone).
- Sem `pressed`/`disabled` próprios; avatar clicável usa active scale 0.98 e
  avatar decorativo usa `aria-hidden`.

## 5) Micro-interações (click, hover, teclado, overlays)

- Hover: lift (translateY -1px) + sombra + `scale(1.05)`.
- Focus (teclado): anel aparece; avatar focável/selecionável (`tabindex`,
  Enter/Espaço ativam quando for botão).
- Click em selecionável: selo check aparece (overlay canto superior direito).
- Presença: dot faz fade-in quando o status muda.
- Loading: spinner/pulse enquanto a imagem carrega; fallback entra se falhar.
- Group: "+3" abre lista/tooltip de membros (interação do `VGroupAvatar`).
- Status nunca é o único meio (sempre com label/ícone/texto — ver §7).

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Faixa Motion ("Subtle, purposeful motion", 6 estágios com setas):

- **Default** — "Resting state."
- **Hover** — "Scale 1.05, 120ms ease-out."
- **Focus** — "Ring appears, 120ms ease-out."
- **Selected** — "Check appears, 150ms ease-out."
- **Online** — "Dot fades in, 200ms ease-out."
- **Loading** — "Pulse, 1000ms ease-in-out."

Mapeamento para tokens (DESIGN.md §10/§20):

- 120ms ≈ entre `--v-motion-fast (100ms)` e `--v-motion-normal (160ms)` →
  usar `var(--v-motion-fast)` (ou `normal` se o token de 120ms não existir;
  nunca hardcodar 120ms fora de token).
- 150ms ≈ `var(--v-motion-normal)`; 200ms/1000ms → `var(--v-motion-slow)`
  (300ms) para o dot e token de pulse/spin
  (`--v-motion-spin-duration`) para loading — checar `_tokens.scss`; se não
  houver 200ms/1000ms, propor token antes de hardcodar.
- Easings: `ease-out` → `var(--v-ease-out)` (entrada),
  `ease-in-out` → `var(--v-ease-in-out)`; padrão `var(--v-ease-standard)`
  `cubic-bezier(.2,.8,.2,1)`.
- Só `transform`/`opacity` (+ `box-shadow` no hover é aceitável por ser sutil).
- `prefers-reduced-motion`: sem scale/lift/pulse (estado final imediato).

## 7) Acessibilidade observada

Tabela Accessibility ("Inclusive by design", 8 linhas):

- Alternative text — "Use descriptive alt text" (`alt="Jane Doe"`).
- Initials fallback — "Show initials when no image" (nunca caixa vazia).
- Status indicator — "Not the only means of conveying status" (dot + texto).
- Keyboard support — "Focusable and selectable".
- Screen reader — "Meaningful labels (e.g. 'Jane Doe, online')"
  (`aria-label`, `role="img"`/botão conforme o caso).
- Color contrast — "Meets WCAG 2.1 AA (≥ 4.5:1)" (iniciais/ícone sobre fundo).
- Non-color cues — "Use icons / text in addition to color".
- Reduced motion — "Respects user preference".
- Foco sempre visível via `:focus-visible`; avatar puramente decorativo =
  `aria-hidden="true"` + `alt=""`.

## 8) data-test-ids sugeridos (lista)

- `avatar` (root)
- `avatar-image`
- `avatar-initials`
- `avatar-icon`
- `avatar-status` / `avatar-status-online` / `avatar-status-busy` /
  `avatar-status-offline`
- `avatar-badge`
- `avatar-group` / `avatar-group-overflow` (pill "+3")
- `avatar-size-xs` / `avatar-size-sm` / `avatar-size-md` /
  `avatar-size-lg` / `avatar-size-xl`
- `avatar-state-loading` / `avatar-state-selected` / `avatar-state-fallback`
- `avatar-shape-square`
