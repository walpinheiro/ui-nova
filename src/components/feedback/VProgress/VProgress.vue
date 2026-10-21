<script setup lang="ts">
import './VProgress.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVProgress } from './useVProgress'
import type { VProgressProps } from './VProgress.types'

const props = withDefaults(defineProps<VProgressProps>(), {
  variant: 'linear',
  size: 'md',
  value: 0,
  state: 'determinate',
  label: true,
})

const vm = useVProgress(props)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <template v-if="vm.config.value.variant === 'linear'">
      <div class="v-progress__linear">
        <span
          v-if="vm.config.value.showSuccessIcon"
          class="v-progress__status-icon v-progress__status-icon--success"
          data-test-id="progress-complete-icon"
          aria-hidden="true"
        >
          <VIcon :icon="vm.config.value.completeIcon" size="sm" />
        </span>
        <span
          v-if="vm.config.value.showErrorIcon"
          class="v-progress__status-icon v-progress__status-icon--error"
          data-test-id="progress-error-icon"
          aria-hidden="true"
        >
          <VIcon :icon="vm.config.value.errorIcon" size="sm" />
        </span>
        <div
          class="v-progress__track"
          data-test-id="progress-track"
          v-bind="(vm.progressAttrs.value as Record<string, unknown>)"
        >
          <div
            class="v-progress__value"
            :class="{ 'v-progress__value--indeterminate': vm.config.value.state === 'indeterminate' }"
            :style="vm.linearValueStyle.value"
            :data-test-id="vm.config.value.valueTestId"
          />
        </div>
      </div>
      <span
        v-if="vm.config.value.showLabel"
        class="v-progress__label"
        data-test-id="progress-label"
      >{{ vm.config.value.labelText }}</span>
    </template>

    <template v-else>
      <div
        class="v-progress__circular-wrap"
        :style="vm.circularWrapStyle.value"
      >
        <svg
          class="v-progress__circular"
          data-test-id="progress-circular"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          :width="vm.config.value.circularSize"
          :height="vm.config.value.circularSize"
          :style="vm.circularSvgStyle.value"
          v-bind="(vm.progressAttrs.value as Record<string, unknown>)"
        >
          <circle
            class="v-progress__ring-track"
            data-test-id="progress-track"
            cx="50"
            cy="50"
            r="45"
            :stroke-width="vm.config.value.ringStrokeWidth"
          />
          <circle
            class="v-progress__ring-value"
            :class="{ 'v-progress__ring-value--indeterminate': vm.config.value.state === 'indeterminate' }"
            cx="50"
            cy="50"
            r="45"
            :stroke-width="vm.config.value.ringStrokeWidth"
            :style="vm.circularValueStyle.value"
            :data-test-id="vm.config.value.valueTestId"
          />
        </svg>
        <span class="v-progress__circular-center" aria-hidden="true">
          <span
            v-if="vm.config.value.showSuccessIcon"
            class="v-progress__status-icon v-progress__status-icon--success"
            data-test-id="progress-complete-icon"
          >
            <VIcon :icon="vm.config.value.completeIcon" size="sm" />
          </span>
          <span
            v-else-if="vm.config.value.showErrorIcon"
            class="v-progress__status-icon v-progress__status-icon--error"
            data-test-id="progress-error-icon"
          >
            <VIcon :icon="vm.config.value.errorIcon" size="sm" />
          </span>
          <span
            v-else-if="vm.config.value.showLabel"
            class="v-progress__label"
            data-test-id="progress-label"
          >{{ vm.config.value.labelText }}</span>
        </span>
      </div>
    </template>
  </div>
</template>
