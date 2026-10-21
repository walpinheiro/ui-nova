# VThumbnailGrid — DESIGN-SPEC (fonte: doc/Ui/VThumbnailGrid.png)

> Página de documentação do componente VThumbnailGrid (VueUI Nova › Components › VThumbnailGrid, v1.0.0).
> Tagline da página: "A responsive thumbnail layout for media, files, and gallery content."
> Três pilares no topo: **Browsable** (Present media and files in a clear, scannable layout.) · **Responsive** (Automatically adapts to any screen size or container.) · **Clear** (Clean and consistent thumbnails with helpful context.).
> Header da página: breadcrumb "VueUI Nova › Components › VThumbnailGrid", título "Components / VThumbnailGrid", badge `v1.0.0`, botão "View on GitHub".
> Sidebar esquerda (contexto de navegação da doc, não parte do componente): logo VueUI Nova "Build beautiful, faster.", busca `Search… ⌘K`, nav Getting Started / Foundations / Components (expandido: Alerts, Avatar, Badge, Button, Card, Input, Select, Tabs, Tooltip, **VThumbnailGrid ativo**) / Patterns / Resources, card "Design. Build. Ship faster. A modern UI system for ambitious products." com botão circular `›`, toggle claro/escuro, `v1.0.0`.
> Texto decorativo manuscrito: "Small components. Big possibilities."
> Footer da página: logo VueUI Nova + "Build beautiful, faster." + "Thoughtful components for modern products."

## 1) Objetivo do componente

Grelha de miniaturas responsiva para media, ficheiros e conteúdo de galeria. É o browser visual do sistema: apresenta imagens, vídeos e documentos num layout escaneável com contexto útil (nome, tamanho, data). O exemplo "In context — A media library for project assets" mostra: sidebar de filtros (All files, Images 128, Videos 24, Documents 36, Design 48, Trash), 5 miniaturas (mountains.jpg 2.4 MB · 2 days ago, beach.jpg 1.8 MB · 3 days ago, brand-guide.pdf 4.2 MB · 5 days ago com ícone PDF vermelho, product-demo.mp4 12.4 MB · 1 week ago com botão play, plant.jpg 1.1 MB · 1 week ago), botão `…` + botão primary "+ Upload", e card lateral "Organized content — VThumbnailGrid helps users browse, manage, and select media and files with clarity and ease."

## 2) Anatomia (partes)

Anatomia oficial numerada no diagrama "Anatomy — The building blocks of a thumbnail." (miniatura de montanha com lupa + `…`):

| Nº | Parte | Obrigatória | Observado na imagem |
|---|---|---|---|
| 1 | Grid container | sim | Responsive layout container |
| 2 | Thumbnail preview | sim | Image, video, or file icon |
| 3 | Label | sim | File name or title (ex.: "mountains.jpg") |
| 4 | Metadata | não | File size, date, or type (ex.: "2.4 MB · 2 days ago") |
| 5 | Selection checkbox | estado | Checkbox for multi-select (badge ✓ no canto) |
| 6 | Overlay actions | estado | Quick actions (view, download, more) — lupa + `…` no hover |
| — | Small (size tag) | sim | Etiqueta de tamanho sob a anatomia ("Small") |

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different layouts for different use cases.", 4 exemplares)

| Variante | Aparência na imagem | Uso literal |
|---|---|---|
| Image gallery | 4 fotos (montanha, plantas, edifício, interior) | Perfect for photos and media collections. |
| File thumbnails | 4 tiles com ícones (PDF vermelho, DOC azul, XLS verde, PPT laranja) | Ideal for documents and project files. |
| Selectable thumbnails | 4 fotos com anel azul + badge ✓ na primeira | Supports single or multiple selection. |
| Compact media grid | 4 fotos densas (gatos, planta, dunas) | Densely display content in smaller grids. |

### Tamanhos ("Sizes — Three sizes for different content needs.", 3 exemplares)

| Tamanho | Observado | Medida |
|---|---|---|
| Small | Miniatura pequena | 64 × 64 |
| Medium (default) | Miniatura destacada com anel azul | 96 × 96 |
| Large | Miniatura grande | 128 × 128 |

## 4) Estados ("States — Interactive states and feedback.", 5 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Miniatura de montanha neutra |
| Hover card | Overlay escuro + lupa + `…` (quick actions) |
| Selected item | Anel azul + badge ✓ no canto superior direito |
| Loading thumbnail | Tile skeleton claro com ícone de imagem (carregamento) |
| Disabled | Miniatura dessaturada/esmaecida, sem acções |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Hover na miniatura | Overlay escuro `rgba(0,0,0,0.6)` faz fade-in com acções rápidas (view/download/more); cursor pointer |
| Click / selecção | Aplica anel + badge ✓; escala gentil; `aria-selected`; suporta single ou multiple selection |
| Lazy-load | Imagem faz fade-in ao entrar no viewport (lazy-load fade-in) |
| Upload | Botão "+ Upload" adiciona ficheiros à grelha |
| Filtros | Sidebar (All files/Images/Videos/Documents/Design/Trash) filtra o conteúdo |
| Teclado Tab / Arrow keys | Navegação sequencial e por setas entre miniaturas |
| Enter / Space | Activa/abre a miniatura focada ou alterna selecção |
| Miniatura Loading/Disabled | Loading mostra skeleton; Disabled sem hover/selecção |

