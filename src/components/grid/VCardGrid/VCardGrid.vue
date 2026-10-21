<script setup lang="ts">
import './VCardGrid.scss'
import { useVCardGrid } from './useVCardGrid'
import type { VCardGridProps } from './VCardGrid.types'

const props = withDefaults(defineProps<VCardGridProps>(), {
  cols: 3,
  gap: 6,
})

const vm = useVCardGrid(props)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <slot />
  </div>
</template>
