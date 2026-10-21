<script setup lang="ts">
import './VCheckbox.scss'
import { computed, onMounted } from 'vue'
import { VIcon } from '../../primitives/VIcon'
import { useVCheckbox } from './useVCheckbox'
import { useVCheckboxSpring } from './useVCheckboxSpring'
import type { VCheckboxProps } from './VCheckbox.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VCheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false,
  size: 'md',
  required: false,
  motion: V_MOTION_DEFAULT,
  doneOpacity: 0.42,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const {
  config,
  inputRef,
  rootAttrs,
  inputAttrs,
  helperId,
  errorId,
  descriptionId,
  hasLabel,
  activeIcon,
  isExpressive,
  strikeThroughMode,
  doneOpacity,
  onChange,
  onLinkClick,
  syncIndeterminate,
} = useVCheckbox(props, emit)

const checkedRef = computed(() => config.value.checked)
const spring = useVCheckboxSpring(checkedRef, {
  expressive: isExpressive,
  doneOpacity,
  strikeLag: computed(() => 0.12),
  bounce: computed(() => 0.2),
})
const { boxStyle, fillStyle, tickStyle, labelStyle, ruleStyle } = spring

onMounted(syncIndeterminate)
</script>

<template>
  <div class="v-checkbox-field">
    <label v-bind="rootAttrs">
      <input ref="inputRef" v-bind="inputAttrs" @change="onChange" />

      <span
        class="v-checkbox__box"
        data-test-id="v-checkbox-box"
        aria-hidden="true"
        :style="isExpressive ? boxStyle : undefined"
      >
        <span v-if="isExpressive" class="v-checkbox__fill" :style="fillStyle" />
        <span
          v-if="isExpressive && (config.checked || config.indeterminate)"
          class="v-checkbox__tick"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" class="v-checkbox__tick-svg">
            <path
              class="v-checkbox__tick-path"
              :style="tickStyle"
              pathLength="1"
              d="M5 12.5 L10 17.5 L19 7.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span
          v-else-if="config.checked || config.indeterminate"
          class="v-checkbox__icon"
          data-test-id="v-checkbox-icon"
        >
          <VIcon :icon="activeIcon" size="sm" />
        </span>
      </span>

      <span v-if="hasLabel" class="v-checkbox__content">
        <span
          class="v-checkbox__label"
          data-test-id="v-checkbox-label"
          :style="isExpressive && config.checked ? labelStyle : undefined"
        >
          <slot name="label">
            <template v-if="props.linkHref && props.linkLabel">
              {{ props.label }}
              <a
                :href="props.linkHref"
                class="v-checkbox__link"
                data-test-id="v-checkbox-terms-link"
                @click="onLinkClick"
              >
                {{ props.linkLabel }}
              </a>
            </template>
            <template v-else>{{ props.label }}</template>
          </slot>
          <span
            v-if="isExpressive && strikeThroughMode !== 'none' && config.checked"
            class="v-checkbox__rule"
            :style="ruleStyle"
            aria-hidden="true"
          />
        </span>
        <span
          v-if="props.description"
          :id="descriptionId"
          class="v-checkbox__description"
          data-test-id="v-checkbox-description"
        >
          {{ props.description }}
        </span>
      </span>
    </label>

    <p
      v-if="props.helperText && !config.hasError"
      :id="helperId"
      class="v-checkbox__helper"
      data-test-id="v-checkbox-helper"
    >
      <VIcon :icon="config.helperIcon" size="sm" class="v-checkbox__helper-icon" />
      <span>{{ props.helperText }}</span>
    </p>

    <p
      v-if="config.hasError"
      :id="errorId"
      class="v-checkbox__error"
      data-test-id="v-checkbox-error"
      role="alert"
      aria-live="assertive"
    >
      <VIcon :icon="config.errorIcon" size="sm" class="v-checkbox__error-icon" />
      <span>{{ props.errorMessage }}</span>
    </p>
  </div>
</template>
