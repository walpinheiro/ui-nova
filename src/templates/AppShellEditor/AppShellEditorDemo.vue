<script setup lang="ts">
import { computed, ref } from 'vue'
import VAppShell from '../../components/grid/VAppShell/VAppShell.vue'
import VTabs from '../../components/navigation/VTabs/VTabs.vue'
import TemplateSidebar from '../_shared/TemplateSidebar.vue'
import ReaderArticle from '../_shared/ReaderArticle.vue'
import CanvasWorkspace from '../_shared/CanvasWorkspace.vue'
import { getDocument } from '../_shared/sampleContent'

const activeItem = ref('reader')
const mainTab = ref('reader')
const docKey = ref('components')

const mainTabs = [
  { value: 'reader', label: 'Leitor' },
  { value: 'canvas', label: 'Canvas' },
]

const document = computed(() => getDocument(docKey.value))

function onNavSelect(value: string) {
  if (value === 'design-system') docKey.value = 'design-system'
  else if (value === 'reader' || value === 'canvas') docKey.value = 'components'
  else if (value === 'workbench') docKey.value = 'guides'
  else docKey.value = 'getting-started'
}
</script>

<template>
  <VAppShell
    variant="editor"
    :utility-open="false"
    :show-utility="false"
    brand-name="VueUI Nova"
    class="app-shell-editor-demo"
  >
    <template #sidebar>
      <div class="app-shell-editor-demo__sidebar-wrap">
        <p class="app-shell-editor-demo__kind">Menu · App shell</p>
        <TemplateSidebar
          v-model:active-item="activeItem"
          brand-name="Nova"
          class="app-shell-editor-demo__sidebar"
          @select="onNavSelect"
        />
      </div>
    </template>

    <div class="app-shell-editor-demo__main">
      <VTabs v-model="mainTab" :items="mainTabs" variant="underline" size="sm">
        <ReaderArticle v-if="mainTab === 'reader'" :document="document" />
        <CanvasWorkspace v-else :label="document.title" />
      </VTabs>
    </div>
  </VAppShell>
</template>

<style scoped lang="scss">
.app-shell-editor-demo {
  height: 100%;

  &__sidebar-wrap {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--v-space-2);
    height: 100%;
    padding-top: var(--v-space-2);
  }

  &__kind {
    margin: 0;
    padding: 0 var(--v-space-3);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--v-color-primary-600);
  }

  &__sidebar {
    height: 100%;
    border-right: var(--v-border-width) solid var(--v-color-border);
  }

  &__main {
    display: grid;
    height: 100%;
    min-width: 0;
    background: var(--v-color-bg);

    :deep(.v-tabs) {
      height: 100%;
      grid-template-rows: auto 1fr;
    }

    :deep(.v-tabs__panel) {
      overflow: auto;
    }
  }
}
</style>
