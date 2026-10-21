<script setup lang="ts">
import { computed, ref } from 'vue'
import VCard from '../../components/containment/VCard/VCard.vue'
import VCardGrid from '../../components/grid/VCardGrid/VCardGrid.vue'
import TemplateSidebar from '../_shared/TemplateSidebar.vue'
import {
  getTemplateCategoryForItem,
  getTemplateMenuKindLabel,
  TEMPLATE_SIDEBAR_CATEGORIES,
} from '../_shared/templateNavigation'

const activeItem = ref('dashboard')

const category = computed(() => getTemplateCategoryForItem(activeItem.value))
const activeLabel = computed(() => {
  for (const cat of TEMPLATE_SIDEBAR_CATEGORIES) {
    const item = cat.items.find((i) => i.value === activeItem.value)
    if (item) return item.label
  }
  return activeItem.value
})
</script>

<template>
  <div class="sidebar-menu-demo">
    <TemplateSidebar v-model:active-item="activeItem" />

    <main class="sidebar-menu-demo__main">
      <header class="sidebar-menu-demo__hero">
        <p v-if="category" class="sidebar-menu-demo__kind">
          {{ getTemplateMenuKindLabel(category.menuKind) }} · {{ category.label }}
        </p>
        <h1 class="sidebar-menu-demo__heading">{{ activeLabel }}</h1>
        <p class="sidebar-menu-demo__lead">
          Menu lateral com <strong>categorias expansíveis</strong>, ícones Keyline nos pais e
          subitens aninhados. Item activo: <code>{{ activeItem }}</code>.
        </p>
      </header>
      <VCardGrid :cols="2" :gap="4">
        <VCard
          title="Ícones nos pais"
          description="Cada categoria (Visão geral, Conteúdo, IA, Sistema) exibe ícone via prop icon."
          variant="elevated"
        />
        <VCard
          title="Tipos de menu"
          description="Primário, aninhado, árvore e app shell — ver outros templates."
          variant="elevated"
        />
      </VCardGrid>
    </main>
  </div>
</template>

<style scoped lang="scss">
.sidebar-menu-demo {
  display: flex;
  height: 100%;
  min-height: 100%;

  &__main {
    flex: 1;
    min-width: 0;
    padding: var(--v-space-6);
    overflow: auto;
    background: var(--v-color-bg);
  }

  &__hero {
    margin-bottom: var(--v-space-6);
  }

  &__kind {
    margin: 0 0 var(--v-space-2);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--v-color-primary-600);
  }

  &__heading {
    margin: 0 0 var(--v-space-2);
    font-size: var(--v-font-size-h3);
    font-weight: var(--v-font-weight-bold);
    color: var(--v-color-text);
  }

  &__lead {
    margin: 0;
    max-width: 36rem;
    font-size: var(--v-font-size-text-medium);
    line-height: var(--v-line-height-text-medium);
    color: var(--v-color-text-muted);

    code {
      padding: 0 var(--v-space-1);
      border-radius: var(--v-radius-4);
      background: var(--v-color-neutral-100);
      font-family: ui-monospace, monospace;
      font-size: var(--v-font-size-caption);
    }
  }
}
</style>
