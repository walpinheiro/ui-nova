<script setup lang="ts">
import './VNumberInput.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVNumberInput } from './useVNumberInput'
import type { VNumberInputProps } from './VNumberInput.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VNumberInputProps>(), {
  modelValue: null,
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  step: 1,
  motion: V_MOTION_DEFAULT,
  interaction: 'scrub',
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  focus: [payload: FocusEvent]
  blur: [payload: FocusEvent]
  increment: []
  decrement: []
}>()

const {
  config,
  inputRef,
  rootAttrs,
  controlAttrs,
  inputAttrs,
  helperId,
  errorId,
  prefixId,
  suffixId,
  canIncrement,
  canDecrement,
  scrub,
  onInput,
  onFocus,
  onBlur,
  onInputKeydown,
  onStepPointerDown,
  onStepPointerUp,
} = useVNumberInput(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <label
      v-if="props.label"
      class="v-number-input__label"
      :for="inputAttrs.id"
      data-test-id="v-number-input-label"
    >
      {{ props.label }}
      <span v-if="scrub.isScrub" class="v-number-input__scrub-hint" aria-hidden="true">↔ arraste</span>
      <span v-if="props.required" class="v-number-input__required" aria-hidden="true">*</span>
    </label>

    <div class="v-number-input__control-shell">
      <div
        v-bind="controlAttrs"
        @pointerdown="scrub.onScrubPointerDown"
        @pointermove="scrub.onScrubPointerMove"
        @pointerup="scrub.onScrubPointerUp"
        @pointercancel="scrub.onScrubPointerUp"
      >
        <span
          v-if="props.prefix"
          :id="prefixId"
          class="v-number-input__prefix"
          data-test-id="v-number-input-prefix"
          aria-hidden="true"
        >
          {{ props.prefix }}
        </span>

        <input
          ref="inputRef"
          v-bind="(inputAttrs as Record<string, unknown>)"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onInputKeydown"
        />

        <span
          v-if="props.suffix"
          :id="suffixId"
          class="v-number-input__suffix"
          data-test-id="v-number-input-suffix"
          aria-hidden="true"
        >
          {{ props.suffix }}
        </span>

        <div class="v-number-input__stepper" data-test-id="v-number-input-stepper">
          <button
            type="button"
            class="v-number-input__stepper-btn v-number-input__stepper-btn--increment"
            data-test-id="v-number-input-increment"
            :disabled="!canIncrement"
            aria-label="Increment value"
            @pointerdown="onStepPointerDown(1)"
            @pointerup="onStepPointerUp"
            @pointerleave="onStepPointerUp"
            @pointercancel="onStepPointerUp"
          >
            <VIcon :icon="config.incrementIcon" size="sm" />
          </button>
          <button
            type="button"
            class="v-number-input__stepper-btn v-number-input__stepper-btn--decrement"
            data-test-id="v-number-input-decrement"
            :disabled="!canDecrement"
            aria-label="Decrement value"
            @pointerdown="onStepPointerDown(-1)"
            @pointerup="onStepPointerUp"
            @pointerleave="onStepPointerUp"
            @pointercancel="onStepPointerUp"
          >
            <VIcon :icon="config.decrementIcon" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <p
      v-if="props.helperText && !config.hasError"
      :id="helperId"
      class="v-number-input__helper"
      data-test-id="v-number-input-helper"
    >
      {{ props.helperText }}
    </p>

    <p
      v-if="config.hasError"
      :id="errorId"
      class="v-number-input__error"
      data-test-id="v-number-input-error"
      role="alert"
      aria-live="assertive"
    >
      <VIcon :icon="config.errorIcon" size="sm" class="v-number-input__error-icon" />
      <span>{{ props.errorMessage }}</span>
    </p>
  </div>
</template>
