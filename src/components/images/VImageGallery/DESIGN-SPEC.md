# VImageGallery — DESIGN-SPEC (fonte: doc/Ui/VImageGallery.png)

> Página de documentação do componente Image Gallery (Components › Image Gallery).
> Tagline da página: "Visual collection and preview".
> Descrição de abertura: "Image Gallery lets you display collections of images in a clean, flexible layout. Perfect for portfolios, product showcases, and media libraries, with built-in preview, selection, and responsive layouts."
> Três pilares no topo: **Visual** (Beautiful image presentation with thumbnails) · **Selectable** (Support single or multiple selection) · **Expandable** (Built-in lightbox preview with smooth animations).
> Header da página: breadcrumb "Components / Image Gallery".
> Texto decorativo manuscrito: "Bigger stories".
> Hero superior (esquerda → direita): grelha 3×3 de fotografias (lago de montanha, Santorini com overlay "View" + cursor, palmeira no deserto, golden retriever, floresta de montanha selecionada com check azul, praia, flor de cerejeira, edifício branco com palmeira, lago de montanha) + lightbox escura à direita ("3 / 12", botão fechar `×`, imagem principal de floresta nublada, setas `<` `>` de navegação, filmstrip inferior com 5 miniaturas sendo a 3.ª com borda azul de seleção).
> Footer da página: "VueUI Nova — Beautiful components for modern web apps." + "Open source · Customizable · Production ready".

## 1) Objetivo do componente

Exibir coleções de imagens num layout limpo e flexível, com apresentação por miniaturas, seleção (simples ou múltipla) e pré-visualização expandida (lightbox) com animações suaves. Casos de uso citados: portfólios, showcases de produto e media libraries. Combina três capacidades: apresentação visual, seleção e expansão.

## 2) Anatomia (partes)

Anatomia oficial numerada na imagem ("Anatomy — Key parts of the image gallery component", 4 itens):

| Parte | Obrigatória | Observado na imagem |
|---|---|---|
| 1 — Thumbnail | sim | Miniatura da imagem (ex.: montanha com lago); base da grelha; tamanhos SM/MD/LG |
| 2 — Overlay | estado (hover) | Camada escura sobre a miniatura com rótulo "View" (ex.: cartão de Santorini com cursor) |
| 3 — Selection indicator | condicional (`selectable`) | Badge circular azul com check `✓` no canto superior-direito da miniatura (ex.: floresta selecionada) |
| 4 — Lightbox | condicional (preview) | Overlay escuro de pré-visualização: contador "3 / 12", botão fechar `×`, imagem principal, setas `<` `>` e filmstrip de miniaturas com seleção destacada em azul |

Elementos do hero que completam a anatomia:

- Grelha de miniaturas 3×3 com cantos arredondados e espaçamento uniforme (`gap`).
- Lightbox: contentor escuro arredondado; topo com contador + fechar; corpo com imagem grande e setas circulares laterais; rodapé com filmstrip (5 thumbs).
- Overlay "View": pill/retângulo escuro centrado sobre o thumbnail em hover, com cursor pointer visível.

## 3) Variantes e tamanhos visíveis

### Variantes ("Variants — Different styles for different use cases", 4 exemplares)

| Variante | Aparência na imagem | Uso |
|---|---|---|
| Grid | Grelha uniforme de 8 células ("Grid layout") | Layout padrão em grelha |
| Masonry | Blocos de alturas variadas ("Masonry layout") | Layout tipo masonry, alturas irregulares |
| Carousel | Faixa horizontal com setas `<` `>` ("Carousel strip") | Faixa deslizante de miniaturas |
| Selectable | Grelha com badges `✓` azuis ("Selectable gallery") | Galeria com seleção (single/multiple) |

### Tamanhos ("Sizes — Three thumbnail sizes for different densities", 3 exemplares)

| Tamanho | Observado | Token base |
|---|---|---|
| Small (SM) | Miniatura compacta de montanha | Densidade alta |
| Medium — MD (default) | Miniatura intermédia, com destaque de borda azul (selecionada como default) | Densidade padrão |
| Large (LG) | Miniatura ampla de montanha | Densidade baixa / destaque |

Código de uso confirma as props: `layout="grid"`, `:selectable="true"`, `:multiple="true"`.

## 4) Estados ("States — Visual states for clear interaction feedback", 6 exemplares)

| Estado | Aparência na imagem |
|---|---|
| Default | Miniatura de montanha sem adornos |
| Hover | Miniatura com overlay escuro "View" + cursor pointer |
| Focus | Miniatura com anel de foco duplo azul (borda externa + interna) |
| Selected | Miniatura com badge circular azul `✓` no canto superior-direito |
| Loading | Placeholder cinza-claro com spinner circular (anel) |
| Empty | Contentor tracejado com ícone de imagem + texto "No images" |

## 5) Micro-interações

| Interação | Comportamento |
|---|---|
| Hover numa miniatura | Exibe overlay "View"; cursor pointer; indica que a imagem é clicável/pré-visualizável |
| Click numa miniatura | Abre a lightbox (zoom + fade suave); contador "n / total" posiciona-se na imagem clicada |
| Click nas setas `<` `>` da lightbox | Navega para imagem anterior/seguinte; atualiza contador e filmstrip |
| Click numa miniatura do filmstrip | Salta diretamente para essa imagem na lightbox |
| Click no `×` / Escape | Fecha a lightbox e devolve o foco à miniatura de origem |
| Click numa miniatura selecionável | Alterna seleção; badge `✓` aparece/desaparece; emite `@select`; suporta single (`multiple=false`) ou múltipla (`multiple=true`) |
| Teclado Tab / Arrow keys | Tab move o foco entre miniaturas; setas navegam na grelha e dentro da lightbox |
| Lightbox aberta — Tab/Shift+Tab | Foco preso (focus trap) entre fechar, setas e filmstrip |
| Loading | Spinner visível até a imagem carregar (transição skeleton → imagem, ver Motion) |
| Empty | Estado estático "No images"; sem interação |

