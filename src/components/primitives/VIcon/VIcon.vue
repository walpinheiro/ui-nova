<script setup lang="ts">
import './VIcon.scss'
import { computed } from 'vue'
import type { VIconProps } from './VIcon.types'

const props = withDefaults(defineProps<VIconProps>(), {
  size: 'md',
})

const viewBox = computed(() => {
  const width = props.icon?.width ?? 24
  const height = props.icon?.height ?? 24
  return `0 0 ${width} ${height}`
})
</script>

<template>
  <svg
    v-if="icon"
    class="v-icon"
    :class="[`v-icon--${size}`]"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    aria-hidden="true"
    focusable="false"
    data-test-id="v-icon"
    v-html="icon.body"
  />
</template>
