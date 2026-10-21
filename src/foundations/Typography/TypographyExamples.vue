<template>
  <div class="type-examples">
    <p class="text-display-1 leading-display-1 font-semibold">Display 1</p>
    <p class="text-display-2 leading-display-2 font-semibold">Display 2</p>
    <p class="text-h1 leading-h1 font-bold">Heading 1</p>
    <p class="text-h2 leading-h2 font-bold">Heading 2</p>
    <p class="text-h3 leading-h3 font-semibold">Heading 3</p>
    <p class="text-text-large leading-text-large">Text large — parágrafo de destaque</p>
    <p class="text-text-medium leading-text-medium">Text medium — corpo padrão</p>
    <p class="text-text-small leading-text-small text-muted">Text small — secundário</p>
    <p class="text-caption leading-caption text-muted">Caption — metadados</p>
  </div>
</template>

<style scoped lang="scss">
.type-examples {
  display: grid;
  gap: var(--v-space-3);
  font-family: var(--v-font-family-sans);
  color: var(--v-color-text);
}
</style>
