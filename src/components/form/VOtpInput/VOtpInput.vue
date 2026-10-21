<script setup lang="ts">
import './VOtpInput.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVOtpInput } from './useVOtpInput'
import { useVOtpInputSpring } from './useVOtpInputSpring'
import type { VOtpInputProps } from './VOtpInput.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VOtpInputProps>(), {
  modelValue: '',
  length: 6,
  masked: false,
  autoSubmit: false,
  disabled: false,
  success: false,
  size: 'md',
  resendCooldown: 0,
  resendLabel: 'Resend code',
  ariaLabel: 'Verification code',
  motion: V_MOTION_DEFAULT,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
  resend: []
  focus: [payload: FocusEvent]
  blur: [payload: FocusEvent]
}>()

const {
  config,
  hiddenRef,
  rootAttrs,
  hiddenAttrs,
  slotChars,
  activeIndex,
  helperId,
  errorId,
  countdown,
  displayChar,
  formatCountdown,
  onHiddenInput,
  onHiddenKeydown,
  onHiddenPaste,
  onSlotClick,
  onResend,
  onFocus,
  onBlur,
} = useVOtpInput(props, emit)

const spring = useVOtpInputSpring(
  props.length,
  () => slotChars.value.filter(Boolean).length,
  () => props.motion === 'expressive',
)
const getSlotStyle = (index: number) => spring.slotStyle(index).value
</script>

<template>
  <div v-bind="rootAttrs">
    <div class="v-otp-input__slots" @click="onSlotClick">
      <template v-for="(char, index) in slotChars" :key="index">
        <span
          v-if="config.separatorIndex === index"
          class="v-otp-input__separator"
          aria-hidden="true"
        >
          -
        </span>
        <span
          class="v-otp-input__slot"
          :class="{
            'v-otp-input__slot--active': activeIndex === index && !config.disabled,
            'v-otp-input__slot--filled': !!char,
          }"
          :style="getSlotStyle(index)"
          :data-test-id="`v-otp-slot-${index}`"
          :data-filled="char ? 'true' : 'false'"
          :data-active="activeIndex === index ? 'true' : 'false'"
          :data-state="char ? 'filled' : activeIndex === index ? 'active' : 'empty'"
          aria-hidden="true"
        >
          {{ displayChar(char) }}
        </span>
      </template>
    </div>

    <input
      :ref="(el) => { hiddenRef = el as HTMLInputElement | null }"
      v-bind="(hiddenAttrs as Record<string, unknown>)"
      @input="onHiddenInput"
      @keydown="onHiddenKeydown"
      @paste="onHiddenPaste"
      @focus="onFocus"
      @blur="onBlur"
    />

    <p
      v-if="config.helperText && !config.hasError"
      :id="helperId"
      class="v-otp-input__helper"
    >
      {{ config.helperText }}
    </p>

    <p
      v-if="config.hasError"
      :id="errorId"
      class="v-otp-input__error"
      data-test-id="v-otp-error"
      role="alert"
      aria-live="assertive"
    >
      <VIcon :icon="config.errorIcon" size="sm" />
      <span>{{ props.errorMessage }}</span>
    </p>

    <p
      v-if="config.hasSuccess"
      class="v-otp-input__success"
      data-test-id="v-otp-success"
      role="status"
      aria-live="polite"
    >
      <VIcon :icon="config.successIcon" size="sm" />
      <span>Code verified</span>
    </p>

    <div v-if="config.hasResend" class="v-otp-input__resend-wrap">
      <button
        type="button"
        class="v-otp-input__resend"
        data-test-id="v-otp-resend"
        :disabled="countdown > 0 || config.disabled"
        @click="onResend"
      >
        {{ config.resendLabel }}
      </button>
      <span
        v-if="countdown > 0"
        class="v-otp-input__countdown"
        data-test-id="v-otp-resend-countdown"
      >
        in {{ formatCountdown(countdown) }}
      </span>
    </div>
  </div>
</template>
