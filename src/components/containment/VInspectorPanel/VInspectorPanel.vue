<script setup lang="ts">
import './VInspectorPanel.scss'
import { provideDropdownGroup } from '../../navigation/VDropdownMenu/dropdownGroup'
import { VIcon } from '../../primitives/VIcon'
import VDropdownMenu from '../../navigation/VDropdownMenu/VDropdownMenu.vue'
import { useVInspectorPanel } from './useVInspectorPanel'
import type { VInspectorPanelEmits, VInspectorPanelProps } from './VInspectorPanel.types'

const props = withDefaults(defineProps<VInspectorPanelProps>(), {
  open: undefined,
  modelValue: undefined,
  title: 'Inspector',
  size: 'default',
  variant: 'default',
  showClose: true,
  dismissible: true,
  disabled: false,
  loading: false,
})
const emit = defineEmits<VInspectorPanelEmits>()
provideDropdownGroup()
const vm = useVInspectorPanel(props, emit)
</script>

<template>
  <Transition name="v-inspector-panel-slide">
    <aside
      v-show="vm.isOpen.value"
      :ref="(el) => vm.setRootRef(el)"
      v-bind="vm.rootAttrs.value"
      @keydown="vm.onKeydown"
    >
      <header class="v-inspector-panel__header" data-test-id="v-inspector-panel-header">
        <div class="v-inspector-panel__title-wrap">
          <slot name="header">
            <h2 :id="vm.titleId" class="v-inspector-panel__title" data-test-id="v-inspector-panel-title">
              {{ title }}
            </h2>
          </slot>
        </div>
        <div
          v-if="$slots.actions || variant === 'floating'"
          class="v-inspector-panel__actions"
          data-test-id="v-inspector-panel-actions"
        >
          <slot name="actions">
            <template v-if="variant === 'floating'">
              <button
                type="button"
                class="v-inspector-panel__action"
                data-test-id="v-inspector-panel-action-settings"
                aria-label="Settings"
                :disabled="vm.config.value.disabled || undefined"
              >
                <VIcon :icon="vm.config.value.icons.settings" size="sm" />
              </button>
              <VDropdownMenu
                size="sm"
                variant="ghost"
                trigger-style="icon"
                icon="more-horizontal"
                :show-trigger-icon="true"
                aria-label="Inspector actions"
                :disabled="vm.config.value.disabled"
              />
            </template>
          </slot>
        </div>
        <button
          v-if="showClose"
          type="button"
          class="v-inspector-panel__close"
          data-test-id="v-inspector-panel-close"
          aria-label="Close inspector"
          :disabled="vm.config.value.disabled || undefined"
          @click="vm.onCloseClick()"
        >
          <VIcon :icon="vm.config.value.icons.close" size="sm" />
        </button>
      </header>

      <div
        v-if="vm.config.value.showTabs"
        class="v-inspector-panel__tabs"
        role="tablist"
        aria-label="Inspector categories"
        data-test-id="v-inspector-panel-tabs"
      >
        <button
          v-for="(tab, index) in vm.config.value.tabs"
          :key="tab.value"
          type="button"
          role="tab"
          class="v-inspector-panel__tab"
          :class="{ 'v-inspector-panel__tab--active': tab.value === vm.activeTab.value }"
          :aria-selected="tab.value === vm.activeTab.value"
          :aria-controls="`v-inspector-panel-tabpanel-${tab.value}`"
          :id="`v-inspector-panel-tab-trigger-${tab.value}`"
          :tabindex="tab.value === vm.activeTab.value ? 0 : -1"
          :disabled="tab.disabled || vm.config.value.disabled || undefined"
          :data-test-id="`v-inspector-panel-tab-${tab.value}`"
          @click="vm.selectTab(tab.value)"
          @keydown="vm.onTabKeydown($event, index)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div
        class="v-inspector-panel__body"
        data-test-id="v-inspector-panel-body"
        role="tabpanel"
        :id="`v-inspector-panel-tabpanel-${vm.activeTab.value}`"
        :aria-labelledby="`v-inspector-panel-tab-trigger-${vm.activeTab.value}`"
      >
        <div
          v-if="loading"
          class="v-inspector-panel__skeleton"
          data-test-id="v-inspector-panel-skeleton"
          aria-hidden="true"
        >
          <span class="v-inspector-panel__skeleton-line" />
          <span class="v-inspector-panel__skeleton-line v-inspector-panel__skeleton-line--short" />
          <span class="v-inspector-panel__skeleton-block" />
          <span class="v-inspector-panel__skeleton-line" />
          <span class="v-inspector-panel__skeleton-block v-inspector-panel__skeleton-block--tall" />
        </div>
        <Transition v-else name="v-inspector-panel-tab" mode="out-in">
          <div
            :key="vm.activeTab.value"
            class="v-inspector-panel__content"
            data-test-id="v-inspector-panel-content"
          >
            <slot :name="vm.activeTab.value">
              <template v-if="vm.visibleSections.value.length">
                <div
                  v-for="section in vm.visibleSections.value"
                  :key="section.value"
                  class="v-inspector-panel__section"
                  :data-test-id="`v-inspector-panel-section-${section.value}`"
                  :data-expanded="vm.isSectionExpanded(section.value) ? 'true' : 'false'"
                >
                  <button
                    type="button"
                    class="v-inspector-panel__section-trigger"
                    :aria-expanded="vm.isSectionExpanded(section.value)"
                    :disabled="section.disabled || vm.config.value.disabled || undefined"
                    @click="vm.toggleSection(section.value)"
                    @keydown="vm.onSectionKeydown($event, section.value)"
                  >
                    <VIcon
                      :icon="vm.isSectionExpanded(section.value)
                        ? vm.config.value.icons.chevronDown
                        : vm.config.value.icons.chevronRight"
                      size="sm"
                      class="v-inspector-panel__section-chevron"
                      aria-hidden="true"
                    />
                    <span class="v-inspector-panel__section-label">{{ section.label }}</span>
                  </button>
                  <div
                    class="v-inspector-panel__section-collapse"
                    :class="{ 'v-inspector-panel__section-collapse--expanded': vm.isSectionExpanded(section.value) }"
                  >
                    <div class="v-inspector-panel__section-body">
                      <slot :name="section.value" :section="section">
                        <slot />
                      </slot>
                    </div>
                  </div>
                </div>
              </template>
              <slot v-else />
            </slot>
          </div>
        </Transition>
      </div>
    </aside>
  </Transition>
</template>
