<script setup lang="ts">
import { computed, ref } from 'vue'
import VSplitView from '../../components/containment/VSplitView/VSplitView.vue'
import VTreeNavigation from '../../components/navigation/VTreeNavigation/VTreeNavigation.vue'
import VBreadcrumb from '../../components/navigation/VBreadcrumb/VBreadcrumb.vue'
import VTabs from '../../components/navigation/VTabs/VTabs.vue'
import TemplateSidebar from '../_shared/TemplateSidebar.vue'
import { TEMPLATE_DOC_TREE } from '../_shared/templateNavigation'
import ReaderArticle from '../_shared/ReaderArticle.vue'
import { getDocument } from '../_shared/sampleContent'

const layoutMode = defineModel<'sidebar' | 'split'>('layoutMode', { default: 'split' })
const activeTreeKey = ref('getting-started')
const readerTab = ref('read')

const readerTabs = [
  { value: 'read', label: 'Leitura', icon: 'home' },
  { value: 'outline', label: 'Sumário' },
]

const document = computed(() => getDocument(activeTreeKey.value))
const breadcrumbItems = computed(() =>
  document.value.breadcrumb.map((item) => ({ label: item.label, href: item.href })),
)
</script>

<template>
  <VSplitView
    v-if="layoutMode === 'split'"
    class="sidebar-reader-demo"
    :sizes="[260, 1]"
    mode="resizable"
    persist-key="template-sidebar-reader"
    aria-label="Layout menu lateral e reader"
  >
    <template #start>
      <div class="sidebar-reader-demo__tree">
        <p class="sidebar-reader-demo__tree-kind">Menu · Árvore</p>
        <p class="sidebar-reader-demo__tree-label">Documentação</p>
        <VTreeNavigation
          v-model:active="activeTreeKey"
          variant="documentation"
          :items="TEMPLATE_DOC_TREE"
          :show-counts="true"
          size="sm"
          :expanded-keys="['workspace', 'documentation']"
        />
      </div>
    </template>

    <template #default>
      <div class="sidebar-reader-demo__content">
        <header class="sidebar-reader-demo__toolbar">
          <VBreadcrumb :items="breadcrumbItems" size="sm" variant="icons" />
        </header>
        <VTabs v-model="readerTab" :items="readerTabs" variant="underline" size="sm">
          <ReaderArticle v-if="readerTab === 'read'" :document="document" />
          <nav v-else class="sidebar-reader-demo__outline">
            <button
              v-for="(paragraph, index) in document.body"
              :key="index"
              type="button"
              class="sidebar-reader-demo__outline-item"
            >
              § {{ index + 1 }} — {{ paragraph.slice(0, 48) }}…
            </button>
          </nav>
        </VTabs>
      </div>
    </template>
  </VSplitView>

  <div v-else class="sidebar-reader-demo sidebar-reader-demo--with-nav">
    <TemplateSidebar active-item="reader" />
    <div class="sidebar-reader-demo__content sidebar-reader-demo__content--full">
      <header class="sidebar-reader-demo__toolbar">
        <VBreadcrumb :items="breadcrumbItems" size="sm" />
      </header>
      <VTabs v-model="readerTab" :items="readerTabs" variant="pill" size="sm">
        <ReaderArticle v-if="readerTab === 'read'" :document="document" />
        <nav v-else class="sidebar-reader-demo__outline">
          <button
            v-for="(paragraph, index) in document.body"
            :key="index"
            type="button"
            class="sidebar-reader-demo__outline-item"
          >
            § {{ index + 1 }} — {{ paragraph.slice(0, 56) }}…
          </button>
        </nav>
      </VTabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-reader-demo {
  height: 100%;

  &--with-nav {
    display: flex;
    min-height: 100%;
  }

  &__tree {
    display: grid;
    gap: var(--v-space-2);
    height: 100%;
    padding: var(--v-space-3);
    border-right: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-surface);
    overflow: auto;
  }

  &__tree-kind {
    margin: 0;
    padding: 0 var(--v-space-2);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--v-color-primary-600);
  }

  &__tree-label {
    margin: 0;
    padding: 0 var(--v-space-2);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--v-color-text-muted);
  }

  &__content {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    min-width: 0;
    background: var(--v-color-bg);

    &--full {
      flex: 1;
    }
  }

  &__toolbar {
    padding: var(--v-space-3) var(--v-space-4);
    border-bottom: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-elevated);
  }

  &__outline {
    display: grid;
    gap: var(--v-space-2);
    padding: var(--v-space-4);
  }

  &__outline-item {
    padding: var(--v-space-2) var(--v-space-3);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
    background: var(--v-color-surface);
    text-align: left;
    font-size: var(--v-font-size-text-small);
    color: var(--v-color-text);
    cursor: pointer;
    transition:
      border-color var(--v-motion-fast) var(--v-ease-out),
      background-color var(--v-motion-fast) var(--v-ease-out);

    &:hover {
      border-color: var(--v-color-primary-300);
      background: var(--v-color-primary-50);
    }

    &:active {
      transform: scale(var(--v-state-press-scale));
    }
  }
}
</style>
