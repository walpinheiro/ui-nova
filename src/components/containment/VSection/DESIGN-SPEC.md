# VSection — DESIGN-SPEC ✅ (fontes: doc/Ui/VSection.png + doc/Ui/VSection-2.png)

> **Status:** ✅ Concluído e validado  
> **Data:** 2026-09-20  
> **Testes:** `pnpm build` ok; `pnpm exec vitest run src/components/containment/VSection/_tests/VSection.spec.ts` — 12/12; e2e (6 specs) pendente de `pnpm exec playwright install chromium` neste ambiente.

> Duas fontes fundidas nesta spec. Fonte principal: página de documentação do componente VSection (VueUI Nova › Components › VSection, v1.0.0). Segunda fonte: poster "Section — Organize content with clarity" (Components / Section). Divergências entre fontes assinaladas com [VSection-2].
> Tagline da página: "A flexible container for organizing related content into a clear, structured section."
> Tagline do poster [VSection-2]: "Organize content with clarity" + descrição "Section groups related content into a distinct, visually separated area. Use it to structure pages, forms, and complex interfaces with clear hierarchy and breathing room."
> Três pilares (página): **Organize** (Group related content with a clear structure) · **Flexible** (Supports headers, actions, footers, and custom content) · **Consistent** (Follows VueUI Nova design principles out of the box).
> Três pilares [VSection-2]: **Structured** (Create clear content hierarchy) · **Flexible** (Works with any content or layout) · **Consistent** (A unified look across your product).
> Header da página: breadcrumb "VueUI Nova › Components › VSection", título "VSection", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VSection ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito: "Structure brings clarity. Beautiful UIs go further." [VSection-2: "Sections bring order to complex interfaces."]
> Footer da página: logo VueUI Nova + "Build beautiful, faster." · "Thoughtful components for modern products."

## 1) Objetivo do componente

Contentor flexível para organizar conteúdo relacionado numa secção clara e estruturada. Agrupa páginas, formulários e interfaces complexas com hierarquia clara e respiro visual [VSection-2: "with clear hierarchy and breathing room"]. Suporta cabeçalho (ícone, título, descrição), ações, área de conteúdo arbitrária e rodapé opcional. Diretriz de uso (Pro tip): partir páginas longas em grupos escaneáveis, com títulos claros e orientados a ação [VSection-2: combinar Section com Window, Card ou Tabs para interfaces ricas e bem estruturadas].

## 2) Anatomia (partes)

Anatomia oficial do diagrama "Anatomy — Key parts of the section component" (6 partes numeradas; [VSection-2] numera 5 partes com os mesmos conceitos):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| 1. Icon (optional) | não | Ícone em contentor arredondado à esquerda do título (ex.: pessoa, "Project Settings"); [VSection-2] mesma posição |
| 2. Heading / Header | sim | Título da secção (ex.: "Project Settings" + botão `2` de ajuda); [VSection-2: "Section Title"] |
| 3. Description | não | Subtítulo descritivo (ex.: "Manage your project preferences."); [VSection-2: "Brief description of this section."] |
| 4. Actions (optional) | não | Botão `…` (overflow) à direita do header; no exemplo "In context" botão `Edit` |
| 5. Content area | sim | Área flexível de conteúdo (linhas/skeleton, campos, texto arbitrário) |
| 6. Footer (optional) | não | Linha de rodapé com separador (ex.: "ⓘ Changes are saved automatically."); [VSection-2 funde footer no container] |
| Container | sim | Invólucro da secção ([VSection-2] parte 5 explícita: "Container"); superfície branca, `radius 16px`, borda ou sombra conforme variante |

Elementos da secção "In context — A section component on a profile settings page":

