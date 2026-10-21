<script setup lang="ts">
import './VTooltip.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVTooltip } from './useVTooltip'
import type { VTooltipProps } from './VTooltip.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VTooltipProps>(), {
  size: 'md',
  variant: 'default',
  placement: 'top',
  disabled: false,
  showArrow: true,
  hideDelay: 500,
  motion: V_MOTION_DEFAULT,
})

const vm = useVTooltip(props)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <span
      :ref="vm.triggerRef"
      v-bind="vm.triggerAttrs.value"
      @mouseenter="vm.onTriggerMouseEnter"
      @mouseleave="vm.onTriggerMouseLeave"
      @focusin="vm.onTriggerFocusIn"
      @focusout="vm.onTriggerFocusOut"
      @pointerdown="vm.onTriggerPointerDown"
      @pointerup="vm.onTriggerPointerUp"
      @pointercancel="vm.onTriggerPointerCancel"
    >
      <slot />
    </span>

    <Teleport to="body">
      <Transition name="v-tooltip" appear @after-enter="vm.updatePosition">
        <div
          v-if="vm.visible.value && !disabled"
          :ref="vm.panelRef"
          v-bind="vm.panelAttrs.value"
        >
          <span
            v-if="showArrow"
            class="v-tooltip__arrow"
            :class="`v-tooltip__arrow--${placement}`"
            data-test-id="tooltip-arrow"
            aria-hidden="true"
          />

          <div class="v-tooltip__content" data-test-id="tooltip-content">
            <span
              v-if="vm.config.value.showIcon"
              class="v-tooltip__icon"
              aria-hidden="true"
            >
              <slot name="icon">
                <VIcon :icon="vm.config.value.iconData!" size="sm" />
              </slot>
            </span>
            <slot name="content">
              <span v-if="content">{{ content }}</span>
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
