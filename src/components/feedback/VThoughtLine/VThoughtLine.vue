<script setup lang="ts">
import { V_MOTION_DEFAULT } from '../../../motion/types'
import './VThoughtLine.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVThoughtLine } from './useVThoughtLine'
import type { VThoughtLineProps } from './VThoughtLine.types'

const props = withDefaults(defineProps<VThoughtLineProps>(), {
  label: 'Thinking',
  steps: () => [],
  duration: 0,
  motion: V_MOTION_DEFAULT,
  defaultExpanded: false,
})

const emit = defineEmits<{ 'update:expanded': [value: boolean] }>()
const vm = useVThoughtLine(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <button v-bind="vm.headerAttrs.value" @click="vm.toggleExpanded">
      <span class="v-thought-line__glyph" data-test-id="v-thought-line-glyph" aria-hidden="true">
        <VIcon :icon="vm.config.value.glyphIcon" size="sm" />
      </span>
      <span class="v-thought-line__label" data-test-id="v-thought-line-label">
        {{ vm.summaryLabel.value }}
      </span>
      <span
        v-if="vm.isThinking.value"
        class="v-thought-line__timer"
        data-test-id="v-thought-line-timer"
      >
        {{ vm.formattedDuration.value }}
      </span>
      <span
        v-if="vm.config.value.steps.length > 0"
        class="v-thought-line__chevron"
        data-test-id="v-thought-line-chevron"
        aria-hidden="true"
      >
        <VIcon :icon="vm.config.value.chevronIcon" size="sm" />
      </span>
    </button>

    <Transition name="v-thought-line-trace">
      <div
        v-if="vm.expanded.value && vm.config.value.steps.length > 0"
        class="v-thought-line__trace"
        data-test-id="v-thought-line-trace"
      >
        <p
          v-for="(step, index) in vm.config.value.steps"
          :key="step.id ?? `${step.label}-${index}`"
          class="v-thought-line__step"
          :style="{ animationDelay: `${index * 60}ms` }"
          :data-test-id="`v-thought-line-step-${index}`"
        >
          {{ step.label }}
        </p>
      </div>
    </Transition>
  </div>
</template>