- Nav lateral: **Profile ativo** (azul, ícone pessoa), Account, Notifications, Billing, Security.
- Card "Personal Information — Manage your public profile and personal details." com botão `Edit` (outline) à direita.
- Grelha de campos: Full name `Alex Johnson`, Location `San Francisco, CA`, Email address `alex@acme.com`, Bio `Product designer working on delightful experiences.`
- Nota de rodapé: "ⓘ Your profile information is visible to your team members."
- [VSection-2] "In context": janela com semáforo e sidebar General (ativa) / Team / Integrations / Billing / Advanced; painel "General — Manage your project details and preferences." com card "Project Information": Name `Acme Platform`, Description `A modern workspace for ambitious teams.`, Visibility `Team only ▾`, botão primary `Save changes`.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different visual styles for different use cases", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Default | Fundo branco, borda subtil (Team / Manage team members and permissions. Clean and versatile); [VSection-2: Account, "Standard section with subtle border"] | Uso geral |
| Elevated | Fundo branco com sombra subtil (Settings / Configure your application preferences. Adds subtle shadow); [VSection-2: Team, "Raised background for emphasis"] | Ênfase por elevação |
| Bordered | Borda clara visível (Documentation / Browse guides and API references. Uses a clear border) | Ênfase por contorno |
| Borderless [só VSection-2] | Sem borda (Integrations / Connect your favorite tools and services. No border for a cleaner look) | Visual mais limpo |
| Tinted | Fundo tingido subtil azul-claro (Upgrade / Unlock more features with a Pro plan. Subtle background color for emphasis); [VSection-2: mesmo, "Subtle background tint"] | Destaque promocional/contextual |

Nota de fusão: a página lista **Bordered**, o poster lista **Borderless**; ambas existem como opções (com/sem borda explícita).

### Tamanhos ("Sizes — Three sizes for different use cases", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small / Compact | "Small title — A compact section." For dense layouts; [VSection-2: Compact, `12px padding`] | `padding 12px` [VSection-2: `--section-padding-sm`] |
| Medium / Default (default) | "Medium title — A balanced section." Everyday use; [VSection-2: Default destacado em azul, `24px padding`] | `padding 24px` (`--v-section-padding`) |
| Large | "Large title — A spacious section with more room." For complex content; [VSection-2: Large, `32px padding`, For content-heavy sections] | `padding 32px` [VSection-2: `--section-padding-lg`] |

## 4) Estados ("States — Interactive states for the section", 4 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Card "Account / Manage your account." neutro (Normal appearance); [VSection-2: Settings neutro] |
| Hover | Mesmo card com fundo subtil acinzentado (Subtle background); [VSection-2: com cursor de mão "Subtle background on hover"] |
| Focus / Focused | Card com anel de foco azul visível (Clear focus ring); [VSection-2: "Keyboard focus state", borda azul completa] |
| Disabled | Card esmaecido, texto claro (Reduced opacity); [VSection-2: "Reduced opacity and no interaction"] |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Hover (secção) | Transição subtil de `background`/elevação (ver Motion 150ms); cursor default (pointer só se a secção for clicável) |
| Focus / Tab | Anel de foco claro no contentor via `:focus-visible` quando a secção é focável; ordem: header → ações → conteúdo → footer |
| Click (ação `Edit` / `…`) | Dispara ação contextual (editar, abrir menu overflow); menu fecha com Escape e devolve foco ao botão |
| Click (exemplo Save changes [VSection-2]) | Submete o formulário da secção; feedback de loading/sucesso ("Changes are saved automatically") |
| Disabled | Sem pointer/keyboard; `aria-disabled="true"` + opacidade reduzida |
| Teclado Enter / Space | Ativa apenas os controlos internos (botões, links); a secção em si não é ativável salvo `role="region"` focável explícita |

## 6) Motion ("Motion — Smooth and intentional interactions")

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Elevation + background (página) | **Subtle elevation and background transitions (150ms ease-out)** | `--v-motion-normal: 160ms` ≈ 150ms + `--v-ease-out` (`box-shadow`/`background`) |
| Gentle entrance [VSection-2] | **Fades and slides up (120ms) for a smooth appearance** | `--v-motion-fast: 100ms` ≈ 120ms + `--v-ease-out` (`opacity`/`transform: translateY(8px → 0)`) |
| Interactive feedback [VSection-2] | **Subtle background and shadow transitions (100ms)** | `--v-motion-fast: 100ms` + `--v-ease-out` |

