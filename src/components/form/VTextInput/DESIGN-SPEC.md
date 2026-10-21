# VTextInput — DESIGN-SPEC (fonte: doc/Ui/VTextInput.png)

> Página de documentação do componente VTextInput (VueUI Nova › Components › VTextInput, v1.0.0).
> Tagline da página: "A flexible single-line text input for forms and search-like data entry."
> Três pilares no topo: **Flexible** (Supports icons, prefixes, suffixes, and validation) · **Accessible** (Built with inclusive design and proper form semantics) · **Versatile** (Perfect for forms, search, filters, and more).
> Header da página: breadcrumb "VueUI Nova › Components › VTextInput", título "Components / VTextInput", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido até Tooltip, com **Input ativo**) / Patterns / Resources, card "Design. Build. Ship faster." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Small components. Big possibilities."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Campo de texto de linha única, flexível, para formulários e entrada de dados estilo busca. É o input de texto fundamental do sistema: nomes, e-mails, cargos, localizações, URLs, filtros e pesquisas. O card lateral da doc resume: "Polished by design — VTextInput helps users enter data with clarity and confidence. With thoughtful states, helpful feedback, and flexible customization, it fits any use case from simple forms to advanced search experiences." O exemplo real ("In context — Text inputs in a real form") mostra o uso canónico: formulário "Create your profile" ("Tell us a bit about yourself.") com `Full name` (ícone pessoa, `Alex Carter`), `Email address` (ícone envelope, `alex.carter@example.com`), `Job title` (`Product Designer`), `Location` (ícone pin, `San Francisco, CA`), `Website (optional)` (ícone link, `https://your-portfolio.com`) e ações `Cancel` / `Save profile`.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a text input" (exemplo com label `Search`, campo `Search products…`, ícone lupa + clear `×`):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Label | sim | Rótulo acima do campo, ex.: `Search`, `Full name`, `Email address` |
| Input field (value / placeholder) | sim | Retângulo arredondado (`radius 12px`), fundo `--input-bg #FFFFFF`, borda `--input-border #E5E7EB`, texto `--input-text #0F172A`, placeholder `--input-placeholder #94A3B8`, padding-x `12px`, sombra `--input-shadow 0 1px 2px rgba(15,23,42,0.04)` |
| Leading icon (optional) | não | À esquerda dentro do campo, ex.: lupa `Search…`, pessoa `Alex Carter`, envelope, pin, link |
| Prefix (optional) | não | Bloco fixo à esquerda, ex.: `$` em `$ 0.00` |
| Suffix (optional) | não | Bloco fixo à direita, ex.: `USD` em `$ 0.00 USD` |
| Clear icon (optional) | não | `×` à direita que aparece quando há conteúdo (prop `clearable`) |
| Helper text (optional) | não | Texto auxiliar sob o campo, ex.: "Find products, documentation, and more…" |

Elementos da seção "In context": 5 campos rotulados com ícones à esquerda (pessoa, envelope, pin, link), campo Website com placeholder de URL, botões `Cancel`/`Save profile`, card lateral "Polished by design".

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different configurations for different needs", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Default | `Enter text` | Campo básico |
| With placeholder | `Search anything…` | Placeholder orientativo |
| With leading icon | Lupa + `Search…` | Busca com ícone |
| With prefix / suffix | `$ 0.00 USD` | Moeda/unidade com afixos fixos |
| Error state | `Invalid input` + ícone `!` em círculo, borda vermelha | Entrada inválida com feedback |

### Tamanhos ("Sizes — Three sizes for different contexts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | `Small input` | `--input-height-sm 32px` |
| Medium (default) | `Medium input` com foco | `--input-height-md 40px` |
| Large | `Large input` | `--input-height-lg 48px` |

Alturas `32/40/48px`; raio `12px` e padding-x `12px` constantes; target mínimo de toque **44×44px** no clear icon (ver acessibilidade).

## 4) Estados ("States — Common states throughout the input lifecycle", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | `Text`, borda neutra |
| Hover | `Text` com fundo/borda subtilmente alterados |
| Focus | `Text` + anel de foco `--input-focus-ring #6366F1` |
| Filled | `Input text|` com caret (valor presente) |
| Invalid | `Error` com borda vermelha + texto de erro descritivo |
| Disabled | Campo acinzentado, sem interação |

Foco usa borda `#6366F1` + anel via `:focus-visible`; inválido usa `aria-invalid="true"` + `aria-describedby` para a mensagem de erro (nunca só cor); desativado usa `disabled` + `aria-disabled`.

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Digitação | Placeholder → valor com transição suave; clear icon (`×`) aparece com fade quando há conteúdo |
| Click no clear icon | Limpa o valor, mantém foco no campo, esconde o `×`; anunciado a leitores de ecrã; `clearable` |
| Hover | Transição subtil de `background`/`border-color`; cursor text no campo, pointer no `×` |
| Focus / Tab | Anel de foco visível + escala subtil; `:focus-visible { outline + offset }`; ordem segue o formulário |
| Blur com valor inválido | Estado Invalid + mensagem descritiva ("Descriptive error text"); erro anunciado (`aria-live`) |
| Prefixo/sufixo | Afixos fixos não editáveis, excluídos da leitura do valor (expostos via `aria-describedby` se informativos) |
| Leading icon | Decorativo (`aria-hidden="true"`); não recebe foco |
| Enter em busca | Submete/pesquisa (formulário ou evento `search`/`submit`) |
| Autocomplete | Atributos `autocomplete`/`name`/`type` adequados (email, url, text, search) |
| Disabled | Sem ação; opacidade reduzida; `cursor: not-allowed` |

