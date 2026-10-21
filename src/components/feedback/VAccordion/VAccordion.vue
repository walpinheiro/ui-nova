<script setup lang="ts">
import './VAccordion.scss'
import { useVAccordion } from './useVAccordion'
import type { VAccordionModelValue, VAccordionProps } from './VAccordion.types'

const props = withDefaults(defineProps<VAccordionProps>(), {
  multiple: false,
  size: 'md',
  variant: 'default',
})
const emit = defineEmits<{
  'update:modelValue': [value: VAccordionModelValue]
  'open-change': [value: VAccordionModelValue]
}>()
const vm = useVAccordion(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <slot />
  </div>
</template>
