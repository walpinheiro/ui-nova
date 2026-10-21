# VOtpInput — DESIGN-SPEC (fonte: doc/Ui/VOtpInput.png)

> Página de documentação do componente VOtpInput (VueUI Nova › Components › VOtpInput, v1.0.0).
> Tagline da página: "A one-time password / verification code input for secure authentication flows."
> Três pilares no topo: **Secure by design** (Optimized for authentication and sensitive user flows) · **Smooth experience** (Auto-advance, paste support and smart interactions) · **Accessible** (Built with inclusive design and screen reader support).
> Header da página: breadcrumb "VueUI Nova › Components › VOtpInput", título "Components / VOtpInput", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido até Tooltip, com **VOtpInput ativo**) / Patterns / Resources, card "Design. Build. Ship faster." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Small components. Big possibilities."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Campo de código de verificação / one-time password para fluxos de autenticação segura. É o controlo de confirmação de identidade: o utilizador recebe um código (ex.: 6 dígitos por e-mail) e introduz dígito a dígito para continuar. O card lateral da doc resume: "Designed for trust — A clean, focused input experience helps users complete verification with confidence." O exemplo real ("In context — Verification code input in a real flow") mostra o uso canónico: ecrã "Check your email" ("We've sent a 6-digit code to alex@company.com. Enter the code below to continue.") com slots `2 4 0 1 8 6` e helper "Didn't receive the code? Resend code".

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of VOtpInput" (exemplo com `2 4 0 1 8 6`):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Digit slot (visual input) | sim | Caixa individual por dígito (`--otp-slot-size 48px (md)`, `gap 12px`, `radius 12px`, fundo `--otp-slot-bg #FFFFFF`, borda `--otp-slot-border #E5E7F0`); ex.: `2`, `4`, `0`, `1`, `8`, `6` |
| Hidden input (single logical input) | sim | Um único input lógico por trás dos slots (amigável a leitores de ecrã) |
| Caret (active slot) | estado | Slot ativo com borda de foco `--otp-slot-border-focus #6366F1` (ex.: `1` no diagrama, `6` no contexto) |
| Separator (optional) | não | Espaçador visual entre grupos de slots (opcional, ex.: `3-3`) |
| Helper text (optional) | não | Texto auxiliar, ex.: "Didn't receive the code? Resend code" |
| Resend action (optional) | não | Ação "Resend code" / "Resend code in 00:23" para reenvio do código |

Elementos da seção "In context":

- Ícone de envelope em quadrado arredondado, título "Check your email", descrição do e-mail de destino.
- 6 slots preenchidos `2 4 0 1 8 6` (último com foco).
- Helper "Didn't receive the code? Resend code" (link).
- Card lateral "Designed for trust" com checks: "Clear input state and feedback", "Supports paste from clipboard", "Works great on all devices".

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different use cases, same great experience", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| 4 digits | `1 2 3 4` | "For shorter codes" |
| 6 digits (default) | `2 4 0 1 8 6` (último focado) | "Common for most auth flows" |
| Masked | `• • • • •` | "Hides entered digits" |
| Auto-submit | `8 7 1 2 9 0` | "Automatically verifies" (submete ao completar) |
| With resend helper | Slots vazios + texto | "Resend code in 00:23" (contagem decrescente + reenvio) |

### Tamanhos ("Sizes — Three sizes for different layouts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | `1 2 3 4` compactos | Escala reduzida |
| Medium (default) | `1 4 3 4` (slot `3` focado) | `--otp-slot-size 48px (md)` |
| Large | `1 2 3 4` amplos | Escala ampliada |

Target mínimo de toque **44×44px** por slot (ver acessibilidade); em mobile os slots mantêm `gap 12px` para acerto.

## 4) Estados ("States — Visual feedback for every state", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Empty | Slots vazios com borda neutra |
| Active slot | Slot com caret + borda/anel de foco azul |
| Filled | `1 2 3` preenchidos, borda neutra/texto escuro |
| Error | `1 2 3` com fundo/borda vermelhos (`--otp-slot-error #EF4444`); dispara shake |
| Disabled | `1 2 3` acinzentados, sem interação |
| Success | `1 2 3` com fundo/borda verdes (`--otp-slot-success #10B981`); check no Motion |

Erro e sucesso usam cor + ícone/texto (nunca só cor); inválido expõe `aria-invalid` e mensagem anunciada.

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Digitar dígito | Preenche slot atual e avança automaticamente para o próximo (auto-advance) |
| Backspace em slot vazio | Retrocede ao slot anterior e limpa-o; Backspace em slot preenchido limpa sem mover |
| Delete | Limpa slot atual sem mover |
| Colar código inteiro | Distribui pelos slots (paste support, inclusive da área de transferência); foco vai para o último preenchido |
| Completar todos os slots | Com `auto-submit`, verifica automaticamente (`@complete`); sem, aguarda submissão manual |
| Código inválido | Estado Error + shake suave + mensagem anunciada; foco permanece para correção |
| Código válido | Estado Success (check) após verificação |
| Resend code | Reenvia código; durante cooldown exibe "Resend code in 00:23" desativado |
| Colar em mobile / autofill OTP | Aceita preenchimento automático do SO (autocomplete `one-time-code`) |
| Hover | Transição subtil de `border-color` nos slots; cursor text |
| Focus / Tab | Um único ponto de tabulação (input lógico); setas ←/→ movem entre slots |
| Disabled | Sem ação; `disabled` + `aria-disabled` |

