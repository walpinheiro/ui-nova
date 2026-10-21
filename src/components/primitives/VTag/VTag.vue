<script setup lang="ts">
import './VTag.scss'
import { VIcon } from '../VIcon'
import { V_TAG_REMOVE_ICON } from './mountVTag'
import { useVTag } from './useVTag'
import type { VTagProps } from './VTag.types'

const props = withDefaults(defineProps<VTagProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  removable: false,
  leaving: false,
  interactive: null,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  remove: [event: MouseEvent]
}>()

const vm = useVTag(props, emit)
</script>

<template>
  <component :is="vm.rootTag.value" v-bind="vm.rootAttrs.value" @click="vm.handleClick">
    <span v-if="$slots.icon" class="v-tag__icon" data-test-id="v-tag-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="v-tag__label" data-test-id="v-tag-label"><slot>Tag</slot></span>
    <button
      v-if="vm.config.value.removable"
      v-bind="vm.removeAttrs.value"
      @click="vm.handleRemove"
    >
      <VIcon :icon="V_TAG_REMOVE_ICON" size="sm" />
    </button>
  </component>
</template>
