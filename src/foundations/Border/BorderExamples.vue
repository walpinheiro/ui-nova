<script setup lang="ts">
import VCard from '../../components/containment/VCard/VCard.vue'
</script>

<template>
  <div class="border-examples">
    <section class="border-examples__section">
      <h4 class="border-examples__heading">Largura (`border` / `border-focus`)</h4>
      <div class="border-examples__row">
        <div class="border-examples__sample border border-border">border · 1px</div>
        <div class="border-examples__sample border border-focus border-border">border-focus · 2px</div>
      </div>
    </section>

    <section class="border-examples__section">
      <h4 class="border-examples__heading">Cor (`border-border`)</h4>
      <div class="border-examples__row">
        <div class="border-examples__sample border border-border">border-border</div>
        <div class="border-examples__sample border border-border-disabled">border-disabled</div>
      </div>
    </section>

    <section class="border-examples__section">
      <h4 class="border-examples__heading">Estilo tracejado (drop zones)</h4>
      <div class="border-examples__dashed border border-dashed border-border">
        border-dashed + border-border
      </div>
    </section>

    <section class="border-examples__section">
      <h4 class="border-examples__heading">Focus ring (tokens)</h4>
      <button type="button" class="border-examples__focus-btn">
        Foco visível
      </button>
    </section>

    <section class="border-examples__section">
      <h4 class="border-examples__heading">No componente</h4>
      <VCard style="padding: var(--v-space-4); max-width: 260px">
        <template #title>VCard</template>
        <p style="margin:0;font-size:var(--v-font-size-text-small);color:var(--v-color-text-muted)">
          Borda via --v-card-border e --v-border-width
        </p>
      </VCard>
    </section>
  </div>
</template>

<style scoped lang="scss">
.border-examples {
  display: grid;
  gap: var(--v-space-8);
  font-family: var(--v-font-family-sans);

  &__section {
    display: grid;
    gap: var(--v-space-3);
  }

  &__heading {
    margin: 0;
    font-size: var(--v-font-size-text-medium);
    font-weight: var(--v-font-weight-semibold);
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-space-4);
  }

  &__sample {
    min-width: 8rem;
    padding: var(--v-space-4);
    border-radius: var(--v-radius-md);
    background: var(--v-color-surface);
    font-size: var(--v-font-size-text-small);
    text-align: center;
  }

  &__dashed {
    max-width: 320px;
    padding: var(--v-space-6);
    border-radius: var(--v-radius-md);
    color: var(--v-color-text-muted);
    font-size: var(--v-font-size-text-small);
    text-align: center;
  }

  &__focus-btn {
    min-height: var(--v-field-min-target);
    padding: var(--v-space-2) var(--v-space-4);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
    background: var(--v-color-surface);
    cursor: pointer;
    font: inherit;

    &:focus-visible {
      outline: var(--v-focus-ring-width) solid var(--v-color-focus);
      outline-offset: var(--v-focus-ring-offset);
    }
  }
}
</style>
