# VWindow — DESIGN-SPEC (fonte: doc/Ui/guia_do_componente_window_vueui_nova.png + complemento pôster_do_componente_window_vueui_nova.png)

> Status: ✅ Concluído e validado
> Data: 2026-09-20
> Testes: `pnpm build` ok; `pnpm exec vitest run src/components/containment/VWindow/_tests/` — **24/24** (23 unit + 1 placeholder e2e); e2e real (8 specs) pendente de `pnpm exec playwright install chromium` neste ambiente.
> Validação visual: comparado com `doc/ui/VWindow.png` — variantes Default/Minimal/Borderless/Modal, tamanhos 640×480/960×640/1280×800, estados Normal/Active/Inactive/Disabled/Loading, anatomia titlebar, motion scale+fade, resize handle e modal backdrop.

## 1) Objetivo do componente

O `VWindow` é um contentor estilo desktop para conteúdo focado, com barra de título, ações e suporte a
redimensionamento.
Poster principal: **"Window — Desktop-like application container"** — *"Window provides a flexible container for
focused content, with a title bar, actions, and resizable support. Use it to create dialogs, tools, or multi-panel
experiences that feel native and productive."*
Complemento repete com *"create dialogs, tools, or multi-panel experiences that feel native and productive."*
Três pilares (principal): **Layered** ("Organize multiple windows with ease"), **Resizable** ("Adjust to your
workflow"), **Familiar** ("A desktop-like experience users understand").
Complemento: **Familiar**, **Flexible** ("Resizable, movable, and composable"), **Customizable**
("Works for tools, editors, dialogs, and more").
Hero do poster principal: janela "Project Notes" — titlebar (ícone app + título + `–`/`▢`/`×`), sidebar
(Overview selecionado, Notes, Tasks, Assets, Settings), conteúdo Overview ("A quick look at your project.",
2 cartões 12 Files / 5 Collaborators, "Recent activity" com 3 linhas + tempos, resize handle no canto).
Hero do complemento: mesma janela mas com semáforo macOS no titlebar e conteúdo "Good Morning, Alex! 👋"
+ 3 cartões (12 Files / 5 Collaborators / 3 Active tasks).
Nota manuscrita: *"Layer your workflow"* / *"A familiar pattern for modern web apps."*
Pro tip: `v-model` para controlar visibilidade e combinar com Dock ou Tabs para experiências multi-janela;
exemplo `<Window v-model:open="show" title="Editor" :resizable="true">…</Window>`.

## 2) Anatomia (partes, cada elemento visível na imagem)

Anatomia do poster principal (4 partes, exemplo "Sample Window"):

1. **App icon** — ícone quadrado azul com símbolo no início da titlebar.
2. **Title** — "Sample Window" (complemento: "Project Notes" após o semáforo).
3. **Window actions** — grupo `–` (minimizar), `▢` (maximizar), `×` (fechar).
4. **Resize handle** — alça no canto inferior direito (diagonal ⤡).

Anatomia do complemento (5 partes): 1. **Traffic lights** (semáforo `🔴🟡🟢`), 2. **Title** ("Project Notes"),
3. **Window actions** (`–`/`▢`/`×`), 4. **Content area**, 5. **Resize handle**.

Ou seja: os dois posters divergem só no lado esquerdo da titlebar — ícone da app (principal) vs. semáforo
macOS (complemento); ambos mantêm título, ações, área de conteúdo e resize handle.

Elementos do hero (todos cobertos): titlebar completa; sidebar com 5 itens iconizados (item ativo em azul-claro);
títulos de seccção ("Overview", "Good Morning, Alex! 👋", "Recent activity"); cartões de estatística com ícone de
contorno + número grande + legenda; linhas de atividade (dot azul/magenta/verde + texto + "2m/1h/3h ago");
resize handle ⤡ no canto.

## 3) Variantes e tamanhos visíveis

Variantes (4 cartões em ambos os posters):

| Variante | Descrição |
|---|---|
| **Default** | "Standard application window." / "Standard application window with title bar and actions." |
| **Minimal** | "Clean and distraction free." / "A clean, distraction-free window." |
| **Borderless** | "Content focused." / "Content-focused window without a visible frame." |
| **Modal** | "Centered and focused." / "Centered and focused, ideal for dialogs." (complemento mostra a janela modal sobre backdrop escurecido) |

Tamanhos — presets (Medium é o default, com destaque azul):

| Tamanho | Dimensões | Uso |
|---|---|---|
| **Small** | 640 × 480 | "Compact tools" |
| **Medium (default)** | 960 × 640 | "Everyday use" |
| **Large** | 1280 × 800 | "Complex workflows" |

Design tokens (principal): `--window-bg`, `--window-surface`, `--window-border`, `--window-title-bg`,
`--window-title-text`, `--window-icon-size`, `--window-shadow`, `--window-radius`, `--window-resize-size`,
`--window-backdrop`.
Complemento: `--window-bg`, `--window-surface`, `--window-border`, `--window-title-bg`, `--window-title-text`,
`--window-accent`, `--window-radius`, `--window-shadow`, `--window-resize-handle`, `--window-backdrop`.

Exemplo Vue (principal):

```vue
<template>
  <Window v-model:open="open" title="Project Notes" :width="960" :height="640">
    <template #default>
      <p class="text-slate-600">Your content goes here.</p>
    </template>
  </Window>
</template>
```

Complemento usa `:width="960" :height="640"` e `title="Project Notes"` de igual forma.

## 4) Estados (default, hover, focus, pressed, disabled, loading)

Estados literais da titlebar (4 cartões):

| Estado | Aparência |
|---|---|
| **Normal** | "Default appearance" |
| **Active** | "In focus" — titlebar com contorno/anel azul de foco |
| **Inactive** | "Out of focus" — titlebar esmaecida (texto/ícones em cinza) |
| **Disabled** | "Not interactive" — tudo esmaecido (semáforo cinzento no complemento), sem interação |

Hover/focus/pressed aplicam-se aos botões da titlebar (`–`/`▢`/`×` com hover, ex. `×` com fundo vermelho em
padrão desktop; anel de foco 2px; pressed com scale) e ao resize handle, seguindo DESIGN.md 08–09.
Loading não ilustrado: inferido — skeleton no content area + spinner, titlebar mantida.
Modal acrescenta o estado de backdrop (overlay escuro atrás da janela centrada).

## 5) Micro-interações (click, hover, teclado, overlays)

- **Botões da titlebar**: `–` minimiza/oculta, `▢` alterna maximizar/restaurar, `×` fecha (com `v-model:open`);
  hover destaca cada botão; `×` tipicamente com hover destrutivo.
- **Resize handle ⤡**: drag redimensiona fluidamente com feedback ao vivo (ver Motion); respeita Small/Medium/
  Large e limites min/max; redimensionável também por teclado (setas).
- **Mover**: arrastar pela titlebar move a janela (complemento: "Fluidly resizable and movable").
- **Sidebar interna**: hover + click troca a secção do content area (Overview/Notes/Tasks/Assets/Settings).
- **Teclado**: `Tab` percorre controles, `Esc` fecha (ou sai do modal); setas redimensionam quando o handle ou a
  janela tem foco; foco visível sempre.
- **Modal**: abre centrada sobre backdrop; foco preso dentro (focus trapping); click no backdrop pode fechar;
  ao fechar devolve o foco ao trigger.
- **Multi-janela**: Active vs. Inactive — clicar numa janela traz para frente (z-index) e marca as restantes
  como Inactive (esmaecidas).

## 6) Motion (durações, easing, transições, cruzando com tokens do DESIGN.md)

Valores literais (ambos os posters):

- **Abertura**: "Opens with a gentle scale and fade."
- **Resize**: "Resizes fluidly with live feedback." / "Fluidly resizable and movable."

Sem durações impressas para Window; cruzar com o padrão do sistema (DESIGN.md 10–11, 20):

| Conceito | Token `--v-*` | Uso no Window |
|---|---|---|
| Abertura (scale+fade) | `--v-motion-normal: 160ms` (aberturas modais típicas) | `opacity 0→1` + `scale(0.98→1)`, `var(--v-ease-out)` |
| Fecho | `--v-motion-fast: 100ms` | reverso com `var(--v-ease-in)` |
| Resize ao vivo | sem transição durante o drag | dimensões diretas; sem settle animado (feedback 1:1) |
| Escala 0.98–1.02 | `scale(0.98)` inicial | escala suave de entrada/saída |
| Slide 4–24px | deslocamento subtil opcional | modal pode combinar `translateY(8px→0)` |

Regras: só `transform`/`opacity`; sombra `--v-shadow-lg/xl` no contentor (janela/modal);
`prefers-reduced-motion` reduz a abertura a fade simples ou nada.

## 7) Acessibilidade observada

Checklist literal (igual nos dois posters):

- ARIA role="dialog" or role="region".
- Accessible title and label.
- Keyboard navigation (Tab, Esc).
- Resizable with keyboard (arrow keys).
- Visible focus indicators.
- Proper focus trapping for modal windows.
- Screen reader friendly structure.
- Supports high contrast themes.

## 8) data-test-ids sugeridos (lista)

- `data-test-id="window"` — contentor raiz
- `data-test-id="window-titlebar"` — barra de título
- `data-test-id="window-traffic-lights"` — semáforo (variante macOS)
- `data-test-id="window-app-icon"` — ícone da app (variante ícone)
- `data-test-id="window-title"` — título ("Project Notes")
- `data-test-id="window-minimize"` — botão `–`
- `data-test-id="window-maximize"` — botão `▢`
- `data-test-id="window-close"` — botão `×`
- `data-test-id="window-sidebar"` — navegação lateral
- `data-test-id="window-nav-overview"` / `window-nav-notes` / `window-nav-tasks` / `window-nav-assets` / `window-nav-settings`
- `data-test-id="window-content"` — content area
- `data-test-id="window-stat-files"` / `window-stat-collaborators` / `window-stat-tasks`
- `data-test-id="window-activity"` — Recent activity
- `data-test-id="window-resize-handle"` — alça ⤡
- `data-test-id="window-backdrop"` — backdrop (variante Modal)