## 6) Motion ("Motion — Delightful interactions, built in", 4 especificações)

| Movimento | Descrição literal da imagem | Token `--v-*` correspondente |
|---|---|---|
| Auto-advance | "Moves to next slot automatically" (slot `1 →` próximo) | `--v-motion-fast: 100ms` + `--v-ease-out` (transição de foco/conteúdo) |
| Focus | "Smooth focus ring animation" | `--v-motion-fast: 100ms` + `--v-ease-out` (`box-shadow` do anel) |
| Error shake | "Gentle shake on invalid code" (`»` slot vermelho `«`) | Duração curta (~200–300ms) `ease-out`; `transform: translateX` com keyframes; respeitar `prefers-reduced-motion` (trocar por cor + mensagem) |
| Submit success | "Success state after verification" (check verde) | `--v-motion-fast: 100ms` + `--v-ease-out` (fade/scale do check) |

Regras gerais: motion apenas em `transform`/`opacity` (e `box-shadow` barato no foco); `prefers-reduced-motion: reduce` elimina shake/avanços animados (mudança de estado instantânea + mensagem).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-otp-input { display: flex; gap: var(--v-space-3); } // 12px

.v-otp-slot {
  width: 48px; height: 48px;
  background: var(--v-color-surface); // #FFFFFF
  border: 1px solid var(--v-color-border); // #E5E7F0
  border-radius: var(--v-radius-md); // 12px
  transition:
    border-color var(--v-motion-fast) var(--v-ease-out),
    box-shadow var(--v-motion-fast) var(--v-ease-out),
    background var(--v-motion-fast) var(--v-ease-out);

  &:focus-within {
    border-color: var(--v-color-primary); // #6366F1
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
  &[data-state="error"] { border-color: var(--v-color-danger); } // #EF4444
  &[data-state="success"] { border-color: var(--v-color-success); } // #10B981
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

@keyframes v-otp-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@media (prefers-reduced-motion: reduce) {
  .v-otp-slot { transition: none; }
  .v-otp-shake { animation: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 6 checks literais)

1. **Single logical input (screen reader friendly)** — um único `<input>` lógico (com `inputmode="numeric"`, `autocomplete="one-time-code"`) em vez de N inputs tabáveis.
2. **Proper labeling with aria-label / aria-describedby** — rótulo ("Verification code") + descrição/helper associados.
3. **Supports pasting an entire code** — colar distribui e anuncia o resultado.
4. **Full keyboard support (Tab, Backspace, Delete)** — Tab entra/sai do grupo, Backspace/Delete editam, ←/→ navegam.
5. **Clear error announcements** — erro via `aria-live`/`role="alert"` com `aria-invalid="true"` (não só cor).
6. **Works with assistive technologies** — testado com leitores de ecrã; slots visuais com `aria-hidden`, estado exposto no input lógico.

## 8) data-test-ids sugeridos

- `v-otp-input` (root; `data-length="4|6"`, `data-variant="default|masked|auto-submit|resend"`, `data-state`)
- `v-otp-slot-{index}` (cada slot visual, `data-filled`, `data-active`)
- `v-otp-hidden-input` (input lógico único)
- `v-otp-resend` (ação "Resend code")
- `v-otp-resend-countdown` ("in 00:23")
- `v-otp-error` (mensagem de erro)
- `v-otp-success` (indicador de sucesso)
- `docs-otp-variant-{4-digits,6-digits,masked,auto-submit,resend}`
- `docs-otp-size-{sm,md,lg}`
- `docs-otp-state-{empty,active,filled,error,disabled,success}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--otp-slot-bg` | `#FFFFFF` |
| `--otp-slot-border` | `#E5E7F0` |
| `--otp-slot-border-focus` | `#6366F1` |
| `--otp-slot-success` | `#10B981` |
| `--otp-slot-error` | `#EF4444` |
| `--otp-slot-size` | `48px (md)` |
| `--otp-slot-gap` | `12px` |
| `--otp-slot-radius` | `12px` |

No repo equivalem a `--v-color-surface`, `--v-color-border`, `--v-color-primary`, `--v-color-success`, `--v-color-danger`, `--v-radius-md`, `--v-space-3`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VOtpInput
    v-model="code"
    :length="6"
    :auto-submit="true"
    @complete="handleVerify"
  />
</template>
```

**Pro tip (literal):** "Use auto-submit for the smoothest experience, and show a resend option for better recovery."
