# VEmptyState — DESIGN-SPEC (fonte: doc/Ui/VEmptyState.png)

> Página de documentação do componente VEmptyState (VueUI Nova › Components › VEmptyState, v1.0.0).
> Tagline da página: "A flexible empty state component for when there's nothing to show."
> Três pilares no topo: **Friendly** (Turns empty moments into helpful next steps) · **Flexible** (Supports different variants, sizes, and custom content) · **Accessible** (Built with inclusive design principles from the start).
> Header da página: breadcrumb "VueUI Nova › Components › VEmptyState", título "Components / VEmptyState", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VEmptyState ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito no fundo: "Clear moments. Better experiences."
> Footer da página: logo VueUI Nova + "Thoughtful components for modern products."

## 1) Objetivo do componente

Estado vazio amigável para quando não há nada para mostrar: transforma momentos vazios em próximos passos úteis com ilustração, título, descrição e ação. Cobre cenários comuns (sem projetos, sem resultados, sem ficheiros, sem notificações, onboarding de criação). Diretriz da doc (Pro tip): manter o empty state útil e orientado à ação — um próximo passo claro transforma um ecrã vazio numa grande experiência de utilizador.

## 2) Anatomia (partes)

Anatomia oficial exibida no diagrama "Anatomy — Key parts of the VEmptyState component" (exemplo "No projects yet"):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| Illustration — optional (1) | não | Pasta lilás/azul-clara com raios no topo (marcada como decorativa) |
| Title (2) | sim | Título forte `#0F172A`, ex.: "No projects yet" |
| Description (3) | não | Texto secundário `#64748B`, ex.: "Get started by creating your first project." |
| Action — optional (4) | não | Botão primary azul `+ Create project` / `+ Create your first project` |

Elementos da seção "In context — An empty project list in a real application" (vista real com sidebar Acme: Search `⌘K`, Dashboard, Projects ativo, Tasks, Team, Settings; header "Projects / Create and manage your projects…" + `+ New Project`):

- Centro: ilustração de pasta + "No projects yet" + "Get started by creating your first project. Projects help you organize work, collaborate with your team, and keep track of progress." + `+ Create your first project`.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Common empty state scenarios", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| No results | Ícone lupa, "No results / We couldn't find anything matching your search." | Busca sem resultados; ação `Try a different search` |
| No files | Ícone documento, "No files / You haven't uploaded any files yet." | Lista de ficheiros vazia; ação `Upload a file` |
| No notifications | Ícone sino, "No notifications / You're all caught up! We'll notify you when something new happens." | Caixa vazia; ação `View settings` |
| Create your first project | Ícone varinha/sparkles, "Create your first project / Get started by creating a project to organize your work." | Onboarding; ação `Create project` |

### Tamanhos ("Sizes — Adjust the visual weight for different contexts", 3 exemplares)

| Tamanho | Observado |
|---|---|
| Small | Ilustração pequena + "No projects yet" — compact spaces |
| Medium (default) | Ilustração média + "No projects yet" (destaque azul na doc) — most use cases |
| Large | Ilustração grande + "No projects yet" — feature pages |

## 4) Estados ("States — Different states and configurations", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Pasta + "No projects yet" estático |
| Action hover | Botão "Create project" com cursor mão (hover sobre a ação) |
| Focus button | Botão "Create project" com anel de foco azul visível (destaque azul na doc) |
| No illustration | Só ícone de documento pequeno + "No projects yet" (sem ilustração) |
| Compact | Pasta pequena + "No projects yet" denso (padding reduzido) |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Click ação (`Create project` / `Try a different search` / `Upload a file` / `View settings`) | Executa o próximo passo (criar, refinar busca, upload, abrir definições) |
| Hover na ação | Transição de `background` com `--empty-action-hover #4F46E5`; cursor pointer |
| Focus / Tab | Anel de foco visível no botão; ordem: título (leitura) → ação |
| Teclado Enter / Space | Ativa a ação focada (semântica nativa `<button>`) |
| Sem ilustração | Layout colapsa com graça (título + descrição + ação mantêm alinhamento) |

