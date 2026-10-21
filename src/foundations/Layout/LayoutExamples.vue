<script setup lang="ts">
import { LAYOUT_Z_INDEX_SCALE } from '../_shared/functionalClasses'
</script>

<template>
  <div class="layout-examples">
    <section class="layout-examples__section">
      <h4 class="layout-examples__heading">Flex + gap (Tailwind → `--v-space-*`)</h4>
      <div class="layout-examples__flex-row gap-2">
        <span class="layout-examples__chip">gap-2</span>
        <span class="layout-examples__chip">8px</span>
      </div>
      <div class="layout-examples__flex-row gap-4" style="margin-top: var(--v-stack-gap-sm)">
        <span class="layout-examples__chip">gap-4</span>
        <span class="layout-examples__chip">16px</span>
        <span class="layout-examples__chip">= --v-flex-gap-md</span>
      </div>
    </section>

    <section class="layout-examples__section">
      <h4 class="layout-examples__heading">Stack vertical (`--v-stack-gap-*`)</h4>
      <div class="layout-examples__stack" style="gap: var(--v-stack-gap-md)">
        <div class="layout-examples__block">Bloco 1</div>
        <div class="layout-examples__block">Bloco 2</div>
        <div class="layout-examples__block">Bloco 3</div>
      </div>
    </section>

    <section class="layout-examples__section">
      <h4 class="layout-examples__heading">Escala z-index</h4>
      <div class="layout-examples__z-demo">
        <div
          v-for="layer in LAYOUT_Z_INDEX_SCALE"
          :key="layer.token"
          class="layout-examples__z-layer"
          :style="{ zIndex: `var(${layer.token})` }"
        >
          <code>z-{{ layer.key }}</code>
          <span>{{ layer.token }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.layout-examples {
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

  &__flex-row {
    display: inline-flex;
    flex-wrap: wrap;
  }

  &__chip {
    padding: var(--v-space-1) var(--v-space-2);
    border-radius: var(--v-radius-pill);
    background: var(--v-color-neutral-100);
    font-size: var(--v-font-size-caption);
  }

  &__stack {
    display: flex;
    flex-direction: column;
    max-width: 280px;
  }

  &__block {
    padding: var(--v-space-3);
    border-radius: var(--v-radius-md);
    background: var(--v-color-primary-50);
    border: var(--v-border-width) solid var(--v-color-primary-200);
    font-size: var(--v-font-size-text-small);
  }

  &__z-demo {
    position: relative;
    height: 140px;
    border: var(--v-border-width) dashed var(--v-color-border);
    border-radius: var(--v-radius-md);
    background: var(--v-color-surface-muted);
  }

  &__z-layer {
    position: absolute;
    left: calc(var(--v-space-4) + var(--v-space-2) * var(--v-z-index-base, 0));
    top: var(--v-space-4);
    display: grid;
    gap: var(--v-space-1);
    padding: var(--v-space-2) var(--v-space-3);
    border-radius: var(--v-radius-4);
    background: var(--v-color-elevated);
    border: var(--v-border-width) solid var(--v-color-border);
    box-shadow: var(--v-shadow-sm);
    font-size: var(--v-font-size-caption);

    &:nth-child(1) { left: var(--v-space-4); }
    &:nth-child(2) { left: calc(var(--v-space-4) + 24px); top: calc(var(--v-space-4) + 12px); }
    &:nth-child(3) { left: calc(var(--v-space-4) + 48px); top: calc(var(--v-space-4) + 24px); }
    &:nth-child(4) { left: calc(var(--v-space-4) + 72px); top: calc(var(--v-space-4) + 36px); }
    &:nth-child(5) { left: calc(var(--v-space-4) + 96px); top: calc(var(--v-space-4) + 48px); }
    &:nth-child(6) { left: calc(var(--v-space-4) + 120px); top: calc(var(--v-space-4) + 60px); }
    &:nth-child(7) { left: calc(var(--v-space-4) + 144px); top: calc(var(--v-space-4) + 72px); }
    &:nth-child(8) { left: calc(var(--v-space-4) + 168px); top: calc(var(--v-space-4) + 84px); }

    code {
      font-family: ui-monospace, monospace;
    }

    span {
      color: var(--v-color-text-muted);
    }
  }
}
</style>
