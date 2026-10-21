<script setup lang="ts">
import './VNavItem.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVNavItem } from './useVNavItem'
import type { VNavItemEmits, VNavItemProps } from './VNavItem.types'

const props = withDefaults(defineProps<VNavItemProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  loading: false,
  active: false,
  collapsed: false,
})

const emit = defineEmits<VNavItemEmits>()
const vm = useVNavItem(props, emit)
</script>

<template>
  <component
    :is="vm.config.value.isLink ? 'a' : 'button'"
    v-bind="vm.itemAttrs.value"
    @click="vm.onClick"
    @keydown="vm.onKeydown"
  >
    <span
      v-if="loading"
      class="v-nav-item__loader"
      data-test-id="v-nav-item-loader"
      aria-hidden="true"
    />

    <span
      v-if="vm.hasIcon.value || $slots.icon"
      class="v-nav-item__icon"
      :class="{ 'v-nav-item__icon--swatch': vm.config.value.iconColor }"
      :style="vm.config.value.iconColor ? { '--v-nav-item-swatch': vm.config.value.iconColor } : undefined"
      data-test-id="v-nav-item-icon"
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
      v-if="!collapsed && (label || $slots.default)"
      class="v-nav-item__label"
      data-test-id="v-nav-item-label"
    >
      <slot>{{ label }}</slot>
    </span>

    <span
      v-if="!collapsed && vm.config.value.showBadge"
      class="v-nav-item__badge"
      :class="{ 'v-nav-item__badge--primary': vm.config.value.badgeTone === 'primary' }"
      data-test-id="v-nav-item-badge"
    >
      {{ badge }}
    </span>

    <span
      v-if="!collapsed && vm.config.value.tag"
      class="v-nav-item__tag"
      data-test-id="v-nav-item-tag"
    >
      {{ vm.config.value.tag }}
    </span>

    <span
      v-if="!collapsed && $slots.trailing"
      class="v-nav-item__trailing"
      data-test-id="v-nav-item-trailing"
    >
      <slot name="trailing" />
    </span>
  </component>
</template>
