<script setup lang="ts">
import { computed, ref } from 'vue'
import VSplitView from '../../components/containment/VSplitView/VSplitView.vue'
import VTreeNavigation from '../../components/navigation/VTreeNavigation/VTreeNavigation.vue'
import VTabs from '../../components/navigation/VTabs/VTabs.vue'
import VInspectorPanel from '../../components/containment/VInspectorPanel/VInspectorPanel.vue'
import { TEMPLATE_EXPLORER_TREE } from '../_shared/templateNavigation'
import ReaderArticle from '../_shared/ReaderArticle.vue'
import CanvasWorkspace from '../_shared/CanvasWorkspace.vue'
import { getDocument } from '../_shared/sampleContent'

const activeTreeKey = ref('components')
const centerTab = ref('document')
const inspectorTab = ref('properties')

const centerTabs = [
  { value: 'document', label: 'Documento' },
  { value: 'canvas', label: 'Canvas' },
]

const document = computed(() => getDocument(activeTreeKey.value))
</script>

<template>
  <VSplitView
    class="editor-workbench-demo"
    :sizes="[240, 1, 320]"
    mode="collapsible"
    :collapsible="true"
    persist-key="template-editor-workbench"
    aria-label="Workbench IDE"
  >
    <template #start>
      <div class="editor-workbench-demo__sidebar">
        <p class="editor-workbench-demo__kind">Menu · Árvore</p>
        <p class="editor-workbench-demo__label">Explorador</p>
        <VTreeNavigation
          v-model:active="activeTreeKey"
          variant="file"
          :items="TEMPLATE_EXPLORER_TREE"
          size="sm"
          :expanded-keys="['src', 'components']"
          :show-counts="false"
        />
      </div>
    </template>

    <template #default>
      <div class="editor-workbench-demo__center">
        <p class="editor-workbench-demo__center-kind">Centro · Abas underline</p>
        <VTabs v-model="centerTab" :items="centerTabs" variant="underline" size="sm">
          <ReaderArticle v-if="centerTab === 'document'" :document="document" />
          <CanvasWorkspace v-else :label="document.title" :zoom="125" />
        </VTabs>
      </div>
    </template>

    <template #end>
      <div class="editor-workbench-demo__inspector-wrap">
        <p class="editor-workbench-demo__inspector-kind">Inspector · Abas</p>
        <VInspectorPanel
          v-model:active-tab="inspectorTab"
          variant="tabs"
          title="Inspector"
          size="compact"
          class="editor-workbench-demo__inspector"
        >
          <template #properties>
            <div class="v-inspector-panel__field">
              <span class="v-inspector-panel__field-label">Título</span>
              <div class="v-inspector-panel__field-control">
                <input :value="document.title" readonly />
              </div>
            </div>
            <div class="v-inspector-panel__field">
              <span class="v-inspector-panel__field-label">Slug</span>
              <div class="v-inspector-panel__field-control">
                <input :value="activeTreeKey" readonly />
              </div>
            </div>
          </template>
          <template #styles>
            <div class="v-inspector-panel__field">
              <span class="v-inspector-panel__field-label">Tema</span>
              <div class="v-inspector-panel__field-control">
                <input value="VueUI Nova default" readonly />
              </div>
            </div>
          </template>
          <template #meta>
            <div class="v-inspector-panel__field">
              <span class="v-inspector-panel__field-label">Última edição</span>
              <div class="v-inspector-panel__field-control">
                <input value="Hoje, 12:30" readonly />
              </div>
            </div>
          </template>
        </VInspectorPanel>
      </div>
    </template>
  </VSplitView>
</template>

<style scoped lang="scss">
.editor-workbench-demo {
  height: 100%;

  &__sidebar {
    display: grid;
    gap: var(--v-space-2);
    align-content: start;
    height: 100%;
    padding: var(--v-space-3);
    border-right: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-surface);
    overflow: auto;
  }

  &__kind,
  &__center-kind,
  &__inspector-kind {
    margin: 0;
    padding: 0 var(--v-space-2);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--v-color-primary-600);
  }

  &__label {
    margin: 0;
    padding: 0 var(--v-space-2);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    color: var(--v-color-text-muted);
  }

  &__center {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--v-space-2);
    height: 100%;
    min-width: 0;
    padding-top: var(--v-space-2);
    background: var(--v-color-bg);

    :deep(.v-tabs) {
      height: 100%;
      grid-template-rows: auto 1fr;
    }

    :deep(.v-tabs__panel) {
      overflow: auto;
    }
  }

  &__inspector-wrap {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--v-space-2);
    height: 100%;
    padding-top: var(--v-space-2);
    border-left: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-surface);
  }

  &__inspector {
    height: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
