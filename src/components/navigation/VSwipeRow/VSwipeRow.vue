<script setup lang="ts">
import { V_MOTION_DEFAULT } from '../../../motion/types'
import './VSwipeRow.scss'
import { useVSwipeRow } from './useVSwipeRow'
import type { VSwipeRowAction, VSwipeRowProps } from './VSwipeRow.types'

const props = withDefaults(defineProps<VSwipeRowProps>(), {
  actions: () => [],
  disabled: false,
  motion: V_MOTION_DEFAULT,
})

const emit = defineEmits<{
  action: [payload: VSwipeRowAction]
}>()

const vm = useVSwipeRow(props, (event, payload) => {
  if (event === 'action') emit('action', payload)
})
</script>

<template>
  <div
    :ref="(el) => { vm.rootRef.value = el as HTMLElement | null }"
    v-bind="vm.rootAttrs.value"
  >
    <div
      :ref="(el) => { vm.actionsRef.value = el as HTMLElement | null }"
      class="v-swipe-row__actions"
      data-test-id="v-swipe-row-actions"
      :aria-hidden="vm.open.value ? undefined : 'true'"
      :inert="!vm.open.value"
    >
      <button
        v-for="action in vm.config.value.actions"
        :key="action.key"
        type="button"
        class="v-swipe-row__action"
        :class="`v-swipe-row__action--${action.intent ?? 'default'}`"
        :data-test-id="`v-swipe-row-action-${action.key}`"
        @click="vm.onAction(action)"
      >
        {{ action.label }}
      </button>
    </div>

    <div
      :ref="(el) => { vm.contentRef.value = el as HTMLElement | null }"
      class="v-swipe-row__content"
      data-test-id="v-swipe-row-content"
      :style="vm.contentStyle.value"
      :tabindex="vm.hasActions.value && !vm.config.value.disabled ? 0 : undefined"
      :aria-expanded="vm.hasActions.value ? vm.open.value : undefined"
      @keydown="vm.onContentKeydown"
      @click.capture="vm.onContentClickCapture"
      @pointerdown="vm.onContentPointerDown"
      @pointermove="vm.onContentPointerMove"
      @pointerup="vm.onContentPointerUp"
      @pointercancel="vm.onContentPointerCancel"
    >
      <slot />
    </div>
  </div>
</template>
