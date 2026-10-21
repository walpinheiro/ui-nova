<script setup lang="ts">
import './VBanner.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVBanner } from './useVBanner'
import type { VBannerProps } from './VBanner.types'
const props = withDefaults(defineProps<VBannerProps>(), {
  // Vue casts absent Boolean props to false; null preserves the uncontrolled default.
  modelValue: null as unknown as boolean,
  size: 'md',
  variant: 'info',
  closable: false,
  closeOnEscape: true,
  disabled: false,
  loading: false,
  dismissLabel: 'Dismiss banner',
  dismissedText: 'Banner dismissed',
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()
const vm = useVBanner(props, emit)
</script>

<template>
  <Transition name="v-banner" mode="out-in">
    <div
      v-if="!vm.dismissed.value"
      v-bind="vm.rootAttrs.value"
      @keydown="vm.handleKeydown"
    >
      <span class="v-banner__icon" data-test-id="v-banner-icon" aria-hidden="true">
        <slot name="icon">
          <VIcon :icon="vm.config.value.iconData" size="sm" />
        </slot>
      </span>

      <div class="v-banner__content" data-test-id="v-banner-content">
        <div v-if="props.title || $slots.title" class="v-banner__title" data-test-id="v-banner-title">
          <slot name="title">{{ props.title }}</slot>
        </div>
        <div v-if="props.description || $slots.description" class="v-banner__description" data-test-id="v-banner-description">
          <slot name="description">{{ props.description }}</slot>
        </div>
        <div
          v-if="!props.title && !props.description && !$slots.title && !$slots.description"
          class="v-banner__body"
          data-test-id="v-banner-body"
        >
          <slot>Banner</slot>
        </div>
      </div>

      <div v-if="$slots.action" class="v-banner__actions" data-test-id="v-banner-actions">
        <slot name="action" />
      </div>

      <button
        v-if="vm.config.value.closable"
        type="button"
        class="v-banner__dismiss"
        data-test-id="v-banner-dismiss"
        :aria-label="props.dismissLabel"
        :disabled="vm.config.value.disabled || vm.config.value.loading"
        @click="vm.dismiss"
      >
        <VIcon :icon="vm.config.value.closeIcon" size="sm" />
      </button>

      <span
        v-if="vm.config.value.loading"
        class="v-banner__loader"
        data-test-id="v-banner-loader"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      />
    </div>

    <div
      v-else
      v-bind="vm.rootAttrs.value"
      class="v-banner--dismissed"
      data-test-id="v-banner-dismissed-placeholder"
      role="status"
      aria-live="polite"
    >
      <span class="v-banner__dismissed-text">{{ props.dismissedText }}</span>
    </div>
  </Transition>
</template>
