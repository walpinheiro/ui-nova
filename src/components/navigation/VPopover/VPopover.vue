<script setup lang="ts">
import './VPopover.scss'
import { useVPopover } from './useVPopover'
import type { VPopoverEmits, VPopoverProps } from './VPopover.types'

const props = withDefaults(defineProps<VPopoverProps>(), {
  size: 'md',
  placement: 'bottom',
  trigger: 'click',
  disabled: false,
  closable: true,
  showArrow: true,
})
const emit = defineEmits<VPopoverEmits>()
const vm = useVPopover(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <span
      :ref="vm.triggerRef"
      v-bind="vm.triggerAttrs.value"
      @click="vm.onTriggerClick"
      @mouseenter="vm.onTriggerMouseEnter"
      @mouseleave="vm.onTriggerMouseLeave"
      @focusin="vm.onTriggerFocusIn"
      @focusout="vm.onTriggerFocusOut"
    >
      <slot name="trigger">
        <button type="button" class="v-popover__default-trigger">Show popover</button>
      </slot>
    </span>

    <Teleport to="body">
      <Transition name="v-popover" appear @after-enter="vm.updatePosition">
        <div
          v-if="vm.open.value"
          :ref="vm.panelRef"
          v-bind="vm.panelAttrs.value"
          :aria-labelledby="ariaLabelledby ?? (title ? vm.titleId : undefined)"
          :aria-describedby="ariaDescribedby"
          @mouseenter="vm.onPanelMouseEnter"
          @mouseleave="vm.onPanelMouseLeave"
          @keydown="vm.onPanelKeydown"
        >
          <span
            v-if="showArrow"
            class="v-popover__arrow"
            :class="`v-popover__arrow--${placement}`"
            data-test-id="v-popover-arrow"
            aria-hidden="true"
          />

          <header
            v-if="title || closable || $slots.header"
            class="v-popover__header"
            data-test-id="v-popover-header"
          >
            <slot name="header">
              <h4
                v-if="title"
                :id="vm.titleId"
                class="v-popover__title"
                data-test-id="v-popover-title"
              >
                {{ title }}
              </h4>
            </slot>
            <button
              v-if="closable"
              type="button"
              class="v-popover__close"
              data-test-id="v-popover-close"
              aria-label="Close"
              @click="vm.onCloseClick"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="m7 7 10 10M17 7 7 17" />
              </svg>
            </button>
          </header>

          <div class="v-popover__content" data-test-id="v-popover-content">
            <slot />
          </div>

          <footer
            v-if="$slots.footer || $slots.actions"
            class="v-popover__footer"
            data-test-id="v-popover-actions"
          >
            <slot name="footer" />
            <slot name="actions" />
          </footer>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
