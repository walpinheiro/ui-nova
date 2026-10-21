<script setup lang="ts">
import './VRadioGroup.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVRadioGroup } from './useVRadioGroup'
import type { VRadioGroupProps } from './VRadioGroup.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VRadioGroupProps>(), {
  modelValue: '',
  options: () => [],
  disabled: false,
  size: 'md',
  layout: 'vertical',
  required: false,
  motion: V_MOTION_DEFAULT,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const {
  config,
  descriptionId,
  errorId,
  rootAttrs,
  optionInputId,
  optionDescriptionId,
  optionDescribedBy,
  onChange,
  optionClass,
} = useVRadioGroup(props, emit)
</script>

<template>
  <fieldset v-bind="rootAttrs">
    <legend
      v-if="props.label"
      class="v-radiogroup__legend"
      data-test-id="v-radiogroup-legend"
    >
      {{ props.label }}
    </legend>

    <p
      v-if="props.description"
      :id="descriptionId"
      class="v-radiogroup__group-description"
      data-test-id="v-radiogroup-description"
    >
      {{ props.description }}
    </p>

    <div class="v-radiogroup__options" data-test-id="v-radiogroup-options">
      <label
        v-for="option in config.options"
        :key="option.value"
        class="v-radiogroup__option"
        :class="optionClass(option.value, option.selected, option.disabled)"
        :data-test-id="`v-radiogroup-option-${option.value}`"
      >
        <input
          :id="optionInputId(option.value)"
          class="v-radiogroup__input"
          :data-test-id="`v-radiogroup-input-${option.value}`"
          type="radio"
          :name="config.groupName"
          :value="option.value"
          :checked="option.selected"
          :disabled="option.disabled || undefined"
          :aria-describedby="optionDescribedBy(option.value, option.description)"
          :aria-invalid="config.hasError ? true : undefined"
          @change="onChange(option.value, option.disabled)"
        />

        <span class="v-radiogroup__ring" aria-hidden="true">
          <span class="v-radiogroup__dot" />
        </span>

        <span class="v-radiogroup__content">
          <span
            class="v-radiogroup__label"
            :data-test-id="`v-radiogroup-label-${option.value}`"
          >
            {{ option.label }}
          </span>
          <span
            v-if="option.description"
            :id="optionDescriptionId(option.value)"
            class="v-radiogroup__option-description"
            :data-test-id="`v-radiogroup-description-${option.value}`"
          >
            {{ option.description }}
          </span>
        </span>
      </label>
    </div>

    <p
      v-if="config.hasError"
      :id="errorId"
      class="v-radiogroup__error"
      data-test-id="v-radiogroup-error"
      role="alert"
      aria-live="assertive"
    >
      <VIcon :icon="config.errorIcon" size="sm" class="v-radiogroup__error-icon" />
      <span>{{ props.errorMessage }}</span>
    </p>
  </fieldset>
</template>
