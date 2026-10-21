<script setup lang="ts">
import './VBadge.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVBadge } from './useVBadge'
import type { VBadgeProps } from './VBadge.types'
const props = withDefaults(defineProps<VBadgeProps>(), { size: 'md', disabled: false, loading: false, interactive: false, removable: false, leaving: false, selected: undefined, live: false })
const emit = defineEmits<{
  click: [MouseEvent]
  select: [MouseEvent]
  'update:selected': [boolean]
  remove: [MouseEvent]
}>()
const vm = useVBadge(props, emit)
</script>

<template>
  <component :is="vm.rootTag.value" v-bind="vm.rootAttrs.value" @click="vm.handleClick">
    <span v-if="props.loading" class="v-badge__loader" data-test-id="badge-loader" aria-hidden="true" />
    <span v-else-if="$slots.icon || vm.config.value.iconData" class="v-badge__icon" data-test-id="badge-icon" aria-hidden="true">
      <slot v-if="$slots.icon" name="icon" />
      <VIcon v-else-if="vm.config.value.iconData" :icon="vm.config.value.iconData" size="sm" />
    </span>
    <span v-else-if="vm.config.value.showDot" class="v-badge__dot" data-test-id="badge-dot" :style="props.dotColor ? { background: props.dotColor } : undefined" aria-hidden="true" />
    <span class="v-badge__label" data-test-id="badge-label"><slot>{{ vm.config.value.fallbackLabel }}</slot></span>
    <span v-if="vm.config.value.showCount" class="v-badge__count" data-test-id="badge-count">{{ props.count }}</span>
    <button
      v-if="vm.config.value.removable"
      v-bind="vm.removeAttrs.value"
      @click="vm.handleRemove"
    >
      <VIcon :icon="vm.config.value.removeIcon" size="sm" />
    </button>
  </component>
</template>
