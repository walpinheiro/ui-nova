# VTagInput — DESIGN-SPEC (fonte: doc/Ui/VTagInput.png)

> Página de documentação do componente VTagInput (VueUI Nova › Components › VTagInput, v1.0.0).
> Tagline da página: "A component for entering, editing, and removing tags or chips."
> Três pilares no topo: **Flexible input** (Add tags by typing, selecting from suggestions, or pasting) · **Fully customizable** (Supports suggestions, validation, and custom rendering) · **Works everywhere** (Perfect for categories, labels, recipients, and more).
> Header da página: breadcrumb "VueUI Nova › Components › VTagInput", título "Components / VTagInput", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido até Tooltip, com **VTagInput ativo**) / Patterns / Resources, card "Design. Build. Ship faster." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Small components. Big possibilities."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Campo de entrada, edição e remoção de etiquetas (tags/chips). Serve para categorizar conteúdo e melhorar descoberta e colaboração: categorias, labels, destinatários e filtros. O card lateral da doc resume: "Organize with ease — Tags help categorize content, improve discoverability, and make collaboration simpler." O exemplo real ("In context — Tags in a real interface") mostra o uso canónico: formulário "Project settings" ("Add relevant tags to help others discover this project.") com campo Tags contendo `design ×`, `component ×`, `ui ×` + texto `vue|` e dropdown de sugestões (`vue`, `vue3`, `vue-router`, `vuex`, `vueuse` com `+` à direita), ações `Cancel` / `Save changes`.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — The building blocks of a tag input" (exemplo com `Design ×`, `Vue ×`, `Add a tag…` + sugestões `component/composable/configuration`):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Container | sim | Retângulo arredondado com borda `--input-border #E2E8F0`; envolve chips + campo |
| Tag / chip | sim | Pill de tag (`--tag-bg #E8EEFF`, texto `--tag-text #1E293B`, raio `--tag-radius 9999px`, gap `--tag-gap 8px`); ex.: `Design ×`, `Vue ×`, `component`, `Frontend`, `API` |
| Remove icon | sim (em tags removíveis) | `×` dentro do chip; exige label descritivo ("Remove tag", ex.: "Remove Design") |
| Input field | sim | Campo de texto inline com placeholder "Add a tag…"; caret visível (`Tag × |`) |
| Caret | estado | Indicador de inserção no campo inline |
| Suggestion list (optional) | não | Dropdown sob o campo (`--suggestion-surface #FFFFFF`); itens `vue/vue3/vue-router/vuex/vueuse` com ação `+`; item destacado `component` |

No contexto, a lista de sugestões abre sob o texto `vue` com 5 resultados e botão `+` por linha para adição direta.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different behaviors for different use cases", 5 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Default | `Design × UI ×` + "Add a tag…" | "Basic tag input." |
| With suggestions | `vue ×` + `comp|` + lista (`component` destacado, `composition`, `composable`) | "Show suggestions while typing." |
| Closable tags | `Design × Dev ×` + "Add a tag…" | "Tags can be removed." |
| Read-only tags | `Vue`, `Components` (pills sem `×`) | "Non-editable display mode." |
| Multi-line | `Frontend × Backend × / Design × API ×` + "Add a tag…" | "Wrap tags to multiple lines." |

### Tamanhos ("Sizes — Three sizes for different contexts", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small | `Tag ×` + "Add…" compactos | Escala reduzida |
| Medium (default) | `Tag ×` + "Add a tag…" | Escala padrão |
| Large | `Tag ×` + "Add a tag…" amplo | Escala ampliada |

Chips e o `×` mantêm área de acerto mínima **44×44px** efetiva (padding invisível) mesmo nos tamanhos menores.

## 4) Estados ("States — Common states in an interactive tag input", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Empty | "Add a tag…" (placeholder, sem tags: "No tags yet.") |
| Typing | `des|` com borda de foco ("User is typing.") |
| Hover tag | Chip `Design ×` destacado sob o cursor ("Tag hover state.") |
| Focus input | `Tag × |` com anel de foco azul (`--input-focus-ring 0 0 0 3px rgba(99,102,241,0.2)`) ("Input is focused.") |
| Selected suggestion | `component` destacado na lista ("Suggestion is highlighted.") |
| Disabled | `Tag ×` + "Add a tag…" acinzentados ("Non-interactive state.") |

