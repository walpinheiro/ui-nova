<script setup lang="ts">
import './VToast.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVToast } from './useVToast'
import { useVToastMotion } from './useVToastMotion'
import type { VToastEmits, VToastProps } from './VToast.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VToastProps>(), {
  size: 'md',
  variant: 'info',
  duration: 5000,
  closable: true,
  showProgress: true,
  loading: false,
  disabled: false,
  modelValue: true,
  motion: V_MOTION_DEFAULT,
})

const emit = defineEmits<VToastEmits>()
const vm = useVToast(props, emit)
const motion = useVToastMotion(props, () => vm.dismiss())
</script>

<template>
  <Transition :name="motion.isExpressive.value ? 'v-toast-spring' : 'v-toast'">
    <div
      v-if="vm.visible.value"
      :ref="(el) => { motion.rootRef.value = el as HTMLElement | null }"
      v-bind="(vm.rootAttrs.value as Record<string, unknown>)"
      :style="motion.rootStyle.value"
      @keydown="vm.onKeydown"
      @mouseenter="vm.pauseTimer"
      @mouseleave="vm.resumeTimer"
      @focusin="vm.pauseTimer"
      @focusout="vm.resumeTimer"
      @pointerdown="motion.onPointerDown"
      @pointermove="motion.onPointerMove"
      @pointerup="motion.onPointerUp"
      @pointercancel="motion.onPointerUp"
    >
      <div v-bind="vm.containerAttrs.value">
        <span class="v-toast__icon" data-test-id="toast-icon" aria-hidden="true">
          <slot name="icon">
            <span
              v-if="vm.config.value.loading"
              class="v-toast__spinner"
              role="status"
              aria-label="Loading"
            />
            <VIcon v-else :icon="vm.config.value.iconData!" size="sm" />
          </slot>
        </span>

        <p class="v-toast__message" data-test-id="toast-message">
          <slot>{{ message }}</slot>
        </p>

        <button
          v-if="closable"
          type="button"
          class="v-toast__close"
          data-test-id="toast-close-button"
          :aria-label="vm.dismissLabel.value"
          :disabled="disabled"
          @click="vm.dismiss"
        >
          <VIcon
            v-if="vm.paused.value"
            :icon="vm.config.value.pauseIcon"
            size="sm"
          />
          <VIcon v-else :icon="vm.config.value.closeIcon" size="sm" />
        </button>

        <div
          v-if="showProgress && !loading && duration > 0"
          class="v-toast__progress"
          data-test-id="toast-progress-bar"
          :class="{ 'v-toast__progress--paused': vm.paused.value }"
          :style="{ transform: `scaleX(${vm.progress.value / 100})` }"
          aria-hidden="true"
        />
      </div>
    </div>
  </Transition>
</template>
