<script setup lang="ts">
import './VSwitch.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVSwitch } from './useVSwitch'
import { useVSwitchMicro } from './useVSwitchMicro'
import type { VSwitchProps } from './VSwitch.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VSwitchProps>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
  showIcon: false,
  motion: V_MOTION_DEFAULT,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const {
  config,
  rootAttrs,
  inputAttrs,
  descriptionId,
  hasLabel,
  activeIcon,
  onChange,
  onKeydown,
} = useVSwitch(props, emit)

const micro = useVSwitchMicro(props, config, emit)
</script>

<template>
  <label v-bind="rootAttrs">
    <input
      v-bind="inputAttrs"
      @change="onChange"
      @keydown="onKeydown"
    />

    <span
      :ref="(el) => { micro.trackRef.value = el as HTMLElement | null }"
      class="v-switch__track"
      data-test-id="v-switch-track"
      aria-hidden="true"
    >
      <span
        v-if="config.showIcon && config.checked"
        class="v-switch__icon"
        data-test-id="v-switch-icon"
      >
        <VIcon :icon="activeIcon" size="sm" />
      </span>
      <span
        :ref="(el) => { micro.thumbRef.value = el as HTMLElement | null }"
        class="v-switch__thumb"
        data-test-id="v-switch-thumb"
        :style="micro.thumbStyle.value"
        @pointerdown="micro.onThumbPointerDown"
        @pointermove="micro.onThumbPointerMove"
        @pointerup="micro.onThumbPointerUp"
        @pointercancel="micro.onThumbPointerUp"
      />
    </span>

    <span v-if="hasLabel" class="v-switch__content">
      <span class="v-switch__label" data-test-id="v-switch-label">
        <slot name="label">{{ props.label }}</slot>
      </span>
      <span
        v-if="props.description"
        :id="descriptionId"
        class="v-switch__description"
        data-test-id="v-switch-description"
      >
        {{ props.description }}
      </span>
    </span>
  </label>
</template>
