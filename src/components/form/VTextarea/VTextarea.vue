<script setup lang="ts">
import './VTextarea.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVTextarea } from './useVTextarea'
import type { VTextareaProps } from './VTextarea.types'

const props = withDefaults(defineProps<VTextareaProps>(), {
  modelValue: '',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  autoResize: false,
  rows: undefined,
  resize: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [payload: FocusEvent]
  blur: [payload: FocusEvent]
}>()

const {
  config,
  textareaRef,
  rootAttrs,
  controlAttrs,
  textareaAttrs,
  inputId,
  helperId,
  errorId,
  counterId,
  counterText,
  isOverLimit,
  onInput,
  onFocus,
  onBlur,
} = useVTextarea(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <label
      v-if="props.label"
      class="v-textarea__label"
      :for="inputId"
      data-test-id="v-textarea-label"
    >
      {{ props.label }}
      <span v-if="props.required" class="v-textarea__required" aria-hidden="true">*</span>
    </label>

    <div class="v-textarea__control-shell">
      <div v-bind="controlAttrs">
        <textarea
          ref="textareaRef"
          v-bind="textareaAttrs"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>

    <div v-if="props.helperText || config.counter || config.hasError" class="v-textarea__footer">
      <p
        v-if="props.helperText && !config.hasError"
        :id="helperId"
        class="v-textarea__helper"
        data-test-id="v-textarea-helper"
      >
        {{ props.helperText }}
      </p>

      <p
        v-if="config.hasError"
        :id="errorId"
        class="v-textarea__error"
        data-test-id="v-textarea-error"
        role="alert"
        aria-live="assertive"
      >
        <VIcon :icon="config.errorIcon" size="sm" class="v-textarea__error-icon" />
        <span>{{ props.errorMessage }}</span>
      </p>

      <p
        v-if="config.counter"
        :id="counterId"
        class="v-textarea__counter"
        :class="{ 'v-textarea__counter--over': isOverLimit }"
        data-test-id="v-textarea-counter"
        aria-live="polite"
      >
        {{ counterText }}
      </p>
    </div>
  </div>
</template>
