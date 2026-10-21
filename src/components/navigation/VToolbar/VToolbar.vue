<script setup lang="ts">
import './VToolbar.scss'
import { useVToolbar } from './useVToolbar'
import type { VToolbarProps } from './VToolbar.types'

const props = withDefaults(defineProps<VToolbarProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  loading: false,
})
const vm = useVToolbar(props)
</script>

<template>
  <div v-bind="vm.rootAttrs.value" @keydown="vm.onKeydown">
    <span
      v-if="loading"
      class="v-toolbar__loader"
      data-test-id="v-toolbar-loader"
      aria-hidden="true"
    />
    <slot />
  </div>
</template>
