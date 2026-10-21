<script setup lang="ts">
import './VDashboardWidgetGrid.scss'
import { useVDashboardWidgetGrid } from './useVDashboardWidgetGrid'
import type { VDashboardWidgetGridEmits, VDashboardWidgetGridProps } from './VDashboardWidgetGrid.types'

const props = withDefaults(defineProps<VDashboardWidgetGridProps>(), {
  cols: 12,
  rowHeight: 128,
  gap: 4,
  variant: 'freeform',
  editMode: false,
  addLabel: '+ Add widget',
  hideToolbar: false,
})

const emit = defineEmits<VDashboardWidgetGridEmits>()
const vm = useVDashboardWidgetGrid(props, (event, ...args) => {
  const handler = emit as (name: keyof VDashboardWidgetGridEmits, ...payload: unknown[]) => void
  handler(event, ...args)
})
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <div v-if="!hideToolbar || $slots.toolbar" class="v-dashboard-widget-grid__toolbar">
      <slot name="toolbar" :edit-mode="vm.editMode.value" :toggle="vm.toggleEditMode" :add="vm.addWidget">
        <button
          type="button"
          class="v-dashboard-widget-grid__edit-btn"
          data-test-id="v-dashboard-widget-grid-edit-layout"
          @click="vm.toggleEditMode()"
        >
          {{ vm.editMode.value ? 'Done editing' : 'Edit layout' }}
        </button>
        <button
          type="button"
          class="v-dashboard-widget-grid__add-btn"
          data-test-id="v-dashboard-widget-grid-add-widget"
          @click="vm.addWidget()"
        >
          {{ addLabel }}
        </button>
      </slot>
    </div>

    <div :ref="(el) => (vm.canvasEl.value = el as HTMLElement | null)" class="v-dashboard-widget-grid__canvas" role="presentation">
      <slot />
    </div>
  </div>
</template>
