<script setup lang="ts">
import type { TemplateDocument } from './sampleContent'

defineProps<{
  document: TemplateDocument
}>()
</script>

<template>
  <article class="reader-article">
    <header class="reader-article__header">
      <h1 class="reader-article__title">{{ document.title }}</h1>
      <p class="reader-article__summary">{{ document.summary }}</p>
    </header>
    <div class="reader-article__body">
      <p v-for="(paragraph, index) in document.body" :key="index">
        {{ paragraph }}
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.reader-article {
  max-width: 42rem;
  padding: var(--v-space-6);
  color: var(--v-color-text);

  &__header {
    display: grid;
    gap: var(--v-space-2);
    margin-bottom: var(--v-space-6);
    padding-bottom: var(--v-space-4);
    border-bottom: var(--v-border-width) solid var(--v-color-border);
  }

  &__title {
    margin: 0;
    font-size: var(--v-font-size-h2);
    line-height: var(--v-line-height-h2);
    font-weight: var(--v-font-weight-bold);
  }

  &__summary {
    margin: 0;
    font-size: var(--v-font-size-text-large);
    line-height: var(--v-line-height-text-large);
    color: var(--v-color-text-muted);
  }

  &__body {
    display: grid;
    gap: var(--v-space-4);
    font-size: var(--v-font-size-text-medium);
    line-height: var(--v-line-height-text-medium);
  }
}
</style>
