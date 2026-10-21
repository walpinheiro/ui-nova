<script setup lang="ts">
import { VIcon } from '../../primitives/VIcon'
import { resolveToolbarIcon } from './mountVToolbarButton'
import type { VToolbarButtonProps } from './VToolbar.types'
import { useVToolbarButton } from './useVToolbarButton'

const props = withDefaults(defineProps<VToolbarButtonProps>(), {
  variant: 'default',
  active: false,
  disabled: false,
})
const emit = defineEmits<{
  click: [event: MouseEvent]
  select: [value: string]
  'open-change': [open: boolean]
}>()
const vm = useVToolbarButton(props, emit)
</script>

<template>
  <span class="v-toolbar__button-wrap">
    <button
      v-bind="vm.rootAttrs.value"
      @click="vm.onClick"
      @keydown="vm.onKeydown"
    >
      <VIcon
        v-if="vm.config.value.iconData"
        :icon="vm.config.value.iconData"
        size="sm"
        class="v-toolbar__button-icon"
      />
      <span v-if="label" class="v-toolbar__button-label">{{ label }}</span>
    </button>
    <div
      v-if="vm.config.value.hasMenu && vm.menuOpen.value"
      class="v-toolbar__menu"
      role="menu"
      data-test-id="v-toolbar-overflow-menu"
    >
      <button
        v-for="item in menu"
        :key="item.value"
        type="button"
        role="menuitem"
        class="v-toolbar__menu-item"
        :disabled="item.disabled || undefined"
        :data-test-id="`v-toolbar-overflow-item-${item.value}`"
        @click="vm.onMenuSelect(item)"
      >
        <VIcon
          v-if="item.icon && resolveToolbarIcon(item.icon)"
          :icon="resolveToolbarIcon(item.icon)"
          size="sm"
          class="v-toolbar__menu-icon"
        />
        <span class="v-toolbar__menu-label">{{ item.label }}</span>
      </button>
    </div>
  </span>
</template>
