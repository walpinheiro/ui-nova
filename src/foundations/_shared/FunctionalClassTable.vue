<script setup lang="ts">
import { ref } from 'vue'
import type { FunctionalClassRow } from './functionalClasses'

defineProps<{
  title?: string
  rows: FunctionalClassRow[]
  showPreview?: boolean
}>()

const copied = ref<string | null>(null)

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = text
    window.setTimeout(() => {
      if (copied.value === text) copied.value = null
    }, 1200)
  } catch {
    copied.value = null
  }
}
</script>

<template>
  <div class="fn-class-table">
    <h3 v-if="title" class="fn-class-table__title">{{ title }}</h3>
    <div class="fn-class-table__wrap">
      <table class="fn-class-table__table">
        <thead>
          <tr>
            <th scope="col">Classe / uso</th>
            <th scope="col">Propriedade</th>
            <th scope="col">Token CSS</th>
            <th v-if="showPreview" scope="col">Preview</th>
            <th scope="col">Notas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.className + row.token">
            <td>
              <button type="button" class="fn-class-table__copy" @click="copy(row.className)">
                <code>{{ row.className }}</code>
              </button>
            </td>
            <td>{{ row.property }}</td>
            <td><code>{{ row.token }}</code></td>
            <td v-if="showPreview">
              <span
                v-if="row.property === 'border-radius' && row.className.startsWith('rounded-')"
                class="fn-class-table__box"
                :class="row.className"
              />
              <span
                v-else-if="row.property === 'border-width' || row.property === 'border-color'"
                class="fn-class-table__box border border-border"
                :class="row.className.includes('focus') ? 'border-focus' : ''"
              />
              <span
                v-else-if="row.property === 'background'"
                class="fn-class-table__swatch"
                :class="row.className"
              />
            </td>
            <td class="fn-class-table__notes">{{ row.notes ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="copied" class="fn-class-table__toast">Copiado: {{ copied }}</p>
  </div>
</template>

<style scoped lang="scss">
.fn-class-table {
  font-family: var(--v-font-family-sans);
  color: var(--v-color-text);

  &__title {
    margin: 0 0 var(--v-space-3);
    font-size: var(--v-font-size-text-medium);
    font-weight: var(--v-font-weight-semibold);
  }

  &__wrap {
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
      background: var(--v-color-neutral-50);
      color: var(--v-color-text-muted);
      font-weight: var(--v-font-weight-semibold);
    }

    tr:last-child td {
      border-bottom: 0;
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8125rem;
    }
  }

  &__copy {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;

    &:hover code {
      color: var(--v-color-primary-text);
    }

    &:focus-visible {
      outline: var(--v-focus-ring-width) solid var(--v-color-focus);
      outline-offset: var(--v-focus-ring-offset);
      border-radius: var(--v-radius-4);
    }
  }

  &__notes {
    color: var(--v-color-text-muted);
    max-width: 16rem;
  }

  &__box {
    display: inline-block;
    width: var(--v-space-8);
    height: var(--v-space-4);
    background: var(--v-color-primary-100);
    border-color: var(--v-color-primary-300);
  }

  &__swatch {
    display: inline-block;
    width: var(--v-space-6);
    height: var(--v-space-6);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-4);
  }

  &__pad {
    display: inline-block;
    border: var(--v-border-width) dashed var(--v-color-primary-300);
    border-radius: var(--v-radius-4);
  }

  &__toast {
    margin: var(--v-space-2) 0 0;
    font-size: var(--v-font-size-caption);
    color: var(--v-color-success-strong);
  }
}
</style>
