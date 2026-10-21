<template>
  <div class="motion-examples">
    <button type="button" class="motion-examples__btn motion-examples__btn--fast">
      duration-fast
    </button>
    <button type="button" class="motion-examples__btn motion-examples__btn--normal">
      duration-normal · ease-out
    </button>
    <button type="button" class="motion-examples__btn motion-examples__btn--spring">
      ease-spring
    </button>
    <div class="motion-examples__states">
      <span class="motion-examples__state motion-examples__state--disabled">opacity-disabled</span>
      <span class="motion-examples__state motion-examples__state--loading">opacity-loading</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.motion-examples {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-space-4);
  align-items: center;
  font-family: var(--v-font-family-sans);

  &__btn {
    padding: var(--v-space-2) var(--v-space-4);
    border: var(--v-border-width) solid var(--v-color-border);
    border-radius: var(--v-radius-md);
    background: var(--v-color-elevated);
    cursor: pointer;
    transition-property: transform, box-shadow, background-color;
    font-size: var(--v-font-size-text-small);

    &:hover {
      background: var(--v-color-primary-50);
      box-shadow: var(--v-shadow-sm);
    }

    &:active {
      transform: scale(var(--v-state-press-scale));
    }

    &--fast {
      transition-duration: var(--v-motion-fast);
      transition-timing-function: var(--v-ease-out);
    }

    &--normal {
      transition-duration: var(--v-motion-normal);
      transition-timing-function: var(--v-ease-out);
    }

    &--spring {
      transition-duration: var(--v-motion-normal);
      transition-timing-function: var(--v-ease-spring);
    }
  }

  &__states {
    display: flex;
    gap: var(--v-space-3);
  }

  &__state {
    padding: var(--v-space-2) var(--v-space-3);
    border-radius: var(--v-radius-pill);
    background: var(--v-color-neutral-200);
    font-size: var(--v-font-size-caption);

    &--disabled {
      opacity: var(--v-state-disabled-opacity);
    }

    &--loading {
      opacity: var(--v-state-loading-opacity);
    }
  }
}
</style>