## 6) Motion ("Motion — Smooth and subtle by default", 1 especificação + legenda literal)

Diagrama: miniatura → (seta) skeleton/placeholder → (seta) miniatura.
Legenda literal: "Opens in a smooth zoom animation with a subtle fade."

| Movimento | Duração / easing (literal ou inferido da imagem) | Token `--v-*` correspondente |
|---|---|---|
| Open lightbox (zoom + fade) | Zoom suave + fade subtil (duração padrão do sistema; tokens de transição da galeria) | `--v-gallery-transition` + `--v-motion-normal/--v-motion-slow` + `--v-ease-out` |
| Thumbnail loading (skeleton → imagem) | Fade de entrada (padrão subtil) | `--v-gallery-transition` |
| Hover overlay | Fade/tint rápido (padrão 100–150ms do sistema) | `--v-motion-fast` + `--v-ease-out` |
| Setas / filmstrip | Transição de slide/fade da imagem (padrão) | `--v-gallery-transition` |

Regras gerais: motion apenas em `transform`/`opacity`; `prefers-reduced-motion: reduce` desativa zoom/fade (abertura instantânea da lightbox); skeleton estático sem shimmer.

Exemplo SCSS (tokens `--v-*`, convenção do repo):

```scss
.v-image-gallery {
  display: grid;
  gap: var(--v-gallery-gap);

  .v-image-gallery__thumb {
    border-radius: var(--v-gallery-radius);
    transition: var(--v-gallery-transition);

    &:focus-visible {
      outline: 2px solid var(--v-gallery-focus-ring);
      outline-offset: 2px;
    }
  }

  .v-image-gallery__overlay {
    background: var(--v-gallery-overlay-bg);
    color: var(--v-gallery-overlay-color);
  }

  .v-image-gallery__thumb--selected {
    border: 2px solid var(--v-gallery-selected-border);
    background: var(--v-gallery-selected-bg);
  }

  @media (prefers-reduced-motion: reduce) {
    .v-image-gallery__thumb { transition: none; }
  }
}
```

## 7) Acessibilidade observada ("Accessibility — Built with accessibility in mind", 6 checks literais)

1. **ARIA compliant (role="list" and role="listitem")** — contentor com `role="list"`, cada miniatura com `role="listitem"` (ou `option` quando selecionável com `aria-selected`).
2. **Keyboard navigation (Tab, Arrow keys)** — Tab alcança miniaturas e controlos da lightbox; setas navegam na grelha e entre imagens.
3. **Screen reader friendly (alt text support)** — cada imagem exige `alt` descritivo; lightbox anuncia "Image n of total" via `aria-live`/label.
4. **Focus visible** — anel de foco azul sempre visível via `:focus-visible`, nunca removido sem substituto.
5. **Supports selection with ARIA states** — seleção exposta com `aria-selected`/`aria-pressed`/`aria-checked`; indicar `aria-multiselectable` quando múltipla.
6. **High contrast and reduced motion support** — overlay/indicador com contraste suficiente em alto contraste; `prefers-reduced-motion` desativa zoom/fade.

Alvos de toque mínimos 44×44px para fechar/setas/filmstrip; Escape fecha sempre a lightbox.

## 8) data-test-ids sugeridos

- `v-image-gallery` (root; `data-layout="grid|masonry|carousel"`, `data-selectable`, `data-multiple`)
- `v-image-gallery-thumb-{index}` (cada miniatura)
- `v-image-gallery-overlay` ("View" no hover)
- `v-image-gallery-selection-{index}` (badge `✓`)
- `v-image-gallery-lightbox` (overlay de preview)
- `v-image-gallery-counter` ("3 / 12")
- `v-image-gallery-close`
- `v-image-gallery-prev` / `v-image-gallery-next`
- `v-image-gallery-filmstrip` / `v-image-gallery-filmstrip-thumb-{index}`
- `v-image-gallery-loading` (spinner)
- `v-image-gallery-empty` ("No images")
- `docs-image-gallery-variant-{grid,masonry,carousel,selectable}`
- `docs-image-gallery-size-{sm,md,lg}`
- `docs-image-gallery-state-{default,hover,focus,selected,loading,empty}`

## Tokens da página (transcrição literal do card "Design tokens — Customize with design tokens")

| Token | Valor na imagem |
|---|---|
| `--v-gallery-gap` | (swatch azul) |
| `--v-gallery-radius` | (swatch azul-claro) |
| `--v-gallery-overlay-bg` | (swatch roxo) |
| `--v-gallery-overlay-color` | (swatch magenta) |
| `--v-gallery-focus-ring` | (swatch azul) |
| `--v-gallery-selected-border` | (swatch azul-escuro) |
| `--v-gallery-selected-bg` | (swatch azul-claro) |
| `--v-gallery-transition` | (swatch amarelo) |

Valores de cor/comprimento não impressos no poster; usar os tokens `--v-*` equivalentes do tema (espaçamento, radius, cores de overlay/foco/seleção, transição padrão).

## Uso Vue (transcrição literal do card "Vue usage — A simple example to get you started")

```vue
<template>
  <VImageGallery
    :images="images"
    layout="grid"
    :selectable="true"
    :multiple="true"
    @select="onSelect"
  />
</template>
```

**Pro tip (literal):** "Use the lightbox slot to customize the preview experience."

```vue
<VImageGallery>
  <template #lightbox="{ image }">
    <div class="my-lightbox">
      <!-- custom content -->
    </div>
  </template>
</VImageGallery>
```
