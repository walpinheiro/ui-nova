# VueUI Nova Component Kit

Biblioteca de componentes Vue 3 (**vueui-nova-kit**) com tokens, Storybook, testes e mais de **100 componentes** organizados por categoria.

## Desenvolvimento

```bash
git clone https://github.com/walpinheiro/ui-nova.git
cd ui-nova
pnpm install
pnpm storybook
```

> Observação: este pacote entrega a arquitetura, documentação, testes e implementações-base funcionais para todos os componentes. Componentes complexos (DatePicker, Tree, Table, overlays, grids etc.) estão deliberadamente em formato de foundation/scaffold e devem receber comportamento de domínio específico antes de publicação.

## Estrutura
- `DESIGN.md` · `COMPONENTS.md` — visão de design e inventário de componentes.
- `src/components/*` — componente por pasta.
- Cada pasta contém `.vue`, `.scss`, `use*`, `mount*`, types, Storybook MDX/stories e `_tests`.
- `src/tokens/_tokens.scss` — fonte única dos tokens (emite `:root --v-*` para live editing).

## Qualidade
`pnpm test` · `pnpm test:e2e` · `pnpm typecheck` · `pnpm storybook`

## Temas (light/dark)

Os tokens `--v-*` têm valores light (padrão) e dark. Para ativar:

```html
<html data-theme="dark">   <!-- força dark -->
<html data-theme="system"> <!-- segue prefers-color-scheme -->
```

Para tematizar apenas uma subárvore, use `.v-theme-dark` / `.v-theme-light` no elemento raiz dela.

### `useTheme()`

```ts
import { useTheme } from '@/composables/useTheme' // src/composables/useTheme.ts

const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme({
  // target: elemento que recebe data-theme (default: <html>)
  // storageKey: 'v-theme' (false desativa a persistência)
  // default: 'system'
})

setTheme('dark')  // 'light' | 'dark' | 'system' — persiste em localStorage
toggleTheme()     // alterna com base em resolvedTheme
```

`theme` é a escolha do usuário (inclui `system`); `resolvedTheme` é o tema efetivo (`light` | `dark`).

### Tokens semânticos principais

`--v-color-bg`, `--v-color-surface`, `--v-color-text`, `--v-color-text-muted`, `--v-color-border`, `--v-color-border-strong`, `--v-color-primary-text`.

### Para autores de componentes

- Nunca use hex/rgb literais: sempre tokens `--v-*` (ou `color-mix()` sobre eles).
- Texto sobre fundo tintado (primary-50, badges, ícones em chips) usa `--v-color-primary-text`, nunca `--v-color-primary` / `primary-600`.
- A escala neutra inverte no dark: `neutral-900` em overlays/hover clareia no dark; prefira tokens semânticos (`surface`, `text`, `border`).
- Valide sempre os dois temas: `node scripts/shot.cjs --filter <story> --theme both`.

## Sidebar multi-nível

`VSidebar` aceita árvores de itens em qualquer profundidade:

- `items[].children` aninhados; `type: 'heading'` cria categorias dentro de submenus; `type: 'group'` cria seções colapsáveis (`collapsible`, `defaultOpen`).
- `accordion` (padrão `true`): abrir um item fecha os irmãos. `accordionGroups` (padrão `false`) estende isso entre grupos.
- `filterOnSearch` (padrão `true`): a busca filtra por label e expande os ancestrais dos resultados.
- `expandedSections`: ao controlar, liste **todos** os ids de grupos/itens abertos.
- Extras por item: `badge` + `badgeTone: 'primary'`, `tag`, `iconColor`, `disabled`, `href`/`to`.
- Slots: `header` (`{ collapsed, toggle }`), `before-nav`, `after-nav`, `footer`, `item-trailing` (`{ item }`).
- Teclado: ↑/↓ percorrem itens visíveis, → abre/entra, ← fecha/volta ao pai, Home/End, Enter/Space ativa. O ancestral do `activeItem` abre sozinho.
- Use `:show-footer="false"` para esconder o usuário demo e dê altura ao host para o `<nav>` rolar.

```vue
<VSidebar
  v-model:active-item="active"
  :items="[
    { type: 'group', value: 'g-main', label: 'Principal', children: [
      { value: 'home', label: 'Início', icon: 'home' },
      { value: 'reports', label: 'Relatórios', icon: 'chart', children: [
        { type: 'heading', value: 'h1', label: 'Financeiro' },
        { value: 'rev', label: 'Receita' },
        { value: 'cost', label: 'Custos' },
      ] },
    ] },
  ]"
  :expanded-sections="['g-main']"
  accordion
  :show-footer="false"
>
  <template #header="{ toggle }">…seletor de workspace…</template>
</VSidebar>
```

Referência completa: `src/components/navigation/VSidebar/VSidebar.types.ts` e `VSidebar.mdx`.

## Templates

Composições completas em Storybook (`pnpm storybook`, grupo "Templates"):

| Template | Story id |
|---|---|
| Insights Detail | `templates-insights-detail--default` |
| CareOps Schedule | `templates-careops-schedule--default` |
| Investment Dashboard | `templates-investment-dashboard--overview` |
| Sales Overview | `templates-sales-overview--dashboard` |
| Menu lateral multinível (acordeão) | `templates-menu-lateral--multinivel-acordeao` |

Código em `src/templates/*`. Gráficos locais em `src/templates/_charts` (LineChart, StepAreaChart) e o alternador de tema compartilhado em `src/templates/_shared/ThemeToggle.vue` (baseado em `useTheme`). Capturas: `node scripts/shot.cjs --filter "templates-" --theme both --full` (flags `--wait <ms>`, `--motion`).

## Documentação no Storybook

Cada exemplo deste README tem um canvas ao vivo:

| Exemplo do README | Onde ver no Storybook |
|---|---|
| Temas light/dark/system, `.v-theme-dark` | `Docs/Temas` (`docs-temas--docs`) |
| `useTheme()` | `Docs/Temas` → "useTheme() ao vivo" · `Docs/Composables` |
| Tokens semânticos / API de tokens | `Docs/Temas` → "Tokens semânticos", "API de tokens" · `Foundations/Tokens` |
| Sidebar multi-nível, acordeão, busca, grupos | `navigation/VSidebar` → `MultiLevel`, `Accordion`, `SearchFilter`, `CollapsibleGroups`, `ChevronStyles`, `CustomWidth`, `ItemTrailingSlot` |
| Templates | `Docs/Templates` e grupo `Templates` |
| Instalação e uso básico | `Docs/Introdução` |

Cobertura: `npm run docs:coverage -- http://localhost:6006` verifica que todo export público tem story e página de docs (gera `evidence/docs-coverage.json`).
