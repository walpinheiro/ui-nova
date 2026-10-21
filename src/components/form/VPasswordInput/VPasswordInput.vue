<script setup lang="ts">
import './VPasswordInput.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVPasswordInput } from './useVPasswordInput'
import type { VPasswordInputProps } from './VPasswordInput.types'

const props = withDefaults(defineProps<VPasswordInputProps>(), {
  modelValue: '',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  showStrength: false,
  requirements: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [payload: FocusEvent]
  blur: [payload: FocusEvent]
  'toggle-visibility': [visible: boolean]
}>()

const {
  config,
  inputRef,
  rootAttrs,
  controlAttrs,
  inputAttrs,
  toggleAttrs,
  helperId,
  errorId,
  requirementsId,
  meterId,
  revealed,
  hasValue,
  requirementResults,
  onInput,
  onFocus,
  onBlur,
  toggleVisibility,
  onToggleKeydown,
} = useVPasswordInput(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <label
      v-if="props.label"
      class="v-password-input__label"
      :for="inputAttrs.id"
      data-test-id="v-password-input-label"
    >
      {{ props.label }}
      <span v-if="props.required" class="v-password-input__required" aria-hidden="true">*</span>
    </label>

    <div class="v-password-input__control-shell">
      <div v-bind="controlAttrs">
        <input
          ref="inputRef"
          v-bind="inputAttrs"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />

        <div class="v-password-input__trailing" data-test-id="v-password-input-trailing">
          <button
            v-bind="(toggleAttrs as Record<string, unknown>)"
            data-test-id="v-password-input-toggle"
            @click="toggleVisibility"
            @keydown="onToggleKeydown"
          >
            <VIcon :icon="revealed ? config.hideIcon : config.showIcon" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="config.showStrength && hasValue"
      :id="meterId"
      class="v-password-input__meter"
      data-test-id="v-password-input-meter"
      :data-strength="config.strength"
      role="status"
      aria-live="polite"
    >
      <div class="v-password-input__meter-track" aria-hidden="true">
        <span
          v-for="segment in 3"
          :key="segment"
          class="v-password-input__meter-segment"
          :class="{ 'v-password-input__meter-segment--active': segment <= config.strengthSegments }"
          :data-strength="config.strength"
        />
      </div>
      <span class="v-password-input__meter-label" data-test-id="v-password-input-meter-label">
        {{ config.strengthLabel }}
      </span>
    </div>

    <ul
      v-if="config.showRequirements"
      :id="requirementsId"
      class="v-password-input__requirements"
      data-test-id="v-password-input-requirements"
    >
      <li
        v-for="rule in requirementResults"
        :key="rule.id"
        class="v-password-input__requirement"
        :class="{ 'v-password-input__requirement--met': rule.met }"
        :data-test-id="`v-password-input-requirement-${rule.id}`"
      >
        <VIcon
          :icon="config.checkIcon"
          size="sm"
          class="v-password-input__requirement-icon"
          :class="{ 'v-password-input__requirement-icon--met': rule.met }"
        />
        <span>{{ rule.label }}</span>
      </li>
    </ul>

    <p
      v-if="props.helperText && !config.hasError"
      :id="helperId"
      class="v-password-input__helper"
      data-test-id="v-password-input-helper"
    >
      {{ props.helperText }}
    </p>

    <p
      v-if="config.hasError"
      :id="errorId"
      class="v-password-input__error"
      data-test-id="v-password-input-error"
      role="alert"
      aria-live="assertive"
    >
      <VIcon :icon="config.errorIcon" size="sm" class="v-password-input__error-icon" />
      <span>{{ props.errorMessage }}</span>
    </p>
  </div>
</template>
