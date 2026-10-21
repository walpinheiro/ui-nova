<script setup lang="ts">
import { V_MOTION_DEFAULT } from '../../../motion/types'
import './VAgentChip.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVAgentChip } from './useVAgentChip'
import type { VAgentChipProps } from './VAgentChip.types'

const props = withDefaults(defineProps<VAgentChipProps>(), {
  label: 'Running tool',
  status: 'pending',
  durationMs: 0,
  motion: V_MOTION_DEFAULT,
})

const emit = defineEmits<{ retry: [] }>()
const vm = useVAgentChip(props, emit)
</script>

<template>
  <span v-bind="vm.rootAttrs.value">
    <span v-if="vm.isPending.value" class="v-agent-chip__fill" aria-hidden="true" />
    <span class="v-agent-chip__label" data-test-id="v-agent-chip-label">
      <slot>{{ vm.config.value.label }}</slot>
    </span>
    <span class="v-agent-chip__duration" data-test-id="v-agent-chip-duration">
      {{ vm.formattedDuration.value }}
    </span>
    <span v-if="vm.isSuccess.value" class="v-agent-chip__icon" data-test-id="v-agent-chip-success-icon" aria-hidden="true">
      <VIcon :icon="vm.config.value.successIcon" size="sm" />
    </span>
    <template v-if="vm.isError.value">
      <span class="v-agent-chip__icon" data-test-id="v-agent-chip-error-icon" aria-hidden="true">
        <VIcon :icon="vm.config.value.errorIcon" size="sm" />
      </span>
      <button v-bind="vm.retryAttrs.value" @click="vm.onRetry">
        <VIcon :icon="vm.config.value.retryIcon" size="sm" />
      </button>
    </template>
  </span>
</template>
