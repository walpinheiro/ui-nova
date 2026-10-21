<script setup lang="ts">
defineProps<{ glyph: string; color: string; label?: string }>()
</script>

<template>
  <span class="coin" :style="{ '--coin': color }" role="img" :aria-label="label ?? glyph">
    <span aria-hidden="true">{{ glyph }}</span>
  </span>
</template>

<style scoped lang="scss">
.coin {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--coin) 70%, white), var(--coin) 65%);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, white 35%, transparent), 0 2px 6px color-mix(in srgb, var(--coin) 35%, transparent);
  color: #fff;
  font: 700 13px/1 var(--v-font-family-sans);
}
</style>
