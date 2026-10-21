<script setup lang="ts">
import './VButton.scss'
import { computed } from 'vue'
import { useVButton } from './useVButton'
import { useVButtonMicro } from './useVButtonMicro'
import type { VButtonProps } from './VButton.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VButtonProps>(), {
  size: 'md',
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  motion: V_MOTION_DEFAULT,
  microInteraction: 'default',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  undo: []
  confirmed: []
}>()

const { config, rootAttrs } = useVButton(props)
const micro = useVButtonMicro(props, emit)

const hasMicro = computed(
  () => micro.isFuse.value || micro.isHold.value || micro.isFavorite.value,
)

const onClick = (event: MouseEvent) => {
  if (micro.fuseActive.value) {
    micro.onFuseUndo(event)
    return
  }
  if (micro.isFavorite.value) {
    micro.onFavoriteClick(event)
    return
  }
  emit('click', event)
  if (micro.isFuse.value) micro.startFuse()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && micro.fuseActive.value) {
    micro.onFuseUndo(event as unknown as MouseEvent)
  }
}
</script>

<template>
  <button
    v-bind="rootAttrs"
    :class="[hasMicro ? micro.microClass.value : null]"
    :style="hasMicro ? { ...micro.fuseStyle.value, ...micro.holdStyle.value } : undefined"
    :disabled="config.disabled"
    @click="onClick"
    @keydown="onKeydown"
    @pointerdown="micro.isHold.value ? micro.onHoldPointerDown : undefined"
    @pointerup="micro.isHold.value ? micro.onHoldPointerUp : undefined"
    @pointercancel="micro.isHold.value ? micro.onHoldPointerUp : undefined"
  >
    <span v-if="micro.isHold.value && micro.holding.value" class="v-button__hold-fill" aria-hidden="true" />
    <span
      v-if="micro.isFuse.value && micro.fuseActive.value"
      class="v-button__fuse-track"
      aria-hidden="true"
    />
    <span
      v-if="config.variant === 'icon' && !config.loading"
      class="v-button__icon"
      data-test-id="v-button-icon"
    >
      <slot name="icon"><slot>Button</slot></slot>
    </span>
    <span
      v-else-if="$slots.icon && !config.loading"
      class="v-button__icon"
      data-test-id="v-button-icon"
    >
      <slot name="icon" />
    </span>
    <span v-if="config.variant !== 'icon'" class="v-button__label" data-test-id="v-button-label">
      <template v-if="micro.isFuse.value && micro.fuseActive.value">
        <slot name="undo-label">Desfazer</slot>
      </template>
      <slot v-else>Button</slot>
    </span>
    <span
      v-if="$slots['icon-end'] && config.variant !== 'icon'"
      class="v-button__icon v-button__icon--end"
      data-test-id="v-button-icon-end"
    >
      <slot name="icon-end" />
    </span>
    <span
      v-if="config.loading"
      class="v-button__loader"
      data-test-id="v-button-spinner"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    />
    <span
      v-if="micro.isFavorite.value && micro.favoriteCount !== undefined"
      class="v-button__favorite-count"
      data-test-id="v-button-favorite-count"
    >
      {{ micro.favoriteCount }}
    </span>
  </button>
</template>