Regras gerais: motion apenas em `transform`/`opacity` (+ `background`/`box-shadow` baratos no hover); saída usa `ease-in`; `prefers-reduced-motion: reduce` desativa elevação/entrada (aparecimento instantâneo).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-section {
  background: var(--v-color-surface, #ffffff); // --v-section-bg #FFFFFF
  border: 1px solid var(--v-color-border, #e5e7f0); // --v-section-border
  border-radius: var(--v-radius-lg, 16px); // --v-section-radius 16px
  padding: var(--v-space-6, 24px); // --v-section-padding 24px
  box-shadow: 0 4px 16px rgba(16, 24, 40, 0.08); // --v-section-shadow
  transition:
    background var(--v-motion-normal) var(--v-ease-out),
    box-shadow var(--v-motion-normal) var(--v-ease-out);

  &--tinted { background: var(--v-color-surface-tinted, #f5f8ff); }
  &--elevated { box-shadow: var(--v-shadow-md); border-color: transparent; }
  &--borderless { border-color: transparent; }

  &:hover { background: var(--v-color-surface-hover); }
  &:focus-visible {
    outline: 2px solid var(--v-color-focus);
    outline-offset: 2px;
  }
  &:disabled, &[aria-disabled="true"] { opacity: 0.5; }

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 9 checks literais)

1. **Supports semantic section landmark** — usar `<section>` nativo ([VSection-2]: "Semantic sectioning (section element)").
2. **Heading structure (use h2/h3)** — título com hierarquia de cabeçalhos correta ([VSection-2]: "Supports accessible headings").
3. **Keyboard accessible actions** — ações do header (Edit, `…`) focáveis e ativáveis por Enter/Space ([VSection-2]: "Works with keyboard navigation").
4. **Maintains sufficient color contrast** — texto e muted dentro do mínimo WCAG AA ([VSection-2]: "Sufficient color contrast").
5. **Works with screen readers** — região anunciada com nome acessível via `aria-labelledby` (título) ([VSection-2]: "Screen reader friendly structure").
6. **Supports reduced motion preferences** — respeita `prefers-reduced-motion` ([VSection-2: implícito no item equivalente]).
7. **Clear focus indicators** — anel de foco visível, nunca removido sem substituto.
8. **Flexible content structure** — conteúdo arbitrário sem hierarquia fixa ([VSection-2]: "Flexible content, no fixed hierarchy").
9. **Follows WAI-ARIA best practices** — landmark, nomes e ordem lógica conforme APG.

## 8) data-test-ids sugeridos

- `v-section` (root; `data-variant="default|elevated|bordered|borderless|tinted"`, `data-size="sm|md|lg"`, `data-state`)
- `v-section-icon`
- `v-section-header`
- `v-section-heading`
- `v-section-description`
- `v-section-actions` / `v-section-action-edit` / `v-section-action-overflow`
- `v-section-content`
- `v-section-footer`
- `docs-section-variant-{default,elevated,bordered,borderless,tinted}` (fileira de variantes)
- `docs-section-size-{sm,md,lg}` (fileira de tamanhos)
- `docs-section-state-{default,hover,focus,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization", fonte VSection.png)

| Token | Valor |
|---|---|
| `--v-section-bg` | `#FFFFFF` |
| `--v-section-bg-tinted` | `#F5F8FF` |
| `--v-section-border` | `#E5E7F0` |
| `--v-section-shadow` | `0 4px 16px rgba(16, 24, 40, 0.08)` |
| `--v-section-radius` | `16px` |
| `--v-section-header-gap` | `16px` |
| `--v-section-padding` | `24px` |
| `--v-section-footer-border` | `#E5E7F0` |
| `--v-section-transition` | `150ms ease-out` |

Tokens do poster [VSection-2] (nomes literais, valores só como swatches): `--section-bg`, `--section-border`, `--section-hover-bg`, `--section-focus-ring`, `--section-title-color`, `--section-description-color`, `--section-padding-sm` (12px), `--section-padding-md` (24px), `--section-padding-lg` (32px), `--section-radius`.

No repo equivalem a `--v-color-surface`, `--v-color-border`, `--v-shadow-md`, `--v-radius-lg`, `--v-space-*`, `--v-color-focus`, `--v-motion-normal` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components", fonte VSection.png)

```vue
<template>
  <VSection
    icon="user"
    title="Personal information"
    description="Manage your details."
  >
    <div class="space-y-4">
      <!-- Your content here -->
    </div>
  </VSection>
</template>
```

Uso alternativo [VSection-2] (transcrição literal):

```vue
<template>
  <VSection title="Project Information" icon="settings">
    <p class="text-slate-600">Manage your project details and preferences.</p>
    <div class="mt-4">
      <!-- Your content goes here -->
    </div>
  </VSection>
</template>
```

**Pro tip (literal):** "Use sections to break long pages into scannable groups. Keep headings clear and action-focused."
**Pro tip [VSection-2] (literal):** "Combine Section with the Window, Card, or Tabs components to create rich, well-structured interfaces." (exemplo: `<VSection title="Settings"><VTabs><!-- Tab content --></VTabs></VSection>`)
