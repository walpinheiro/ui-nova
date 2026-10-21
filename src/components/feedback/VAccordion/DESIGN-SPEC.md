# VAccordion — DESIGN-SPEC

Status: ✅ Concluído e validado  
Data: 2026-09-20  
Fonte visual: `doc/Ui/VAccordion.png`

## Objetivo

Accordion para progressive disclosure em FAQs, painéis de definições e conteúdos que precisam de uma hierarquia compacta. A implementação é composta por `VAccordion` e `VAccordionItem`.

## API

`VAccordion` aceita:

- `modelValue`: `string | number | Array<string | number> | null`; valor aberto em modo simples ou lista em `multiple`.
- `multiple`: permite manter várias secções abertas; `false` por defeito.
- `variant`: `default`, `divided`, `bordered` ou `leading-icon`.
- `size`: `sm`, `md` (default) ou `lg`.
- `disabled`, `loading` e `ariaLabel`.

`VAccordionItem` aceita `id`, `value`, `title`, `disabled`, `loading` e `ariaLabel`. O slot default é o corpo; `title` substitui o texto do título e `icon` fornece o visual leading na variante `leading-icon`.

Eventos:

- `update:modelValue` — emite o valor normalizado após uma alternância.
- `open-change` — emite o mesmo valor para consumo semântico do estado aberto.

## Anatomia

Cada item contém:

1. Trigger nativo `<button>` de largura total, com indicador esquerdo ou ícone leading.
2. Título do item.
3. Indicador chevron à direita.
4. Região de conteúdo expandível, ligada por `aria-controls`/`aria-labelledby`.

O painel usa grid rows (`0fr → 1fr`) para empurrar os itens seguintes, sem overlay. Conteúdo arbitrário, incluindo ações, permanece no slot e não colapsa o item ao ser clicado.

## Variantes e tamanhos

| Variante | Tratamento visual |
|---|---|
| `default` | Cartões empilhados com borda, raio e fundo de superfície. |
| `divided` | Contentor único com divisórias horizontais. |
| `bordered` | Cada secção com caixa e borda própria. |
| `leading-icon` | Ícone opcional à esquerda e chevron apenas como indicador à direita. |

`sm`, `md` e `lg` alteram padding, tipografia e densidade sem introduzir valores visuais fora dos tokens existentes.

## Estados

- Default/collapsed: superfície branca e chevrons apontados para a direita.
- Hover: fundo neutro suave no trigger.
- Focus-visible: anel de foco visível com `--v-focus-ring-width`, `--v-color-focus` e `--v-focus-ring-offset`.
- Pressed: feedback de fundo mais forte no `:active`.
- Expanded: fundo `--v-color-primary-50`, chevron esquerdo para baixo e indicador direito para cima.
- Disabled: trigger nativo desabilitado, sem foco de teclado, com `--v-state-disabled-opacity`.
- Loading: `aria-busy="true"` e skeleton no painel aberto; o trigger continua disponível para alternar.

## Movimento

| Interação | Propriedade | Token |
|---|---|---|
| Hover/pressed | `background`, `color` | `--v-motion-fast`, `--v-ease-out` |
| Expand/collapse | `grid-template-rows`, `opacity` | `--v-motion-normal`, `--v-ease-out` |
| Chevron | `transform` | `--v-motion-fast`, `--v-ease-standard` |

`prefers-reduced-motion: reduce` neutraliza as transições do item, trigger, chevrons e painel.

## Acessibilidade e teclado

Triggers nativos expõem `aria-expanded`, `aria-controls` e `aria-disabled`; painéis expõem `role="region"`, `aria-labelledby` e `aria-hidden`. `Enter`/`Space` usam a ativação nativa do botão. `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home` e `End` movem o foco entre triggers habilitados.

IDs estáveis de teste incluem `v-accordion`, `accordion-item-{id}`, `accordion-trigger-{id}`, `accordion-panel-{id}`, `accordion-title`, `accordion-indicator`, `accordion-leading-icon` e `accordion-skeleton`.

## Tokens

Não foi criado token compartilhado novo. A implementação usa os tokens já disponíveis: cores de superfície, texto, neutros e primary; `--v-space-*`; `--v-radius-*`; `--v-border-width*`; `--v-shadow-sm`; `--v-font-*`; `--v-motion-*`; `--v-ease-*`; e estados de disabled/pressed. Os nomes `--v--accordion-*` do poster são representados pelo token semântico existente mais próximo, respeitando a restrição de não editar `src/tokens`.

## Validação

- `pnpm exec vitest run src/components/feedback/VAccordion/_tests/VAccordion.spec.ts --reporter=dot` — 11 testes aprovados.
- `pnpm exec playwright test src/components/feedback/VAccordion/_tests/VAccordion.e2e.spec.ts --reporter=line` — 5 testes aprovados em Chromium.
- `pnpm exec vue-tsc --noEmit --pretty false` — sem diagnósticos em `VAccordion`; o comando global ainda reporta diagnósticos preexistentes em outros componentes.
- `pnpm exec vite build` — build de produção aprovado.
- Validação visual: screenshot Chromium do componente renderizado a 760×420 comparado a `doc/Ui/VAccordion.png`; verificados cartões empilhados, indicadores duplos, superfície expandida em indigo suave, tipografia/densidade, bordas/raios, foco/teclado e comportamento de expansão. O Storybook não pôde ser iniciado porque o repositório não contém `.storybook/main.js`; a validação visual foi feita com o bundle construído e a suíte Playwright.
