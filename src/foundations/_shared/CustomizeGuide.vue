<script setup lang="ts">
defineProps<{
  css: string
  title?: string
}>()
</script>

<template>
  <div class="customize-guide">
    <h4 v-if="title" class="customize-guide__title">{{ title }}</h4>
    <pre class="customize-guide__code"><code>{{ css }}</code></pre>
    <div class="customize-guide__preview">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.customize-guide {
  display: grid;
  gap: var(--v-space-4);

  &__title {
    margin: 0;
    font-size: var(--v-font-size-text-small);
    font-weight: var(--v-font-weight-semibold);
    color: var(--v-color-text-muted);
  }

  &__code {
    margin: 0;
    padding: var(--v-space-4);
    overflow: auto;
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
    background: var(--v-color-neutral-50);
    font-size: var(--v-font-size-text-small);
    line-height: 1.5;

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
  }

  &__preview {
    padding: var(--v-space-4);
    border: var(--v-border-width) dashed var(--v-color-border);
    border-radius: var(--v-radius-md);
    background: var(--v-color-surface);
  }
}
</style>
