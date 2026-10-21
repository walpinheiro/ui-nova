<script setup lang="ts">
import './VStepper.scss'
import { VIcon } from '../../primitives/VIcon'
import { STEPPER_CHECK_ICON } from './mountVStepper'
import { useVStepper } from './useVStepper'
import type { VStepperEmits, VStepperProps } from './VStepper.types'

const props = withDefaults(defineProps<VStepperProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  loading: false,
})

const emit = defineEmits<VStepperEmits>()
const vm = useVStepper(props, emit)
</script>

<template>
  <nav v-bind="vm.rootAttrs.value">
    <span
      v-if="loading"
      class="v-stepper__loader"
      data-test-id="v-stepper-loader"
      aria-hidden="true"
    />

    <ol class="v-stepper__list" data-test-id="v-stepper-list">
      <li
        v-for="(step, index) in vm.config.value.steps"
        :key="step.value"
        v-bind="vm.stepAttrs(step)"
      >
        <div class="v-stepper__step-content">
          <button
            v-bind="vm.markerAttrs(step)"
            @click="vm.onStepClick(step)"
            @keydown="vm.onStepKeydown($event, step)"
          >
            <VIcon
              v-if="step.state === 'completed'"
              :icon="STEPPER_CHECK_ICON"
              size="sm"
            />
            <span v-else class="v-stepper__index">{{ index + 1 }}</span>
          </button>

          <div class="v-stepper__text">
            <span class="v-stepper__label" data-test-id="v-stepper-label">{{ step.label }}</span>
            <span
              v-if="step.description"
              class="v-stepper__description"
              data-test-id="v-stepper-description"
            >
              {{ step.description }}
            </span>
          </div>
        </div>

        <span
          v-if="index < vm.config.value.steps.length - 1"
          v-bind="vm.connectorAttrs(step)"
        />
      </li>
    </ol>
  </nav>
</template>
