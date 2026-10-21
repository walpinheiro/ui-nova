<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    zoom?: number
  }>(),
  { label: 'Canvas', zoom: 100 },
)
</script>

<template>
  <div class="canvas-workspace" data-test-id="template-canvas">
    <div class="canvas-workspace__surface">
      <div class="canvas-workspace__selection">
        <span class="canvas-workspace__selection-label">{{ label }}</span>
      </div>
      <div class="canvas-workspace__guide canvas-workspace__guide--h" aria-hidden="true" />
      <div class="canvas-workspace__guide canvas-workspace__guide--v" aria-hidden="true" />
    </div>
    <footer class="canvas-workspace__toolbar">
      <div class="canvas-workspace__tools">
        <button type="button" class="canvas-workspace__tool" aria-label="Seleção">▢</button>
        <button type="button" class="canvas-workspace__tool" aria-label="Pan">✥</button>
      </div>
      <div class="canvas-workspace__zoom">
        <button type="button" class="canvas-workspace__zoom-btn" aria-label="Diminuir zoom">−</button>
        <span>{{ zoom }}%</span>
        <button type="button" class="canvas-workspace__zoom-btn" aria-label="Aumentar zoom">+</button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.canvas-workspace {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
  min-height: 320px;
  background: var(--v-color-surface-muted);

  &__surface {
    position: relative;
    overflow: hidden;
    background-color: var(--v-color-elevated);
    background-image: radial-gradient(var(--v-color-border) 1px, transparent 1px);
    background-size: 16px 16px;
  }

  &__selection {
    position: absolute;
    top: 28%;
    left: 22%;
    width: 42%;
    height: 36%;
    border: var(--v-border-width-focus) solid var(--v-color-primary);
    border-radius: var(--v-radius-4);
    background: color-mix(in srgb, var(--v-color-primary) 12%, transparent);
    box-shadow: var(--v-shadow-sm);
  }

  &__selection-label {
    position: absolute;
    top: calc(-1 * var(--v-space-6));
    left: 0;
    padding: var(--v-space-1) var(--v-space-2);
    border-radius: var(--v-radius-pill);
    background: var(--v-color-primary);
    color: var(--v-color-on-primary);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
  }

  &__guide {
    position: absolute;
    border: 1px dashed var(--v-color-primary-400);
    pointer-events: none;

    &--h {
      top: 46%;
      left: 0;
      right: 0;
      height: 0;
    }

    &--v {
      top: 0;
      bottom: 0;
      left: 43%;
      width: 0;
    }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-space-4);
    padding: var(--v-space-2) var(--v-space-4);
    border-top: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-elevated);
  }

  &__tools,
  &__zoom {
    display: flex;
    align-items: center;
    gap: var(--v-space-2);
  }

  &__tool,
  &__zoom-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--v-space-8);
    min-height: var(--v-space-8);
    padding: 0 var(--v-space-2);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-4);
    background: var(--v-color-surface);
    color: var(--v-color-text);
    cursor: pointer;
    font-size: var(--v-font-size-text-small);

    &:hover {
      background: var(--v-color-neutral-100);
    }
  }

  &__zoom span {
    min-width: 3rem;
    text-align: center;
    font-size: var(--v-font-size-caption);
    color: var(--v-color-text-muted);
  }
}
</style>
