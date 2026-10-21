<script setup lang="ts">
import { computed } from 'vue'
import {
  DEFAULT_TEMPLATE_THEME_ID,
  formatTemplateThemeCss,
  TEMPLATE_THEME_PRESETS,
} from './templateThemes'

const model = defineModel<string>({ default: DEFAULT_TEMPLATE_THEME_ID })

const cssSnippet = computed(() => formatTemplateThemeCss(model.value))
</script>

<template>
  <section class="template-theme-bar" aria-label="Troca de cor primária do projeto">
    <div class="template-theme-bar__row">
      <p class="template-theme-bar__label">Cor primária do projeto</p>
      <div class="template-theme-bar__choices" role="radiogroup" aria-label="Presets de cor primária">
        <button
          v-for="preset in TEMPLATE_THEME_PRESETS"
          :key="preset.id"
          type="button"
          role="radio"
          class="template-theme-bar__choice"
          :class="{ 'template-theme-bar__choice--active': preset.id === model }"
          :aria-checked="preset.id === model"
          :title="preset.label"
          @click="model = preset.id"
        >
          <span
            class="template-theme-bar__swatch"
            :style="{ backgroundColor: preset.swatch }"
            aria-hidden="true"
          />
          <span class="template-theme-bar__choice-label">{{ preset.label }}</span>
        </button>
      </div>
    </div>

    <details class="template-theme-bar__details" open>
      <summary class="template-theme-bar__summary">
        Variáveis CSS — mude a escala <code>--v-color-primary-*</code> e tudo desce (sidebar, abas, botões)
      </summary>
      <pre class="template-theme-bar__code"><code>{{ cssSnippet }}</code></pre>
    </details>
  </section>
</template>

<style scoped lang="scss">
.template-theme-bar {
  display: grid;
  gap: var(--v-space-3);
  padding: var(--v-space-3) var(--v-space-4);
  border: var(--v-border-width) solid var(--v-color-border);
  border-radius: var(--v-radius-md);
  background: var(--v-color-surface);

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--v-space-3);
  }

  &__label {
    margin: 0;
    font-size: var(--v-font-size-text-small);
    font-weight: var(--v-font-weight-semibold);
    color: var(--v-color-text);
  }

  &__choices {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-space-2);
  }

  &__choice {
    display: inline-flex;
    align-items: center;
    gap: var(--v-space-2);
    padding: var(--v-space-1) var(--v-space-2);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-pill);
    background: var(--v-color-bg);
    color: var(--v-color-text);
    font: inherit;
    font-size: var(--v-font-size-caption);
    cursor: pointer;
    transition:
      border-color var(--v-motion-fast) var(--v-ease-standard),
      box-shadow var(--v-motion-fast) var(--v-ease-standard);

    &:hover {
      border-color: var(--v-color-primary-300);
    }

    &:focus-visible {
      outline: var(--v-focus-ring-width) solid var(--v-color-focus);
      outline-offset: var(--v-focus-ring-offset);
    }

    &--active {
      border-color: var(--v-color-primary);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--v-color-primary) 35%, transparent);
    }
  }

  &__swatch {
    width: var(--v-space-3);
    height: var(--v-space-3);
    border-radius: var(--v-radius-circle);
    border: var(--v-border-width) solid color-mix(in srgb, var(--v-color-text) 12%, transparent);
  }

  &__choice-label {
    line-height: 1;
  }

  &__details {
    min-width: 0;
  }

  &__summary {
    cursor: pointer;
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    color: var(--v-color-text-muted);
  }

  &__code {
    margin: var(--v-space-2) 0 0;
    padding: var(--v-space-3);
    overflow: auto;
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-sm);
    background: var(--v-color-neutral-50);
    font-size: var(--v-font-size-caption);
    line-height: 1.45;

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
  }
}
</style>
