<script setup lang="ts">
import { VIcon } from '../../primitives/VIcon'
import { AUTO_LAYOUT_GRID_UI_ICONS } from './mountVAutoLayoutGrid'
import { useVAutoLayoutGridItem } from './useVAutoLayoutGridItem'
import type { VAutoLayoutGridItemProps } from './VAutoLayoutGrid.types'

const props = withDefaults(defineProps<VAutoLayoutGridItemProps>(), {
  selected: false,
  disabled: false,
  dragging: false,
  interactive: true,
})

const emit = defineEmits<{ click: [event: MouseEvent | KeyboardEvent]; select: [selected: boolean] }>()
const vm = useVAutoLayoutGridItem(props)

function onActivate(event: MouseEvent | KeyboardEvent) {
  if (props.disabled || props.interactive === false) return
  emit('click', event)
  emit('select', !props.selected)
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.interactive === false) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onActivate(event)
  }
}
</script>

<template>
  <div
    v-bind="vm.rootAttrs.value"
    @click="onActivate($event)"
    @keydown="onKeydown"
  >
    <span
      v-if="selected"
      class="v-auto-layout-grid__selection-badge"
      data-test-id="v-auto-layout-grid-selection-badge"
      aria-hidden="true"
    >
      <VIcon :icon="AUTO_LAYOUT_GRID_UI_ICONS.check" size="sm" />
    </span>
    <slot />
  </div>
</template>
