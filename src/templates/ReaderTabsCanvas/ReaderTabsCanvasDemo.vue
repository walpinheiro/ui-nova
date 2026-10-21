<script setup lang="ts">
import { computed, ref } from 'vue'
import VSplitView from '../../components/containment/VSplitView/VSplitView.vue'
import VTreeNavigation from '../../components/navigation/VTreeNavigation/VTreeNavigation.vue'
import VTabs from '../../components/navigation/VTabs/VTabs.vue'
import VBreadcrumb from '../../components/navigation/VBreadcrumb/VBreadcrumb.vue'
import { TEMPLATE_DOC_TREE } from '../_shared/templateNavigation'
import ReaderArticle from '../_shared/ReaderArticle.vue'
import CanvasWorkspace from '../_shared/CanvasWorkspace.vue'
import { getDocument } from '../_shared/sampleContent'

const activeTreeKey = ref('components')
const mainTab = ref('reader')

const mainTabs = [
  { value: 'reader', label: 'Leitor', icon: 'home' },
  { value: 'canvas', label: 'Canvas', icon: 'home' },
  { value: 'preview', label: 'Pré-visualização' },
]

const document = computed(() => getDocument(activeTreeKey.value))
</script>

<template>
  <VSplitView
    class="reader-tabs-canvas-demo"
    :sizes="[240, 1]"
    mode="resizable"
    persist-key="template-reader-canvas"
  >
    <template #start>
      <div class="reader-tabs-canvas-demo__nav">
        <p class="reader-tabs-canvas-demo__nav-kind">Menu · Árvore de ficheiros</p>
        <VTreeNavigation
          v-model:active="activeTreeKey"
          variant="file"
          :items="TEMPLATE_DOC_TREE"
          size="sm"
          :expanded-keys="['workspace', 'documentation', 'projects']"
          :show-counts="true"
        />
      </div>
    </template>

    <template #default>
      <div class="reader-tabs-canvas-demo__workspace">
        <header class="reader-tabs-canvas-demo__header">
          <p class="reader-tabs-canvas-demo__header-kind">Centro · Abas pill</p>
          <VBreadcrumb
            size="sm"
            variant="compact"
            :items="document.breadcrumb.map((item) => ({ label: item.label }))"
          />
        </header>

        <VTabs v-model="mainTab" :items="mainTabs" variant="pill" size="sm" class="reader-tabs-canvas-demo__tabs">
          <ReaderArticle v-if="mainTab === 'reader'" :document="document" />
          <CanvasWorkspace v-else-if="mainTab === 'canvas'" :label="document.title" />
          <div v-else class="reader-tabs-canvas-demo__preview">
            <div class="reader-tabs-canvas-demo__preview-card">
              <h4>{{ document.title }}</h4>
              <p>{{ document.summary }}</p>
            </div>
          </div>
        </VTabs>
      </div>
    </template>
  </VSplitView>
</template>

<style scoped lang="scss">
.reader-tabs-canvas-demo {
  height: 100%;

  &__nav {
    display: grid;
    gap: var(--v-space-2);
    height: 100%;
    padding: var(--v-space-2) var(--v-space-3);
    border-right: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-surface);
    overflow: auto;
  }

  &__nav-kind {
    margin: 0;
    padding: 0 var(--v-space-1);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--v-color-primary-600);
  }

  &__workspace {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    min-width: 0;
  }

  &__header {
    display: grid;
    gap: var(--v-space-2);
    padding: var(--v-space-3) var(--v-space-4);
    border-bottom: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-elevated);
  }

  &__header-kind {
    margin: 0;
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    color: var(--v-color-text-muted);
  }

  &__tabs {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 0;

    :deep(.v-tabs__panel) {
      overflow: auto;
      min-height: 0;
    }
  }

  &__preview {
    display: grid;
    place-items: center;
    min-height: 100%;
    padding: var(--v-space-6);
    background: var(--v-color-neutral-100);
  }

  &__preview-card {
    width: min(100%, 22rem);
    padding: var(--v-space-6);
    border-radius: var(--v-radius-lg);
    background: var(--v-color-elevated);
    box-shadow: var(--v-shadow-lg);

    h4 {
      margin: 0 0 var(--v-space-2);
      font-size: var(--v-font-size-h4);
    }

    p {
      margin: 0;
      color: var(--v-color-text-muted);
      font-size: var(--v-font-size-text-small);
    }
  }
}
</style>
