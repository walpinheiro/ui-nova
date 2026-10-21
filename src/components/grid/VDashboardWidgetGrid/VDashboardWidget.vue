<script setup lang="ts">
import { VIcon } from '../../primitives/VIcon'
import { DASHBOARD_WIDGET_GRID_UI_ICONS } from './mountVDashboardWidgetGrid'
import { useVDashboardWidget } from './useVDashboardWidget'
import type { VDashboardWidgetEmits, VDashboardWidgetProps } from './VDashboardWidgetGrid.types'

const props = withDefaults(defineProps<VDashboardWidgetProps>(), {
  x: 0,
  y: 0,
  w: 2,
  h: 2,
  locked: false,
  disabled: false,
  focused: false,
  closable: true,
})

const emit = defineEmits<VDashboardWidgetEmits>()
const vm = useVDashboardWidget(props, (event, ...args) => {
  const handler = emit as (name: keyof VDashboardWidgetEmits, ...payload: unknown[]) => void
  handler(event, ...args)
})
</script>

<template>
  <article v-bind="vm.rootAttrs.value" @keydown="vm.onKeydown($event)">
    <header class="v-dashboard-widget__header">
      <button
        v-if="vm.grid?.editMode && !vm.isLocked.value"
        type="button"
        class="v-dashboard-widget__drag-handle"
        data-test-id="v-dashboard-widget-drag-handle"
        aria-label="Move widget"
        @pointerdown="vm.onDragStart($event)"
        @pointermove="vm.onDragMove($event)"
        @pointerup="vm.onDragEnd($event)"
        @pointercancel="vm.onDragEnd($event)"
      >
        <VIcon :icon="DASHBOARD_WIDGET_GRID_UI_ICONS.grip" size="sm" />
      </button>
      <h3 v-if="title" class="v-dashboard-widget__title">{{ title }}</h3>
      <span v-if="vm.isLocked.value" class="v-dashboard-widget__lock" data-test-id="v-dashboard-widget-lock">
        <VIcon :icon="DASHBOARD_WIDGET_GRID_UI_ICONS.lock" size="sm" />
      </span>
      <slot name="header-actions" />
      <button
        v-if="closable && !vm.isLocked.value"
        type="button"
        class="v-dashboard-widget__close"
        data-test-id="v-dashboard-widget-close"
        aria-label="Remove widget"
        @click="vm.onClose()"
      >
        <VIcon :icon="DASHBOARD_WIDGET_GRID_UI_ICONS.close" size="sm" />
      </button>
    </header>
    <div class="v-dashboard-widget__body">
      <slot />
    </div>
    <span
      v-if="vm.grid?.editMode && !vm.isLocked.value && !disabled"
      class="v-dashboard-widget__resize-handle"
      data-test-id="v-dashboard-widget-resize-handle"
      role="separator"
      aria-label="Resize widget"
      @pointerdown="vm.onResizeStart($event)"
      @pointermove="vm.onResizeMove($event)"
      @pointerup="vm.onResizeEnd($event)"
      @pointercancel="vm.onResizeEnd($event)"
    />
  </article>
</template>
