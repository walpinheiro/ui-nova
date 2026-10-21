<script setup lang="ts">
import { computed, ref } from 'vue'
import TemplateThemeBar from './TemplateThemeBar.vue'
import { DEFAULT_TEMPLATE_THEME_ID, getTemplateThemeVars } from './templateThemes'

withDefaults(
  defineProps<{
    title?: string
    height?: string
    showThemeBar?: boolean
  }>(),
  {
    height: '720px',
    showThemeBar: true,
  },
)

const themeId = ref(DEFAULT_TEMPLATE_THEME_ID)
const themeVars = computed(() => getTemplateThemeVars(themeId.value))
</script>

<template>
  <div class="template-shell" :style="{ '--template-shell-height': height }">
    <header v-if="title" class="template-shell__header">
      <h3 class="template-shell__title">{{ title }}</h3>
      <p class="template-shell__hint">
        Composição de componentes VueUI Nova — redimensione painéis, troque abas e experimente a cor primária.
      </p>
    </header>

    <TemplateThemeBar v-if="showThemeBar" v-model="themeId" />

    <div class="template-shell__frame" :style="themeVars">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.template-shell {
  display: grid;
  gap: var(--v-space-4);
  font-family: var(--v-font-family-sans);

  &__header {
    display: grid;
    gap: var(--v-space-1);
  }

  &__title {
    margin: 0;
    font-size: var(--v-font-size-text-medium);
    font-weight: var(--v-font-weight-semibold);
    color: var(--v-color-text);
  }

  &__hint {
    margin: 0;
    font-size: var(--v-font-size-caption);
    color: var(--v-color-text-muted);
  }

  &__frame {
    height: var(--template-shell-height);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
    overflow: hidden;
    background: var(--v-color-bg);
  }
}
</style>
