<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listTokens } from '../../tokens/live'
import { TOKEN_CATEGORIES, getTokenCategory, isColorToken } from '../Tokens/tokenCategories'

interface TokenRow {
  name: string
  value: string
  category: string
}

const props = withDefaults(
  defineProps<{
    prefix?: string | string[]
    placeholder?: string
    showCategoryFilter?: boolean
  }>(),
  {
    placeholder: 'Buscar token por nome ou valor…',
    showCategoryFilter: false,
  },
)

const query = ref('')
const categoryFilter = ref('all')
const tokens = ref<TokenRow[]>([])
const copied = ref<string | null>(null)

const prefixList = computed(() => {
  if (!props.prefix) return null
  return Array.isArray(props.prefix) ? props.prefix : [props.prefix]
})

function matchesPrefix(name: string): boolean {
  if (!prefixList.value) return true
  return prefixList.value.some((p) => name.startsWith(p))
}

onMounted(() => {
  tokens.value = listTokens()
    .filter(({ name }) => matchesPrefix(name))
    .map(({ name, value }) => ({
      name,
      value,
      category: getTokenCategory(name),
    }))
})

const categories = computed(() => {
  const counts = new Map<string, number>()
  for (const t of tokens.value) counts.set(t.category, (counts.get(t.category) ?? 0) + 1)
  return TOKEN_CATEGORIES.map((c) => ({
    id: c.label,
    label: c.label,
    count: counts.get(c.label) ?? 0,
  })).filter((c) => c.count > 0)
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return tokens.value.filter((t) => {
    if (props.showCategoryFilter && categoryFilter.value !== 'all' && t.category !== categoryFilter.value) {
      return false
    }
    if (!q) return true
    return t.name.toLowerCase().includes(q) || t.value.toLowerCase().includes(q)
  })
})

