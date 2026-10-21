<script setup lang="ts">
import './VAutoLayoutGrid.scss'
import { useVAutoLayoutGrid } from './useVAutoLayoutGrid'
import type { VAutoLayoutGridProps } from './VAutoLayoutGrid.types'

const props = withDefaults(defineProps<VAutoLayoutGridProps>(), {
  minItemWidth: 280,
  behavior: 'auto-fit',
  size: 'medium',
  selectable: false,
})

const vm = useVAutoLayoutGrid(props)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <slot />
    <div
      v-if="$slots['drop-preview']"
      class="v-auto-layout-grid__drop-preview"
      data-test-id="v-auto-layout-grid-drop-preview"
    >
      <slot name="drop-preview" />
    </div>
  </div>
</template>
