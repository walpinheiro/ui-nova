<script setup lang="ts">
import './VMasonryGrid.scss'
import { VIcon } from '../../primitives/VIcon'
import { VSpinner } from '../../feedback/VSpinner'
import { MASONRY_UI_ICONS } from './mountVMasonryGrid'
import { useVMasonryGrid } from './useVMasonryGrid'
import type { VMasonryGridProps } from './VMasonryGrid.types'

const props = withDefaults(defineProps<VMasonryGridProps>(), {
  cols: 3,
  gap: 6,
  variant: 'default',
  loading: false,
  empty: false,
})

const vm = useVMasonryGrid(props)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <template v-if="loading">
      <div
        v-for="n in vm.resolvedCols.value * 2"
        :key="n"
        class="v-masonry-grid__skeleton"
        data-test-id="masonry-skeleton"
      />
      <div class="v-masonry-grid__loading" data-test-id="masonry-state-loading" aria-live="polite">
        <VSpinner size="md" />
        <span>Loading items…</span>
      </div>
    </template>
    <div v-else-if="empty" class="v-masonry-grid__empty" data-test-id="masonry-state-empty">
      <VIcon :icon="MASONRY_UI_ICONS.image" size="lg" />
      <span>No items yet</span>
    </div>
    <slot v-else />
  </div>
</template>
