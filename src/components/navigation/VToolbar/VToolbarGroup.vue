<script setup lang="ts">
defineProps<{ ariaLabel?: string }>()
</script>

<template>
  <div
    class="v-toolbar__group"
    role="group"
    :aria-label="ariaLabel"
    data-test-id="v-toolbar-group"
  >
    <slot />
  </div>
</template>