## 6) Motion ("Motion — Smooth, intentional interactions.", 3 especificações)

| Movimento | Duração / easing (literal da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Hover overlay | **150ms ease-out** ("Fade in actions") | `--v-motion-normal: 150–160ms` + `--v-ease-out` (`opacity` do overlay) |
| Selection scale | **100ms ease-out** ("Gentle scale") | `--v-motion-fast: 100ms` + `--v-ease-out` (`transform: scale()`) |
| Lazy-load fade-in | **300ms ease-out** ("Image fades in") | `--v-motion-slow: 300ms` + `--v-ease-out` (`opacity` da imagem) |

Regras gerais: animar apenas `transform`/`opacity`; `prefers-reduced-motion: reduce` desliga overlay-fade, escala e lazy-fade (imagem aparece instantaneamente).

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--v-thumbnail-size-md, 96px), 1fr));
  gap: var(--v-space-4); // 16px

  .v-thumbnail {
    width: var(--v-thumbnail-size-md, 96px);
    border: 1px solid var(--v-border-color);
    border-radius: var(--v-radius-md); // 12px
    transition: transform var(--v-motion-fast) var(--v-ease-out);

    &[data-size="sm"] { width: 64px; }
    &[data-size="lg"] { width: 128px; }
    &[data-selected="true"] { box-shadow: 0 0 0 2px var(--v-color-focus); transform: scale(1.02); }

    &__overlay { background: rgba(0, 0, 0, 0.6); transition: opacity 150ms var(--v-ease-out); }
    img { animation: v-thumbnail-fade-in 300ms var(--v-ease-out); }
  }

  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none; animation: none; } }
}
```

## 7) Acessibilidade observada ("Accessibility — Inclusive by design.", 8 checks literais)

1. **Keyboard navigation (Tab, Arrow keys)** — navegação sequencial e por setas (roving tabindex) entre miniaturas.
2. **Visible focus ring** — anel de foco visível via `:focus-visible`.
3. **Descriptive alt text for images** — `alt` descritivo (ex.: nome do ficheiro/conteúdo).
4. **ARIA labels for interactive actions** — `aria-label` em view/download/more, play de vídeo e Upload.
5. **Supports screen reader announcements** — selecção e carregamento anunciados via `aria-live`.
6. **Clear selection state semantics** — `aria-selected` / `aria-checked` reflectem o estado Selected.
7. **Sufficient color contrast** — label `#1F2937` e meta `#6B7280` com contraste suficiente.
8. **Works with dynamic content and lazy loading** — conteúdo dinâmico e lazy-load acessíveis (sem perda de foco/semântica).

## 8) data-test-ids sugeridos

- `v-thumbnail-grid` (root; `data-size="sm|md|lg"`, `data-selectable`)
- `v-thumbnail` / `v-thumbnail-{mountains,beach,brand-guide,product-demo,plant}` (itens do contexto)
- `v-thumbnail-preview` / `v-thumbnail-label` / `v-thumbnail-meta` (partes da anatomia)
- `v-thumbnail-selection` (checkbox/badge ✓)
- `v-thumbnail-overlay` + `v-thumbnail-action-{view,download,more}` (acções rápidas do hover)
- `v-thumbnail-upload` (botão "+ Upload")
- `v-thumbnail-filter-{all,images,videos,documents,design,trash}` (sidebar de filtros)
- `docs-thumbnail-grid-variant-{image-gallery,file-thumbnails,selectable,compact}` (fileira de variantes)
- `docs-thumbnail-grid-size-{small,medium,large}` (fileira de tamanhos)
- `docs-thumbnail-grid-state-{default,hover,selected,loading,disabled}` (fileira de estados)

## Tokens da página (transcrição literal do card "Design tokens — Key tokens for customization.")

| Token | Valor |
|---|---|
| `--thumbnail-size-sm` | `64px` |
| `--thumbnail-size-md` | `96px` |
| `--thumbnail-size-lg` | `128px` |
| `--thumbnail-radius` | `12px` |
| `--thumbnail-border` | `1px` |
| `--thumbnail-overlay` | `rgba(0, 0, 0, 0.6)` |
| `--thumbnail-gap` | `16px` |
| `--thumbnail-label-color` | `#1F2937` |
| `--thumbnail-meta-color` | `#6B7280` |

No repo equivalem a `--v-space-4`, `--v-radius-md`, `--v-text-*`, `--v-motion-fast/normal/slow` + `--v-ease-out`.

## Uso Vue (transcrição literal do card "Vue usage — Use in your Vue components.")

```vue
<template>
  <VThumbnailGrid
    :items="items"
    selectable
    @update:selected="handleSelect"
  />
</template>
```

**Pro tip (literal):** "Use lazy loading for large galleries to improve performance and initial load time."
