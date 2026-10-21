<script setup lang="ts">
import './VSegmentedControl.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVSegmentedControl } from './useVSegmentedControl'
import type { VSegmentedControlProps } from './VSegmentedControl.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VSegmentedControlProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  fullWidth: false,
  motion: V_MOTION_DEFAULT,
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const vm = useVSegmentedControl(props, (event, value) => emit(event as 'update:modelValue', value))
const { trackRef } = vm
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <div ref="trackRef" class="v-segmented-control__track" data-test-id="v-segmented-control-track">
      <span
        class="v-segmented-control__indicator"
        data-test-id="v-segmented-control-indicator"
        aria-hidden="true"
        :style="vm.indicatorStyle.value"
      />
      <button
        v-for="(item, index) in vm.config.value.items"
        :key="item.value"
        :ref="(el) => vm.setSegmentRef(el as HTMLElement | null, index)"
        type="button"
        role="radio"
        class="v-segmented-control__segment"
        :class="{ 'v-segmented-control__segment--icon-only': item.iconData && !item.label }"
        :aria-checked="item.value === vm.config.value.selected"
        :aria-disabled="item.disabled || vm.config.value.disabled || undefined"
        :aria-label="vm.segmentAriaLabel(item)"
        :tabindex="item.value === vm.config.value.selected ? 0 : -1"
        :disabled="item.disabled || vm.config.value.disabled || undefined"
        :data-test-id="`v-segmented-control-segment-${item.value}`"
        @click="vm.select(item.value, item.disabled)"
        @keydown="vm.onKeydown($event, index)"
      >
        <VIcon
          v-if="item.iconData"
          :icon="item.iconData"
          size="sm"
          class="v-segmented-control__icon"
          data-test-id="v-segmented-control-icon"
        />
        <span
          v-if="item.label"
          class="v-segmented-control__label"
          data-test-id="v-segmented-control-label"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
  </div>
</template>
