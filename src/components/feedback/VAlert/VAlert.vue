<script setup lang="ts">
import './VAlert.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVAlert } from './useVAlert'
import type { VAlertEmit, VAlertProps } from './VAlert.types'

const props = withDefaults(defineProps<VAlertProps>(), {
  modelValue: undefined,
  size: 'md',
  variant: 'info',
  layout: 'inline',
  disabled: false,
  loading: false,
  dismissible: false,
})

const emit = defineEmits<VAlertEmit>()
const { canDismiss, config, dismiss, dismissLabel, rootAttrs, visible } = useVAlert(props, emit)
</script>

<template>
  <Transition name="v-alert">
    <div v-if="visible" v-bind="rootAttrs" role="alert">
      <span
        v-if="loading"
        class="v-alert__icon v-alert__icon--loading"
        data-test-id="v-alert-icon"
      >
        <span
          class="v-alert__loader"
          data-test-id="v-alert-spinner"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        />
      </span>
      <span v-else class="v-alert__icon" data-test-id="v-alert-icon" role="img" :aria-label="`${config.variant} alert`">
        <slot name="icon">
          <VIcon :icon="config.iconData" size="sm" />
        </slot>
      </span>

      <div class="v-alert__content" data-test-id="v-alert-content">
        <span v-if="$slots.title || title" class="v-alert__title" data-test-id="v-alert-title">
          <slot name="title">{{ title }}</slot>
        </span>
        <span v-if="$slots.description || description" class="v-alert__description" data-test-id="v-alert-description">
          <slot name="description">{{ description }}</slot>
        </span>
        <span v-if="$slots.default" class="v-alert__message" data-test-id="v-alert-message"><slot /></span>
        <span v-else-if="!title && !description && !$slots.title && !$slots.description" class="v-alert__title" data-test-id="v-alert-title">
          Alert
        </span>
      </div>

      <div v-if="$slots.action" class="v-alert__action" data-test-id="v-alert-action"><slot name="action" /></div>

      <button
        v-if="dismissible"
        type="button"
        class="v-alert__close"
        data-test-id="v-alert-close"
        :aria-label="dismissLabel"
        :disabled="!canDismiss"
        :aria-disabled="canDismiss ? undefined : 'true'"
        @click="dismiss"
      >
        <VIcon :icon="config.closeIcon" size="sm" />
      </button>
    </div>
  </Transition>
</template>
