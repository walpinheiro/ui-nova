<script setup lang="ts">
import './VSheet.scss'
import xIcon from '@iconify-icons/keyline-icons/x'
import { VIcon } from '../../primitives/VIcon'
import { useVSheet } from './useVSheet'
import type { VSheetEmits, VSheetProps } from './VSheet.types'

const props = withDefaults(defineProps<VSheetProps>(), {
  open: undefined,
  modelValue: undefined,
  side: 'right',
  size: 'md',
  fullHeight: false,
  title: undefined,
  description: undefined,
  showClose: true,
  closeLabel: 'Close sheet',
  dismissible: true,
  disabled: false,
  loading: false,
  ariaLabel: undefined,
  ariaDescribedby: undefined,
  rootClass: undefined,
  surfaceClass: undefined,
  testIds: undefined,
  rootDataAttrs: undefined,
})
const emit = defineEmits<VSheetEmits>()
const vm = useVSheet(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <div v-bind="vm.backdropAttrs.value" @click="vm.onBackdropClick()" />
    <Transition
      name="v-sheet-surface"
      appear
      @before-enter="vm.onBeforeEnter()"
      @after-enter="vm.onAfterEnter()"
      @before-leave="vm.onBeforeLeave()"
      @after-leave="vm.onAfterLeave()"
    >
      <section
        v-if="vm.isOpen.value"
        :ref="(el) => vm.setPanelRef(el)"
        v-bind="vm.panelAttrs.value"
        :aria-label="ariaLabel || (!title && !$slots.title && !$slots.header ? 'Sheet' : undefined)"
        :aria-labelledby="ariaLabel ? undefined : (title || $slots.title || $slots.header ? vm.titleId : undefined)"
        :aria-describedby="ariaDescribedby || (description || $slots.description ? vm.descriptionId : undefined)"
        @keydown="vm.onPanelKeydown($event)"
      >
        <header
          v-if="title || $slots.title || $slots.header || description || $slots.description || $slots.actions || showClose"
          class="v-sheet__header"
          :data-test-id="testIds?.header ?? 'v-sheet-header'"
        >
          <span class="v-sheet__titles">
            <h2 v-if="title" :id="vm.titleId" class="v-sheet__title" :data-test-id="testIds?.title ?? 'v-sheet-title'">{{ title }}</h2>
            <h2 v-else-if="$slots.title" :id="vm.titleId" class="v-sheet__title" :data-test-id="testIds?.title ?? 'v-sheet-title'">
              <slot name="title" />
            </h2>
            <h2
              v-else-if="$slots.header"
              :id="vm.titleId"
              class="v-sheet__title"
              :data-test-id="testIds?.title ?? 'v-sheet-title'"
            >
              <slot name="header" />
            </h2>
            <p v-if="description" :id="vm.descriptionId" class="v-sheet__description" data-test-id="v-sheet-description">
              {{ description }}
            </p>
            <p
              v-else-if="$slots.description"
              :id="vm.descriptionId"
              class="v-sheet__description"
              data-test-id="v-sheet-description"
            >
              <slot name="description" />
            </p>
          </span>
          <span
            v-if="$slots.actions"
            class="v-sheet__actions"
            data-test-id="v-sheet-actions"
          >
            <slot name="actions" />
          </span>
          <button
            v-if="showClose"
            type="button"
            class="v-sheet__close"
            :data-test-id="testIds?.close ?? 'v-sheet-close'"
            :aria-label="closeLabel"
            :disabled="vm.config.value.disabled || undefined"
            @click="vm.onCloseClick()"
          >
            <slot name="close">
              <VIcon :icon="xIcon" size="sm" class="v-sheet__close-icon" aria-hidden="true" />
            </slot>
          </button>
        </header>

        <div v-if="$slots.prepend" :data-test-id="testIds?.prepend">
          <slot name="prepend" />
        </div>

        <hr
          v-if="title || $slots.title || $slots.header || $slots.prepend || description || $slots.description"
          class="v-sheet__divider"
          :data-test-id="testIds?.divider"
        />

        <div class="v-sheet__content" :data-test-id="testIds?.content ?? 'v-sheet-content'">
          <span
            v-if="loading"
            class="v-sheet__loader"
            data-test-id="v-sheet-loader"
            role="status"
            aria-live="polite"
            aria-label="Loading"
          />
          <slot />
        </div>
        <footer
          v-if="$slots.footer"
          class="v-sheet__footer"
          :data-test-id="testIds?.footer ?? 'v-sheet-footer'"
        >
          <slot name="footer" />
        </footer>
      </section>
    </Transition>
  </div>
</template>
