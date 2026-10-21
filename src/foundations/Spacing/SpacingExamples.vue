<script setup lang="ts">
import VButton from '../../components/form/VButton/VButton.vue'
import VCard from '../../components/containment/VCard/VCard.vue'
import { SPACING_SCALE } from '../_shared/functionalClasses'

const paddingSteps = SPACING_SCALE.filter((s) => !['0', '24'].includes(s.key))
</script>

<template>
  <div class="spacing-examples">
    <section class="spacing-examples__section">
      <h4 class="spacing-examples__heading">Padding (`p-*` → `--v-space-*`)</h4>
      <div class="spacing-examples__row">
        <div v-for="step in paddingSteps" :key="step.token" class="spacing-examples__cell">
          <div :class="['spacing-examples__pad-box', `p-${step.key}`]">
            <span class="spacing-examples__inner">conteúdo</span>
          </div>
          <code>p-{{ step.key }}</code>
          <span class="spacing-examples__meta">{{ step.token }} · {{ step.px }}</span>
        </div>
      </div>
    </section>

    <section class="spacing-examples__section">
      <h4 class="spacing-examples__heading">Gap (`gap-*` em flex)</h4>
      <div class="spacing-examples__gap-demo gap-2">
        <span class="spacing-examples__pill">gap-2</span>
        <span class="spacing-examples__pill">8px</span>
      </div>
      <div class="spacing-examples__gap-demo gap-4">
        <span class="spacing-examples__pill">gap-4</span>
        <span class="spacing-examples__pill">16px</span>
      </div>
      <div class="spacing-examples__gap-demo gap-6">
        <span class="spacing-examples__pill">gap-6</span>
        <span class="spacing-examples__pill">24px</span>
      </div>
    </section>

    <section class="spacing-examples__section">
      <h4 class="spacing-examples__heading">Margin (`m-*` entre blocos)</h4>
      <div class="spacing-examples__margin-stack">
        <div class="spacing-examples__margin-block mb-4">mb-4 (16px)</div>
        <div class="spacing-examples__margin-block mb-2">mb-2 (8px)</div>
        <div class="spacing-examples__margin-block">sem margin-bottom</div>
      </div>
    </section>

    <section class="spacing-examples__section">
      <h4 class="spacing-examples__heading">Impacto nos componentes</h4>
      <div class="spacing-examples__components">
        <VCard class="p-4" style="max-width: 240px">
          <template #title>VCard p-4</template>
          <p class="spacing-examples__card-text">Padding via classe Tailwind ligada a --v-space-4.</p>
        </VCard>
        <VButton>Botão (--v-button-padding-*)</VButton>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.spacing-examples {
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

  &__cell {
    display: grid;
    gap: var(--v-space-1);
    justify-items: center;
    width: 6.5rem;
    font-size: var(--v-font-size-caption);

    code {
      font-family: ui-monospace, monospace;
    }
  }

  &__pad-box {
    border: var(--v-border-width) dashed var(--v-color-primary-300);
    border-radius: var(--v-radius-4);
    background: var(--v-color-primary-50);
  }

  &__inner {
    display: block;
    font-size: var(--v-font-size-caption);
    color: var(--v-color-text-muted);
  }

  &__meta {
    color: var(--v-color-text-muted);
    text-align: center;
  }

  &__gap-demo {
    display: inline-flex;
    margin-right: var(--v-space-4);
    margin-bottom: var(--v-space-2);
  }

  &__pill {
    padding: var(--v-space-1) var(--v-space-2);
    border-radius: var(--v-radius-pill);
    background: var(--v-color-neutral-100);
    font-size: var(--v-font-size-caption);
  }

  &__margin-stack {
    max-width: 280px;
    padding: var(--v-space-3);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
  }

  &__margin-block {
    padding: var(--v-space-2);
    border-radius: var(--v-radius-4);
    background: var(--v-color-info-soft);
    font-size: var(--v-font-size-text-small);
  }

  &__components {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-space-4);
    align-items: flex-start;
  }

  &__card-text {
    margin: 0;
    font-size: var(--v-font-size-text-small);
    color: var(--v-color-text-muted);
  }
}
</style>
