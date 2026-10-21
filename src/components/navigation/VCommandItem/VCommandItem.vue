<script setup lang="ts">
import './VCommandItem.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVCommandItem } from './useVCommandItem'
import type { VCommandItemEmits, VCommandItemProps } from './VCommandItem.types'

const props = withDefaults(defineProps<VCommandItemProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  loading: false,
  selected: false,
})

const emit = defineEmits<VCommandItemEmits>()
const vm = useVCommandItem(props, emit)
</script>

<template>
  <button
    v-bind="vm.itemAttrs.value"
    @click="vm.onClick"
    @keydown="vm.onKeydown"
  >
    <span
      v-if="loading"
      class="v-command-item__loader"
      data-test-id="v-command-item-loader"
      aria-hidden="true"
    />

    <span
      v-if="vm.hasIcon.value || $slots.icon"
      class="v-command-item__icon"
      data-test-id="v-command-item-icon"
      aria-hidden="true"
    >
      <slot name="icon">
        <VIcon
          v-if="vm.config.value.iconData"
          :icon="vm.config.value.iconData"
          size="sm"
        />
      </slot>
    </span>

    <span
      v-if="label || $slots.default"
      class="v-command-item__label"
      data-test-id="v-command-item-label"
    >
      <slot>{{ label }}</slot>
    </span>

    <kbd
      v-if="vm.config.value.showShortcut"
      class="v-command-item__shortcut"
      data-test-id="v-command-item-shortcut"
    >
      {{ shortcut }}
    </kbd>
  </button>
</template>
