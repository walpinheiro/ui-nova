# VPasswordInput — DESIGN-SPEC (fonte: doc/Ui/VPasswordInput.png)

> Página de documentação do componente VPasswordInput (VueUI Nova › Components › VPasswordInput, v1.0.0).
> Tagline da página: "A secure password field with visibility toggle and strength feedback."
> Três pilares no topo: **Secure by default** (Masks input with a single click to reveal) · **Password strength** (Real-time feedback to help users create stronger passwords) · **Flexible & accessible** (Built with accessibility and modern UX best practices).
> Header da página: breadcrumb "VueUI Nova › Components › VPasswordInput", título "Components / VPasswordInput", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido até Tooltip, com **VPasswordInput ativo**) / Patterns / Resources, card "Design. Build. Ship faster." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Secure inputs. Confident users. Stronger products."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Campo de senha seguro com alternância de visibilidade (mostrar/ocultar) e feedback de força em tempo real. Serve para criação e autenticação de contas: máscara por omissão, revelação com um clique e medidor/lista de requisitos que guiam o utilizador para senhas fortes. O card lateral da doc resume: "Your security matters — We use industry best practices to keep your data safe and secure." (checks: "Passwords are encrypted", "Never shared with third parties", "You're always in control"). O exemplo real ("In context — VPasswordInput in a real interface") mostra o uso canónico: formulário "Create your account" ("Join VueUI Nova and start building.") com Email `sarah.chen@acme.com`, Password mascarada `••••••••••••` + toggle olho, barra de força verde "Great password!" e checkbox "I agree to the Terms of Service and Privacy Policy."

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a password input" (exemplo com `••••••••` + olho):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Label | sim | Rótulo acima do campo, ex.: "Password" |
| Field | sim | Retângulo arredondado (`radius 12px`), fundo `--vpi-bg #FFFFFF`, borda `--vpi-border #E5E7EB`, texto `--vpi-text` |
| Masked value | sim | Valor mascarado `••••••••` (pontos); revelado mostra texto claro `VueNova2024` |
| Visibility toggle | sim | Ícone de olho à direita dentro do campo (`--vpi-icon #6B7280`, hover `--vpi-icon-hover #374151`) |
| Strength meter | não | Barra segmentada sob o campo (verde = forte); no contexto: 3 segmentos verdes + "Great password!"; variante "Good" com 1 segmento |
| Requirement list | não | Lista de regras com checks, ex.: "At least 8 characters / Include a number / Include a special character / Include an uppercase letter" |
| Helper text (optional) | não | Texto auxiliar, ex.: "Use at least 8 characters." |

Elementos da seção "In context":

- Campos Email e Password rotulados; toggle olho à direita da senha.
- Medidor de força verde com texto "Great password!".
- Checkbox de consentimento com links "Terms of Service" e "Privacy Policy".
- Card lateral "Your security matters" com ícone de cadeado e 3 checks verdes.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Common variations for different use cases", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Default | `Password / •••••••` sem toggle | Campo básico mascarado |
| With show/hide | `Password / •••••••` + olho | Alternância de visibilidade |
| With strength meter | `••••••••••` + olho + barra verde "Good" | Feedback de força em tempo real |
| (With requirement list) | Barra + 4 regras com checks (3 verdes, 1 vazia) | Guia explícito de requisitos |
| Error state | Borda vermelha + olho + "✖ Password is too weak" | Senha rejeitada (curta/fraca) |

### Tamanhos ("Sizes — Three sizes for different layouts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | Campo compacto `••••••` + olho | Escala reduzida |
| Medium (default) | Campo `•••••••` + olho com foco | Altura média (padrão) |
| Large | Campo amplo `•••••••` + olho | Escala ampliada |

Target mínimo de toque **44×44px** no toggle olho (ver acessibilidade).

## 4) Estados ("States — Key states throughout the interaction", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | `•••••••` + olho, borda neutra |
| Hover | `•••••••` + olho com fundo/borda subtilmente alterados |
| Focus | `•••••••` + olho com anel de foco azul |
| Revealed | Texto claro `VueNova2024` + ícone olho-cortado |
| Invalid | `•••••••` + olho com borda vermelha (`--vpi-error #EF4444`) |
| Disabled | `•••••••` + olho-cortado acinzentados, sem interação |

Mascarado usa `type="password"` nativo (compatível com gestores de senhas); revelado troca para `type="text"` mantendo valor e foco. Inválido expõe `aria-invalid` + mensagem descritiva.

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click no toggle (olho) | Alterna mascarado ↔ revelado; ícone troca olho ↔ olho-cortado; foco permanece no campo |
| Digitação | Atualiza medidor de força e lista de requisitos em tempo real (por regra, com check verde ao cumprir) |
| Força fraca no submit/blur | Estado Invalid + mensagem "Password is too weak"; erro anunciado a leitores de ecrã |
| Força boa/forte | Barra verde ("Good" / "Great password!") + texto (não só cor) |
| Hover no toggle | Ícone escurece (`--vpi-icon-hover #374151`); cursor pointer; tooltip/label acessível |
| Focus / Tab | Anel de foco visível; Tab alcança campo e toggle separadamente (toggle é `<button type="button" tabindex="0">`) |
| Enter / Space no toggle | Ativa a alternância via teclado |
| Copiar/colar | Permitido (gestores de senhas); valor colado reavalia força imediatamente |
| Disabled | Sem ação; `disabled` + `aria-disabled` |