const grouped = computed(() => {
  if (prefixList.value) {
    return [{ category: 'Tokens', rows: filtered.value }]
  }
  const map = new Map<string, TokenRow[]>()
  for (const row of filtered.value) {
    const list = map.get(row.category) ?? []
    list.push(row)
    map.set(row.category, list)
  }
  const order = TOKEN_CATEGORIES.map((c) => c.label)
  return [...map.entries()]
    .sort(([a], [b]) => {
      const ai = order.indexOf(a)
      const bi = order.indexOf(b)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
    .map(([category, rows]) => ({ category, rows }))
})

async function copyToken(name: string) {
  try {
    await navigator.clipboard.writeText(name)
    copied.value = name
    window.setTimeout(() => {
      if (copied.value === name) copied.value = null
    }, 1200)
  } catch {
    copied.value = null
  }
}
</script>

<template>
  <div class="token-catalog" data-test-id="token-catalog">
    <div class="token-catalog__toolbar">
      <label class="token-catalog__search-wrap">
        <span class="token-catalog__search-label">Buscar</span>
        <input
          v-model="query"
          class="token-catalog__search"
          type="search"
          :placeholder="placeholder"
          autocomplete="off"
          spellcheck="false"
          data-test-id="token-catalog-search"
        />
      </label>
      <label v-if="showCategoryFilter" class="token-catalog__filter-wrap">
        <span class="token-catalog__search-label">Categoria</span>
        <select v-model="categoryFilter" class="token-catalog__filter" data-test-id="token-catalog-filter">
          <option value="all">Todas ({{ tokens.length }})</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.label">
            {{ cat.label }} ({{ cat.count }})
          </option>
        </select>
      </label>
      <p class="token-catalog__meta">
        {{ filtered.length }} de {{ tokens.length }} tokens
      </p>
    </div>

    <p v-if="filtered.length === 0" class="token-catalog__empty">
      Nenhum token encontrado para “{{ query }}”.
    </p>

    <section v-for="group in grouped" :key="group.category" class="token-catalog__group">
      <h3 v-if="!prefixList || grouped.length > 1" class="token-catalog__group-title">
        {{ group.category }}
        <span class="token-catalog__group-count">{{ group.rows.length }}</span>
      </h3>
      <div class="token-catalog__table-wrap">
        <table class="token-catalog__table">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Valor computado</th>
              <th scope="col">Amostra</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in group.rows" :key="row.name">
              <td class="token-catalog__name">
                <button
                  type="button"
                  class="token-catalog__copy"
                  :title="copied === row.name ? 'Copiado!' : 'Copiar token'"
                  @click="copyToken(row.name)"
                >
                  <code>{{ row.name }}</code>
                </button>
              </td>
              <td class="token-catalog__value">
                <code>{{ row.value || '—' }}</code>
              </td>
              <td class="token-catalog__sample">
                <span
                  v-if="isColorToken(row.name, row.value)"
                  class="token-catalog__swatch"
                  :style="{ background: row.value }"
                  :title="row.value"
                />
                <span
                  v-else-if="row.name.includes('radius') || row.name.startsWith('--v-radius-')"
                  class="token-catalog__radius-demo"
                  :style="{ borderRadius: row.value }"
                />
                <span
                  v-else-if="row.name.startsWith('--v-space-')"
                  class="token-catalog__space-demo"
                  :style="{ width: row.value, height: 'var(--v-space-2)' }"
                />
                <span
                  v-else-if="row.name.startsWith('--v-border-') || row.name.startsWith('--v-focus-ring')"
                  class="token-catalog__border-demo"
                  :style="{ borderWidth: row.value }"
                />
                <span
                  v-else-if="row.name.startsWith('--v-shadow-')"
                  class="token-catalog__shadow-demo"
                  :style="{ boxShadow: row.value }"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.token-catalog {
  font-family: var(--v-font-family-sans);
  color: var(--v-color-text);

  &__toolbar {
    display: grid;
    gap: var(--v-space-3);
    margin-bottom: var(--v-space-6);

    @media (min-width: 768px) {
      grid-template-columns: 1fr minmax(12rem, 16rem) auto;
      align-items: end;
    }
  }

  &__search-label {
    display: block;
    margin-bottom: var(--v-space-1);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    color: var(--v-color-text-muted);
  }

  &__search,
  &__filter {
    box-sizing: border-box;
    width: 100%;
    min-height: var(--v-field-height-sm);
    padding: var(--v-space-2) var(--v-space-3);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
    background: var(--v-color-surface);
    color: var(--v-color-text);
    font: inherit;
    font-size: var(--v-font-size-text-small);

    &:focus-visible {
      outline: var(--v-focus-ring-width) solid var(--v-color-focus);
      outline-offset: var(--v-focus-ring-offset);
    }
  }

  &__meta {
    margin: 0;
    font-size: var(--v-font-size-text-small);
    color: var(--v-color-text-muted);
    white-space: nowrap;
  }

  &__empty {
    padding: var(--v-space-6);
    border: var(--v-border-width) dashed var(--v-color-border);
    border-radius: var(--v-radius-md);
    color: var(--v-color-text-muted);
    text-align: center;
  }

  &__group {
    margin-bottom: var(--v-space-8);
  }

  &__group-title {
    display: flex;
    align-items: center;
    gap: var(--v-space-2);
    margin: 0 0 var(--v-space-3);
    font-size: var(--v-font-size-text-medium);
    font-weight: var(--v-font-weight-semibold);
  }

  &__group-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--v-space-6);
    height: var(--v-space-6);
    padding: 0 var(--v-space-2);
    border-radius: var(--v-radius-pill);
    background: var(--v-color-neutral-100);
    color: var(--v-color-text-muted);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
  }

  &__table-wrap {
    overflow: auto;
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--v-font-size-text-small);

    th,
    td {
      padding: var(--v-space-2) var(--v-space-3);
      border-bottom: var(--v-border-width) solid var(--v-color-border);
      text-align: left;
      vertical-align: middle;
    }

    th {
      position: sticky;
      top: 0;
      background: var(--v-color-neutral-50);
      font-weight: var(--v-font-weight-semibold);
      color: var(--v-color-text-muted);
    }

    tr:last-child td {
      border-bottom: 0;
    }
  }

  &__copy {
    display: inline;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-align: left;

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8125rem;
    }

    &:hover code {
      color: var(--v-color-primary-text);
    }

    &:focus-visible {
      outline: var(--v-focus-ring-width) solid var(--v-color-focus);
      outline-offset: var(--v-focus-ring-offset);
      border-radius: var(--v-radius-4);
    }
  }

  &__value code {
    word-break: break-all;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.8125rem;
    color: var(--v-color-text-muted);
  }

  &__swatch {
    display: inline-block;
    width: var(--v-space-6);
    height: var(--v-space-6);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-4);
  }

  &__radius-demo {
    display: inline-block;
    width: var(--v-space-8);
    height: var(--v-space-4);
    background: var(--v-color-primary-100);
    border: var(--v-border-width) solid var(--v-color-primary-300);
  }

  &__space-demo {
    display: inline-block;
    max-width: 100%;
    background: var(--v-color-primary);
    border-radius: var(--v-radius-4);
  }

  &__border-demo {
    display: inline-block;
    width: var(--v-space-8);
    height: var(--v-space-4);
    border-style: solid;
    border-color: var(--v-color-border);
    border-radius: var(--v-radius-4);
  }

  &__shadow-demo {
    display: inline-block;
    width: var(--v-space-8);
    height: var(--v-space-6);
    background: var(--v-color-surface);
    border-radius: var(--v-radius-4);
  }
}
</style>