Somente-leitura exibe pills sem `×` e sem campo; desativado usa `disabled` + `aria-disabled`; foco usa `:focus-visible` + anel no container (`:focus-within`).

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Enter / vírgula / Tab (configurável) | Confirma o texto como nova tag (chip add com escala + spring 150ms) |
| Click no `+` da sugestão | Adiciona a sugestão como tag |
| Click / ↑ / ↓ + Enter na lista | Navega sugestões (↑/↓), destaca (`component`) e confirma com Enter; Escape fecha sem adicionar |
| Click no `×` do chip | Remove a tag (fade + shrink 120ms); foco volta ao campo; remoção anunciada a leitores de ecrã |
| Backspace com campo vazio | Remove/seleciona a última tag (padrão de tag inputs); segunda pressão confirma remoção |
| Colar lista ("a, b, c") | Cria várias tags de uma vez (paste support); duplicadas/inválidas rejeitadas com feedback |
| Validação | Tags inválidas/duplicadas bloqueadas (feedback inline); limite máximo opcional |
| Hover na tag | Destaque subtil do chip + `×` acionável; cursor pointer no `×` |
| Abrir/fechar sugestões | Dropdown abre ao digitar (fade + slide down 200ms); Escape ou click-fora fecha e devolve foco ao campo |
| Focus / Tab | Tab entra no campo; Tab com lista aberta pode confirmar destaque (configurável); anel visível |
| Disabled / read-only | Sem adição/remoção; pills sem `×` no read-only |

## 6) Motion ("Motion — Smooth, purposeful interactions", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Chip add | **"Scales in (150ms) with a soft spring"** (`Vue → Vue ×`) | ~`--v-motion-normal` (150ms aprox.) + spring (`cubic-bezier` suave); `transform: scale` |
| Chip remove | **"Fades and shrinks (120ms)"** (`Design × → Vue ×`) | ~`--v-motion-fast` (120ms aprox.); `opacity` + `transform: scale` |
| Suggestion dropdown | **"Fades and slides down (200ms)"** | Sem token exato (entre normal 160ms e slow 300ms); `opacity` + `transform: translateY` |

Regras gerais: motion apenas em `transform`/`opacity`; saída usa `ease-in`; `prefers-reduced-motion: reduce` zera spring/fade/slide (adição/remoção instantâneas).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-tag-input {
  border: 1px solid var(--v-color-border); // #E2E8F0
  transition:
    border-color var(--v-motion-fast) var(--v-ease-out),
    box-shadow var(--v-motion-fast) var(--v-ease-out);

  &:focus-within {
    border-color: var(--v-color-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.v-tag {
  background: #e8eeff;
  color: #1e293b;
  border-radius: 9999px;
  animation: v-tag-in 150ms ease-out;
}

.v-tag--leaving { opacity: 0; transform: scale(0.9); transition: opacity 120ms ease-out, transform 120ms ease-out; }

.v-tag-suggestions { animation: v-suggest-in 200ms ease-out; }

@media (prefers-reduced-motion: reduce) {
  .v-tag, .v-tag--leaving, .v-tag-suggestions { animation: none; transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design", 6 checks literais)

1. **Descriptive remove labels (e.g. "Remove tag")** — cada `×` com `aria-label="Remove {tag}"` (ex.: "Remove Design").
2. **Full keyboard navigation (Tab, Arrow keys, Enter, Backspace)** — adicionar/navegar/remover sem rato; setas movem entre chips e sugestões.
3. **Combobox semantics with ARIA roles** — padrão combobox: `role="combobox"` + `aria-expanded` + `aria-controls`/`aria-activedescendant` + `role="listbox"`/`role="option"` na lista.
4. **Announces tag additions and removals via screen readers** — `aria-live` anuncia "Tag {x} added/removed" e contagem.
5. **Focus management and visible focus ring** — foco retorna ao campo após remover; anel `0 0 0 3px rgba(99,102,241,0.2)` via `:focus-visible`/`:focus-within`.
6. **Supports disabled and read-only states** — `disabled`/`readonly` + `aria-disabled`; read-only sem `×` nem campo editável.

## 8) data-test-ids sugeridos

- `v-tag-input` (root; `data-variant="default|suggestions|closable|readonly|multiline"`, `data-size="sm|md|lg"`, `data-state`)
- `v-tag-input-field` (campo inline; `placeholder="Add a tag…"`)
- `v-tag` / `v-tag-{value}` (chip; ex.: `v-tag-design`, `v-tag-component`)
- `v-tag-remove` / `v-tag-remove-{value}` (botão `×`)
- `v-tag-suggestions` (dropdown)
- `v-tag-suggestion-{value}` (item; `data-highlighted`)
- `v-tag-suggestion-add-{value}` (botão `+`)
- `v-tag-empty` ("No tags yet.")
- `docs-tag-variant-{default,suggestions,closable,readonly,multiline}`
- `docs-tag-size-{sm,md,lg}`
- `docs-tag-state-{empty,typing,hover-tag,focus,selected-suggestion,disabled}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--tag-bg` | `#E8EEFF` |
| `--tag-text` | `#1E293B` |
| `--input-border` | `#E2E8F0` |
| `--suggestion-surface` | `#FFFFFF` |
| `--tag-gap` | `8px` |
| `--tag-radius` | `9999px` |
| `--input-focus-ring` | `0 0 0 3px rgba(99, 102, 241, 0.2)` |

No repo equivalem a `--v-color-border`, `--v-color-primary`, `--v-radius-pill` (`--v-tag-radius`), `--v-space-2` (aprox.).

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VTagInput
    v-model="tags"
    :suggestions="suggestions"
    placeholder="Add a tag..."
  />
</template>
```

**Pro tip (literal):** "Use suggestions with remote search to help users find existing tags and keep consistency."