## 6) Motion ("Motion — Smooth, purposeful interactions", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Toggle reveal | **"Quick fade between masked and revealed"** | `--v-motion-fast: 100ms` + `--v-ease-out` (`opacity` do valor/ícone) |
| Focus ring | **"Smooth 100ms ease-out transition"** (literal) | `--v-motion-fast: 100ms` + `--v-ease-out` (`box-shadow` do anel) |
| Strength bar fill | **"Animated fill as user types (200ms ease-out)"** (literal) | Sem token exato (entre normal 160ms e slow 300ms); aproximar com token dedicado ou `--v-motion-normal`; anima `width`/`scaleX` com `ease-out` |

Regras gerais: motion apenas em `transform`/`opacity` (e `box-shadow`/`width` do medidor); `prefers-reduced-motion: reduce` zera fade/preenchimento animado (mudança instantânea + texto).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-password-input {
  background: var(--v-color-surface); // #FFFFFF
  border: 1px solid var(--v-color-border); // #E5E7EB
  border-radius: var(--v-radius-md); // 12px
  transition:
    border-color var(--v-motion-fast) var(--v-ease-out),
    box-shadow var(--v-motion-fast) var(--v-ease-out);

  &:hover { border-color: var(--v-color-border-hover); }
  &:focus-within {
    border-color: var(--v-color-primary); // #6366F1
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
  &[aria-invalid="true"] { border-color: var(--v-color-danger); } // #EF4444
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  .v-password-input__toggle { color: #6b7280; transition: color var(--v-motion-fast) var(--v-ease-out); &:hover { color: #374151; } }
  .v-password-input__meter-fill { transition: width 200ms ease-out; }

  @media (prefers-reduced-motion: reduce) { transition: none; .v-password-input__meter-fill { transition: none; } }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 7 checks literais)

1. **Visibility toggle has descriptive label** — toggle com `aria-label`/`aria-pressed` descritivo (ex.: "Show password" / "Hide password").
2. **Works with password managers** — usa `type="password"` nativo (standard input `type="password"`), `name`/`autocomplete` (`current-password`/`new-password`).
3. **Fully keyboard accessible (Tab, Enter, Space)** — campo e toggle operáveis por teclado.
4. **Clear error messages announced by screen readers** — erro ("Password is too weak") via `aria-live`/`role="alert"` + `aria-invalid`, com `aria-describedby` para requisitos.
5. **Strength feedback is not color-only** — força com texto ("Good", "Great password!") e ícones/checks além da cor.
6. **Meets WCAG 2.1 AA color contrast** — texto/ícones/erros dentro do contraste mínimo.
7. **(Implícito: alvo e foco)** — toggle com área mínima 44×44px e anel de foco visível via `:focus-visible`.

## 8) data-test-ids sugeridos

- `v-password-input` (root; `data-variant="default|show-hide|strength|requirements|error"`, `data-size="sm|md|lg"`, `data-state`)
- `v-password-input-field` (input nativo)
- `v-password-input-toggle` (botão olho; `aria-pressed`)
- `v-password-input-toggle-show` / `v-password-input-toggle-hide` (ícones)
- `v-password-input-meter` (barra de força; `data-strength="weak|medium|strong"`)
- `v-password-input-meter-label` ("Good" / "Great password!")
- `v-password-input-requirements` (lista de regras)
- `v-password-input-requirement-{length,number,special,uppercase}` (cada regra)
- `v-password-input-error` ("Password is too weak")
- `v-password-input-email` (contexto Create your account)
- `docs-password-variant-{default,show-hide,strength,requirements,error}`
- `docs-password-size-{sm,md,lg}`
- `docs-password-state-{default,hover,focus,revealed,invalid,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--vpi-bg` | `#FFFFFF` |
| `--vpi-border` | `#E5E7EB` |
| `--vpi-border-focus` | `#6366F1` |
| `--vpi-icon` | `#6B7280` |
| `--vpi-icon-hover` | `#374151` |
| `--vpi-error` | `#EF4444` |
| `--vpi-success` | `#10B981` |
| `--vpi-meter-weak` | `#EF4444` |
| `--vpi-meter-medium` | `#F59E0B` |
| `--vpi-meter-strong` | `#10B981` |
| `--vpi-radius` | `12px` |

No repo equivalem a `--v-color-surface`, `--v-color-border`, `--v-color-primary`, `--v-color-danger`, `--v-color-success`, `--v-color-warning (#F59E0B)`, `--v-radius-md`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VPasswordInput
    v-model="password"
    label="password"
    :show-strength="true"
    :requirements="true"
    placeholder="Create a strong password"
  />
</template>
```

**Pro tip (literal):** "Combine with a requirements list to set clear expectations and reduce failed sign-ups."
