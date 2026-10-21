<template>
  <div class="shadow-examples">
    <div class="shadow-examples__card shadow-sm">shadow-sm</div>
    <div class="shadow-examples__card shadow-md">shadow-md</div>
    <div class="shadow-examples__card shadow-lg">shadow-lg</div>
    <div class="shadow-examples__card shadow-xl">shadow-xl</div>
  </div>
</template>

<style scoped lang="scss">
.shadow-examples {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-space-6);
  padding: var(--v-space-6);
  background: var(--v-color-surface-muted);
  border-radius: var(--v-radius-md);

  &__card {
    width: 8rem;
    height: 5rem;
    display: grid;
    place-items: center;
    border-radius: var(--v-radius-md);
    background: var(--v-color-elevated);
    font-size: var(--v-font-size-caption);
    font-family: var(--v-font-family-sans);
  }
}
</style>
