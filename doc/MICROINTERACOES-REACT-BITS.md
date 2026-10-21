# Microinterações React Bits → VueUI Nova Kit

**Fonte analisada:** [React Bits — Micro](https://reactbits.dev/c/micro) (34 componentes)  
**Data:** 22/09/2026  
**Projeto destino:** `vueui-nova-kit` (Vue 3, SCSS + tokens `--v-*`, sem lib de motion externa hoje)

---

## 1. Resumo executivo

A seção **Micro** do React Bits não é um catálogo de componentes novos — é um conjunto de **microinterações de alto nível sensorial** aplicadas a padrões de UI já conhecidos (checkbox, switch, toast, select, slider, etc.). A maioria usa **física de spring** via [`motion`](https://motion.dev/) (Framer Motion), gestos de arrastar/flick, e animações coordenadas em múltiplas camadas (fill + tick + label + strike-through no mesmo gesto).

O UiNova já cobre **67 famílias de componentes** com transições CSS (`--v-motion-*`, `--v-ease-spring`) e `<Transition>`, mas **sem spring physics real nem gestos de arrastar**. O gap principal não é visual — é **comportamental**.

### Recomendação estratégica

| Abordagem | O que fazer |
|-----------|-------------|
| **Curto prazo (Fase 1)** | Enriquecer componentes existentes com variantes `motion` opcionais via CSS + pequenos composables Vue |
| **Médio prazo (Fase 2)** | Adicionar `@vueuse/motion` ou portar springs com `motion` (via wrapper) para gestos complexos |
| **Longo prazo (Fase 3)** | Componentes AI-first (Prompt Bar, Thought Line) só se o produto tiver chat/agentes |
| **Evitar** | Portar 1:1 componentes com Three.js (`PaperCrumple`) ou Matter.js (`FolderFloat`) — peso e manutenção incompatíveis com um DS enxuto |

---

## 2. Estado atual do UiNova (baseline)

### Stack de motion existente

```
src/tokens/_tokens.scss
├── --v-motion-fast: 100ms
├── --v-motion-normal: 160ms
├── --v-motion-slow: 300ms
├── --v-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  ← aproximação, não spring real
└── prefers-reduced-motion: reduce → durações zeradas
```

### Padrões já implementados

- **Hover/press:** `transform` + `opacity` em botões, cards, nav items
- **Indicadores deslizantes:** `VTabs`, `VSegmentedControl` (transição de posição do indicador)
- **Overlays:** `VDialog`, `VDrawer`, `VSheet`, `VPopover` com `<Transition>`
- **Loading:** `VSpinner`, `VSkeleton` (shimmer), spinners inline em `VButton`
- **Toast:** timer com pause on hover (`VToast`), stack empilhável (`VToastStack`)

### Lacunas em relação ao React Bits Micro

| Capacidade | React Bits | UiNova hoje |
|------------|-----------|-------------|
| Spring physics (bounce, velocity) | `motion/react` | Apenas `cubic-bezier` |
| Drag / flick gestures | Pointer events + spring | Não |
| Animações multi-camada sincronizadas | 3–5 elementos por gesto | 1–2 propriedades CSS |
| Scrub / hold-to-confirm | Vários componentes | Não |
| Swipe-to-dismiss | SwipeToast, SwipeRow | Não |
| Clip-path morphing | BellToggle, RubberSegment | Não |

---

## 3. Dependências técnicas dos 34 Micro (React Bits)

| Dependência | Componentes que usam | Impacto no UiNova |
|-------------|---------------------|-------------------|
| `motion/react` | 18 de 34 | **Crítico** — spring, velocity, drag |
| `@hugeicons/*` | ~15 | Substituir por `VIcon` + Keyline Icons |
| `three` | PaperCrumple | **Alto** — WebGL 3D, ~500KB+ |
| `matter-js` | FolderFloat | **Alto** — física 2D |
| Apenas React + CSS/DOM | ~10 | Portável com esforço médio |

---

## 4. Catálogo completo — os 34 Micro

Para cada item: **o que faz** → **onde encaixa no UiNova** → **como se comportaria** → **viabilidade**.

Legenda de viabilidade:
- 🟢 **Alta** — encaixa direto em componente existente, sem deps pesadas
- 🟡 **Média** — requer lib de motion ou gestos, mas ROI claro
- 🟠 **Baixa** — nicho, alto custo, ou fora do escopo de DS
- 🔴 **Não recomendado** — deps 3D/física ou puramente decorativo

---

### 4.1 Form controls — prioridade máxima

#### Spring Check 🟢
**Fonte:** [spring-check](https://reactbits.dev/c/micro/spring-check)

**O que faz:** Checkbox onde um único spring coordena: fill que incha do centro da caixa → tick desenhado → strike-through no label → label perde opacidade. Props: `bounce`, `strikeLag`, `doneOpacity`, direção do strike (`left|center|right|none`).

**Destino UiNova:** `VCheckbox` (`src/components/form/VCheckbox/`)

**Comportamento proposto:**
```ts
// Nova prop em VCheckbox.types.ts
motion?: 'default' | 'spring'  // default = atual; spring = Spring Check
strikeThrough?: boolean | 'left' | 'center' | 'right'
doneOpacity?: number  // default 0.42
```

- Ao marcar: `scale` do fill de 0→1 com overshoot (`--v-ease-spring` ou spring real)
- Tick: `stroke-dashoffset` animado em sincronia
- Label: `::after` com `scaleX(0→1)` e `opacity` reduzida
- `prefers-reduced-motion`: toggle instantâneo (já suportado globalmente)
- **Deps:** portável com CSS + `requestAnimationFrame`; spring fiel requer `@vueuse/motion`

---

#### Squish Switch 🟡
**Fonte:** [squish-switch](https://reactbits.dev/c/micro/squish-switch)

**O que faz:** Switch arrastável; thumb **estica** conforme velocidade do drag, achata nas bordas, inverte no midpoint. Props: `speed`, `stretch`, `hoverScale`.

**Destino UiNova:** `VSwitch` (`src/components/form/VSwitch/`)

**Comportamento proposto:**
- Nova variante `gesture="scrub"` além do toggle por clique
- Thumb com `width` dinâmico durante drag; `border-radius` ajusta para manter área
- Track: cross-fade de cor em 320ms
- Pointer: drag + teclado (Space/Enter)
- **Deps:** `motion/react` no original; em Vue, `@vueuse/gesture` + spring ou port manual

---

#### Jelly Radio 🟡
**Fonte:** [jelly-radio](https://reactbits.dev/c/micro/jelly-radio)

**O que faz:** Radio group em chips; seleção **inchada** wide-then-tall em dois springs, empurrando vizinhos com stagger.

**Destino UiNova:** `VRadioGroup` + opcionalmente `VSegmentedControl`

**Comportamento proposto:**
- Variante `variant="chips"` no `VRadioGroup`
- Chip selecionado: `scaleX(1.08) → scaleY(1.04)` sequencial
- Vizinhos: `translateX` com delay escalonado (`--v-motion-fast` * index)
- Acessibilidade: manter `role="radio"` + `aria-checked`

---

#### Rubber Segment 🟡
**Fonte:** [rubber-segment](https://reactbits.dev/c/micro/rubber-segment)

**O que faz:** Segmented control com thumb elástico; tap estica através do gap, squash no destino; drag + flick entre slots.

**Destino UiNova:** `VSegmentedControl` (`src/components/navigation/VSegmentedControl/`)

**Comportamento proposto:**
- Substituir indicador atual (transição linear de posição) por thumb com `clip-path` ou `scaleX` elástico
- Novo prop `motion="rubber"` (default mantém indicador atual)
- Drag: pointer capture no thumb; flick usa velocity para escolher slot
- O indicador atual já tem `--v-segmented-motion` — evoluir para spring quando `motion="rubber"`

---

#### Glide Select 🟡
**Fonte:** [glide-select](https://reactbits.dev/c/micro/glide-select)

**O que faz:** Select cujo menu **sai do próprio canto** do chip; highlight de hover **desliza** entre rows, lembrando última posição.

**Destino UiNova:** `VSelect` + `VDropdownMenu`

**Comportamento proposto:**
- Menu: `transform-origin` no canto do trigger; enter com `scale(0.95→1)` + `opacity`
- Highlight: elemento absoluto que anima `top/height` entre options (não re-render por item)
- Re-entry: highlight parte da última posição, não pisca
- Encaixa no padrão de overlay já usado em `VPopover`

---

#### Wake Slider 🟡
**Fonte:** [wake-slider](https://reactbits.dev/c/micro/wake-slider)

**O que faz:** Slider sem thumb visível; barras finas; velocidade do drag cria **wake** (rastro) que some ao parar.

**Destino UiNova:** `VSlider` (`src/components/form/VSlider/`)

**Comportamento proposto:**
- Variante `appearance="bars"` com barras verticais/horizontais
- Durante drag: N barras atrás do handle com `opacity` decrescente proporcional à velocity
- Em repouso: apenas barra ativa iluminada
- Acessibilidade: thumb invisível mas focusable para teclado

---

#### Code Slots 🟡
**Fonte:** [code-slots](https://reactbits.dev/c/micro/code-slots)

**O que faz:** OTP onde input oculto gerencia foco/paste/autofill; cada slot: fill do centro, dígito sobe, caret desliza; erro = cascade drain; sucesso = merge em wash.

**Destino UiNova:** `VOtpInput` (`src/components/form/VOtpInput/`)

**Comportamento proposto:**
- Refatorar slots para animação por dígito com spring
- Estado `error`: slots drenam em sequência (`transition-delay` escalonado)
- Estado `success`: slots colapsam em uma barra de cor `--v-color-success-base`
- Paste/SMS autofill: manter input único oculto (padrão já comum em OTP)

---

#### Scrub Field 🟢
**Fonte:** [scrub-field](https://reactbits.dev/c/micro/scrub-field)

**O que faz:** Chip numérico arrastável (scrub); rubber band nos limites; clique sem movimento abre para digitar.

**Destino UiNova:** `VNumberInput` (`src/components/form/VNumberInput/`)

**Comportamento proposto:**
- Modo `interaction="scrub"`: drag horizontal altera valor (como Figma/After Effects)
- Fora do range: valor "empurra" com resistência elástica, snap back
- Click sem `pointermove`: foco no input para edição direta
- Cursor: `ew-resize` no chip

---

#### Comet Dial 🟠
**Fonte:** [comet-dial](https://reactbits.dev/c/micro/comet-dial)

**O que faz:** Dial circular com flick angular; cometa de luz segue a velocidade até parar.

**Destino UiNova:** Novo `VDial` ou variante de `VSlider` circular — **não existe hoje**

**Comportamento proposto:** Componente novo em `form/`; útil para áudio, brightness, datas. Custo alto; priorizar só se houver caso de uso no produto.

---

#### Peek Rating 🟡
**Fonte:** [peek-rating](https://reactbits.dev/c/micro/peek-rating)

**O que faz:** Estrelas com preview no hover (onda seguindo pointer); click commita com pop.

**Destino UiNova:** Novo `VRating` em `form/` (não existe)

**Comportamento proposto:**
- Hover: estrelas até o índice do pointer preenchem com stagger
- Tooltip flutuante com label ("Good", "Excellent")
- Click: `scale(1.2→1)` pop + `v-model`
- Caso de uso: reviews, feedback pós-ação

---

### 4.2 Botões e ações

#### Hold Button 🟡
**Fonte:** [hold-button](https://reactbits.dev/c/micro/hold-button)

**O que faz:** Confirmar segurando; fill líquido sobe; release cedo = volta; completo = label troca com blur.

**Destino UiNova:** `VButton` — variante `confirm="hold"`

**Comportamento proposto:**
- `confirmHoldDuration={ms}` (ex: 1500)
- Press: pseudo-elemento `::before` com `height` 0→100%
- Release antes: animação reversa
- Completo: `@confirmed` emit + label crossfade
- Uso: ações destrutivas (`VConfirmDialog` alternativa inline)

---

#### Fuse Button 🟢
**Fonte:** [fuse-button](https://reactbits.dev/c/micro/fuse-button)

**O que faz:** Após ação, label vira "Undo"; fio queima pelo tempo da janela de undo; Undo/Escape reverte.

**Destino UiNova:** `VButton` — variante `undoWindow={ms}`

**Comportamento proposto:**
- Pós-click: texto crossfade para "Desfazer"
- Barra `::after` com `scaleX` linear = timer restante
- `undo` emit ou Escape → reverte estado
- Padrão Gmail/Slack; alto valor, baixa complexidade

---

#### Sling Button 🟠
**Fonte:** [sling-button](https://reactbits.dev/c/micro/sling-button)

**O que faz:** Botão estilingue; puxar para trás, arco de poder, release dispara com velocity.

**Destino UiNova:** Variante lúdica de `VButton` ou slot em `PromptBar`

**Comportamento proposto:** Gestos complexos; bom para onboarding/gamificação, não para DS core.

---

#### Slide Commit 🟡
**Fonte:** [slide-commit](https://reactbits.dev/c/micro/slide-commit)

**O que faz:** Slide-to-confirm; spinner durante async; sucesso = pill "Done"; falha = shake + spring home.

**Destino UiNova:** `VConfirmDialog` ou novo `VSlideConfirm` em `feedback/`

**Comportamento proposto:**
- Handle deslizável em track
- `loading`: spinner no handle
- `success`: handle expande para pill verde
- `error`: `animation: shake` + retorno elástico
- Caso: confirmações críticas mobile-first (pagamentos, exclusões)

---

#### Pulse Heart 🟢
**Fonte:** [pulse-heart](https://reactbits.dev/c/micro/pulse-heart)

**O que faz:** Like que contrai a ponto, inverte cor no menor frame, pulsa de volta; contador troca um glyph.

**Destino UiNova:** `VButton` (`icon-only`) ou padrão em `VCard`/`VImageGallery`

**Comportamento proposto:**
- `variant="favorite"` com `count`
- Toggle: `scale(1→0.2→1.15→1)` + troca fill/outline
- Contador: crossfade de dígitos (não layout shift)
- Ícone via `VIcon` (heart Keyline)

---

### 4.3 Feedback e notificações

#### Swipe Toast 🟡
**Fonte:** [swipe-toast](https://reactbits.dev/c/micro/swipe-toast)

**O que faz:** Toast entra pela borda inferior; swipe down dismiss; fuse visual do tempo restante; hover pausa; modo inline.

**Destino UiNova:** `VToast` + `VToastStack`

**Comportamento proposto:**
- `VToast` já pausa timer no hover — adicionar:
  - Enter: `translateY(100%)→0` com spring
  - Drag vertical: `translateY` segue pointer; dismiss se > threshold ou velocity
  - Fuse: barra inferior com `width` = tempo restante (hoje `showProgress` é linear no topo — unificar)
  - `inline` mode: posição `absolute` no container pai
- `@vueuse/gesture` ou pointer events nativos

---

#### Warm Tooltip 🟢
**Fonte:** [warm-tooltip](https://reactbits.dev/c/micro/warm-tooltip)

**O que faz:** Grupo de tooltips com delay compartilhado; primeiro espera, irmãos abrem instantâneo enquanto "warm"; lean opcional por velocity.

**Destino UiNova:** `VTooltip` (`src/components/feedback/VTooltip/`)

**Comportamento proposto:**
- Composable `useWarmTooltipGroup()` com estado global do grupo
- Primeiro tooltip: delay 400ms (configurável)
- Enquanto grupo "warm" (mouse na toolbar): delay 0 nos irmãos
- Cooldown ao sair do grupo
- Ideal para `VToolbar`, `VMenuBar`, `VTopBar`

---

#### Status Mark 🟡
**Fonte:** [status-mark](https://reactbits.dev/c/micro/status-mark)

**O que faz:** Glyph 20px para tasks: idle (anel tracejado) → spinner/progress arc → check/cross; label strike opcional.

**Destino UiNova:** `VProgress` (circular), `VSpinner`, `VBadge`, `VStepper`

**Comportamento proposto:**
- Novo primitive `VStatusMark` em `feedback/` ou `primitives/`
- Estados: `idle | running | progress | success | error`
- SVG morph entre formas (mesmo viewBox)
- Usar em listas de tarefas, steppers, uploads

---

#### Lattice Loader 🟢
**Fonte:** [lattice-loader](https://reactbits.dev/c/micro/lattice-loader)

**O que faz:** Grid 3×3 ou 4×4 com onda de brilho phase-offset; verbo + cronômetro; resolve em check/cross.

**Destino UiNova:** `VSpinner` — variante `lattice`; `VEmptyState` loading; futuros fluxos AI

**Comportamento proposto:**
- `@keyframes` com `animation-delay` por célula (portável sem motion lib)
- Slot para verbo ("Thinking…", "Searching…")
- Timer live ao lado
- Estado final: morph para ✓ ou ✗

---

#### Call Chip 🟡
**Fonte:** [call-chip](https://reactbits.dev/c/micro/call-chip)

**O que faz:** Chip de tool-call AI; fill wipe + contador ms; sucesso = verde; erro = shake vermelho + retry.

**Destino UiNova:** `VBadge` + novo `VAgentChip` (se produto tiver AI)

**Comportamento proposto:**
- Chip inline com `status: pending | success | error`
- Fill `scaleX` durante execução
- `duration` em ms ao vivo
- Erro: `animation: shake` + ícone retry

---

### 4.4 Navegação e contenção

#### Branched Menu 🟡
**Fonte:** [branched-menu](https://reactbits.dev/c/micro/branched-menu)

**O que faz:** Menu colapsável com trunk + branches curvas; linha accent viaja até item selecionado; marker no section aberto.

**Destino UiNova:** `VTreeNavigation`, `VSidebar`, `VAccordion`

**Comportamento proposto:**
- SVG path animado (`stroke-dashoffset`) conectando parent→child
- Section aberta: marker desliza verticalmente
- Accent line: `motion path` ou CSS `offset-path`
- Visual forte; implementação média-alta

---

#### Folder Float 🟠
**Fonte:** [folder-float](https://reactbits.dev/c/micro/folder-float)

**O que faz:** Pasta abre no hover; flap inclina; notas flutuam em nuvem para seleção; fecham com spring.

**Destino UiNova:** `VDropdownMenu`, `VContextMenu`, picker de arquivos

**Comportamento proposto:** Usa `matter-js` no original. Em Vue: versão simplificada só com CSS springs (sem física real). Nicho para file pickers.

---

#### Flip Card 🟡
**Fonte:** [flip-card](https://reactbits.dev/c/micro/flip-card)

**O que faz:** Card 3D duas faces; flip por click/drag/flick com velocity; tilt no cursor; sheen + sombra dinâmica.

**Destino UiNova:** `VCard` — variante `flippable`

**Comportamento proposto:**
- `perspective` + `rotateY` no container
- Drag horizontal: rotação proporcional; release com velocity → snap 0° ou 180°
- Face A/B via slots `front` / `back`
- Tilt: `rotateX/Y` leve seguindo pointer (opcional, `tilt={boolean}`)

---

#### Swipe Row 🟡
**Fonte:** [swipe-row](https://reactbits.dev/c/micro/swipe-row)

**O que faz:** List row com ações ocultas; snap por velocity; delete em swipe completo com cor esticada.

**Destino UiNova:** `VTable` rows, `VNotificationItem`, listas em `VCommandPalette`

**Comportamento proposto:**
- Wrapper `VSwipeRow` em `navigation/` ou mixin no table
- Swipe left: revela ações (edit, delete)
- Swipe total: delete com background que preenche a row
- Mobile-first; desktop mantém botões visíveis

---

#### Bell Toggle 🟡
**Fonte:** [bell-toggle](https://reactbits.dev/c/micro/bell-toggle)

**O que faz:** Pill toggle; sino toca em keyframes; label blur-crossfade; pill expande via clip-path em spring.

**Destino UiNova:** `VSwitch` ou `VButton` em `VTopBar` / `VNotificationCenter`

**Comportamento proposto:**
- Toggle de notificações na top bar
- Ícone bell: `@keyframes ring` (rotate ±15°)
- Pill width animada com `clip-path` ou `max-width` spring
- Label curta → longa ("On" → "Notifications on")

---

### 4.5 AI / Chat (condicional ao produto)

> Implementar **somente** se o UiNova for usado em produtos com chat, agentes ou geração de mídia.

#### Prompt Bar 🟡
**Fonte:** [prompt-bar](https://reactbits.dev/c/micro/prompt-bar)

**O que faz:** Composer de chat com @ sources, / commands, model picker, dictação, anexos; send tile carrega e morph arrow→stop.

**Destino UiNova:** Novo `VPromptBar` em `form/` ou `navigation/`

**Comportamento:** Composer completo; alto esforço; depende de `VCommandPalette`, `VTagInput`, `VFileUpload`.

---

#### Thought Line 🟡
**Fonte:** [thought-line](https://reactbits.dev/c/micro/thought-line)

**O que faz:** Header de reasoning trace; glyph + label respiram; steps aparecem; colapsa em "Thought for 4.2s".

**Destino UiNova:** Novo em `feedback/` para UIs de agente

---

#### Refine Frame 🟡
**Fonte:** [refine-frame](https://reactbits.dev/c/micro/refine-frame)

**O que faz:** Frame com aspect ratio fixo para mídia AI; estágios queued→generating→refining→complete sem layout shift; band sweep; chip de estágio.

**Destino UiNova:** `VCard` + `VSkeleton` + `VProgress` combinados; ou `VImageGallery`

---

#### Voice Pill 🟡
**Fonte:** [voice-pill](https://reactbits.dev/c/micro/voice-pill)

**O que faz:** Mic que expande em capsule com equalizer + relógio; relaxa ao soltar.

**Destino UiNova:** `VSearchField` ou `VPromptBar` — botão de dictação

---

#### Slosh Gauge 🟠
**Fonte:** [slosh-gauge](https://reactbits.dev/c/micro/slosh-gauge)

**O que faz:** Tanque com líquido que persegue valor com massa, inclina com velocidade, splash no topo.

**Destino UiNova:** `VProgress` — variante decorativa

**Comportamento:** Canvas/SVG com simulação; bonito mas nicho para dashboards criativos.

---

### 4.6 Experiências lúdicas / alto custo

#### Shredder 🔴
**Fonte:** [shredder](https://reactbits.dev/c/micro/shredder)

**O que faz:** Lista com shredder no fundo; drag row → cortada em tiras que caem; lista recompõe com spring.

**Destino UiNova:** Demo/onboarding apenas — não como primitivo de DS

**Motivo:** Física de papel + strips é custosa; delete normal (`VSwipeRow`) cobre o caso de uso.

---

#### Paper Crumple 🔴
**Fonte:** [paper-crumple](https://reactbits.dev/c/micro/paper-crumple)

**O que faz:** Imagem 3D que amassa, segue drag, solta como bola ou desdobra.

**Destino UiNova:** Não portar (Three.js, ~35KB só o componente)

---

#### Tear Ticket 🔴
**Fonte:** [tear-ticket](https://reactbits.dev/c/micro/tear-ticket)

**O que faz:** Ticket com perfuração; stub arranca com fibras; parallax 3D.

**Destino UiNova:** Marketing/landing pages, não DS

---

#### Dodge Field 🟠
**Fonte:** [dodge-field](https://reactbits.dev/c/micro/dodge-field)

**O que faz:** Wrapper que faz filho fugir do pointer; após N tentativas, desiste e volta.

**Destino UiNova:** Easter egg em `VEmptyState` ou onboarding

---

## 5. Matriz de priorização

### Fase 1 — Quick wins (CSS + tokens, 2–4 semanas)

| Micro | Componente UiNova | Esforço | Impacto |
|-------|-------------------|---------|---------|
| Spring Check | `VCheckbox` | Médio | Alto |
| Fuse Button | `VButton` | Baixo | Alto |
| Warm Tooltip | `VTooltip` | Baixo | Médio |
| Lattice Loader | `VSpinner` | Baixo | Médio |
| Pulse Heart | `VButton` | Baixo | Médio |
| Scrub Field | `VNumberInput` | Médio | Médio |

### Fase 2 — Gestos + spring (requer lib motion, 4–8 semanas)

| Micro | Componente UiNova | Esforço | Impacto |
|-------|-------------------|---------|---------|
| Squish Switch | `VSwitch` | Alto | Alto |
| Rubber Segment | `VSegmentedControl` | Alto | Alto |
| Swipe Toast | `VToast` | Médio | Alto |
| Glide Select | `VSelect` | Médio | Alto |
| Code Slots | `VOtpInput` | Médio | Médio |
| Hold Button | `VButton` | Médio | Médio |
| Swipe Row | `VTable` / lists | Alto | Alto |
| Jelly Radio | `VRadioGroup` | Médio | Médio |
| Wake Slider | `VSlider` | Médio | Médio |
| Flip Card | `VCard` | Médio | Médio |
| Status Mark | novo primitive | Médio | Médio |
| Slide Commit | `VConfirmDialog` | Alto | Médio |

### Fase 3 — AI / produto-específico

| Micro | Componente UiNova |
|-------|-------------------|
| Prompt Bar | `VPromptBar` (novo) |
| Thought Line | `VThoughtLine` (novo) |
| Call Chip | `VAgentChip` (novo) |
| Refine Frame | composição em `VCard` |
| Voice Pill | dictação em `VPromptBar` |
| Bell Toggle | `VNotificationCenter` |

### Não priorizar para o DS

Shredder, Paper Crumple, Tear Ticket, Dodge Field, Sling Button, Comet Dial, Slosh Gauge, Folder Float (versão Matter.js)

---

## 6. Arquitetura de implementação recomendada

### 6.1 Camada de motion compartilhada

```
src/
├── composables/
│   ├── useSpring.ts          # wrapper sobre @vueuse/motion ou CSS spring
│   ├── usePointerDrag.ts     # drag + velocity + threshold
│   ├── useWarmTooltipGroup.ts
│   └── useReducedMotion.ts   # espelha prefers-reduced-motion (reforço local)
├── motion/
│   ├── springs.ts            # presets: snappy, bouncy, critical
│   └── gestures.ts           # flick, scrub, swipe-dismiss
└── tokens/_tokens.scss       # novos tokens (ver abaixo)
```

### 6.2 Novos tokens propostos

```scss
// Adicionar em _tokens.scss
$v-motion-spring-duration: 200ms;
$v-motion-spring-bounce: 0.2;
$v-gesture-swipe-threshold: 80px;
$v-gesture-flick-velocity: 0.5;
$v-tooltip-warm-delay: 400ms;
$v-tooltip-warm-cooldown: 300ms;
```

### 6.3 Padrão de API nos componentes

Todos os componentes existentes ganham prop opcional:

```ts
motion?: 'default' | 'expressive' | 'none'
// default = comportamento atual
// expressive = microinteração React Bits equivalente
// none = sem animação (além de reduced-motion)
```

Isso evita breaking changes e permite adopção gradual via Storybook.

### 6.4 Storybook

Criar story group `motion/` com lado a lado:
- `default` vs `expressive` para cada componente tocado
- Controles para `bounce`, `strikeLag`, `stretch`, etc. (como no React Bits)
- Toggle `prefers-reduced-motion` no toolbar

---

## 7. Mapeamento visual — componente React Bits → UiNova

```
FORM                          FEEDBACK                    NAVIGATION
─────────────────────────────────────────────────────────────────────
Spring Check ──► VCheckbox    Swipe Toast ──► VToast      Rubber Segment ──► VSegmentedControl
Squish Switch ─► VSwitch      Warm Tooltip ─► VTooltip     Glide Select ────► VSelect
Jelly Radio ───► VRadioGroup  Lattice Loader ► VSpinner    Branched Menu ───► VTreeNavigation
Code Slots ────► VOtpInput    Status Mark ───► VProgress*  Swipe Row ───────► VTable
Scrub Field ───► VNumberInput Pulse Heart ───► VButton     Bell Toggle ─────► VTopBar
Wake Slider ───► VSlider      Slide Commit ──► VConfirm*   Flip Card ───────► VCard
Peek Rating ───► VRating*     Call Chip ─────► VBadge*     Folder Float ────► VDropdown*
Comet Dial ────► VDial*       Fuse Button ───► VButton
Hold Button ───► VButton      Shredder ──────► (skip)

AI (se aplicável)               LÚDICO (skip/baixa)
─────────────────               ───────────────────
Prompt Bar ──► VPromptBar*      Paper Crumple ──► skip
Thought Line ► VThoughtLine*    Tear Ticket ────► skip
Refine Frame ► VCard            Dodge Field ────► skip
Voice Pill ──► VPromptBar       Sling Button ───► skip
Slosh Gauge ─► VProgress        Comet Dial ─────► VDial*
```

`*` = componente novo ou composição a criar

---

## 8. Considerações de acessibilidade

Todas as portas devem respeitar o que o React Bits já faz + o que o UiNova já tem:

1. **`prefers-reduced-motion`:** toggles instantâneos; sem drag obrigatório
2. **Alternativa por teclado:** todo gesto de drag precisa de equivalente (Space, arrows, Enter)
3. **Não depender só de animação** para comunicar estado (aria-live, aria-checked, etc.)
4. **Hold-to-confirm:** anunciar progresso via `aria-valuenow` em barra de hold
5. **Swipe dismiss:** manter botão close visível como fallback

---

## 9. Decisão sobre dependência de motion

| Opção | Prós | Contras |
|-------|------|---------|
| **Só CSS** (`--v-ease-spring`) | Zero deps, leve | Sem velocity, drag limitado |
| **`@vueuse/motion`** | Vue-native, spring | +15KB, curva de aprendizado |
| **Portar lógica do `motion/react`** | Fidelidade máxima | Manutenção manual |

**Recomendação:** Fase 1 com CSS; avaliar `@vueuse/motion` antes da Fase 2. Não adicionar `three` ou `matter-js` ao kit.

---

## 10. Status de implementação (22/09/2026)

As três fases foram implementadas no código:

- **Infra:** `src/motion/`, `src/composables/` (spring, drag, warm tooltip), tokens em `_tokens.scss`
- **API:** `motion?: 'default' | 'expressive' | 'none'` nos componentes tocados
- **Fase 1:** `VCheckbox`, `VButton`, `VTooltip`, `VSpinner`, `VNumberInput`
- **Fase 2:** `VSwitch`, `VSegmentedControl`, `VToast`, `VSelect`, `VOtpInput`, `VRadioGroup`, `VSlider`, `VCard`, `VConfirmDialog`, `VStatusMark`, `VSwipeRow`
- **Fase 3:** `VAgentChip`, `VThoughtLine`, `VPromptBar`, `VCard` (refineFrame), `VNotificationCenter` (BellToggle)
- **Storybook:** `motion/Expressive` em `src/components/motion/MotionMicro.stories.ts`

### Uso rápido

```vue
<VCheckbox motion="expressive" label="Ship the build" />
<VButton motion="expressive" micro-interaction="fuse" :undo-window="5000">Enviar</VButton>
<VTooltip motion="expressive" warm-group="toolbar" content="Bold"><button>B</button></VTooltip>
<VSpinner variant="lattice" verb="Thinking" />
<VNumberInput motion="expressive" interaction="scrub" v-model="opacity" />
```

## 11. Próximos passos sugeridos

1. Validar visualmente no Storybook (`motion/Expressive`)
2. Documentar tokens de gesture em `DESIGN-SPEC.md` dos componentes tocados
3. Adicionar testes e2e para gestos críticos (swipe toast, slide commit)

---

## Referências

- [React Bits — Micro (catálogo)](https://reactbits.dev/c/micro)
- [Repositório fonte — `src/constants/Information.js`](https://github.com/DavidHDev/react-bits/blob/main/src/constants/Information.js)
- [Vue Bits](https://vue-bits.dev) — port Vue do mesmo autor (referência de port, não dependência)
- Tokens UiNova: `src/tokens/_tokens.scss`
- Skill de ícones: `.cursor/skills/vueui-icons-composition/SKILL.md`
