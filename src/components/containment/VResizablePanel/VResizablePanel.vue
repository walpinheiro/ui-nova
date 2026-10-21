<script setup lang="ts">
import './VResizablePanel.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVResizablePanel } from './useVResizablePanel'
import type { VResizablePanelEmits, VResizablePanelProps } from './VResizablePanel.types'

const props = withDefaults(defineProps<VResizablePanelProps>(), {
  size: 'md',
  orientation: undefined,
  min: 0,
  max: 1200,
  variant: undefined,
  disabled: false,
  loading: false,
  collapsible: false,
})
const emit = defineEmits<VResizablePanelEmits>()
const vm = useVResizablePanel(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value" role="group">
    <span
      class="v-resizable-panel__live"
      data-test-id="v-resizable-panel-live"
      aria-live="polite"
      aria-atomic="true"
    >{{ vm.ariaLiveMessage.value }}</span>
    <span v-if="loading" class="v-resizable-panel__loader" data-test-id="v-resizable-panel-loader" aria-hidden="true" />

    <div class="v-resizable-panel__surface" data-test-id="v-resizable-panel-surface">
      <div class="v-resizable-panel__content" data-test-id="v-resizable-panel-content">
        <slot>Resizable Panel</slot>
      </div>
    </div>

    <div class="v-resizable-panel__edge" data-test-id="v-resizable-panel-edge" aria-hidden="true">
      <span class="v-resizable-panel__limit v-resizable-panel__limit--min" data-test-id="v-resizable-panel-min" />
      <div
        v-bind="vm.handleAttrs.value"
        class="v-resizable-panel__handle"
        @pointerdown="vm.onHandlePointerDown"
        @pointermove="vm.onHandlePointerMove"
        @pointerup="vm.onHandlePointerUp"
        @pointercancel="vm.onHandlePointerUp"
        @keydown="vm.onHandleKeyDown"
      >
        <VIcon
          v-if="vm.handleIcon.value"
          :icon="vm.handleIcon.value"
          size="sm"
          class="v-resizable-panel__handle-icon"
        />
        <span v-else class="v-resizable-panel__handle-grip" aria-hidden="true" />
        <span class="v-resizable-panel__tooltip" data-test-id="v-resizable-panel-drag-tooltip" aria-hidden="true">
          Drag to resize
        </span>
      </div>
      <span class="v-resizable-panel__limit v-resizable-panel__limit--max" data-test-id="v-resizable-panel-max" />
    </div>

    <button
      v-if="vm.config.value.collapsible && !vm.collapsed.value"
      v-bind="vm.collapseAttrs.value"
      class="v-resizable-panel__collapse"
      @click="vm.toggleCollapse"
    >
      <VIcon :icon="vm.collapseIcon.value" size="sm" />
    </button>
  </div>
</template>