## 6) Motion ("Motion — Smooth, intentional interactions", 3 especificações)

| Movimento | Descrição da imagem | Token `--v-*` correspondente |
|---|---|---|
| Focus ring | **"Subtle scale and color transition on focus"** (`Text` com foco) | `--v-motion-fast: 100ms` + `--v-ease-out` (`box-shadow` do anel + `transform: scale(~1.01)` subtil + `border-color`) |
| Placeholder → value | **"Smooth transition when typing"** (`Search… → Product`) | `--v-motion-fast: 100ms` + `--v-ease-out` (`opacity` do placeholder/valor) |
| Clear icon reveal | **"Clear icon fades in when there is content"** (`Product ×`) | `--v-motion-fast: 100ms` + `--v-ease-out` (`opacity` + `scale` do `×`) |

Regras gerais: motion apenas em `transform`/`opacity` (e `border-color`/`box-shadow` baratos); saída usa `ease-in`; `prefers-reduced-motion: reduce` zera escala/fades.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-text-input {
  background: var(--v-color-surface); // #FFFFFF
  color: var(--v-color-text); // #0F172A
  border: 1px solid var(--v-color-border); // #E5E7EB
  border-radius: var(--v-radius-md); // 12px
  padding-inline: 12px;
  height: 40px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition:
    border-color var(--v-motion-fast) var(--v-ease-out),
    box-shadow var(--v-motion-fast) var(--v-ease-out),
    transform var(--v-motion-fast) var(--v-ease-out);

  &::placeholder { color: #94a3b8; transition: opacity var(--v-motion-fast) var(--v-ease-out); }
  &:hover { border-color: var(--v-color-border-hover); }
  &:focus-within {
    border-color: var(--v-color-primary); // #6366F1
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
  &[aria-invalid="true"] { border-color: var(--v-color-danger); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  .v-text-input__clear { opacity: 0; transition: opacity var(--v-motion-fast) var(--v-ease-out); }
  &.has-value .v-text-input__clear { opacity: 1; }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 8 checks literais)

1. **Proper label association (for attribute)** — todo campo com `<label for>` (ou `aria-label`/`aria-labelledby`).
2. **Helpful helper and error messages** — helper e erro associados via `aria-describedby`; erro com `role="alert"`/`aria-live`.
3. **Supports keyboard navigation** — Tab/Shift+Tab, Enter para submeter; clear icon focável e ativável por Enter/Space com `aria-label` (ex.: "Clear search").
4. **Clear focus indication** — anel de foco sempre visível via `:focus-visible`.
5. **Sufficient color contrast (WCAG 2.1 AA)** — texto `#0F172A`, placeholder `#94A3B8` (texto grande/acessório dentro do limite aplicável) e erro dentro do AA.
6. **Works with screen readers** — valor, label, helper e erro anunciados; ícones decorativos com `aria-hidden`.
7. **Descriptive error text** — erro textual específico (não só borda vermelha/ícone `!`).
8. **Supports autocomplete attributes** — `autocomplete`/`autocapitalize`/`spellcheck`/`type` adequados ao dado (email, url, search).

## 8) data-test-ids sugeridos

- `v-text-input` (root; `data-variant="default|placeholder|leading-icon|prefix-suffix|error"`, `data-size="sm|md|lg"`, `data-state`)
- `v-text-input-field` (input nativo)
- `v-text-input-label` (rótulo)
- `v-text-input-leading-icon` (lupa/pessoa/envelope/pin/link)
- `v-text-input-prefix` (`$`) / `v-text-input-suffix` (`USD`)
- `v-text-input-clear` (botão `×`; `aria-label="Clear …"`)
- `v-text-input-helper` ("Find products, documentation, and more…")
- `v-text-input-error` (mensagem + ícone `!`)
- `v-text-input-full-name` / `v-text-input-email` / `v-text-input-job` / `v-text-input-location` / `v-text-input-website` (contexto Create your profile)
- `docs-text-variant-{default,placeholder,leading-icon,prefix-suffix,error}`
- `docs-text-size-{sm,md,lg}`
- `docs-text-state-{default,hover,focus,filled,invalid,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--input-bg` | `#FFFFFF` |
| `--input-border` | `#E5E7EB` |
| `--input-text` | `#0F172A` |
| `--input-placeholder` | `#94A3B8` |
| `--input-focus-ring` | `#6366F1` |
| `--input-radius` | `12px` |
| `--input-shadow` | `0 1px 2px rgba(15, 23, 42, 0.04)` |
| `--input-height-sm` | `32px` |
| `--input-height-md` | `40px` |
| `--input-height-lg` | `48px` |
| `--input-padding-x` | `12px` |

No repo equivalem a `--v-color-surface`, `--v-color-border`, `--v-color-text`, `--v-color-primary`, `--v-radius-md`, `--v-space-3`, `--v-shadow-xs`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VTextInput
    v-model="search"
    label="Search"
    placeholder="Search products..."
    leading-icon="search"
    clearable
  />
</template>
```

**Pro tip (literal):** "Use clearable for search inputs to help users quickly reset their input."
