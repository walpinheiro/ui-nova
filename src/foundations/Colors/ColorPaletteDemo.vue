<script setup lang="ts">
import { computed, ref } from 'vue'
import VButton from '../../components/form/VButton/VButton.vue'
import VCard from '../../components/containment/VCard/VCard.vue'
import VTag from '../../components/primitives/VTag/VTag.vue'
import { COLOR_PALETTE_GROUPS, CUSTOM_THEME_PRESET } from '../_shared/functionalClasses'

const mode = ref<'default' | 'custom'>('default')

const previewStyle = computed(() => {
  if (mode.value === 'default') return {}
  return CUSTOM_THEME_PRESET.vars as Record<string, string>
})

function swatchStyle(token: string): Record<string, string> {
  if (mode.value === 'custom' && token in CUSTOM_THEME_PRESET.vars) {
    return {
      background: CUSTOM_THEME_PRESET.vars[token as keyof typeof CUSTOM_THEME_PRESET.vars],
    }
  }
  return { background: `var(${token})` }
}
</script>

<template>
  <div class="color-palette">
    <div class="color-palette__toggle">
      <button
        type="button"
        class="color-palette__btn"
        :class="{ 'color-palette__btn--active': mode === 'default' }"
        @click="mode = 'default'"
      >
        Paleta default
      </button>
      <button
        type="button"
        class="color-palette__btn"
        :class="{ 'color-palette__btn--active': mode === 'custom' }"
        @click="mode = 'custom'"
      >
        Paleta customizada
      </button>
    </div>

    <div v-for="group in COLOR_PALETTE_GROUPS" :key="group.id" class="color-palette__group">
      <h4 class="color-palette__heading">{{ group.label }}</h4>
      <div class="color-palette__grid">
        <div v-for="token in group.tokens" :key="token" class="color-palette__swatch-wrap">
          <div class="color-palette__swatch" :style="swatchStyle(token)" />
          <code class="color-palette__token">{{ token.replace('--v-color-', '') }}</code>
        </div>
      </div>
    </div>

    <section class="color-palette__preview-section">
      <h4 class="color-palette__heading">Componentes com a paleta {{ mode === 'default' ? 'default' : 'custom' }}</h4>
      <div class="color-palette__preview" :style="previewStyle">
        <VButton>Primary action</VButton>
        <VTag variant="soft">Status tag</VTag>
        <VCard style="padding: var(--v-space-4); max-width: 240px">
          <template #title>Surface card</template>
          <p style="margin:0;font-size:var(--v-font-size-text-small);color:var(--v-color-text-muted)">
            Cores propagam via tokens semânticos.
          </p>
        </VCard>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.color-palette {
  display: grid;
  gap: var(--v-space-6);
  font-family: var(--v-font-family-sans);

  &__toggle {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-space-2);
  }

  &__btn {
    min-height: var(--v-field-height-sm);
    padding: var(--v-space-2) var(--v-space-4);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-pill);
    background: var(--v-color-surface);
    cursor: pointer;
    font: inherit;
    font-size: var(--v-font-size-text-small);

    &--active {
      border-color: var(--v-color-primary-text);
      background: color-mix(in srgb, var(--v-color-primary) 8%, var(--v-color-surface));
      color: var(--v-color-primary-text);
      font-weight: var(--v-font-weight-semibold);
    }

    &:focus-visible {
      outline: var(--v-focus-ring-width) solid var(--v-color-focus);
      outline-offset: var(--v-focus-ring-offset);
    }
  }

  &__group {
    display: grid;
    gap: var(--v-space-3);
  }

  &__heading {
    margin: 0;
    font-size: var(--v-font-size-text-medium);
    font-weight: var(--v-font-weight-semibold);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
    gap: var(--v-space-3);
  }

  &__swatch-wrap {
    display: grid;
    gap: var(--v-space-1);
  }

  &__swatch {
    height: var(--v-space-8);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
  }

  &__token {
    font-size: var(--v-font-size-caption);
    font-family: ui-monospace, monospace;
    color: var(--v-color-text-muted);
    word-break: break-all;
  }

  &__preview-section {
    display: grid;
    gap: var(--v-space-3);
  }

  &__preview {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-space-4);
    align-items: flex-start;
    padding: var(--v-space-4);
    border: var(--v-border-width) dashed var(--v-color-border);
    border-radius: var(--v-radius-md);
  }
}
</style>
