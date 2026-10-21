<script setup lang="ts">
import './VEmptyState.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVEmptyState } from './useVEmptyState'
import type { VEmptyStateEmit, VEmptyStateProps } from './VEmptyState.types'

const props = withDefaults(defineProps<VEmptyStateProps>(), {
  size: 'md',
  variant: 'default',
  showIllustration: true,
  compact: false,
  disabled: false,
  loading: false,
  headingLevel: 2,
})
const emit = defineEmits<VEmptyStateEmit>()
const vm = useVEmptyState(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <div
      v-if="vm.config.value.showIllustration || $slots.illustration || $slots.icon"
      class="v-empty-state__illustration"
      data-test-id="v-empty-state-illustration"
      aria-hidden="true"
    >
      <slot name="illustration">
        <span class="v-empty-state__icon" data-test-id="v-empty-state-icon">
          <slot name="icon">
            <VIcon :icon="vm.config.value.iconData" size="lg" />
          </slot>
        </span>
      </slot>
    </div>

    <div class="v-empty-state__content">
      <component
        :is="`h${vm.config.value.headingLevel}`"
        v-if="vm.config.value.title || $slots.title"
        class="v-empty-state__title"
        data-test-id="v-empty-state-title"
      >
        <slot name="title">{{ vm.config.value.title }}</slot>
      </component>

      <p
        v-if="vm.config.value.description || $slots.description"
        class="v-empty-state__description"
        data-test-id="v-empty-state-description"
      >
        <slot name="description">{{ vm.config.value.description }}</slot>
      </p>

      <div
        v-if="vm.config.value.action || $slots.action"
        class="v-empty-state__actions"
      >
        <slot name="action">
          <button
            v-if="vm.config.value.action"
            type="button"
            class="v-empty-state__action"
            data-test-id="v-empty-state-action"
            :disabled="vm.config.value.disabled"
            @click="vm.onActionClick"
          >
            <VIcon
              v-if="vm.actionIcon.value"
              :icon="vm.actionIcon.value"
              size="sm"
              class="v-empty-state__action-icon"
            />
            <span>{{ vm.config.value.action.label }}</span>
          </button>
        </slot>
      </div>
    </div>

    <span
      v-if="vm.config.value.loading"
      class="v-empty-state__loader"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    />
  </div>
</template>
