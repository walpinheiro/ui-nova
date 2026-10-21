<script setup lang="ts">
import { VIcon } from '../../../primitives/VIcon'
import { V_SORTABLE_HEADER_ICONS } from './mountVSortableHeader'
import { useVSortableHeader } from './useVSortableHeader'
import type { VSortableHeaderProps } from './VSortableHeader.types'

const props = withDefaults(defineProps<VSortableHeaderProps>(), {
  direction: null,
  disabled: false,
  size: 'md',
  leadingIcon: false,
})

const emit = defineEmits<{
  sort: [{ direction: 'asc' | 'desc' | null; columnKey?: string; shiftKey: boolean }]
}>()

const vm = useVSortableHeader(props, emit)
</script>

<template>
  <button
    type="button"
    v-bind="vm.rootAttrs.value"
    @click="vm.handleClick"
    @keydown="vm.handleKeydown"
  >
    <span v-if="leadingIcon" class="v-table__sortable-header-leading" aria-hidden="true">
      <VIcon :icon="V_SORTABLE_HEADER_ICONS.leading" size="sm" />
    </span>
    <span class="v-table__sortable-header-label" data-test-id="table-header-sort-label">{{ label }}</span>
    <span class="v-table__sortable-header-indicator" data-test-id="table-header-sort-indicator" aria-hidden="true">
      <VIcon :icon="vm.config.value.indicatorIcon" size="sm" />
    </span>
    <span
      v-if="vm.config.value.showPriority"
      class="v-table__sortable-header-priority"
      data-test-id="table-header-sort-priority"
      aria-hidden="true"
    >
      {{ vm.config.value.priority }}
    </span>
  </button>
</template>
