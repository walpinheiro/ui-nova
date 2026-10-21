<script setup lang="ts">
import './VTextInput.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVTextInput } from './useVTextInput'
import type { VTextInputProps } from './VTextInput.types'

const props = withDefaults(defineProps<VTextInputProps>(), {
  modelValue: '',
  size: 'md',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
  focus: [payload: FocusEvent]
  blur: [payload: FocusEvent]
}>()

const {
  config,
  inputRef,
  rootAttrs,
  controlAttrs,
  inputAttrs,
  inputId,
  helperId,
  errorId,
  successId,
  prefixId,
  suffixId,
  hasLeadingIcon,
  showClear,
  clearAriaLabel,
  onInput,
  onFocus,
  onBlur,
  clear,
  onClearKeydown,
} = useVTextInput(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <label
      v-if="props.label"
      class="v-text-input__label"
      :for="inputId"
      data-test-id="v-text-input-label"
    >
      {{ props.label }}
      <span v-if="props.required" class="v-text-input__required" aria-hidden="true">*</span>
    </label>

    <div class="v-text-input__control-shell">
      <div v-bind="controlAttrs">
      <span
        v-if="hasLeadingIcon"
        class="v-text-input__leading-icon"
        data-test-id="v-text-input-leading-icon"
        aria-hidden="true"
      >
        <slot name="leading-icon">
          <VIcon v-if="config.leadingIconData" :icon="config.leadingIconData" size="sm" />
        </slot>
      </span>

      <span
        v-if="props.prefix"
        :id="prefixId"
        class="v-text-input__prefix"
        data-test-id="v-text-input-prefix"
        aria-hidden="true"
      >
        {{ props.prefix }}
      </span>

      <input
        ref="inputRef"
        v-bind="inputAttrs"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <span
        v-if="props.suffix"
        :id="suffixId"
        class="v-text-input__suffix"
        data-test-id="v-text-input-suffix"
        aria-hidden="true"
      >
        {{ props.suffix }}
      </span>

      <div
        v-if="config.hasError || config.hasSuccess || showClear"
        class="v-text-input__trailing"
        data-test-id="v-text-input-trailing"
      >
        <span
          v-if="config.hasError"
          class="v-text-input__status-icon v-text-input__status-icon--error"
          aria-hidden="true"
        >
          <VIcon :icon="config.errorIcon" size="sm" />
        </span>

        <span
          v-else-if="config.hasSuccess"
          class="v-text-input__status-icon v-text-input__status-icon--success"
          aria-hidden="true"
        >
          <VIcon :icon="config.successIcon" size="sm" />
        </span>

        <button
          v-if="showClear"
          type="button"
          class="v-text-input__clear"
          data-test-id="v-text-input-clear"
          :aria-label="clearAriaLabel"
          @click="clear"
          @keydown="onClearKeydown"
        >
          <VIcon :icon="config.clearIcon" size="sm" />
        </button>
      </div>
      </div>
    </div>

    <p
      v-if="props.helperText && !config.hasError && !config.hasSuccess"
      :id="helperId"
      class="v-text-input__helper"
      data-test-id="v-text-input-helper"
    >
      {{ props.helperText }}
    </p>

    <p
      v-if="config.hasError"
      :id="errorId"
      class="v-text-input__error"
      data-test-id="v-text-input-error"
      role="alert"
      aria-live="assertive"
    >
      <VIcon :icon="config.errorIcon" size="sm" class="v-text-input__error-icon" />
      <span>{{ props.errorMessage }}</span>
    </p>

    <p
      v-if="config.hasSuccess"
      :id="successId"
      class="v-text-input__success"
      data-test-id="v-text-input-success"
      role="status"
      aria-live="polite"
    >
      <VIcon :icon="config.successIcon" size="sm" class="v-text-input__success-icon" />
      <span>{{ props.successMessage }}</span>
    </p>
  </div>
</template>
