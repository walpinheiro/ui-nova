<script setup lang="ts">
import './VSpinner.scss'
import { useVSpinner } from './useVSpinner'
import type { VSpinnerProps } from './VSpinner.types'

const props = withDefaults(defineProps<VSpinnerProps>(), {
  variant: 'circular',
  color: 'primary',
  size: 'md',
  label: 'Loading',
  disabled: false,
  loading: true,
  paused: false,
  latticeSize: 3,
  resolved: null,
})

const vm = useVSpinner(props)
</script>

<template>
  <span v-bind="vm.rootAttrs.value">
    <span
      v-if="vm.config.value.variant === 'lattice'"
      class="v-spinner__lattice"
      data-test-id="v-spinner-lattice"
      :class="`v-spinner__lattice--${vm.config.value.latticeSize}`"
      aria-hidden="true"
    >
      <span
        v-for="cell in vm.config.value.latticeCells"
        :key="cell"
        class="v-spinner__lattice-cell"
        :style="{ animationDelay: `${(cell % vm.config.value.latticeSize) * 80}ms` }"
      />
      <span
        v-if="vm.config.value.resolved === 'success'"
        class="v-spinner__lattice-resolved v-spinner__lattice-resolved--success"
      >✓</span>
      <span
        v-else-if="vm.config.value.resolved === 'error'"
        class="v-spinner__lattice-resolved v-spinner__lattice-resolved--error"
      >✕</span>
    </span>
    <span
      v-else-if="vm.config.value.variant === 'dots'"
      class="v-spinner__dots"
      data-test-id="v-spinner-indicator"
      aria-hidden="true"
    >
      <span class="v-spinner__dot" data-test-id="v-spinner-track" />
      <span class="v-spinner__dot v-spinner__dot--center" />
      <span class="v-spinner__dot" />
    </span>
    <span
      v-else
      class="v-spinner__ring"
      :class="{
        'v-spinner__ring--inline': vm.config.value.variant === 'inline',
        'v-spinner__ring--track': vm.config.value.variant === 'ring' || vm.config.value.variant === 'circular',
      }"
      data-test-id="v-spinner-indicator"
      aria-hidden="true"
    >
      <span class="v-spinner__track" data-test-id="v-spinner-track" />
    </span>
    <span v-if="label" class="v-spinner__label" data-test-id="v-spinner-label">{{ label }}</span>
    <slot />
  </span>
</template>
