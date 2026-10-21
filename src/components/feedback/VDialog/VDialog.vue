<script setup lang="ts">
import './VDialog.scss'
import { computed, useSlots } from 'vue'
import { VIcon } from '../../primitives/VIcon'
import { V_DIALOG_CLOSE_ICON } from './mountVDialog'
import { useVDialog } from './useVDialog'
import type { VDialogEmits, VDialogProps } from './VDialog.types'

const props = withDefaults(defineProps<VDialogProps>(), {
  modelValue: undefined,
  open: undefined,
  title: undefined,
  description: undefined,
  showClose: true,
  dismissible: true,
  persistent: false,
  disabled: false,
  loading: false,
  size: 'md',
  variant: 'basic',
  intent: 'neutral',
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  ariaLabel: undefined,
  ariaDescribedby: undefined,
  closeLabel: 'Close dialog',
})
const emit = defineEmits<VDialogEmits>()
const slots = useSlots()
const vm = useVDialog(props, emit)

const showIcon = computed(
  () =>
    Boolean(slots.icon) ||
    vm.config.value.showConfirmActions ||
    (vm.config.value.variant !== 'basic' && vm.config.value.variant !== 'form'),
)

const showHeader = computed(
  () =>
    Boolean(
      slots.header ||
        props.title ||
        slots.title ||
        props.description ||
        slots.description ||
        showIcon.value ||
        vm.config.value.showClose,
    ),
)

const showFooter = computed(
  () => Boolean(slots.actions || slots.footer || vm.config.value.showConfirmActions),
)

const showBody = computed(() => Boolean(slots.default) || vm.config.value.loading)
</script>

<template>
  <Teleport to="body">
    <div v-if="vm.isOpen.value" v-bind="vm.rootAttrs.value">
      <div v-bind="vm.backdropAttrs.value" @click="vm.onBackdropClick()" />
      <Transition name="v-dialog-surface" appear>
        <section
          :ref="(element) => vm.setPanelRef(element)"
          v-bind="vm.panelAttrs.value"
          :aria-label="ariaLabel || (!title && !$slots.title ? 'Dialog' : undefined)"
          :aria-labelledby="title || $slots.title ? vm.titleId : undefined"
          :aria-describedby="ariaDescribedby || (description || $slots.description ? vm.descriptionId : undefined)"
          @keydown="vm.onPanelKeydown($event)"
        >
          <header v-if="showHeader" class="v-dialog__header" data-test-id="dialog-header">
            <slot name="header">
              <div v-if="showIcon" class="v-dialog__icon" data-test-id="dialog-icon" aria-hidden="true">
                <slot name="icon">
                  <VIcon :icon="vm.config.value.iconData" size="md" />
                </slot>
              </div>
              <div class="v-dialog__titles">
                <h2 v-if="title" :id="vm.titleId" class="v-dialog__title" data-test-id="dialog-title">{{ title }}</h2>
                <h2 v-else-if="$slots.title" :id="vm.titleId" class="v-dialog__title" data-test-id="dialog-title">
                  <slot name="title" />
                </h2>
                <p
                  v-if="description"
                  :id="vm.descriptionId"
                  class="v-dialog__description"
                  data-test-id="dialog-description"
                >
                  {{ description }}
                </p>
                <p
                  v-else-if="$slots.description"
                  :id="vm.descriptionId"
                  class="v-dialog__description"
                  data-test-id="dialog-description"
                >
                  <slot name="description" />
                </p>
              </div>
              <button
                v-if="vm.config.value.showClose"
                type="button"
                class="v-dialog__close"
                data-test-id="dialog-close-button"
                :aria-label="closeLabel"
                :disabled="vm.config.value.disabled || vm.config.value.loading || undefined"
                @click="vm.onCloseClick()"
              >
                <VIcon :icon="V_DIALOG_CLOSE_ICON" size="sm" />
              </button>
            </slot>
          </header>

          <div v-if="showBody" class="v-dialog__content" data-test-id="dialog-content">
            <span
              v-if="vm.config.value.loading"
              class="v-dialog__loader"
              data-test-id="dialog-loader"
              role="status"
              aria-live="polite"
              aria-label="Loading"
            />
            <slot />
          </div>

          <footer v-if="showFooter" class="v-dialog__footer" data-test-id="dialog-footer">
            <div v-if="$slots.footer" class="v-dialog__footer-extra">
              <slot name="footer" />
            </div>
            <div class="v-dialog__actions" data-test-id="dialog-actions">
              <slot name="actions">
                <template v-if="vm.config.value.showConfirmActions">
                  <button
                    v-if="vm.config.value.showCancel"
                    type="button"
                    class="v-dialog__action v-dialog__action--cancel"
                    data-test-id="dialog-action-cancel"
                    :disabled="vm.config.value.disabled || vm.config.value.loading || undefined"
                    @click="vm.onCancelClick()"
                  >
                    {{ vm.config.value.cancelText }}
                  </button>
                  <button
                    type="button"
                    class="v-dialog__action v-dialog__action--confirm"
                    :class="`v-dialog__action--${vm.config.value.intent}`"
                    data-test-id="dialog-action-confirm"
                    :disabled="vm.config.value.disabled || vm.config.value.loading || undefined"
                    :aria-busy="vm.config.value.loading || undefined"
                    @click="vm.onConfirmClick($event)"
                  >
                    <span v-if="vm.config.value.loading" class="v-dialog__action-loader" aria-hidden="true" />
                    {{ vm.config.value.confirmText }}
                  </button>
                </template>
              </slot>
            </div>
          </footer>
        </section>
      </Transition>
    </div>
  </Teleport>
</template>