## 6) Motion ("Motion — Subtle, purposeful motion", 3 especificações literais)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Fade in | **200ms ease-out** | Sem token exato (entre normal 160ms e slow 300ms); `opacity` na entrada |
| Gentle scale | **300ms ease-out** | `--v-motion-slow: 300ms` + `--v-ease-out` (ilustração `scale(0.96→1)`) |
| Stagger content | **Staggered 100ms** | Sem token exato; atraso de 100ms entre ilustração → título → descrição → ação (`transition-delay`) |

Regras gerais: motion subtil apenas em `transform`/`opacity`; `prefers-reduced-motion: reduce` mostra o estado final sem animação.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-empty-state {
  padding: 48px 16px; // --empty-padding-y / --empty-spacing
  border-radius: 16px; // --empty-border-radius
  text-align: center;

  .v-empty-state-illustration {
    width: 96px; // --empty-illustration-size
    transition:
      opacity 200ms var(--v-ease-out),
      transform 300ms var(--v-ease-out);
  }
  .v-empty-state-content > * { transition: opacity 200ms var(--v-ease-out); }
  .v-empty-state-content > *:nth-child(2) { transition-delay: 100ms; }
  .v-empty-state-content > *:nth-child(3) { transition-delay: 200ms; }

  @media (prefers-reduced-motion: reduce) { * { transition: none; } }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by default", 8 checks literais)

1. **Semantic structure (heading, text, button)** — título como heading, descrição como texto, ação como `<button>`.
2. **Keyboard accessible action** — ação atingível e ativável por Tab/Enter/Space.
3. **Proper focus management** — foco visível e ordem lógica; sem armadilhas de foco.
4. **Supports screen readers** — heading + texto + botão anunciados; ilustração ignorada.
5. **Meaningful, descriptive text** — "No projects yet" + descrição específica em vez de genéricos.
6. **Illustration marked as decorative** — ilustração com `aria-hidden="true"` / `alt=""`.
7. **Sufficient color contrast** — título `#0F172A` e descrição `#64748B` sobre fundo claro dentro do mínimo WCAG AA.
8. **Works without illustration** — estado "No illustration" totalmente utilizável (informação não depende da imagem).

## 8) data-test-ids sugeridos

- `v-empty-state` (root; `data-variant="results|files|notifications|create"`, `data-size="sm|md|lg"`, `data-state`)
- `v-empty-state-illustration`
- `v-empty-state-title` ("No projects yet")
- `v-empty-state-description`
- `v-empty-state-action` (botão "Create project" / "Try a different search" / "Upload a file" / "View settings")
- `docs-empty-variant-{results,files,notifications,create}`
- `docs-empty-size-{sm,md,lg}`
- `docs-empty-state-{default,hover,focus,no-illustration,compact}`

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization")

| Token | Valor |
|---|---|
| `--empty-illustration-size` | `96px` |
| `--empty-title-color` | `#0F172A` |
| `--empty-description-color` | `#64748B` |
| `--empty-action-bg` | `#6366F1` |
| `--empty-action-hover` | `#4F46E5` |
| `--empty-padding-y` | `48px` |
| `--empty-spacing` | `16px` |
| `--empty-border-radius` | `16px` |

No repo equivalem a `--v-illustration-md`, `--v-color-text`, `--v-color-text-muted`, `--v-color-primary`, `--v-color-primary-hover`, `--v-space-12`, `--v-space-4`, `--v-radius-lg`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components")

```vue
<template>
  <VEmptyState
    title="No projects yet"
    description="Get started by creating your first project."
    :action="{
      label: 'Create project',
      icon: 'plus'
    }"
  />
</template>
```

**Pro tip (literal):** "Keep your empty state helpful and action-oriented. A clear next step can turn an empty screen into a great user experience."
