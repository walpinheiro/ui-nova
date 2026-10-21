# VFileUpload — DESIGN-SPEC (fonte: doc/Ui/pôster_do_componente_file_upload_vueui_nova.png)

## 1) Objetivo do componente

Upload de arquivos com dropzone e fluxo guiado ("Dropzone and upload flow"). Permite
selecionar ou arrastar e soltar arquivos com fluxo claro: progresso, validação e
tratamento de erro, design limpo e acessível para qualquer aplicação. Anotação hero:
"Simple powerful reliable". Pilares: Guided (clear states and helpful feedback), Safe
(built-in validation and error handling), Flexible (multiple files, file types, custom UI).
Exemplo hero: dropzone "Drag and drop files here or click to browse / Supports images,
documents and more. Max 10 MB per file." + 3 arquivos: "hero-image.jpg 2.1 MB — 72%"
(barra + ×), "product-brochure.pdf 4.8 MB — Upload complete" (check verde + ×),
"demo-video.mp4 12.4 MB — Failed to upload / File type not supported" (× vermelho + ×).

## 2) Anatomia (partes, cada elemento visível na imagem)

Diagrama "Anatomy — Key parts" sobre a dropzone numerada 1-2-3:
- **(1) Icon**: nuvem com seta (upload) no topo da dropzone; ícones por tipo nos itens (imagem/pdf/vídeo).
- **(2) Content**: "Drag and drop files here or click to browse" ("click to browse" como link).
- **(3) Helper text**: "Max 10 MB per file." à direita.
- **Dropzone**: área tracejada arredondada clicável + drag target.
- **File list**: linhas com thumbnail/ícone, nome ("hero-image.jpg", "report.pdf"), tamanho ("2.1 MB", "4.8 MB", "12.4 MB", "2.4 MB"), status (barra 72%, "Upload complete" verde, "Failed to upload / File type not supported" vermelho) e botão remover "×".
- Props do code: `v-model="files"`, `accept="image/*,.application/pdf"` (sic na imagem), `:max-size="10 * 1024 * 1024"`, `multiple`, `@change="handleUpload"`, slot `#default` com `<UploadIcon />` + "Drop files here".

## 3) Variantes e tamanhos visíveis

Variantes (4 cards):
- **Dropzone** — "Full dropzone with instructions" (área tracejada com nuvem + textos).
- **Button trigger** — botão primário "Choose files" (upload icon). "Opens file picker."
- **Compact list** — item minimalista "report.pdf 2.4 MB" + ×. "Minimal file list style."
- **Image upload** — thumbnail de montanha + tile tracejado "+" . "Optimized for images."

Tamanhos (3 botões "Choose files"):
- **SM**, **MD (default)** (destacado azul claro), **LG** — "Three sizes for different densities."

## 4) Estados (default, hover, focus, pressed, disabled, loading se houver)

Faixa "States — Visual states for clear interaction feedback" (7 dropzones em miniatura):
- **Idle** — tracejada cinza com nuvem.
- **Hover** — leve destaque.
- **Drag over** — borda azul + fundo azul claro com nuvem.
- **Uploading** — spinner circular azul.
- **Success** — check verde em fundo verde claro, borda verde tracejada.
- **Error** — "!" vermelho em fundo vermelho claro, borda vermelha tracejada.
- **Disabled** — nuvem cinza apagada, não interativa.
- Loading = **Uploading** (spinner + barra 72% nos itens); progresso por arquivo na lista.

## 5) Micro-interações (click, hover, teclado, overlays)

- Click na dropzone/botão/"click to browse" abre o file picker nativo; Enter/Espaço também ativam via teclado.
- Drag & drop: arrastar sobre a zona acende "Drag over"; soltar adiciona à lista e inicia upload.
- Upload mostra barra de progresso por arquivo (72%); concluir vira "Upload complete"; erro mostra "Failed to upload / File type not supported" (validação de tipo/tamanho, max 10 MB).
- "×" por arquivo remove/cancela o item.
- Múltiplos arquivos suportados (`multiple`); tipos via `accept`; slots customizam todo o conteúdo interno ("Use slots to fully customize the content inside the upload area").
- Sem overlay próprio; status anunciados para screen reader.

## 6) Motion (durações, easing, transições, cruzando com tokens --v-motion-*/--v-ease-*)

Faixa "Motion — Smooth and subtle by default": diagrama nuvem cinza → nuvem azul → check verde.
- "Includes smooth transitions for hover, drag, upload progress, and success feedback."
- Mapeamento para tokens (DESIGN.md §10/§20, sem valores numéricos na imagem): hover/drag em `--v-motion-fast: 100ms` a `--v-motion-normal: 160ms` com `--v-ease-standard: cubic-bezier(.2,.8,.2,1)` / `--v-ease-out` (entrada); progresso do fill contínuo/reativo; spinner de uploading em loop (`--v-motion-spin-duration`, linear); sucesso com scale sutil 0.98→1; fade 0–100%; só `transform`/`opacity`; `prefers-reduced-motion` zera.

## 7) Acessibilidade observada

Lista "Accessibility — Built with accessibility in mind" (6 itens):
- ARIA compliant (`aria-labels`, `aria-describedby`).
- Keyboard navigation (Tab, Enter, Space).
- Screen reader friendly.
- Clear error messages.
- Focus visible.
- Supports multiple files and status announcements.
- Erros com ícone + texto explícito ("File type not supported"), nunca só cor; foco visível na dropzone/botão.

## 8) data-test-ids sugeridos (lista)

- `file-upload-dropzone`
- `file-upload-icon`
- `file-upload-content`
- `file-upload-helper-text`
- `file-upload-input`
- `file-upload-button-trigger`
- `file-upload-file-item`
- `file-upload-file-name`
- `file-upload-file-size`
- `file-upload-progress-bar`
- `file-upload-status-complete`
- `file-upload-status-error`
- `file-upload-remove-button`
- `file-upload-compact-list`
- `file-upload-image-preview`

Tokens de design vistos na imagem (nomes): `--v-upload-bg/border/border-hover/primary/success/error/text/progress-bg/progress-fill` (mapear para `--v-color-surface/border/focus/primary/success-base/error-base/text` + `--v-radius-*` para a dropzone e `--v-shadow-sm`).
