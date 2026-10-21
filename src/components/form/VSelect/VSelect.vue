<script setup lang="ts">
import './VSelect.scss'

import { VIcon } from '../../primitives/VIcon'
import { V_SELECT_UI_ICONS } from './mountVSelect'
import { useVSelect } from './useVSelect'
import type { VSelectProps } from './VSelect.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VSelectProps>(), {
  modelValue: '',
  size: 'md',
  disabled: false,
  placeholder: 'Select option',
  motion: V_MOTION_DEFAULT,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'open-change': [value: boolean]
  change: [value: string]
  clear: []
}>()

const {
  config,
  isOpen,
  bindRootRef,
  bindTriggerRef,
  bindPanelRef,
  triggerId,
  errorId,
  rootAttrs,
  triggerAttrs,
  panelAttrs,
  optionAttrs,
  toggle,
  onTriggerKeydown,
  onTriggerFocus,
  onTriggerBlur,
  showClear,
  clearSelection,
  onClearKeydown,
  highlightStyle,
} = useVSelect(props, emit)
</script>

<template>
  <div :ref="bindRootRef" v-bind="rootAttrs">
    <label
      v-if="props.label"
      class="v-select__label"
      :for="triggerId"
      data-test-id="v-select-label"
    >
      {{ props.label }}
    </label>

    <div class="v-select__control-shell">
      <div class="v-select__control">
        <button
          :ref="bindTriggerRef"
          v-bind="triggerAttrs"
          @click="toggle"
          @keydown="onTriggerKeydown"
          @focus="onTriggerFocus"
          @blur="onTriggerBlur"
        >
          <span
            v-if="config.leadingIconData"
            class="v-select__leading-icon"
            aria-hidden="true"
          >
            <slot name="leading-icon">
              <VIcon :icon="config.leadingIconData" size="sm" />
            </slot>
          </span>

          <span
            class="v-select__value"
            :class="{ 'v-select__value--placeholder': !config.hasValue }"
            data-test-id="v-select-value"
          >
            {{ config.displayLabel }}
          </span>

          <button
            v-if="showClear"
            type="button"
            class="v-select__clear"
            data-test-id="v-select-clear"
            aria-label="Clear selection"
            @click="clearSelection"
            @keydown="onClearKeydown"
          >
            <VIcon :icon="V_SELECT_UI_ICONS.clear" size="sm" />
          </button>

          <span class="v-select__chevron-wrap" data-test-id="v-select-chevron" aria-hidden="true">
            <VIcon
              :icon="V_SELECT_UI_ICONS.chevronDown"
              size="sm"
              class="v-select__chevron"
            />
          </span>
        </button>
      </div>

      <div
        v-if="isOpen"
        :ref="bindPanelRef"
        v-bind="panelAttrs"
      >
        <span
          v-if="highlightStyle"
          class="v-select__glide-highlight"
          aria-hidden="true"
          :style="highlightStyle"
        />
        <button
          v-for="option in config.options"
          :key="option.value"
          v-bind="optionAttrs(option)"
        >
          <span class="v-select__option-label">{{ option.label }}</span>
          <VIcon
            v-if="option.value === props.modelValue"
            :icon="V_SELECT_UI_ICONS.check"
            size="sm"
            class="v-select__check"
            :data-test-id="`v-select-check-${option.value}`"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <p
      v-if="config.hasError"
      :id="errorId"
      class="v-select__error"
      data-test-id="v-select-error"
      role="alert"
      aria-live="assertive"
    >
      <VIcon :icon="config.errorIcon" size="sm" class="v-select__error-icon" />
      <span>{{ props.errorMessage }}</span>
    </p>
  </div>
</template>
